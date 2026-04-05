"use client";

import { useEffect, useState } from "react";
import { WeatherData} from "@/app/_object/weather-data";
import { Selection } from "@/app/_object/selection";
import WeatherResume from "@/app/_components/WeatherResume";
import WeatherWeek from "@/app/_components/WeatherWeek";
import WeatherTimeline from "./WeatherTimeline";

interface WeatherDisplayProps {
  selection: Selection;
}

export default function WeatherDisplay({ selection }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
  if (!selection.lat || !selection.lng) return;

  const controller = new AbortController();

  async function fetchWeather() {
    setLoading(true);
    setError(null);
    
    // Tocar o som de ativação
    const audio = new Audio("/busca.mp3");
    audio.volume = 0.4; // Um pouco mais baixo para não assustar
    
    // Tenta tocar, mas ignora se o navegador bloquear (user gesture policy)
    audio.play().catch((e) => console.warn("Áudio bloqueado pelo browser:", e));
    
    try {
      const res = await fetch(
        `/api/weather?lat=${selection.lat}&lng=${selection.lng}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao buscar clima");
      }

      const data: WeatherData = await res.json();
      setWeather(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
        // Opcional: tocar um som de erro aqui?
      }
    } finally {
      // Pequeno delay opcional para o loading não "piscar" muito rápido
      setLoading(false);
    }
  }

  fetchWeather();

  return () => {
    controller.abort();
  };
}, [selection.lat, selection.lng]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <span className="animate-pulse text-gold font-black uppercase tracking-widest">
          CARREGANDO PREVISÃO...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-950 border-2 border-red-500 text-red-400 text-sm font-bold uppercase">
        ❌ {error}
      </div>
    );
  }

  if (!weather) return null;

  const now = new Date();
  const hourlyStart = weather.hourly.times.findIndex((t) => new Date(t) >= now);
  const next24h = weather.hourly.times
    .slice(hourlyStart, hourlyStart + 24)
    .map((t, i) => ({
      time: new Date(t),
      weatherCode: weather.hourly.weatherCode[hourlyStart + i],
      precip: weather.hourly.precipitationProbability[hourlyStart + i],
    }));

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-700">
      
      {/* 1. MÓDULO DE STATUS ATUAL (RESUME) */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-magenta-500 to-gold opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-black">
          <WeatherResume weather={weather} selection={selection} />
        </div>
      </section>

      {/* 2. MÓDULO DE SENSORIAMENTO HORÁRIO (TIMELINE) */}
      <section className="p-1 bg-zinc-900 border-t-2 border-zinc-700">
        <h3 className="text-[10px] text-zinc-500 mb-2 ml-2 tracking-[0.3em] uppercase flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          Live Chronos Data
        </h3>
        <WeatherTimeline weather={weather} selection={selection} />
      </section>

      {/* 3. MÓDULO DE PREVISÃO ESTENDIDA (WEEK) */}
      <section className="relative border-l-4 border-magenta-600 bg-zinc-950/50">
         <div className="p-2">
            <h3 className="text-xs text-white font-black italic mb-4 flex items-center gap-2">
              <span className="bg-white text-black px-2 py-0.5 skew-x-[-15deg]">FUTURE</span>
              PROJECTIONS
            </h3>
            <WeatherWeek weather={weather} selection={selection} />
         </div>
      </section>

    </div>
  );
}
