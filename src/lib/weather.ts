import type { Place } from "../types";

export type Sky =
  | "clear-day"
  | "clear-night"
  | "partly"
  | "partly-night"
  | "overcast"
  | "fog"
  | "rain"
  | "snow"
  | "storm"
  | "idle";

export type IconKind =
  | "sun"
  | "moon"
  | "cloud-sun"
  | "cloud-moon"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export type WeatherMeta = {
  label: string;
  kind: IconKind;
  sky: Sky;
};

const GROUPS: Array<{
  codes: number[];
  label: string;
  day: IconKind;
  night: IconKind;
  skyDay: Sky;
  skyNight: Sky;
}> = [
  { codes: [0], label: "Clear sky", day: "sun", night: "moon", skyDay: "clear-day", skyNight: "clear-night" },
  { codes: [1], label: "Mainly clear", day: "sun", night: "moon", skyDay: "clear-day", skyNight: "clear-night" },
  { codes: [2], label: "Partly cloudy", day: "cloud-sun", night: "cloud-moon", skyDay: "partly", skyNight: "partly-night" },
  { codes: [3], label: "Overcast", day: "cloud", night: "cloud", skyDay: "overcast", skyNight: "overcast" },
  { codes: [45, 48], label: "Fog", day: "fog", night: "fog", skyDay: "fog", skyNight: "fog" },
  { codes: [51, 53, 55, 56, 57], label: "Drizzle", day: "drizzle", night: "drizzle", skyDay: "rain", skyNight: "rain" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rain", day: "rain", night: "rain", skyDay: "rain", skyNight: "rain" },
  { codes: [71, 73, 75, 77, 85, 86], label: "Snow", day: "snow", night: "snow", skyDay: "snow", skyNight: "snow" },
  { codes: [95, 96, 99], label: "Thunderstorm", day: "storm", night: "storm", skyDay: "storm", skyNight: "storm" },
];

export function weatherMeta(code: number, isDay: boolean): WeatherMeta {
  const entry = GROUPS.find((group) => group.codes.includes(code));
  if (!entry) {
    return {
      label: "Unknown conditions",
      kind: isDay ? "cloud-sun" : "cloud-moon",
      sky: isDay ? "partly" : "clear-night",
    };
  }
  return {
    label: entry.label,
    kind: isDay ? entry.day : entry.night,
    sky: isDay ? entry.skyDay : entry.skyNight,
  };
}

export function atmosphereFor(code: number, isDay: boolean) {
  const meta = weatherMeta(code, isDay);
  return { id: meta.kind, label: meta.label, sky: meta.sky };
}

export function windCompass(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % dirs.length;
  return dirs[index] ?? "N";
}

export function placeSubtitle(place: Place): string {
  const bits = [place.admin1, place.country].filter(Boolean);
  if (bits.length) return bits.join(", ");
  return `${place.latitude.toFixed(2)}°, ${place.longitude.toFixed(2)}°`;
}
