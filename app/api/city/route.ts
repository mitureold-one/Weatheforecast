import { NextRequest, NextResponse } from "next/server";
import { City } from "@/app/_object/city";
import { LocationData } from "@/app/_object/location-data";


// Rota GET para buscar cidades por país usando a API GeoNames
export async function GET(req: NextRequest) {

  //1° verificamos se a variável de ambiente GEONAMES_USER está configurada. Se não estiver, retornamos um erro 500 indicando que a variável não foi configurada.
  const GEONAMES_USER = process.env.GEONAMES_USER;
  if (!GEONAMES_USER)
  {
    return NextResponse.json
    (
      { error: "Variável GEONAMES_USER não configurada no .env.local" },
      { status: 500 }
    );
  }
 
  //2° extraímos o parâmetro "country" da query string da requisição. Se o parâmetro não for fornecido, retornamos um erro 400 indicando que o parâmetro é obrigatório.
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  if (!country)
  {  
    return NextResponse.json
    (
      { error: "Parâmetro country é obrigatório" },
      { status: 400 }
    );
  }

  // 3° Construímos a URL da API GeoNames usando os parâmetros "country" e  o "adminCode". verificamos se o "adminCode" existe para pesquisar direto pelas cidades se não vamos, verificar quais estados existem no pais e em seguida pesquisaremos novamento pela cidade .
  let url = ""
  const adminCode = searchParams.get("adminCode");
  if (adminCode) {
    // cidades — featureClass=P funciona aqui
    url = `http://api.geonames.org/searchJSON?country=${country}&adminCode1=${adminCode}&featureClass=P&cities=cities1000&orderby=name&maxRows=1000&username=${GEONAMES_USER}`;
  } else {
    // estados — featureClass=A, sem featureClass=P
    url = `http://api.geonames.org/searchJSON?country=${country}&featureCode=ADM1&orderby=name&username=${GEONAMES_USER}`;
  }

  //4° Fazemos a requisição para a API GeoNames usando fetch. Se a resposta não for bem-sucedida (status diferente de 200), retornamos um erro JSON com a mensagem de erro e o status da resposta. Caso contrário, processamos a resposta JSON para extrair os dados das cidades ou estados, dependendo dos parâmetros fornecidos.  
  try {
    // O fetch com cache evita requisições repetidas à API externa
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    // Verifica se a resposta da API GeoNames é bem-sucedida. Se não for, retorna um erro JSON com a mensagem de erro e o status da resposta.
    if (!res.ok)
      {
        return NextResponse.json(
          { error: `GeoNames retornou status ${res.status}` },
          { status: res.status }
        );
      }

    // 5° Processamos a resposta da API GeoNames.
    const data = await res.json();
    const geonames = data.geonames || [];

    if (data.status)
    {
      return NextResponse.json(
        { error: `Erro GeoNames: ${data.status.message}` },
        { status: 401 }
      );
    }
    const seen = new Set<number>();
    // 5° Retorno condicional baseado no que foi buscado
    if (adminCode)
    {
      // Retornamos um array de City[]
      const cities: City[] = geonames
      .filter((item: any) => {
        if (seen.has(item.geonameId)) return false;
        seen.add(item.geonameId);
        return true;})
      .map((item: any) => ({
        geonameId: item.geonameId,
        name: item.name,
        lat: item.lat,
        lng: item.lng,
        countryCode: item.countryCode,
        adminName1: item.adminName1 ?? "",
        adminCodes1: {
          ISO3166_2: item.adminCodes1?.ISO3166_2 ?? "",
        },
      }));
      return NextResponse.json(cities);
    } 
    else
    {
      // Retornamos um array de LocationData[] (estados)
      const states: LocationData[] = geonames.map((item: any) => ({
       name: item.name,
        adminCode1: item.adminCode1,                        // "27"
        isoCode: item.adminCodes1?.ISO3166_2 ?? "",         // "SP"
      }));
      return NextResponse.json(states);
    }
  
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao conectar com a API GeoNames" },
      { status: 500 }
    );
  }
}