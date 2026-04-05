/* um objeto para representar os dados de localização retornados pela API do GeoNames,
mandanmos uma instância do objeto para a API da Open-Meteo para obter os dados meteorológicos específicos daquela localização.
*/
export interface LocationData {
  name: string;
  adminCode1: string;      
  isoCode: string;         
}
// 