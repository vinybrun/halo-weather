# Halo Weather

A polished, responsive weather app for the browser. Search any city, or use your location, and read current conditions plus a seven-day forecast. Data comes from [Open-Meteo](https://open-meteo.com/) — **no API key**.

**Live:** https://vinybrun.github.io/halo-weather/

This is a static Vite + React + TypeScript app. The browser talks to Open-Meteo directly. There is no backend and no secrets.

## Features

- City search with live suggestions and keyboard navigation
- Invalid-city handling when Open-Meteo finds no match
- Optional **Near me** via the browser Geolocation API
- Current temperature, description, humidity, wind, and feels-like
- °C / °F toggle (wind and precipitation convert with it)
- Next-hours strip and a 7-day forecast
- Loading skeletons, network errors with retry, and permission-denied states
- Last place and unit preference saved in `localStorage`
- Weather-reactive atmosphere (clear, night, rain, snow, storm)
- Responsive layout for phones and desktops

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

Production preview:

```bash
npm run build
npm run preview
```

## APIs used

No keys. Attribution is required by Open-Meteo’s CC BY 4.0 licence (shown in the footer).

1. **Geocoding** — `https://geocoding-api.open-meteo.com/v1/search`  
   Resolves a city name to coordinates.
2. **Reverse geocoding** — `https://geocoding-api.open-meteo.com/v1/reverse`  
   Labels a GPS fix when possible; otherwise the app shows **Your location**.
3. **Forecast** — `https://api.open-meteo.com/v1/forecast`  
   Current conditions, hourly, and 7-day daily outlook for those coordinates.

The browser Geolocation API is used only when you click **Near me**.

## Deploy

The production build is a static site (`dist/`).

### GitHub Pages

```bash
npm run build
```

This repo deploys in two ways:

- **Actions:** `.github/workflows/pages.yml` builds on every push to `main`.
- **Branch:** the `gh-pages` branch serves the contents of `dist/`.

After creating a new repo:

```bash
gh repo create YOUR_USER/halo-weather --public --source=. --remote=origin --push
gh api -X POST repos/YOUR_USER/halo-weather/pages \
  -f build_type=legacy \
  -f source[branch]=gh-pages \
  -f source[path]='/'
```

To publish `dist/` to `gh-pages`:

```bash
git checkout --orphan gh-pages
git reset
git add -f dist
git mv dist/* .
touch .nojekyll
git add .nojekyll
git commit -m "Deploy"
git push -u origin gh-pages
```

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

## Project layout

```
src/
  api/            Open-Meteo client + browser geolocation
  components/     Search, icons, current view, status panels
  hooks/          App state machine
  lib/            units, formatting, WMO codes, localStorage
  App.tsx         Shell and status routing
  styles.css      Visual system
```

## Remaining risks

- Open-Meteo rate-limits very heavy anonymous use (about 10k calls/day on the free tier).
- City search depends on Open-Meteo’s gazetteer; obscure or misspelled names can miss.
- Geolocation can be blocked by the browser, HTTP (non-secure) origins, or the user.
- Forecasts are model output, not official warnings.
- Google Fonts are loaded from `fonts.googleapis.com` (the app still works if that request fails).
- Reverse geocoding may be unavailable; the app then labels the pin as **Your location**.
