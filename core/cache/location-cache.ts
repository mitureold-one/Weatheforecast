// core/cache/location-cache.ts
import { COUNTRIES } from "./data/countries"; 
import { CountryMapper } from "../_object/mapper/country-mapper";
import { CountryDto } from "../_object/dto/country-dto";
import { StateDto } from "../_object/dto/state-dto";
import { CityDto } from "../_object/dto/city-dto";
import fs from 'fs';
import path from 'path';

export class LocationCache {
  private static cachedCountries: CountryDto[] | null = null;
  private static stateCache = new Map<string, StateDto[]>();
  private static cityCache = new Map<string, CityDto[]>();

  // Define o caminho: core/cache/data/storage
  private static cacheDir = path.join(process.cwd(), 'core/cache/data/storage');

  // --- MÉTODOS DE DISCO (Privados) ---

  private static saveToDisk(fileName: string, data: any) {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(this.cacheDir, `${fileName.toLowerCase()}.json`), 
        JSON.stringify(data, null, 2)
      );
    } catch (e) {
      console.error(`[Cache] Erro ao gravar ${fileName}:`, e);
    }
  }

  private static loadFromDisk<T>(fileName: string): T | null {
    try {
      const filePath = path.join(this.cacheDir, `${fileName.toLowerCase()}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as T;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  // --- PAÍSES ---
  static getCountries(): CountryDto[] {
    if (!this.cachedCountries) {
      this.cachedCountries = COUNTRIES.map(country => CountryMapper.toDto(country));
    }
    return this.cachedCountries;
  }

  // --- ESTADOS ---
  static getStates(countryCode: string): StateDto[] | undefined {
    const key = countryCode.toUpperCase();
    
    // 1. Tenta RAM
    if (this.stateCache.has(key)) return this.stateCache.get(key);

    // 2. Tenta Disco
    const fromDisk = this.loadFromDisk<StateDto[]>(`states-${key}`);
    if (fromDisk) {
      this.stateCache.set(key, fromDisk); // Alimenta a RAM para o próximo hit
      return fromDisk;
    }
    return undefined;
  }

  static setStates(countryCode: string, states: StateDto[]): void {
    const key = countryCode.toUpperCase();
    this.stateCache.set(key, states);
    this.saveToDisk(`states-${key}`, states);
  }

  // --- CIDADES ---
  static getCities(countryCode: string, adminCode: string): CityDto[] | undefined {
    const key = `${countryCode}-${adminCode}`.toUpperCase();
    
    if (this.cityCache.has(key)) return this.cityCache.get(key);

    const fromDisk = this.loadFromDisk<CityDto[]>(`cities-${key}`);
    if (fromDisk) {
      this.cityCache.set(key, fromDisk);
      return fromDisk;
    }
    return undefined;
  }

  static setCities(countryCode: string, adminCode: string, cities: CityDto[]): void {
    const key = `${countryCode}-${adminCode}`.toUpperCase();
    this.cityCache.set(key, cities);
    this.saveToDisk(`cities-${key}`, cities);
  }

  static flush() {
    this.cachedCountries = null;
    this.stateCache.clear();
    this.cityCache.clear();
  }
}