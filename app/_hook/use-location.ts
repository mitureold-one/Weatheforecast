// hooks/use-location.ts
import { useState } from "react";
import { StateDto } from "@/core/_object/dto/state-dto";
import { City } from "@/core/_object/model/city";

export function useLocation() {
  const [states, setStates] = useState<StateDto[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStates = async (countryCode: string) => {
    if (!countryCode) {
      setStates([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geoname?country=${countryCode}`, {
        headers: { 'x-api-key': 'jojo_secreto_123' }
      });
      
      if (!res.ok) throw new Error("Erro ao carregar estados");
      
      const data = await res.json();

      setStates(data);
    } catch (err) {
      console.error("Erro no catch:", err);
      setError("Falha ao buscar estados");
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (countryCode: string, adminCode: string) => {
    if (!adminCode || !countryCode) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geoname?country=${countryCode}&adminCode=${adminCode}`, {
        headers: { 'x-api-key': 'jojo_secreto_123' }
      });
      if (!res.ok) throw new Error("Erro ao carregar cidades");
      const data = await res.json();
      
      setCities(data);
    } catch (err) {
      setError("Falha ao buscar cidades");
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    states,
    cities,
    loading,
    error,
    fetchStates,
    fetchCities,
    resetCities: () => setCities([]),
    resetStates: () => setStates([]),
  };
}