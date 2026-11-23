# Google Weather Web App

A responsive, modern Google Weather-style web application built with **React**, **TypeScript**, **Tailwind CSS**, **Recharts**, and free weather APIs (**Open-Meteo** and **BigDataCloud**).

---

## ✨ Features

1. **Header & Navigation:**
   - **Autocomplete Location Search:** Real-time search with debouncing for cities, states, and countries worldwide.
   - **Recent Searches:** Automatically stores search history in `localStorage` with quick replay and one-click clear.
   - **"Use Current Location":** Instant geolocation with reverse geocoding to resolve your city name and local coordinates.
   - **Global °C / °F Unit Toggle:** Seamlessly updates temperatures, wind speeds (`km/h` ↔ `mph`), visibility (`km` ↔ `mi`), and pressure (`hPa` ↔ `inHg`) globally.
   - **Favorites & Pinned Cities Drawer:** Slide-out right drawer to pin current locations, manage saved cities, and pick from suggested world capitals.

2. **Current Weather Card:**
   - City name, region, country, and live update timestamp.
   - Weather condition text and animated Google Weather-style icons.
   - Large temperature display with **"Feels Like"** temperature and day's high/low range.
   - **Sun & Daylight Progress Arc:** Visual daylight progress bar tracking sunrise to sunset in real-time.
   - **8 Secondary Weather Metrics Tiles:**
     - 💧 **Humidity (%)** & Dew point
     - 💨 **Wind Speed & Direction** (compass direction e.g., `NE`, bearing in degrees)
     - ☀️ **UV Index** (with color-coded severity: Low, Moderate, High, Very High, Extreme)
     - 🛡️ **Air Quality Index (AQI)** (US AQI standard with health advisories)
     - ⏱️ **Atmospheric Pressure** (`hPa` or `inHg`)
     - 👁️ **Visibility** (`km` or `miles` with clarity ratings)
     - 🌕 **Moon Phase** (astronomical phase calculation with illumination percentage)
     - ☁️ **Cloud Cover (%)**

3. **Hourly Forecast (Next 48 Hours):**
   - Horizontal scrollable timeline strip with left/right quick scroll buttons.
   - Time ("Now", "11 AM", etc.), condition icon, temperature, and precipitation chance (%).

4. **Interactive 24-Hour Trend Visualizer (Charts):**
   - **Temperature:** Smooth spline area chart with radiant gradient fill and custom glassmorphism tooltip.
   - **Precipitation:** Blue bar chart displaying hourly rain probability (0%–100%).
   - **Wind & Gusts:** Area chart showing wind variation over the next 24 hours.

5. **10-Day Extended Outlook:**
   - Daily forecast cards displaying weekday, full date, weather condition icon, condition text, and rain probability.
   - **Google Weather-Style Temperature Range Bar:** Proportional horizontal gradient bar visualizing the day's minimum and maximum temperatures relative to the entire week's overall range.
   - **Expandable Accordion:** Click any day to reveal its specific sunrise, sunset, max wind, max UV, and complete 24-hour breakdown.

6. **Severe Weather Alert Banner:**
   - Automatically detects severe weather phenomena (thunderstorms with hail, severe wind, excessive heat waves, hard freezes, hazardous air quality).
   - Expandable card detailing severe weather headlines, advisories, precautions, and issuing authority.
   - **"Preview Severe Alert"** button allowing testing and demonstration of the severe weather banner in any location.

7. **UI/UX & Dynamic Themes:**
   - Dynamic background color gradients that morph according to weather conditions (sunny clear day, starry night, overcast, rain, thunderstorms, snow, fog) and time of day.
   - Glassmorphic card styling (`backdrop-blur-xl bg-white/15 dark:bg-black/25`) with subtle borders and shadows.
   - Fully responsive for mobile, tablet, and desktop viewports.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`.

---

## 🔑 Weather API Configuration

**Zero Configuration Required!**  
By default, the application uses **Open-Meteo** (no API key required) and **BigDataCloud** (free client-side reverse geocoding), providing full global coverage out-of-the-box.

If you wish to configure additional API keys, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
And add your optional keys:
```env
VITE_WEATHER_API_KEY=your_weatherapi_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
```

---

## 🛠️ Project Structure

```text
weather-app/
├── index.html                     # HTML entry point with metadata & fonts
├── vite.config.ts                 # Vite + Tailwind v4 configuration
├── package.json                   # Dependencies & scripts
├── src/
│   ├── App.tsx                    # Main orchestrator & state manager
│   ├── index.css                  # Tailwind styles & keyframes
│   ├── main.tsx                   # React root entry
│   ├── types/
│   │   └── weather.ts             # TypeScript definitions
│   ├── utils/
│   │   ├── weatherUtils.ts        # Unit conversions, WMO codes, moon phase math
│   │   └── storage.ts             # LocalStorage helpers for saved cities & recents
│   ├── services/
│   │   └── weatherApi.ts          # Open-Meteo & reverse geocode API service
│   └── components/
│       ├── Header.tsx             # Search, autocomplete, geolocation & unit switch
│       ├── WeatherBackground.tsx  # Dynamic atmospheric sky gradients & particles
│       ├── WeatherIcon.tsx        # Styled weather condition icons
│       ├── CurrentWeatherCard.tsx # Main current weather display & 8 metric tiles
│       ├── HourlyForecastTimeline.tsx # Horizontal 48-hr scroll strip
│       ├── WeatherCharts.tsx      # Recharts visualizer (Temp, Rain %, Wind)
│       ├── WeeklyForecast.tsx     # 10-day outlook with range bars & daily expansion
│       ├── SevereAlertBanner.tsx  # Severe weather alert banner
│       ├── FavoritesDrawer.tsx    # Slide-out saved locations sidebar
│       └── WeatherSkeleton.tsx    # Loading skeleton animation
```

---

## 📦 Build for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```
