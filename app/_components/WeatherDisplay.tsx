"use client";

import WeatherResume from "@/app/_components/WeatherResume";
import WeatherWeek from "@/app/_components/WeatherWeek";
import WeatherTimeline from "./WeatherTimeline";
import { WeatherDto } from "@/core/_object/dto/weather-dto"; // Seu novo DTO

interface WeatherDisplayProps {
  weather: WeatherDto;
  selection: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
}

export default function WeatherDisplay({ weather, selection }: WeatherDisplayProps) {
  // Lógica de processamento das próximas 24h (usando o novo DTO)
  const now = new Date();
  
  // Encontra o índice da hora atual no array de tempos
  const hourlyStart = weather.hourly.times.findIndex((t) => new Date(t) >= now);
  
  // Se não encontrar (erro de timezone), assume o início
  const startIndex = hourlyStart === -1 ? 0 : hourlyStart;

  const next24h = weather.hourly.times
    .slice(startIndex, startIndex + 24)
    .map((t, i) => ({
      time: new Date(t),
      weatherCode: weather.hourly.weatherCode[startIndex + i],
      // Ajustamos para os nomes que definimos no DTO/Mapper
      humidity: weather.hourly.humidity[startIndex + i], 
      windSpeed: weather.hourly.windSpeed[startIndex + i],
      precipProb: weather.hourly.precipitationProbability[startIndex + i],
    }));

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-700">
      
      {/* 1. MÓDULO DE STATUS ATUAL (RESUME) */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta-500 to-gold opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black">
          {/* O WeatherResume usará weather.current */}
          <WeatherResume weather={weather} selection={selection} />
        </div>
      </section>

      {/* 2. MÓDULO DE SENSORIAMENTO HORÁRIO (TIMELINE) */}
      <section className="p-1 bg-zinc-900 border-t-2 border-zinc-700">
        <h3 className="text-[10px] text-zinc-500 mb-2 ml-2 tracking-[0.3em] uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          Live Chronos Data
        </h3>
        {/* Passamos o next24h processado ou o weather completo */}
        <WeatherTimeline weather={weather} /> 
      </section>

      {/* 3. MÓDULO DE PREVISÃO ESTENDIDA (WEEK) */}
      <section className="relative border-l-4 border-magenta-600 bg-zinc-950/50">
         <div className="p-2">
            <h3 className="text-xs text-white font-black italic mb-4 flex items-center gap-2">
              <span className="bg-white text-black px-2 py-0.5 skew-x-[-15deg]">FUTURE</span>
              PROJECTIONS
            </h3>
            {/* O WeatherWeek usará weather.daily */}
            <WeatherWeek weather={weather} />
         </div>
      </section>

    </div>
  );
}