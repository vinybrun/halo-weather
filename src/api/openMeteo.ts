import { WeatherError, type Place, type WeatherBundle } from "../types";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL = "https://geocoding-api.open-meteo.com/v1/reverse";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REQUEST_MS = 12_000;

type GeocodeHit = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

type GeocodeResponse = {
  results?: GeocodeHit[];
};

type ForecastResponse = {
  timezone?: string;
  timezone_abbreviation?: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: Array<number | null>;
    is_day: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: Array<number | null>;
    sunrise: string[];
    sunset: string[];
  };
};

function combineSignals(signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const combined = combineSignals(signal);
  let response: Response;
  try {
    response = await fetch(url, { signal: combined });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new WeatherError(
      "Can't reach the weather service. Check your connection and try again.",
      "network",
    );
  }

  if (!response.ok) {
    throw new WeatherError("The weather service returned an error. Please try again shortly.", "api");
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new WeatherError("The weather service sent an unexpected response.", "api");
  }
}

function toPlace(hit: GeocodeHit): Place {
  return {
    id: hit.id,
    name: hit.name,
    latitude: hit.latitude,
    longitude: hit.longitude,
    country: hit.country,
    admin1: hit.admin1,
    timezone: hit.timezone,
  };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  const url = new URL(GEOCODE_URL);
  url.searchParams.set("name", name);
  url.searchParams.set("count", "7");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const data = await getJson<GeocodeResponse>(url.toString(), signal);
  return (data.results ?? []).map(toPlace);
}

export function pickBestPlace(hits: Place[], query: string): Place | undefined {
  if (hits.length === 0) return undefined;
  const q = query.trim().toLowerCase();
  return (
    hits.find((hit) => hit.name.toLowerCase() === q) ??
    hits.find((hit) => hit.name.toLowerCase().startsWith(q)) ??
    hits[0]
  );
}

export function placeFromCoords(latitude: number, longitude: number): Place {
  const latHem = latitude >= 0 ? "N" : "S";
  const lonHem = longitude >= 0 ? "E" : "W";
  return {
    id: -1,
    name: "Your location",
    latitude,
    longitude,
    admin1: `${Math.abs(latitude).toFixed(2)}°${latHem}`,
    country: `${Math.abs(longitude).toFixed(2)}°${lonHem}`,
  };
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<Place> {
  const fallback = placeFromCoords(latitude, longitude);
  const url = new URL(REVERSE_URL);
  url.searchParams.set("latitude", latitude.toFixed(4));
  url.searchParams.set("longitude", longitude.toFixed(4));
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("count", "1");

  try {
    const data = await getJson<GeocodeResponse>(url.toString(), signal);
    const hit = data.results?.[0];
    return hit ? toPlace(hit) : fallback;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return fallback;
  }
}

export async function fetchWeather(place: Place, signal?: AbortSignal): Promise<WeatherBundle> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(place.latitude));
  url.searchParams.set("longitude", String(place.longitude));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
    ].join(","),
  );
  url.searchParams.set("hourly", "temperature_2m,weather_code,precipitation_probability,is_day");
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const data = await getJson<ForecastResponse>(url.toString(), signal);
  if (!data.current || !data.hourly || !data.daily) {
    throw new WeatherError("Weather data for this place is incomplete.", "api");
  }

  const now = new Date(data.current.time).getTime();
  const hourly: WeatherBundle["hourly"] = [];
  for (let i = 0; i < data.hourly.time.length; i += 1) {
    const stamp = data.hourly.time[i];
    const temperature = data.hourly.temperature_2m[i];
    const weatherCode = data.hourly.weather_code[i];
    if (!stamp || temperature === undefined || weatherCode === undefined) continue;
    if (new Date(stamp).getTime() + 30 * 60 * 1000 < now) continue;
    hourly.push({
      time: stamp,
      temperature,
      weatherCode,
      precipitationProbability: data.hourly.precipitation_probability[i] ?? 0,
      isDay: data.hourly.is_day[i] === 1,
    });
    if (hourly.length === 14) break;
  }

  const daily = data.daily.time.flatMap((date, i) => {
    const weatherCode = data.daily?.weather_code[i];
    const tMax = data.daily?.temperature_2m_max[i];
    const tMin = data.daily?.temperature_2m_min[i];
    const sunrise = data.daily?.sunrise[i] ?? "";
    const sunset = data.daily?.sunset[i] ?? "";
    if (weatherCode === undefined || tMax === undefined || tMin === undefined) return [];
    return [
      {
        date,
        weatherCode,
        tMax,
        tMin,
        precipProb: data.daily?.precipitation_probability_max[i] ?? 0,
        sunrise,
        sunset,
      },
    ];
  });

  if (daily.length < 5) {
    throw new WeatherError("Not enough forecast days came back. Please try again.", "api");
  }

  return {
    place,
    timezone: data.timezone ?? place.timezone ?? "UTC",
    timezoneAbbreviation: data.timezone_abbreviation ?? "",
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      precipitation: data.current.precipitation,
    },
    hourly,
    daily,
  };
}
