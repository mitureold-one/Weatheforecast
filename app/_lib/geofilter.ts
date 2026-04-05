import {LocationData } from "@/app/_object/location-data";
import{ City } from "@/app/_object/city";

// Busca uma cidade pelo nome para obter lat/lng
export function findCity(cities: City[], cityName: string): City | undefined {
  return cities.find((city) => city.name === cityName);
}

// Busca os estados de um país
export async function fetchStates(countryCode: string): Promise<LocationData[]> {
  const res = await fetch(`/api/city?country=${countryCode}`);
  if (!res.ok) throw new Error("Falha ao buscar estados");
  const data: LocationData[] = await res.json();
  return data.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

// Busca as cidades de um estado
export async function fetchCities(countryCode: string, adminCode: string): Promise<City[]> {
  const res = await fetch(`/api/city?country=${countryCode}&adminCode=${adminCode}`);
  if (!res.ok) throw new Error("Falha ao buscar cidades");
  const data: City[] = await res.json();
  return data.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}