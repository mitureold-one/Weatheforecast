"use server";

import { City } from "@/app/_object/city";
import { LocationData } from "@/app/_object/location-data";

export async function getGeoData(country: string, adminCode?: string) {
  const GEONAMES_USER = process.env.GEONAMES_USER;
  const INTERNAL_KEY = process.env.INTERNAL_API_KEY; 

  if (!GEONAMES_USER) throw new Error("Configuração ausente");

  let url = adminCode 
    ? `http://api.geonames.org/searchJSON?country=${country}&adminCode1=${adminCode}&featureClass=P&cities=cities1000&orderby=name&maxRows=1000&username=${GEONAMES_USER}`
    : `http://api.geonames.org/searchJSON?country=${country}&featureCode=ADM1&orderby=name&username=${GEONAMES_USER}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error("Erro na GeoNames");

  const data = await res.json();
  const geonames = data.geonames || [];

  if (adminCode) {
    const seen = new Set();
    return geonames
      .filter((item: any) => {
        if (seen.has(item.geonameId)) return false;
        seen.add(item.geonameId);
        return true;
      })
      .map((item: any): City => ({
        geonameId: item.geonameId,
        name: item.name,
        lat: item.lat,
        lng: item.lng,
        countryCode: item.countryCode,
        adminName1: item.adminName1 ?? "",
        adminCodes1: { ISO3166_2: item.adminCodes1?.ISO3166_2 ?? "" },
      }));
  }

  return geonames.map((item: any): LocationData => ({
    name: item.name,
    adminCode1: item.adminCode1,
    isoCode: item.adminCodes1?.ISO3166_2 ?? "",
  }));
}