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

      // --- AGORA SIM, LOGS DE DEBUG NO LUGAR CERTO ---
      console.log("--- DEBUG REQUISIÇÃO ESTADOS ---");
      console.log("Status da Resposta:", res.status);
      console.log("Dados que chegaram:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log("Primeiro item mapeado:", {
          nome: data[0].name,
          alas: data[0].alas, // Verifique se isso aqui é "" ou undefined
          id: data[0].id
        });
      } else {
        console.warn("Aviso: Data não é um array ou está vazio:", data);
      }
      // ----------------------------------------------

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
      
      console.log("--- DEBUG CIDADES ---", data);
      
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