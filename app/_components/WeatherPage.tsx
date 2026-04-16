// app/weather/page.tsx
"use client";

import { useState } from "react";
import { LocationSelector } from "@/app/_components/location-selector";
import { CountryDto } from "@/core/_object/dto/country-dto";

interface WeatherPageProps {
  initialCountries: CountryDto[];
}

export default function WeatherPage({ initialCountries }: WeatherPageProps) {
  const [isSystemActive, setIsSystemActive] = useState(false);

  // --- TELA DE BOOT (SPLASH SCREEN) ---
  if (!isSystemActive) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden">
        {/* Grid de fundo sutil (Efeito Matrix/Terminal) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative group scale-110">
          {/* Brilho externo no hover */}
          <div className="absolute -inset-1 bg-gold opacity-20 blur-2xl group-hover:opacity-100 transition-opacity duration-700" />
          
          <button 
            onClick={() => setIsSystemActive(true)}
            className="relative px-10 py-5 bg-black border-2 border-gold text-gold font-black italic tracking-[0.4em] skew-x-[-15deg] hover:bg-gold hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          >
            INITIALIZE WEATHER REPORT
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[10px] text-zinc-600 font-mono animate-pulse uppercase tracking-[0.2em]">
            // USER INTERACTION REQUIRED FOR AUDIO SYNC
          </p>
          <p className="text-[9px] text-zinc-800 font-mono uppercase">
            Satellite Uplink: <span className="text-zinc-500">READY</span>
          </p>
        </div>

        {/* Onomatopeia decorativa Jojo de fundo */}
        <div className="absolute bottom-10 right-10 text-zinc-900 text-9xl font-black select-none pointer-events-none opacity-20">
          ゴ
        </div>
      </div>
    );
  }

  // --- INTERFACE PRINCIPAL (APÓS BOOT) ---
  return (
    <main className="min-h-screen bg-black text-zinc-300 selection:bg-gold selection:text-black overflow-x-hidden">
      
      {/* HEADER TIPO HUD DE JATO/GAME */}
      <header className="w-full border-b-2 border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2">
              <span className="bg-gold text-black px-2 py-0.5 not-italic">CHRONOS</span>
              <span className="text-gold tracking-widest">.OS</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">System Status: Optimal</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className="text-[10px] text-magenta-500 font-black uppercase tracking-widest italic bg-magenta-500/10 px-2">
              Heavy Weather Active
            </p>
            <p className="text-[9px] text-zinc-600 font-mono mt-1">
              REL_TIME: {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex flex-col gap-10">
          
          {/* SEÇÃO DE CONTROLE (SÃO LUÍS POR DEFAULT) */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
              <h2 className="text-[11px] font-black text-gold uppercase tracking-[0.3em] italic">
                Navigation_Panel
              </h2>
            </div>
            
            {/* O LocationSelector aqui já deve conter o useEffect para São Luís */}
            <LocationSelector initialCountries={initialCountries} />
          </section>

          {/* FOOTER DECORATIVO */}
          <footer className="mt-20 pb-10 flex flex-col items-center gap-4 opacity-30">
            <div className="h-[1px] w-full bg-zinc-900" />
            <div className="flex justify-between w-full text-[8px] font-mono uppercase tracking-widest">
              <span>GeoNames_DB_V2</span>
              <span className="text-center font-black">Em homenagem ao arco 6 de JoJo</span>
              <span>Open-Meteo_Engine</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Efeitos de Scanline de fundo para o clima Cyberpunk */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[size:100%_2px,3px_100%]" />
    </main>
  );
}