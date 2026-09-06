import type { Place, UnitSystem } from "../types";

const UNIT_KEY = "halo.unit";
const PLACE_KEY = "halo.place";

export function loadUnit(): UnitSystem {
  try {
    return localStorage.getItem(UNIT_KEY) === "fahrenheit" ? "fahrenheit" : "celsius";
  } catch {
    return "celsius";
  }
}

export function saveUnit(unit: UnitSystem): void {
  try {
    localStorage.setItem(UNIT_KEY, unit);
  } catch {
    /* private mode / quota */
  }
}

export function loadLastPlace(): Place | null {
  try {
    const raw = localStorage.getItem(PLACE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Place>;
    if (
      typeof parsed.name !== "string" ||
      typeof parsed.latitude !== "number" ||
      typeof parsed.longitude !== "number"
    ) {
      return null;
    }
    return {
      id: typeof parsed.id === "number" ? parsed.id : -1,
      name: parsed.name,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      country: parsed.country,
      admin1: parsed.admin1,
      timezone: parsed.timezone,
    };
  } catch {
    return null;
  }
}

export function saveLastPlace(place: Place): void {
  try {
    localStorage.setItem(PLACE_KEY, JSON.stringify(place));
  } catch {
    /* private mode / quota */
  }
}
