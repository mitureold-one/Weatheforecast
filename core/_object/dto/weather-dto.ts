export interface WeatherDto {
  latitude: number;
  longitude: number;
  elevation: number;
  current: {
    temperature: number;
    humidity: number;
    apparentTemperature: number;
    surfacePressure: number;
    isDay: number;
    weatherCode: number;
    windSpeed: number;
    precipitation: number;
  };
  daily: {
    dates: string[];
    sunrise: string[];  
    sunset: string[]; 
    tempMax: number[];
    tempMin: number[];
    rainSum: number[];
    uvIndexMax: number[];
    windSpeedMax: number[];
    precipitationProbMax: number[];
    weatherCode: number[];
  };
  hourly: {
    times: string[];
    humidity: number[];
    precipitationProbability: number[];
    visibility: number[];
    windSpeed: number[];
    weatherCode: number[];
  };
}