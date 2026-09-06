import { formatClock, formatHourLabel, formatSun, formatWeekday, placeSubtitle } from "../lib/format";
import { formatPrecip, formatTemp, formatWind, precipUnit, tempSuffix, windUnit } from "../lib/units";
import { weatherMeta, windCompass } from "../lib/weather";
import type { Place, UnitSystem, WeatherBundle } from "../types";
import { WeatherIcon } from "./WeatherIcon";

type Props = {
  place: Place;
  weather: WeatherBundle;
  unit: UnitSystem;
};

export function WeatherView({ place, weather, unit }: Props) {
  const { current, hourly, daily, timezone, timezoneAbbreviation } = weather;
  const meta = weatherMeta(current.weatherCode, current.isDay);
  const today = daily[0];

  return (
    <>
      <section className="now" aria-live="polite">
        <div className="now-copy">
          <p className="place">
            {place.name}
            <span className="place-sub"> · {placeSubtitle(place)}</span>
          </p>
          <p className="when">
            {formatClock(current.time, timezone)}
            {timezoneAbbreviation ? ` · ${timezoneAbbreviation}` : ""}
          </p>
          <div className="temp-row">
            <div className="halo" data-kind={meta.kind}>
              <WeatherIcon kind={meta.kind} size={56} />
            </div>
            <p className="temp">
              {formatTemp(current.temperature, unit)}
              <span>{tempSuffix(unit)}</span>
            </p>
          </div>
          <p className="desc">{meta.label}</p>
        </div>
        <dl className="stats">
          <div className="stat">
            <dt>Feels like</dt>
            <dd>{formatTemp(current.feelsLike, unit)}</dd>
          </div>
          <div className="stat">
            <dt>Humidity</dt>
            <dd>{Math.round(current.humidity)}%</dd>
          </div>
          <div className="stat">
            <dt>Wind</dt>
            <dd>
              {formatWind(current.windSpeed, unit)}{" "}
              <small>
                {windUnit(unit)} {windCompass(current.windDirection)}
              </small>
            </dd>
          </div>
          <div className="stat">
            <dt>Precip now</dt>
            <dd>
              {formatPrecip(current.precipitation, unit)} <small>{precipUnit(unit)}</small>
            </dd>
          </div>
        </dl>
      </section>

      {today ? (
        <p className="sunline">
          High {formatTemp(today.tMax, unit)} · Low {formatTemp(today.tMin, unit)}
          {today.sunrise ? ` · Sunrise ${formatSun(today.sunrise, timezone)}` : ""}
          {today.sunset ? ` · Sunset ${formatSun(today.sunset, timezone)}` : ""}
        </p>
      ) : null}

      <section className="strip-wrap" aria-labelledby="hourly-title">
        <h2 id="hourly-title">Next hours</h2>
        <div className="strip" role="list">
          {hourly.map((hour) => {
            const hourMeta = weatherMeta(hour.weatherCode, hour.isDay);
            return (
              <article className="hour" role="listitem" key={hour.time}>
                <p className="hour-t">{formatHourLabel(hour.time, current.time, timezone)}</p>
                <WeatherIcon kind={hourMeta.kind} size={24} />
                <p className="hour-temp">{formatTemp(hour.temperature, unit)}</p>
                <p className="hour-pop">{hour.precipitationProbability}%</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="days-wrap" aria-labelledby="daily-title">
        <h2 id="daily-title">Seven-day outlook</h2>
        <div className="days" role="list">
          {daily.map((day) => {
            const dayMeta = weatherMeta(day.weatherCode, true);
            return (
              <article className="day" role="listitem" key={day.date}>
                <p className="day-name">{formatWeekday(day.date, daily[0]?.date)}</p>
                <div className="day-icon">
                  <WeatherIcon kind={dayMeta.kind} size={28} />
                </div>
                <p className="day-label">{dayMeta.label}</p>
                <p className="day-range">
                  <span className="hi">{formatTemp(day.tMax, unit)}</span>
                  <span className="lo">{formatTemp(day.tMin, unit)}</span>
                </p>
                <p className="day-pop">{day.precipProb}%</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
