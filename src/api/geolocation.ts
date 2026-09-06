import { WeatherError } from "../types";

export function requestPosition(): Promise<GeolocationPosition> {
  if (!("geolocation" in navigator)) {
    return Promise.reject(
      new WeatherError(
        "This browser doesn’t expose geolocation. Search a city instead.",
        "geo_unavailable",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new WeatherError(
              "Allow location in the browser, or search a city by name instead.",
              "geo_denied",
            ),
          );
          return;
        }
        if (error.code === error.TIMEOUT) {
          reject(
            new WeatherError(
              "We couldn’t get a fix in time. Try again, or search a city.",
              "geo_timeout",
            ),
          );
          return;
        }
        reject(
          new WeatherError("Couldn’t read your location. Search a city instead.", "geo_unavailable"),
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 5 * 60_000,
      },
    );
  });
}
