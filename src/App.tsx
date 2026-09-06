import { SearchBar } from "./components/SearchBar";
import { ErrorPanel, IdlePanel, LoadingPanel, NotFoundPanel } from "./components/StatusPanels";
import { UnitToggle } from "./components/UnitToggle";
import { HaloMark } from "./components/WeatherIcon";
import { WeatherView } from "./components/WeatherView";
import { useWeatherApp } from "./hooks/useWeatherApp";
import { weatherMeta } from "./lib/weather";
import type { WeatherError } from "./types";

export default function App() {
  const app = useWeatherApp();
  const sky = app.weather
    ? weatherMeta(app.weather.current.weatherCode, app.weather.current.isDay).sky
    : "idle";
  const loading = app.status.kind === "loading";
  const error = app.status.kind === "error" ? app.status.error : null;

  return (
    <div className="shell" data-sky={sky}>
      <div className="atmosphere" aria-hidden="true">
        <div className="orb" />
        <div className="haze" />
        <div className="grain" />
      </div>

      <header className="top">
        <a className="brand" href="./">
          <span className="brand-mark">
            <HaloMark />
          </span>
          <span className="brand-copy">
            <span className="brand-name">Halo</span>
            <span className="brand-tag">Weather</span>
          </span>
        </a>
        <UnitToggle unit={app.unit} onChange={app.setUnit} />
      </header>

      <div className="main">
        <SearchBar
          query={app.query}
          onQueryChange={app.setQuery}
          onSubmitQuery={(value) => void app.searchCity(value)}
          onSelectPlace={(place) => void app.loadPlace(place, "search")}
          onUseLocation={() => void app.useLocation()}
          busy={loading}
        />

        {error?.code === "not_found" ? (
          <NotFoundPanel
            query={app.failedQuery || app.query}
            onPick={(city: string) => void app.searchCity(city)}
          />
        ) : null}

        {error && error.code !== "not_found" ? (
          <ErrorPanel title={errorTitle(error)} detail={error.message} onRetry={() => void app.retry()} />
        ) : null}

        {app.status.kind === "loading" && !app.weather ? (
          <LoadingPanel
            label={app.status.reason === "geo" ? "your location" : app.query || "the forecast"}
          />
        ) : null}

        {!loading && !app.weather && !error ? (
          <IdlePanel onPick={(city: string) => void app.searchCity(city)} />
        ) : null}

        {app.weather && !error ? (
          <WeatherView place={app.weather.place} weather={app.weather} unit={app.unit} />
        ) : null}
      </div>

      <footer className="foot">
        <p>
          Weather data by{" "}
          <a href="https://open-meteo.com/" rel="noreferrer" target="_blank">
            Open-Meteo
          </a>{" "}
          (CC BY 4.0). Locations from GeoNames via Open-Meteo Geocoding. Forecasts are model output,
          not official warnings.
        </p>
      </footer>
    </div>
  );
}

function errorTitle(error: WeatherError): string {
  switch (error.code) {
    case "network":
      return "Can’t reach the weather service";
    case "geo_denied":
      return "Location permission denied";
    case "geo_timeout":
      return "Location timed out";
    case "geo_unavailable":
      return "Location isn’t available";
    case "api":
      return "The forecast stalled";
    default:
      return "Something went wrong";
  }
}
