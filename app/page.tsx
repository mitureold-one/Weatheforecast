"use client";

import { useState } from "react";
import Filters from "@/app/_components/Filters";
import WeatherDisplay from "@/app/_components/WeatherDisplay";
import { Selection } from "@/app/_object/selection";

export default function Page() {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [selection, setSelection] = useState<Selection>({
    countryCode: "BR",
    stateCode: "13",
    cityName: "São Luís",
    lat: "-2.52972",
    lng: "-44.30278",
  });

  if (!isSystemActive) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
        <div className="relative group">
          {/* Efeito de brilho atrás do botão */}
          <div className="absolute -inset-1 bg-gold opacity-30 blur-xl group-hover:opacity-100 transition-opacity" />

          <button
            onClick={() => setIsSystemActive(true)}
            className="relative px-8 py-4 bg-black border-2 border-gold text-gold font-black italic tracking-[0.3em] skew-x-[-15deg] hover:bg-gold hover:text-black transition-all"
          >
            INITIALIZE WEATHER REPORT
          </button>
        </div>
        <p className="mt-4 text-[10px] text-zinc-600 font-mono animate-pulse">
          // USER INTERACTION REQUIRED FOR AUDIO SYNC
        </p>
      </div>
    );
  }

  return (
    // Background com leve textura de grão para parecer mangá antigo
    <div className="min-h-screen bg-[#121212] p-2 sm:p-6 lg:p-10 flex flex-col items-center overflow-x-hidden selection:bg-magenta-500 selection:text-white">

      {/* HEADER: Estilo Neon/Gold */}
      <header className="mb-10 relative z-20 text-center">
        <div className="relative inline-block group">
          <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-t from-gold via-yellow-200 to-white drop-shadow-[6px_6px_0px_#7c3aed] uppercase tracking-tighter transition-all duration-500 group-hover:tracking-widest">
            Weather <span className="text-magenta-500">Report</span>
          </h1>
          {/* Linha de energia abaixo do título */}
          <div className="h-1.5 w-full bg-gold mt-2 shadow-[0_0_20px_#f59e0b] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 animate-[line-scan_2s_linear_infinite]" />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 mt-3 tracking-[0.4em] font-bold uppercase">
          Atmospheric Command Center // State: <span className="text-gold">Active</span>
        </p>
      </header>

      {/* DASHBOARD CONTAINER */}
      <main className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

        {/* Onomatopeias Flutuantes (Escondidas no mobile para não quebrar o layout) */}
        <div className="hidden xl:block absolute -left-20 top-20 text-8xl font-black text-zinc-800/20 -rotate-12 select-none pointer-events-none">
          ドドドド
        </div>
        <div className="hidden xl:block absolute -right-20 bottom-40 text-8xl font-black text-zinc-800/20 rotate-12 select-none pointer-events-none">
          ゴゴゴゴ
        </div>

        {/* COLUNA ESQUERDA: Filtros e Status do Stand (3/12 colunas) */}
        <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="bg-zinc-900 border-l-8 border-gold p-4 shadow-[4px_4px_0px_#000]">
            <h2 className="text-xs font-black text-gold mb-4 tracking-widest uppercase">Target Location</h2>
            <Filters selection={selection} onSelectionChange={setSelection} />
          </div>
        </aside>

        {/* COLUNA CENTRAL/DIREITA: Display Principal (9/12 colunas) */}
        <div className="lg:col-span-9 space-y-8 order-1 lg:order-2">
          <section className="relative">
            {/* Efeito de Scanner na transição */}
            <div className="absolute -top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-magenta-500 to-transparent animate-pulse"></div>

            {/* O WeatherDisplay agora respira dentro de um container maior */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border-2 border-zinc-800 p-1">
               <WeatherDisplay selection={selection} />
            </div>
          </section>
        </div>

      </main>

      {/* FOOTER: To be continued */}
      <footer className="w-full max-w-7xl mt-16 pb-10 flex flex-col items-center gap-6">
        <div className="w-full h-px bg-zinc-800 flex justify-center items-center">
            <span className="bg-[#121212] px-4 text-[10px] text-zinc-600 font-black tracking-[0.5em]">SYSTEM TERMINATED</span>
        </div>

        <div className="group cursor-pointer">
          <div className="inline-block px-8 py-2 border-4 border-gold text-gold font-black italic text-lg skew-x-[-20deg] shadow-[5px_5px_0px_#7c3aed] group-hover:translate-x-2 group-hover:shadow-none transition-all duration-300">
            TO BE CONTINUED... <span className="ml-2">▶︎</span>
          </div>
        </div>
      </footer>

      {/* Global Style para a animação do header */}
      <style jsx global>{`
        @keyframes line-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}