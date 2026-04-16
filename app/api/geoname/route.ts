import { NextRequest, NextResponse } from "next/server";
import { CityMapper } from "@/core/_object/mapper/city-mapper";
import { CityDao } from "@/core/_object/dao/city-dao";
import { StateDao } from "@/core/_object/dao/state-dao";
import { StateMapper } from "@/core/_object/mapper/state-mapper";
import { LocationCache } from "@/core/cache/location-cache";

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin');
  const seuDominio = process.env.NEXT_PUBLIC_SITE_URL;
  const apiKey = req.headers.get("x-api-key");

  // --- Segurança ---
  // Nota: Verifique se INTERNAL_API_KEY está definida na Vercel
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Em produção, valida se a chamada vem do seu próprio site
  if (process.env.NODE_ENV === 'production' && origin !== seuDominio) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  // --- Validação de Configuração ---
  const GEONAMES_USER = process.env.GEONAMES_USER;
  if (!GEONAMES_USER) {
    return NextResponse.json(
      { error: "Variável GEONAMES_USER não configurada no servidor" },
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

  // --- 1. VERIFICAÇÃO DE CACHE ---
  if (adminCode) {
    const cachedCities = LocationCache.getCities(country, adminCode);
    if (cachedCities) return NextResponse.json(cachedCities);
  } else {
    const cachedStates = LocationCache.getStates(country);
    if (cachedStates) return NextResponse.json(cachedStates);
  }

  // --- 2. CONSTRUÇÃO DA URL (USANDO HTTPS SECURE) ---
  // Mudamos para secure.geonames.org para evitar erros de TLS/SSL 403
  const baseUrl = "https://secure.geonames.org/searchJSON";
  
  const url = adminCode 
    ? `${baseUrl}?country=${country}&adminCode1=${adminCode}&featureClass=P&cities=cities1000&orderby=name&maxRows=1000&username=${GEONAMES_USER}`
    : `${baseUrl}?country=${country}&featureCode=ADM1&orderby=name&username=${GEONAMES_USER}`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 86400 },
      headers: {
        // User-Agent é essencial para evitar bloqueios 403 em servidores Cloud
        'User-Agent': 'ChronosWeather/1.0 (contact@yourdomain.com)',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `GeoNames Uplink Error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // O GeoNames retorna 200 OK mesmo com erro de conta/créditos, 
    // o erro vem dentro do body.status
    if (data.status) {
      console.error("GeoNames API Status Error:", data.status.message);
      return NextResponse.json(
        { error: `GeoNames: ${data.status.message}` },
        { status: 401 }
      );
    }

    const geonames = data.geonames || [];

    // --- 3. PROCESSAMENTO ---
    if (adminCode) {
      const seen = new Set<number>();
      const cities = geonames
        .filter((item: CityDao) => {
          if (seen.has(item.geonameId)) return false;
          seen.add(item.geonameId);
          return true;
        })
        .map((item: CityDao) => CityMapper.toDomain(item)); 

      LocationCache.setCities(country, adminCode, cities);
      return NextResponse.json(cities);
      
    } else {
      const states = geonames.map((item: StateDao) => {
        const domain = StateMapper.toDomain(item); 
        return StateMapper.toDto(domain);         
      });
      
      LocationCache.setStates(country, states);
      return NextResponse.json(states);
    }

  } catch (error) {
    console.error("Erro crítico na rota GeoNames:", error);
    return NextResponse.json(
      { error: "Falha na conexão de satélite com GeoNames" },
      { status: 500 }
    );
  }
}