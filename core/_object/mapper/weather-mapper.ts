// core/_object/mapper/weather-mapper.ts
import { Weather } from "../model/weather";
import { WeatherDto } from "../dto/weather-dto";


export class WeatherMapper {
  static toDomain(raw: any): Weather {
    // Aqui garantimos que o domínio tenha exatamente o que definimos nas interfaces
    return {
      latitude: raw.latitude,
      longitude: raw.longitude,
      elevation: raw.elevation,
      current: { ...raw.current },
      daily: { ...raw.daily },
      hourly: { ...raw.hourly },
    };
  }

  static toDto(model: Weather): WeatherDto {
    return {
      latitude: model.latitude,
      longitude: model.longitude,
      elevation: model.elevation,
      current: model.current,
      daily: model.daily,
      hourly: model.hourly,
    };
  }

  // O "atalho" que usaremos na rota
  static mapToDto(raw: any): WeatherDto {
    const domain = this.toDomain(raw);
    return this.toDto(domain);
  }
}