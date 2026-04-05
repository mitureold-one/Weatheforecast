"use client";
import { useState } from "react";

export default function WeatherPage() {
  const [isSystemActive, setIsSystemActive] = useState(false);

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
    <main>
      {/* Aqui vai o seu Dashboard completo */}
      {/* O useEffect de busca só vai rodar quando isSystemActive for true */}
    </main>
  );
}