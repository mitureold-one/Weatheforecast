// core/_object/mapper/state-mapper.ts
import { StateDao } from "../dao/state-dao";
import { State } from "../model/state";
import { StateDto } from "../dto/state-dto";

export class StateMapper {
  // Recebe o dado BRUTO da API (DAO) e transforma no seu modelo (State)
  static toDomain(dao: StateDao): State {
    return {
      name: dao.name,
      idGeoNames: dao.adminCode1,
      // Aqui resolvemos o problema do "alas" vazio:
      // Se isoCode não existir, usamos o adminCode1
      alasGeonames: (dao.isoCode && dao.isoCode !== "") ? dao.isoCode : dao.adminCode1
    };
  }

  // Recebe o seu modelo (State) e transforma no que o Front vai ler (DTO)
  static toDto(model: State): StateDto {
    return {
      id: model.idGeoNames,
      name: model.name,
      alas: model.alasGeonames
    };
  }
}