"use client";

import { WeatherData } from "@/app/_object/weather-data";
import { getWeatherInfo, WMO_CODES } from "@/app/_object/weather";
import { Selection } from "@/app/_object/selection";

interface WeatherResumeProps {
  weather: WeatherData;
  selection: Selection;
}

export default function WeatherResume({ weather, selection }: WeatherResumeProps) {
  const current = weather.current;
  const currentInfo = getWeatherInfo(current.weatherCode);
  const isDay = current.isDay === 1;

  // Lógica de Índice UV (Usando o índice 7 para o dia atual devido ao past_days: 7)
  const todayIndex = 7; 
  const uvIndex = Math.round(weather.daily.uvIndexMax[todayIndex]);

  // Busca a informação do clima no mapeamento
  const weatherInfo = WMO_CODES[current.weatherCode];

  // Lógica para decidir se usa a imagem do sol ou da lua para o código 0
  let finalIconPath = weatherInfo.icon;
  if (current.weatherCode === 0 && !isDay) {
    finalIconPath = "/lua.jpeg"; // Usa a lua se for noite limpa
  }

  // Verifica se o ícone é um caminho de imagem
  const isImageIcon = finalIconPath.startsWith("/");
  
  const uvColor =
    uvIndex <= 2 ? "border-green-500 text-green-400" :
    uvIndex <= 5 ? "border-yellow-400 text-yellow-300" :
    uvIndex <= 7 ? "border-orange-500 text-orange-400" :
    uvIndex <= 10 ? "border-red-500 text-red-400" :
    "border-purple-500 text-purple-400";

  const stats = [
    { label: "SENSAÇÃO",     val: `${Math.round(current.apparentTemperature)}°C`, color: "border-blue-500" },
    { label: "HUMIDADE",     val: `${Math.round(current.humidity)}%`,     color: "border-green-500" },
    { label: "VENTO",        val: `${Math.round(current.windSpeed)} km/h`,        color: "border-red-500" },
    { label: "PRESSÃO",      val: `${Math.round(current.surfacePressure)} hPa`,   color: "border-purple-500" },
    { label: "PRECIPITAÇÃO", val: `${current.precipitation.toFixed(1)} mm`,       color: "border-cyan-500" },
    { label: "UV INDEX",     val: `${uvIndex}`,                                   color: uvColor },
  ];

  return (
    <div className={`relative p-6 border-4 border-double rounded-none overflow-hidden transition-all duration-500
      ${isDay
        ? "bg-gradient-to-br from-indigo-950 via-black to-purple-950 border-gold shadow-[10px_10px_0px_0px_rgba(234,179,8,0.8)]"
        : "bg-gradient-to-br from-black via-gray-900 to-indigo-950 border-blue-400 shadow-[10px_10px_0px_0px_rgba(96,165,250,0.6)]"
      }`}>

      {/* Badge Superior Direito */}
      <div className={`absolute top-0 right-0 p-2 font-bold text-[10px] tracking-widest z-20 
        ${isDay ? "bg-gold text-black" : "bg-blue-500 text-white"}`}>
        STAND ID: WEATHER REPORT
      </div>

      {/* Indicador Dia/Noite */}
      <div className="absolute top-2 left-3 flex items-center gap-2 z-20">
        <span className="animate-pulse">{isDay ? "☀️" : "🌙"}</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {isDay ? "SOLAR SYSTEM ACTIVE" : "LUNAR MODE ENABLED"}
        </span>
      </div>

      {/* Bloco de Temperatura Principal */}
      <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 mt-6 mb-8">
        <div className="relative group">
          {isImageIcon ? (
            <img 
              src={finalIconPath} 
              alt={currentInfo.label}
              className="w-32 h-32 object-contain drop-shadow-[5px_5px_0px_rgba(236,72,153,1)] animate-[bounce_4s_infinite]"
            />
          ) : (
            <span className="text-8xl block drop-shadow-[5px_5px_0px_rgba(236,72,153,1)] animate-[bounce_4s_infinite]">
              {finalIconPath}
            </span>
          )}
          <div className="absolute -bottom-2 -right-2 text-magenta-500 font-black text-3xl italic animate-pulse">
            !!
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-gold text-4xl font-black uppercase tracking-tighter italic leading-none drop-shadow-[2px_2px_0px_#000]">
            {selection.cityName}
          </h2>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="text-7xl font-black text-white drop-shadow-[4px_4px_0px_#7c3aed]">
              {Math.round(current.temperature)}
            </span>
            <span className="text-3xl font-bold text-white/50">°C</span>
          </div>
          <div className="inline-block bg-teal-500 text-black px-3 py-0.5 font-black text-xs skew-x-[-15deg] uppercase mt-2">
            {currentInfo.label}
          </div>
        </div>
      </div>

      {/* Grid de Atributos (Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`
              relative group overflow-hidden
              bg-gray-950/40 backdrop-blur-md 
              border-l-4 ${stat.color.split(' ')[0]} 
              p-3 skew-x-[-6deg] 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
              hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] 
              hover:translate-x-2 hover:-translate-y-1
              transition-all duration-300 ease-out
              cursor-crosshair
            `}
          >
            {/* Efeito de Brilho de Vidro (Reflexo) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Efeito de Raio/Energia (Borda interna pulsante no hover) */}
            <div className={`absolute inset-0 border-r-2 border-t-2 opacity-0 group-hover:opacity-40 transition-all duration-500 pointer-events-none ${stat.color.replace('border-', 'border-')}`} />

            {/* Conteúdo */}
            <div className="relative z-10">
              <p className="text-[9px] text-gray-400 font-black uppercase italic tracking-tighter mb-1 group-hover:text-white transition-colors">
                {stat.label}
              </p>
              <p className={`text-xl font-black tracking-tight drop-shadow-sm ${stat.color.split(' ')[1]}`}>
                {stat.val}
              </p>
            </div>

            {/* Onomatopeia fantasma interna (opcional para estilo Jojo) */}
            <span className="absolute -right-1 -bottom-1 text-white/5 text-2xl font-black italic group-hover:opacity-20 transition-opacity">
              !!
            </span>
          </div>
        ))}
      </div>

      {/* Onomatopeia de fundo Decorativa */}
      <div className="absolute -bottom-4 -right-4 opacity-5 text-9xl font-black text-white pointer-events-none select-none">
        ゴ
      </div>
    </div>
  );
}