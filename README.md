# Halo Weather

A polished weather observatory for the browser. Search any city, or use your location, and get current conditions plus a seven-day forecast. Powered by [Open-Meteo](https://open-meteo.com/) — no API key, no account.

**Live:** https://vinybrun.github.io/halo-weather/

**Project path:** `/home/viny/.local/share/fleet-host/work/07b61a11-acbb-4287-8ace-da06d62f44c1`

## Features

- City search with live suggestions and keyboard navigation
- Optional browser geolocation, reverse-geocoded to a place name
- Current temperature, description, humidity, wind, and feels-like
- °C / °F toggle (wind and precipitation follow the same preference)
- Next-hours strip and a 7-day outlook
- Loading skeletons, network errors with retry, and invalid-city handling
- Last place and unit preference remembered locally
- Responsive layout for phones and desktops

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production bundle into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | TypeScript only |

## API

Halo talks to Open-Meteo over HTTPS from the browser. No keys, no backend.

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Reverse geocoding: `https://geocoding-api.open-meteo.com/v1/reverse`
- Forecast: `https://api.open-meteo.com/v1/forecast`

Attribution is required by Open-Meteo’s CC BY 4.0 license and is shown in the footer.

## Deploy

This is a static Vite app. Publish the `dist/` folder to any static host.

### GitHub Pages

A workflow in `.github/workflows/pages.yml` builds on push to `main` and deploys to GitHub Pages. After the first push:

1. Repo **Settings → Pages → Source: GitHub Actions**
2. Wait for the **Deploy to GitHub Pages** workflow

Or from a machine with `gh` authenticated:

```bash
gh api -X POST repos/<you>/halo-weather/pages -f build_type=workflow
```

The site will be at `https://<you>.github.io/halo-weather/`. The Vite `base` is `./`, so project-page paths work.

### Vercel

```bash
npx vercel --prod
```

`vercel.json` already points at `npm run build` and `dist`.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

`netlify.toml` sets the build command and publish directory.

### Cloudflare Pages

Connect the repo, build command `npm run build`, output directory `dist`.

## Project layout

```
src/
  api/            Open-Meteo + geolocation
  components/     Search, icons, current view, status panels
  hooks/          App state machine
  lib/            units, formatting, WMO codes, localStorage
  App.tsx         Shell and status routing
  styles.css      Visual system
```

## Remaining risks

- Open-Meteo is a public free API. Heavy traffic can be rate-limited.
- Geolocation needs HTTPS (or localhost) and an explicit user permission grant.
- City search quality depends on Open-Meteo’s geocoding index; ambiguous names should include a country (`Paris, TX`).
- Last location is stored in `localStorage` only — nothing is sent to a Halo server, because there isn’t one.
