# Halo

A polished, responsive weather app. Search any city, optionally use browser geolocation, and read current conditions plus a 7-day forecast. Data comes from [Open-Meteo](https://open-meteo.com/) — **no API key**.

**Live:** [https://vinybrun.github.io/halo-weather/](https://vinybrun.github.io/halo-weather/)

This is a static Vite + React + TypeScript app. The browser talks to Open-Meteo directly. There is no backend and no secrets.

## Features

- City search with live suggestions and keyboard navigation
- Invalid-city handling when Open-Meteo finds no match
- Optional **Near me** via the browser Geolocation API
- Current temperature, description, humidity, wind, feels-like, precipitation, sunrise, and sunset
- °C / °F toggle (wind and precipitation convert with it)
- Next-hours strip and 7-day forecast
- Loading skeletons, network errors, permission-denied states, and retry
- Last place and unit preference saved in `localStorage`
- Weather-reactive atmosphere (clear, night, rain, snow, storm)

## Run locally

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck and build static files into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Typecheck without bundling |

## APIs used

No keys. Attribution is required by Open-Meteo’s CC BY 4.0 licence (shown in the footer).

| Use | Endpoint |
| --- | --- |
| City search | `https://geocoding-api.open-meteo.com/v1/search` |
| Forecast | `https://api.open-meteo.com/v1/forecast` |

Requested forecast fields:

- **current:** `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`, `wind_direction_10m`, `is_day`, `precipitation`
- **hourly:** `temperature_2m`, `weather_code`, `precipitation_probability`, `is_day`
- **daily:** `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`, `sunrise`, `sunset` (7 days)

The browser Geolocation API is used only when you click **Near me**. Weather still loads for those coordinates and is labelled **Your location**.

## Deploy

The production build is a static site (`dist/`).

This is a static Vite app (`dist/`). `base` is `./`, so it works on a domain root or a project subpath.

### GitHub Pages

The repo includes `.github/workflows/pages.yml`. After the first push to `main`:

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
```

Or: **Settings → Pages → Source: GitHub Actions**.

### Vercel

```bash
npx vercel --yes
```

`vercel.json` already points at the Vite output.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or connect the repo: build command `npm run build`, publish directory `dist`. `netlify.toml` is included.

### Manual static host

```bash
npm run build
```

Upload the contents of `dist/` to any static host.

## Remaining risks

- Open-Meteo rate-limits very heavy anonymous use (about 10k calls/day on the free tier).
- City search depends on Open-Meteo’s gazetteer; obscure or misspelled names can miss.
- Geolocation can be blocked by the browser, HTTP (non-secure) origins, or the user.
- Forecasts are model output, not official warnings.
- Google Fonts are loaded from `fonts.googleapis.com` (the app still works if that request fails).
