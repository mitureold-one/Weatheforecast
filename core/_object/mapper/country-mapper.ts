import { CountryDao } from "../dao/country-dao";
import { CountryDto } from "../dto/country-dto";

export class CountryMapper {
  static toDto(dao: CountryDao): CountryDto {
    return {
      name: dao.name,
      code: dao.isoCode
    };
  }
}