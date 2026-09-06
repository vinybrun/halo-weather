export type UnitSystem = "celsius" | "fahrenheit";

export type Place = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

export type CurrentConditions = {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
};

export type HourlyPoint = {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
};

export type DailyPoint = {
  date: string;
  weatherCode: number;
  tMax: number;
  tMin: number;
  precipProb: number;
  sunrise: string;
  sunset: string;
};

export type WeatherBundle = {
  place: Place;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  timezone: string;
  timezoneAbbreviation: string;
};

export type WeatherErrorCode =
  | "network"
  | "not_found"
  | "api"
  | "geo_denied"
  | "geo_unavailable"
  | "geo_timeout";

export class WeatherError extends Error {
  readonly code: WeatherErrorCode;

  constructor(message: string, code: WeatherErrorCode) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}

export type AppStatus =
  | { kind: "idle" }
  | { kind: "loading"; reason: "search" | "geo" | "refresh" }
  | { kind: "error"; error: WeatherError };
