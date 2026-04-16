// core/_object/weather.ts

export const DAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export interface WeatherCodeInfo {
  label: string;
  icon: string;
}

// Mapeamento de códigos WMO (World Meteorological Organization)
// Adicionei os principais, você pode expandir conforme a necessidade
export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0:  { label: "Céu Limpo", icon: "☀️" }, // No componente Resume, ele troca para /lua.jpeg se isDay for 0
  1:  { label: "Principalmente Limpo", icon: "🌤️" },
  2:  { label: "Parcialmente Nublado", icon: "⛅" },
  3:  { label: "Nublado", icon: "☁️" },
  45: { label: "Nevoeiro", icon: "🌫️" },
  48: { label: "Nevoeiro com Gelo", icon: "🌫️" },
  51: { label: "Drizzle Leve", icon: "🌦️" },
  53: { label: "Drizzle Moderado", icon: "🌦️" },
  55: { label: "Drizzle Denso", icon: "🌧️" },
  61: { label: "Chuva Leve", icon: "🌧️" },
  63: { label: "Chuva Moderada", icon: "🌧️" },
  65: { label: "Chuva Forte", icon: "🌊" },
  71: { label: "Neve Leve", icon: "❄️" },
  73: { label: "Neve Moderada", icon: "❄️" },
  75: { label: "Neve Forte", icon: "🏔️" },
  77: { label: "Grãos de Neve", icon: "❄️" },
  80: { label: "Pancadas de Chuva Leves", icon: "🌦️" },
  81: { label: "Pancadas de Chuva Moderadas", icon: "🌧️" },
  82: { label: "Pancadas de Chuva Violentas", icon: "⛈️" },
  95: { label: "Trovoada", icon: "⛈️" },
  96: { label: "Trovoada com Granizo Leve", icon: "🌩️" },
  99: { label: "Trovoada com Granizo Forte", icon: "⚡" },
};

/**
 * Retorna a informação amigável baseada no código WMO.
 * Se o código não existir, retorna um fallback de "Desconhecido".
 */
export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WMO_CODES[code] || { label: "Condição Estelar", icon: "🌀" };
}