"use client";

import { getWeatherInfo, DAY_NAMES, WMO_CODES } from "@/core/_object/weather";
import { WeatherDto } from "@/core/_object/dto/weather-dto";

interface WeatherWeekProps {
  weather: WeatherDto;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function WeatherWeek({ weather }: WeatherWeekProps) {
  // No novo DTO, o índice 0 já é o dia atual (forecast)
  const forecastDays = weather.daily.dates.map((date, i) => {
    return {
      date,
      dayIndex: new Date(date + "T12:00:00").getDay(),
      weatherCode: weather.daily.weatherCode[i],
      tempMax: weather.daily.tempMax[i],
      tempMin: weather.daily.tempMin[i],
      rainSum: weather.daily.rainSum[i],
      uvIndexMax: weather.daily.uvIndexMax[i],
      windSpeedMax: weather.daily.windSpeedMax[i],
      precipProb: weather.daily.precipitationProbMax[i],
      sunrise: weather.daily.sunrise[i],
      sunset: weather.daily.sunset[i],
    };
  });

  return (
    <div className="bg-zinc-950 border-[4px] border-zinc-800 rounded-none relative shadow-[10px_10px_0px_0px_#7c3aed] overflow-hidden">
      
      {/* Header "Judgment" */}
      <div className="absolute -top-1 -right-1 bg-magenta-600 text-white px-4 py-1 text-[10px] font-black italic tracking-[0.2em] z-20 skew-x-[-15deg] border-l-2 border-b-2 border-white">
        JUDGMENT: 07_DAYS_PROJECTION
      </div>

      <div className="divide-y divide-zinc-900 mt-2">
        {forecastDays.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode);
          const isToday = i === 0;

          const weatherInfo = WMO_CODES[day.weatherCode];
          let finalIconPath = weatherInfo?.icon || "🌡️";
          
          // Previsão diária assume visual diurno
          const isImageIcon = typeof finalIconPath === 'string' && finalIconPath.startsWith("/");

          const uvColor =
            day.uvIndexMax <= 2 ? "text-green-500" :
            day.uvIndexMax <= 5 ? "text-yellow-400" :
            day.uvIndexMax <= 7 ? "text-orange-500" :
            "text-red-500";

          return (
            <div
              key={day.date}
              className={`flex items-center justify-between px-4 py-4 group transition-all
                ${isToday ? "bg-zinc-900/50 border-l-4 border-gold" : "bg-transparent hover:bg-zinc-900/30"}`}
            >
              {/* Coluna Dia */}
              <div className="flex items-center gap-4 w-32">
                <div className={`flex flex-col items-center justify-center w-10 h-10 border-2 font-black text-[10px] skew-x-[-10deg]
                  ${isToday ? "bg-gold border-black text-black" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
                  <span>{isToday ? "HOJE" : DAY_NAMES[day.dayIndex].toUpperCase().substring(0, 3)}</span>
                </div>
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300 select-none">
                  {isImageIcon ? (
                    <img 
                      src={finalIconPath as string} 
                      alt={info.label}
                      className="w-8 h-8 object-contain inline-block"
                    />
                  ) : (
                    finalIconPath
                  )}
                </span>
              </div>

              {/* Coluna Central (Dados de Sensores) */}
              <div className="hidden md:flex flex-col gap-1 flex-1 px-4 text-[9px] font-black italic tracking-tighter">
                <span className="text-zinc-500 uppercase tracking-widest">// {info.label}</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="text-blue-400">💧 {Math.round(day.precipProb)}%</span>
                  <span className="text-cyan-500">🌧 {day.rainSum.toFixed(1)}mm</span>
                  <span className="text-zinc-500">💨 {Math.round(day.windSpeedMax)}km/h</span>
                </div>
                <div className="flex gap-4">
                  <span className={uvColor}>☀ UV {Math.round(day.uvIndexMax)}</span>
                  <span className="text-orange-400/70">🌅 {formatTime(day.sunrise)}</span>
                  <span className="text-indigo-400/70">🌇 {formatTime(day.sunset)}</span>
                </div>
              </div>

              {/* Coluna Temperaturas */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[8px] text-zinc-600 font-black leading-none">MIN</p>
                  <p className="text-xl text-blue-500 font-black tracking-tighter italic">{Math.round(day.tempMin)}°</p>
                </div>
                <div className="text-right min-w-[50px]">
                  <p className="text-[8px] text-zinc-600 font-black leading-none">MAX</p>
                  <p className={`text-3xl font-black italic tracking-tighter drop-shadow-[2px_2px_0px_#000] 
                    ${isToday ? "text-gold" : "text-white"}`}>
                    {Math.round(day.tempMax)}°
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rodapé Estilizado */}
      <div className="bg-zinc-900/50 p-2 text-center border-t border-zinc-900">
        <p className="text-[8px] text-zinc-600 font-black tracking-[0.5em] uppercase">
          Weather Report // Stand Ability: Heavy Weather
        </p>
      </div>
    </div>
  );
}