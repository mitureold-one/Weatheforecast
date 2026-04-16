export interface CityDao {
 geonameId: number;
  name: string;
  lat: string;
  lng: string;
  countryCode: string;
  adminName1: string;
  adminCodes1: {
    ISO3166_2: string;
  };
}