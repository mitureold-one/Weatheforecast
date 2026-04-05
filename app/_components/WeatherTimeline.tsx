"use client";

import { getWeatherInfo, WMO_CODES } from "@/app/_object/weather";
import { WeatherData } from "../_object/weather-data";
import { Selection } from "@/app/_object/selection";

interface WeatherTimelineProps {
  weather: WeatherData;
  selection: Selection;
}

export default function WeatherTimeline({ weather, selection }: WeatherTimelineProps) {
  const now = new Date();
  const hourlyStart = weather.hourly.times.findIndex((t) => new Date(t) >= now);

  const next24h = weather.hourly.times
    .slice(hourlyStart, hourlyStart + 24)
    .map((t, i) => ({
      time: new Date(t),
      weatherCode: weather.hourly.weatherCode[hourlyStart + i],
      precip: weather.hourly.precipitationProbability[hourlyStart + i],
      // Verifique se no seu weather-data.ts o nome é 'relativeHumidity' ou 'humidity'
      humidity: weather.hourly.humidity ? weather.hourly.humidity[hourlyStart + i] : 0, 
      visibility: weather.hourly.visibility[hourlyStart + i],
      windSpeed: weather.hourly.windSpeed[hourlyStart + i],
    }));

  return (
    <div className="p-4 bg-black border-2 border-zinc-800 rounded-none shadow-[6px_6px_0px_0px_#f59e0b] relative overflow-hidden group/timeline">
      
      {/* Linha de Scan - Substituí a animação custom por uma do Tailwind para evitar o erro de token */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-teal-500/30 animate-pulse pointer-events-none" />

      <h3 className="text-xl font-black text-white uppercase mb-4 flex items-center gap-2 italic tracking-tighter">
        <span className="bg-teal-500 text-black px-3 py-0.5 skew-x-[-15deg] shadow-[2px_2px_0px_#fff] text-sm">
          24H
        </span>
        CHRONOS VISION
        <span className="text-[9px] text-zinc-600 tracking-[0.2em] uppercase ml-auto font-bold animate-pulse">
          // Radar Active
        </span>
      </h3>

      {/* Container de Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory 
        scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-teal-500">
        
        {next24h.map((h, i) => {
          const info = getWeatherInfo(h.weatherCode);
          const isNow = i === 0;
          
          // Lógica para ícones personalizados (sol/lua)
          const weatherInfo = WMO_CODES[h.weatherCode];
          let finalIconPath = weatherInfo.icon;
          // Para timeline, usa o horário atual para determinar dia/noite
          const currentHour = new Date().getHours();
          const isDay = currentHour >= 6 && currentHour < 18; // Simplificado
          if (h.weatherCode === 0 && !isDay) {
            finalIconPath = "/lua.jpeg";
          }
          const isImageIcon = finalIconPath.startsWith("/");
          
          return (
            <div
              key={i}
              className={`flex flex-col items-center min-w-[80px] p-3 border-b-4 transition-all group cursor-crosshair snap-center
                ${isNow
                  ? "bg-gradient-to-b from-teal-950/50 to-black border-teal-500 shadow-[inset_0_0_15px_rgba(20,184,166,0.2)]"
                  : "bg-zinc-900/30 border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-800/50"
                }`}
            >
              <time className={`text-[10px] font-black italic tracking-widest mb-2 ${isNow ? "text-teal-400" : "text-zinc-500"}`}>
                {isNow ? "NOW" : `${h.time.getHours().toString().padStart(2, "0")}:00`}
              </time>

              <span className="text-3xl my-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                {isImageIcon ? (
                  <img 
                    src={finalIconPath} 
                    alt={info.label}
                    className="w-8 h-8 object-contain inline-block"
                  />
                ) : (
                  finalIconPath
                )}
              </span>

              <div className="space-y-2 w-full mt-2">
                <div className="flex justify-between items-center bg-black/40 px-1.5 py-0.5 rounded-sm">
                  <span className="text-[9px]">💧</span>
                  <span className="text-[10px] text-blue-400 font-black">{Math.round(h.precip)}%</span>
                </div>

                <div className="flex justify-between items-center bg-black/40 px-1.5 py-0.5 rounded-sm">
                  <span className="text-[9px]">💨</span>
                  <span className="text-[10px] text-zinc-400 font-black">{Math.round(h.windSpeed)}</span>
                </div>

                <div className="pt-1">
                  <div className="h-1 bg-zinc-800 rounded-none overflow-hidden border-[0.5px] border-zinc-700">
                    <div
                      className={`h-full transition-all duration-1000 ${h.visibility > 10000 ? 'bg-teal-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, (h.visibility / 24000) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[7px] text-zinc-600 font-bold uppercase text-center mt-1 tracking-tighter">Visibility</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 pt-3 border-t border-zinc-900 text-[8px] text-zinc-600 font-black uppercase tracking-widest">
        <div className="flex items-center gap-1"><span className="text-blue-500">💧</span> Prob. Precip.</div>
        <div className="flex items-center gap-1"><span className="text-zinc-400">💨</span> Velocity km/h</div>
        <div className="flex items-center gap-1"><span className="text-teal-500 italic">| |</span> Atmos. Clarity</div>
      </div>
    </div>
  );
}