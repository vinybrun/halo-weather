# Halo Weather

A polished, publicly usable weather app. Search any city, or use the browser’s location. Current conditions, the next hours, and a 7-day forecast — no accounts, no API keys.

**Live:** [https://vinybrun.github.io/halo-weather/](https://vinybrun.github.io/halo-weather/)

Weather and geocoding come from [Open-Meteo](https://open-meteo.com/) (free, no key).

## Features

- City search with live suggestions and keyboard navigation
- Optional browser geolocation (“Near me”)
- Current conditions: temperature, description, humidity, wind, feels-like
- Instant °C / °F toggle (wind km/h ↔ mph, precipitation mm ↔ in)
- Next-hours strip and a 7-day outlook
- Loading skeletons, network errors with retry, and unknown-city handling
- Last place and unit preference remembered in `localStorage`
- Responsive layout for phones and desktops
- Weather-reactive atmosphere

## Project path

```
/home/viny/.local/share/fleet-host/work/07b61a11-acbb-4287-8ace-da06d62f44c1
```

This directory is the app root (`package.json`, `src/`, `index.html`). Ignore leftover experiment folders such as `alto-app/`, `brume/`, and `halo-ship/` — they are not the shipped product.

## Run locally

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Typecheck and production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |

## API

No keys. The browser talks to Open-Meteo directly.

| Use | Endpoint |
| --- | --- |
| City search | `https://geocoding-api.open-meteo.com/v1/search` |
| Reverse geocode (optional) | `https://geocoding-api.open-meteo.com/v1/reverse` |
| Forecast | `https://api.open-meteo.com/v1/forecast` |

Requested forecast fields:

- **current:** `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`, `wind_direction_10m`, `is_day`, `precipitation`
- **hourly:** `temperature_2m`, `weather_code`, `precipitation_probability`, `is_day`
- **daily:** `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`, `sunrise`, `sunset` (7 days)

Forecasts are requested in Celsius / km/h and converted on the device. If reverse geocoding is unavailable, “Near me” still loads weather for the coordinates and labels the place **Your location**.

## Deploy

This is a static Vite app (`dist/`). `base` is `./`, so it works on a domain root or a project subpath. No environment variables.

### GitHub Pages (this repo)

The live site is served from the `gh-pages` branch.

```bash
npm ci
npm run build
# publish the contents of dist/ to the gh-pages branch
```

Repo **Settings → Pages → Deploy from a branch → `gh-pages` / root**.

A GitHub Actions workflow also exists at `.github/workflows/pages.yml`. To use it instead, switch Pages source to **GitHub Actions**.

### Vercel

```bash
npx vercel --prod
```

`vercel.json` already points at `dist`.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or connect the repo. `netlify.toml` sets `npm run build` and publish directory `dist`.

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

## Remaining risks

- Open-Meteo’s free tier is for **non-commercial** use and is rate-limited. Heavy public traffic can be throttled.
- City search needs at least two characters. Unusual spellings or very small places may return nothing.
- Geolocation depends on HTTPS (or localhost), a supporting browser, and the user granting permission.
- Forecasts are model output, not official warnings. Do not rely on this app for severe-weather decisions.
- Last place is stored only in the browser. Clearing site data forgets it.
- Google Fonts load from `fonts.googleapis.com`. The app still works if that request fails (system fonts).

## License

MIT. Weather data attribution: **Weather data by Open-Meteo.com**. Location data based on GeoNames.
