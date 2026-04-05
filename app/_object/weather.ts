// WMO Weather Code → descrição e emoji
import Image from "next/image";

// No seu arquivo onde WMO_CODES é definido

export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  // Alterado: agora aponta para o caminho da imagem
  0:  { label: "Céu limpo",               icon: "/sol.jpeg" }, 

  // Mantidos como emojis por enquanto
  1:  { label: "Predominantemente limpo", icon: "🌤️" },
  2:  { label: "Parcialmente nublado",    icon: "⛅" },
  3:  { label: "Nublado",                 icon: "☁️" },
  45: { label: "Névoa",                   icon: "🌫️" },
  48: { label: "Névoa com geada",         icon: "🌫️" },
  51: { label: "Garoa leve",              icon: "🌦️" },
  53: { label: "Garoa moderada",          icon: "🌦️" },
  55: { label: "Garoa intensa",           icon: "🌧️" },
  61: { label: "Chuva leve",              icon: "🌧️" },
  63: { label: "Chuva moderada",          icon: "🌧️" },
  65: { label: "Chuva intensa",           icon: "🌧️" },
  71: { label: "Neve leve",               icon: "❄️" },
  73: { label: "Neve moderada",           icon: "❄️" },
  75: { label: "Neve intensa",            icon: "❄️" },
  80: { label: "Pancadas leves",          icon: "🌦️" },
  81: { label: "Pancadas moderadas",      icon: "🌧️" },
  82: { label: "Pancadas fortes",         icon: "⛈️" },
  95: { label: "Tempestade",              icon: "⛈️" },
  96: { label: "Tempestade c/ granizo",   icon: "⛈️" },
  99: { label: "Tempestade c/ granizo",   icon: "⛈️" },
};

export function getWeatherInfo(code: number) {
  // Garante que o código seja um número inteiro para a busca no Record
  const cleanCode = Math.floor(code);
  return WMO_CODES[cleanCode] ?? { label: "Desconhecido", icon: "🌡️" };
}

export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];