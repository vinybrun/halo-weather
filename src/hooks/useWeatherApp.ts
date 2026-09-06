import { useCallback, useEffect, useRef, useState } from "react";
import { requestPosition } from "../api/geolocation";
import { fetchWeather, pickBestPlace, reverseGeocode, searchPlaces } from "../api/openMeteo";
import { loadLastPlace, loadUnit, saveLastPlace, saveUnit } from "../lib/storage";
import {
  WeatherError,
  type AppStatus,
  type Place,
  type UnitSystem,
  type WeatherBundle,
} from "../types";

export function useWeatherApp() {
  const [unit, setUnitState] = useState<UnitSystem>(() => loadUnit());
  const [query, setQuery] = useState("");
  const [failedQuery, setFailedQuery] = useState("");
  const [weather, setWeather] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<AppStatus>({ kind: "idle" });
  const weatherAbort = useRef<AbortController | null>(null);
  const retryRef = useRef<(() => void) | null>(null);

  const setUnit = useCallback((next: UnitSystem) => {
    setUnitState(next);
    saveUnit(next);
  }, []);

  const loadPlace = useCallback(async (place: Place, reason: "search" | "geo" | "refresh") => {
    weatherAbort.current?.abort();
    const controller = new AbortController();
    weatherAbort.current = controller;
    setStatus({ kind: "loading", reason });
    retryRef.current = () => {
      void loadPlace(place, reason);
    };
    try {
      const bundle = await fetchWeather(place, controller.signal);
      if (controller.signal.aborted) return;
      setWeather(bundle);
      setQuery(place.id === -1 ? "" : place.name);
      saveLastPlace(place);
      setStatus({ kind: "idle" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus({
        kind: "error",
        error:
          error instanceof WeatherError
            ? error
            : new WeatherError("Something went wrong while loading weather.", "api"),
      });
    }
  }, []);

  useEffect(() => {
    const last = loadLastPlace();
    if (last?.latitude && last.longitude) {
      void loadPlace(last, "refresh");
    }
  }, [loadPlace]);

  const searchCity = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      setQuery(trimmed);
      if (trimmed.length < 2) {
        setStatus({
          kind: "error",
          error: new WeatherError("Type at least two letters of a city name.", "not_found"),
        });
        retryRef.current = () => {
          setStatus({ kind: "idle" });
        };
        return;
      }

      setStatus({ kind: "loading", reason: "search" });
      retryRef.current = () => {
        void searchCity(trimmed);
      };
      try {
        const results = await searchPlaces(trimmed);
        const match = pickBestPlace(results, trimmed);
        if (!match) {
          setWeather(null);
          setFailedQuery(trimmed);
          setStatus({
            kind: "error",
            error: new WeatherError(
              `No place named “${trimmed}”. Try another city, region, or postal code.`,
              "not_found",
            ),
          });
          return;
        }
        await loadPlace(match, "search");
      } catch (error) {
        setStatus({
          kind: "error",
          error:
            error instanceof WeatherError
              ? error
              : new WeatherError("Search failed. Please try again.", "api"),
        });
      }
    },
    [loadPlace],
  );

  const useLocation = useCallback(async () => {
    setStatus({ kind: "loading", reason: "geo" });
    retryRef.current = () => {
      void useLocation();
    };
    try {
      const position = await requestPosition();
      const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      await loadPlace(place, "geo");
    } catch (error) {
      setStatus({
        kind: "error",
        error:
          error instanceof WeatherError
            ? error
            : new WeatherError("Could not use your location.", "geo_unavailable"),
      });
    }
  }, [loadPlace]);

  const retry = useCallback(() => {
    if (retryRef.current) retryRef.current();
    else setStatus({ kind: "idle" });
  }, []);

  return {
    unit,
    setUnit,
    query,
    setQuery,
    failedQuery,
    weather,
    status,
    loadPlace,
    searchCity,
    useLocation,
    retry,
  };
}
