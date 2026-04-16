import { NextRequest, NextResponse } from "next/server";
import { CityMapper } from "@/core/_object/mapper/city-mapper";
import { CityDao } from "@/core/_object/dao/city-dao";
import { StateDao } from "@/core/_object/dao/state-dao";
import { StateMapper } from "@/core/_object/mapper/state-mapper";
import { LocationCache } from "@/core/cache/location-cache"; // Importando o cache

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const seuDominio = process.env.NEXT_PUBLIC_SITE_URL;
  const apiKey = req.headers.get("x-api-key");

  // --- Segurança ---
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (origin !== seuDominio && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  // --- Validação de Configuração ---
  const GEONAMES_USER = process.env.GEONAMES_USER;
  if (!GEONAMES_USER) {
    return NextResponse.json(
      { error: "Variável GEONAMES_USER não configurada" },
      { status: 500 }
    );
  }

  // --- Parâmetros da Query ---
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country")?.toUpperCase(); 
  const adminCode = searchParams.get("adminCode");

  if (!country) {
    return NextResponse.json(
      { error: "Parâmetro country é obrigatório" },
      { status: 400 }
    );
  }

  // --- 1. VERIFICAÇÃO DE CACHE (Antes de qualquer fetch) ---
  if (adminCode) {
    const cachedCities = LocationCache.getCities(country, adminCode);
    if (cachedCities) {
      console.log(`[Cache Hit] Cidades: ${country}-${adminCode}`);
      return NextResponse.json(cachedCities);
    }
  } else {
    const cachedStates = LocationCache.getStates(country);
    if (cachedStates) {
      console.log(`[Cache Hit] Estados: ${country}`);
      return NextResponse.json(cachedStates);
    }
  }

  // --- 2. CONSTRUÇÃO DA URL ---
  const url = adminCode 
    ? `http://api.geonames.org/searchJSON?country=${country}&adminCode1=${adminCode}&featureClass=P&cities=cities1000&orderby=name&maxRows=1000&username=${GEONAMES_USER}`
    : `http://api.geonames.org/searchJSON?country=${country}&featureCode=ADM1&orderby=name&username=${GEONAMES_USER}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: `GeoNames retornou status ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (data.status) {
      return NextResponse.json(
        { error: `Erro GeoNames: ${data.status.message}` },
        { status: 401 }
      );
    }

    const geonames = data.geonames || [];

    // --- 3. PROCESSAMENTO E ALIMENTAÇÃO DO CACHE ---
    if (adminCode) {
      const seen = new Set<number>();
      
      const cities = geonames
        .filter((item: CityDao) => {
          if (seen.has(item.geonameId)) return false;
          seen.add(item.geonameId);
          return true;
        })
        .map((item: CityDao) => CityMapper.toDomain(item)); 

      // Salva no Cache de Cidades
      LocationCache.setCities(country, adminCode, cities);
      return NextResponse.json(cities);
      
    } else {
      const states = geonames.map((item: StateDao) => StateMapper.daoToDto(item));
      
      // Salva no Cache de Estados
      LocationCache.setStates(country, states);
      return NextResponse.json(states);
    }

  } catch (error) {
    console.error("Erro na rota GeoNames:", error);
    return NextResponse.json(
      { error: "Falha ao conectar com a API GeoNames" },
      { status: 500 }
    );
  }
}