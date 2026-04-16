'use client'

import { useEffect, useState } from "react";
import { useLocation } from "@/app/_hook/use-location";
import { CountryDto } from "@/core/_object/dto/country-dto";
import { useWeather } from "../_hook/use-weather";
import WeatherDisplay from "./WeatherDisplay";

interface Props {
  initialCountries: CountryDto[];
}

export function LocationSelector({ initialCountries }: Props) {
  const { 
    states, 
    cities, 
    loading: loadingLocation, 
    fetchStates, 
    fetchCities, 
    resetCities 
  } = useLocation();

  const { weather, loadingWeather, fetchWeather, resetWeather } = useWeather();

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // --- ORDENAÇÃO ALFABÉTICA ---
  const sortedStates = [...states].sort((a, b) => a.name.localeCompare(b.name));
  const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));

  const onCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedState("");
    setSelectedCity("");
    resetCities();
    resetWeather();
    fetchStates(countryCode);
  };

  const onStateChange = (adminCode: string) => {
    setSelectedState(adminCode);
    setSelectedCity("");
    resetWeather();
    fetchCities(selectedCountry, adminCode);
  };

  const onCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const cityObj = cities.find(c => c.name === cityName);
    
    if (cityObj?.coords?.lat != null && cityObj?.coords?.lng != null) {
      fetchWeather(cityObj.coords.lat, cityObj.coords.lng);
    } else {
      resetWeather();
    }
  };

  // Bootstrap inicial para São Luís - MA
  useEffect(() => {
    const initializeDefaultLocation = async () => {
      setSelectedCountry("BR");
      await fetchStates("BR");
      
      setSelectedState("13"); 
      await fetchCities("BR", "13");

      setSelectedCity("São Luís");
      fetchWeather(-2.5307, -44.3068);
    };

    initializeDefaultLocation();
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* PAINEL DE CONTROLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
        {/* SELECT PAÍS */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-gold tracking-widest">Target_Country</label>
          <select 
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="bg-black text-white p-2 border border-zinc-700 focus:border-gold outline-none text-sm font-mono cursor-pointer"
          >
            <option value="">SELECT_ORIGIN...</option>
            {initialCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* SELECT ESTADO (ORDENADO) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Admin_Zone</label>
          <select 
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={!states.length || loadingLocation}
            className="bg-black text-white p-2 border border-zinc-700 disabled:opacity-30 focus:border-magenta-500 outline-none text-sm font-mono cursor-pointer"
          >
            <option value="">{loadingLocation && !states.length ? "SCANNING..." : "SELECT_ZONE..."}</option>
            {sortedStates.map((s) => (
              <option key={s.id} value={s.alas}>{s.name.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* SELECT CIDADE (ORDENADA) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Local_Coordinate</label>
          <select 
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!cities.length || loadingLocation}
            className="bg-black text-white p-2 border border-zinc-700 disabled:opacity-30 focus:border-teal-500 outline-none text-sm font-mono cursor-pointer"
          >
            <option value="">{loadingLocation && states.length && !cities.length ? "SEARCHING..." : "SELECT_CITY..."}</option>
            {sortedCities.map((city) => (
              <option key={city.id} value={city.name}>{city.name.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FEEDBACK E DISPLAY */}
      {loadingWeather && (
        <div className="flex flex-col items-center justify-center p-20 bg-zinc-950 border-2 border-dashed border-zinc-800">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent animate-spin mb-4"></div>
          <p className="text-gold font-black italic tracking-[0.3em] animate-pulse">UPLINKING SATELLITE DATA...</p>
        </div>
      )}

      {weather && !loadingWeather && (
        <WeatherDisplay 
          weather={weather} 
          selection={{
            city: selectedCity || "São Luís",
            state: selectedState || "21",
            lat: cities.find(c => c.name === selectedCity)?.coords?.lat ?? -2.5307,
            lng: cities.find(c => c.name === selectedCity)?.coords?.lng ?? -44.3068
          }} 
        />
      )}
    </div>
  );
}