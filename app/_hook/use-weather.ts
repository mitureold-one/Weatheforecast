import { useState } from "react";
import { WeatherDto } from "@/core/_object/dto/weather-dto";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherDto | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lng: number) => {
    const audio = new Audio("/busca.mp3");
    audio.volume = 0.2;
    audio.play().catch(() => {}); 

  setLoadingWeather(true);
    if (!lat || !lng) return;

    setLoadingWeather(true);
    setWeatherError(null);

    try {
      const res = await fetch(`/api/neometeor?lat=${lat}&lng=${lng}`);
      
      if (!res.ok) throw new Error("Falha ao carregar dados meteorológicos");

      const data: WeatherDto = await res.json();
      setWeather(data);
    } catch (err) {
      setWeatherError("Não foi possível obter o clima atual.");
      console.error(err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const resetWeather = () => setWeather(null);

  return {
    weather,
    loadingWeather,
    weatherError,
    fetchWeather,
    resetWeather
  };
}