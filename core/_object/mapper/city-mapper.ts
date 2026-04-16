import { CityDao } from "../dao/city-dao";
import { City } from "../model/city";
import { CityDto } from "../dto/city-dto";

export class CityMapper {
  /**
   * Converte o dado bruto da API GeoNames (DAO) para a entidade de Domínio (City).
   * Realiza o parsing de strings para números e protege o sistema contra dados nulos.
   */
  static toDomain(dao: any): City {
  return {
    id: Number(dao.geonameId),
    name: dao.name,
    stateCode: dao.adminCode1,
    coords: {
      lat: Number(dao.lat),
      lng: Number(dao.lng)
    }
  };
}

  /**
   * Converte a entidade de Domínio para o DTO de Clima.
   * Simplifica a estrutura para o consumo da API Open-Meteo ou Front-end.
   */
  static toDto(model: City): CityDto {
    return {
      latitude: model.coords.lat,
      longitude: model.coords.lng,
      name: model.name
    };
  }
  
  
}