"use client";

import { useState, useEffect } from "react";
import {LocationData } from "@/app/_object/location-data";
import{City} from "@/app/_object/city";
import { COUNTRIES } from "@/app/_lib/countries";
import {fetchStates, fetchCities, findCity } from "@/app/_lib/geofilter";
import { Selection } from "../_object/selection"; 
import { getGeoData } from "@/app/_lib/actions";

interface FiltersProps {
  selection: Selection;
  onSelectionChange: (selection: Selection) => void;
}

export default function Filters({ selection, onSelectionChange }: FiltersProps) {
  const [states, setStates] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca estados quando o país muda
  useEffect(() => {
    async function loadStates() {
      setLoading(true);
      try {
        const data = await getGeoData(selection.countryCode);
        setStates(data as LocationData[]);

        // Se o estado atual não existe na nova lista, seleciona o primeiro
       const currentStateExists = data.some((state: LocationData) => state.adminCode1 === selection.stateCode);
        if (!currentStateExists && data.length > 0) {
          onSelectionChange({
            ...selection,
            stateCode: data[0].adminCode1,
            cityName: "",
            lat: "",
            lng: "",
          });
        } else {
          // Limpa cidades se o estado mudou
          setCities([]);
        }
      } catch (error: any) {
        console.error("Erro ao buscar estados:", error);
        setStates([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }
    loadStates();
  }, [selection.countryCode]);

  // Busca cidades quando o estado muda
  useEffect(() => {
    if (!selection.stateCode) {
      setCities([]);
      return;
    }
    async function loadCities() {
      setLoading(true);
      try {
        const data = await getGeoData(selection.countryCode, selection.stateCode);
        setCities(data as City[]);

        // Se a cidade atual não existe na nova lista, seleciona a primeira
        const currentCityExists = data.some((city: City) => city.name === selection.cityName);
        if (!currentCityExists && data.length > 0) {
          onSelectionChange({
            ...selection,
            cityName: data[0].name,
            lat: data[0].lat,
            lng: data[0].lng,
          });
        }
      } catch (error: any) {
        console.error("Erro ao buscar cidades:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, [selection.stateCode, selection.countryCode]);

  function handleCountryChange(code: string) {
    onSelectionChange({
      ...selection,
      countryCode: code,
      stateCode: "",
      cityName: "",
      lat: "",
      lng: "",
    });
  }

  function handleStateChange(code: string) {
    onSelectionChange({
      ...selection,
      stateCode: code,
      cityName: "",
      lat: "",
      lng: "",
    });
  }

  function handleCityChange(name: string) {
    const city = findCity(cities, name);
    onSelectionChange({
      ...selection,
      cityName: name,
      lat: city?.lat ?? "",
      lng: city?.lng ?? "",
    });
  }

  return (
<section className="p-1 bg-gradient-to-br from-purple-900 via-zinc-900 to-indigo-950 border-4 border-gold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      
      {/* Elementos decorativos de fundo (Sutis) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true">
        <span className="absolute -top-4 -right-2 text-6xl font-black text-magenta-500 transform rotate-12">ゴ</span>
      </div>

      <form className="p-3 relative z-10">
        <header className="flex flex-col mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-magenta-600 text-white text-[10px] px-1.5 py-0.5 font-black italic shadow-[2px_2px_0px_#f59e0b]">
              WRYYYY!
            </span>
            <h2 className="text-lg font-black text-gold tracking-tighter uppercase italic">
              Localização
            </h2>
          </div>
          <div className="h-0.5 w-full bg-zinc-800 mt-2 relative">
            <div className="absolute inset-0 bg-gold/50 w-1/3 animate-pulse" />
          </div>
        </header>

        {/* Mudança crucial: grid-cols-1 para a lateral, md:grid-cols-1 dentro do aside */}
        <fieldset className="flex flex-col gap-5 border-none p-0 m-0">
          
          {/* Input de País */}
          <div className="relative group">
            <label className="absolute -top-2 left-2 px-1 bg-[#1a1a1a] text-[9px] font-black text-teal-400 uppercase tracking-widest z-20 group-focus-within:text-gold transition-colors">
              01 // PAÍS
            </label>
            <div className="relative h-10 w-full flex items-center bg-black border-2 border-zinc-700 group-focus-within:border-gold transition-all shadow-[3px_3px_0px_0px_#000]">
              <select 
                value={selection.countryCode} 
                onChange={(e) => handleCountryChange(e.target.value)} 
                className="w-full h-full px-3 bg-transparent text-gray-100 text-sm font-bold appearance-none outline-none z-10 cursor-pointer"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.isoCode} value={country.isoCode} className="bg-zinc-900">
                    {country.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 text-magenta-500 text-xs">★</span>
            </div>
          </div>

          {/* Input de Estado */}
          <div className="relative group">
            <label className="absolute -top-2 left-2 px-1 bg-[#1a1a1a] text-[9px] font-black text-teal-400 uppercase tracking-widest z-20 group-focus-within:text-gold transition-colors">
              02 // ESTADO
            </label>
            <div className={`relative h-10 w-full flex items-center bg-black border-2 border-zinc-700 group-focus-within:border-gold transition-all shadow-[3px_3px_0px_0px_#000] ${loading || states.length === 0 ? "opacity-40" : ""}`}>
              <select 
                value={selection.stateCode || ""} 
                onChange={(e) => handleStateChange(e.target.value)} 
                disabled={loading || states.length === 0} 
                className="w-full h-full px-3 bg-transparent text-gray-100 text-sm font-bold appearance-none outline-none z-10 disabled:cursor-not-allowed cursor-pointer"
              >
                {states.length === 0 ? (
                  <option value="">{loading ? "CARREGANDO..." : "VAZIO"}</option>
                ) : (
                  states.map((s: LocationData) => (
                    <option key={s.adminCode1} value={s.adminCode1} className="bg-zinc-900">{s.name}</option>
                  ))
                )}
              </select>
              <span className="absolute right-3 text-magenta-500 text-xs">☆</span>
            </div>
          </div>

          {/* Input de Cidade */}
          <div className="relative group">
            <label className="absolute -top-2 left-2 px-1 bg-[#1a1a1a] text-[9px] font-black text-teal-400 uppercase tracking-widest z-20 group-focus-within:text-gold transition-colors">
              03 // CIDADE
            </label>
            <div className={`relative h-10 w-full flex items-center bg-black border-2 border-zinc-700 group-focus-within:border-gold transition-all shadow-[3px_3px_0px_0px_#000] ${loading || cities.length === 0 ? "opacity-40" : ""}`}>
              <select 
                value={selection.cityName || ""} 
                onChange={(e) => handleCityChange(e.target.value)} 
                disabled={loading || cities.length === 0} 
                className="w-full h-full px-3 bg-transparent text-gray-100 text-sm font-bold appearance-none outline-none z-10 disabled:cursor-not-allowed cursor-pointer"
              >
                {cities.length === 0 ? (
                  <option value="">{loading ? "CARREGANDO..." : "VAZIO"}</option>
                ) : (
                  cities.map((city: City) => (
                    <option key={city.geonameId} value={city.name} className="bg-zinc-900">{city.name}</option>
                  ))
                )}
              </select>
              <span className="absolute right-3 text-magenta-500 text-xs">✦</span>
            </div>
          </div>

        </fieldset>

        <footer className="mt-4 border-t border-zinc-800 pt-2">
          <p className="text-[8px] text-zinc-500 uppercase font-black text-center tracking-tighter">
            Data Input via GeoNames Interface
          </p>
        </footer>
      </form>
    </section>
  );
}
  