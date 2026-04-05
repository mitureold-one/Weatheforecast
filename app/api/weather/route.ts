import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Parâmetros lat e lng são obrigatórios" }, { status: 400 });
  }

  // 1. CONFIGURAÇÃO DOS PARÂMETROS (Ordem aqui define o variables(x))
  const params = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "surface_pressure", "is_day", "weather_code", "wind_speed_10m", "precipitation"],
    daily: ["sunrise", "sunset", "temperature_2m_max", "temperature_2m_min", "rain_sum", "uv_index_max", "wind_speed_10m_max", "precipitation_probability_max", "weather_code"],
    hourly: ["relative_humidity_2m", "precipitation_probability", "visibility", "wind_speed_10m", "weather_code"],
    timezone: "auto",
    past_days: 7,
    forecast_days: 7,
  };

  try {
    const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    // Referências dos blocos
    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // 2. PROCESSAMENTO DE TEMPO (Necessário para as datas e horas)
    const hourlyLength = (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval();
    const hourlyTimes = Array.from({ length: hourlyLength }, (_, i) =>
      new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000).toISOString()
    );

    const dailyLength = (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval();
    const dailyDates = Array.from({ length: dailyLength }, (_, i) =>
      new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toISOString().split("T")[0]
    );

    // 3. MONTAGEM DO OBJETO FINAL (Mapeamento rigoroso dos índices)
    const weatherData = {
      latitude: response.latitude(),
      longitude: response.longitude(),
      elevation: response.elevation(),
      current: {
        temperature: current.variables(0)!.value(),
        humidity: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        surfacePressure: current.variables(3)!.value(),
        isDay: current.variables(4)!.value(),
        weatherCode: current.variables(5)!.value(),
        windSpeed: current.variables(6)!.value(),    // <--- MAPEADO
        precipitation: current.variables(7)!.value(), // <--- MAPEADO
      },
      daily: {
        dates: dailyDates,
        sunrise: Array.from({ length: dailyLength }, (_, i) =>
          new Date((Number(daily.variables(0)!.values(i)) + utcOffsetSeconds) * 1000).toISOString()
        ),
        sunset: Array.from({ length: dailyLength }, (_, i) =>
          new Date((Number(daily.variables(1)!.values(i)) + utcOffsetSeconds) * 1000).toISOString()
        ),
        tempMax: Array.from(daily.variables(2)!.valuesArray()!),
        tempMin: Array.from(daily.variables(3)!.valuesArray()!),
        rainSum: Array.from(daily.variables(4)!.valuesArray()!),
        uvIndexMax: Array.from(daily.variables(5)!.valuesArray()!),
        windSpeedMax: Array.from(daily.variables(6)!.valuesArray()!),
        precipitationProbMax: Array.from(daily.variables(7)!.valuesArray()!),
        weatherCode: Array.from(daily.variables(8)!.valuesArray()!),
      },
      hourly: {
        times: hourlyTimes,
        humidity: Array.from(hourly.variables(0)!.valuesArray()!),
        precipitationProbability: Array.from(hourly.variables(1)!.valuesArray()!),
        visibility: Array.from(hourly.variables(2)!.valuesArray()!),
        windSpeed: Array.from(hourly.variables(3)!.valuesArray()!),
        weatherCode: Array.from(hourly.variables(4)!.valuesArray()!),
      },
    };

    return NextResponse.json(weatherData);
  } catch (error) {
  console.error("Erro detalhado:", error);
  return NextResponse.json({ error: "Falha ao conectar com a API Open-Meteo" }, { status: 500 });
}
}