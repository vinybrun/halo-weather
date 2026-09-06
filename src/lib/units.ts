import type { UnitSystem } from "../types";

export function convertTemp(celsius: number, unit: UnitSystem): number {
  return unit === "fahrenheit" ? (celsius * 9) / 5 + 32 : celsius;
}

export function convertWind(kmh: number, unit: UnitSystem): number {
  return unit === "fahrenheit" ? kmh * 0.621371 : kmh;
}

export function convertPrecip(mm: number, unit: UnitSystem): number {
  return unit === "fahrenheit" ? mm / 25.4 : mm;
}

export function tempSuffix(unit: UnitSystem): "°C" | "°F" {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export const tempUnit = tempSuffix;

export function windUnit(unit: UnitSystem): "km/h" | "mph" {
  return unit === "fahrenheit" ? "mph" : "km/h";
}

export function precipUnit(unit: UnitSystem): "mm" | "in" {
  return unit === "fahrenheit" ? "in" : "mm";
}

export function formatTemp(celsius: number, unit: UnitSystem): string {
  return `${Math.round(convertTemp(celsius, unit))}°`;
}

export function formatWind(kmh: number, unit: UnitSystem): string {
  return String(Math.round(convertWind(kmh, unit)));
}

export function formatPrecip(mm: number, unit: UnitSystem): string {
  const value = convertPrecip(mm, unit);
  if (unit === "fahrenheit") {
    return value < 0.05 ? "0" : value.toFixed(2);
  }
  return value < 0.05 ? "0" : value.toFixed(1);
}
