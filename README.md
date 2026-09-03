# Wanderlust — World Travel Explorer

A front-end React application for the **TAP Academy Front-End Developer Assessment**.

> Explore destinations around the world, see live weather, discover famous places, and plan your trip with an AI assistant.

---

## Live Demo

> https://wanderlust-th1b.onrender.com/

---

## Features

| Feature | Details |
|---------|---------|
| **Landing hero** | Looping background video (Coverr CDN), animated headline, social proof pill |
| **Destination explorer** | 12 curated destinations, live search, region + tag filters, URL-synced |
| **Famous places** | 6 notable places per destination, fetched from Pexels, editorial cards |
| **Location awareness** | Browser geolocation + manual city search via OpenCage geocoding |
| **Real-time weather** | OpenWeather API — temperature, humidity, wind, condition icon |
| **Images via Pexels** | All destination and place images fetched from Pexels API with fallback chain |
| **AI chatbot** | Google Gemini 1.5 Flash — travel Q&A with per-destination system context |
| **Itinerary planner** | Structured Gemini response parsed to JSON, rendered as day-by-day plan |
| **Error states** | Every API failure, empty search, denied location, and loading state is designed |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigation, WCAG AA contrast |
| **Responsive** | Mobile → tablet → desktop layouts at all three breakpoints |

---

## Design

Combines two editorial travel design systems:

- **Raus** — warm cabin journal aesthetic: cream paper canvas (`#f5eedc`), Pine green wordmark (`#006434`), Marigold search bar (`#fcbd1c`), weight-300 headlines
- **Going™** — electric travel companion: Deep Lagoon teal body text (`#004449`), Electric Iris CTAs (`#483cff`), Mint Wash section bands (`#d7ffc2`), Lime Pulse display emphasis (`#0bff80`)

Typography: **Inter** (weights 300/400/500/600/700) — substitute for both Neue Haas Unica and PP Mori.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| React Markdown | Renders Gemini AI responses |
| CSS Modules | Scoped, maintainable component styles |
| CSS Custom Properties | Full design token system |

**APIs:**
- [OpenWeather](https://openweathermap.org/api) — live weather
- [Google Gemini](https://aistudio.google.com/) — AI chat + itinerary
- [Pexels](https://www.pexels.com/api/) — destination and place images
- [OpenCage](https://opencagedata.com/) — reverse + forward geocoding

**Video:** [Coverr](https://coverr.co/) — free aerial travel footage (CDN URL, not committed)

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Travel_Application
npm install
```

### 2. Configure API keys

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```
VITE_OPENWEATHER_KEY=your_key_here
VITE_GEMINI_KEY=your_key_here
VITE_PEXELS_KEY=your_key_here
VITE_OPENCAGE_KEY=your_key_here
```

**Where to get keys (all free tiers):**
- OpenWeather: https://openweathermap.org/api
- Gemini: https://aistudio.google.com/
- Pexels: https://www.pexels.com/api/
- OpenCage: https://opencagedata.com/

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Render

1. Push to GitHub (`.env` is gitignored — never committed)
2. Import the repo at [render.com](https://render.com)
3. Add environment variables in the Render dashboard under **Settings → Environment Variables**:
   - `VITE_OPENWEATHER_KEY`
   - `VITE_GEMINI_KEY`
   - `VITE_PEXELS_KEY`
   - `VITE_OPENCAGE_KEY`
4. Deploy — Render auto-detects Vite

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # AnnouncementBar, Navbar, Footer
│   ├── home/            # HeroSection, MariGoldSearchBar
│   ├── destinations/    # DestinationCard, DestinationGrid
│   ├── places/          # PlaceCard
│   ├── weather/         # WeatherCard
│   ├── chatbot/         # ChatBot, ChatMessage, ItineraryDisplay
│   └── ui/              # Button, SkeletonCard, ErrorState, Toast
├── context/             # LocationContext
├── data/                # destinations.js (12 curated destinations)
├── hooks/               # useWeather, usePexels
├── pages/               # HomePage, ExplorePage, DestinationDetailPage
├── services/            # weatherService, geminiService, pexelsService, geocodingService
└── styles/              # globals.css, animations.css
```

---

## Security

- ✅ All API keys stored in environment variables
- ✅ `.env` is gitignored
- ✅ `.env.example` ships with placeholder names only
- ✅ No keys appear anywhere in source code

---

## Accessibility

- Semantic HTML throughout (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`)
- All images have descriptive `alt` text
- All interactive elements have `aria-label` or visible text
- Keyboard navigation: Tab, Enter, Escape for all interactive patterns
- ARIA live regions for search results and chat messages
- Color contrast: all text passes WCAG AA 4.5:1 minimum

---

*Built for the TAP Academy Front-End Developer Assessment — TAP-JOB-ID-2621*
