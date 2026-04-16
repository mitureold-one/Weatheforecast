// app/page.tsx
import { LocationCache } from "@/core/cache/location-cache";
import WeatherPage from "./_components/WeatherPage"; // O componente completo que criamos

export default async function Home() {
  // Pegamos os países mapeados do seu cache estático (Server Side)
  // Isso garante que o primeiro carregamento seja instantâneo
  const countries = LocationCache.getCountries();

  return (
    /* Passamos os países para o WeatherPage, que gerencia 
       a Splash Screen e o estado de inicialização.
    */
    <WeatherPage initialCountries={countries} />
  );
}