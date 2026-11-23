import React from 'react';
import {
  MapPin,
  Bookmark,
  Droplets,
  Wind,
  Compass,
  Sun,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Moon,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import type { WeatherData, TemperatureUnit, SavedCity } from '../types/weather';
import {
  formatTemp,
  formatSpeed,
  formatDistance,
  formatPressure,
  getUVDescription,
  getAQIDescription,
  formatTimeDisplay,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  isSaved: boolean;
  onToggleSave: () => void;
  savedCities: SavedCity[];
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
  isSaved,
  onToggleSave,
}) => {
  const { current, location, daily } = weather;
  const todayDaily = daily && daily.length > 0 ? daily[0] : null;

  const uvInfo = getUVDescription(current.uvIndex);
  const aqiInfo = getAQIDescription(current.aqi);

  // Calculate daylight progress percentage
  const getDaylightProgress = () => {
    if (!current.sunrise || !current.sunset) return 50;
    try {
      const sunrise = new Date(current.sunrise).getTime();
      const sunset = new Date(current.sunset).getTime();
      const now = Date.now();
      if (now < sunrise) return 0;
      if (now > sunset) return 100;
      return Math.round(((now - sunrise) / (sunset - sunrise)) * 100);
    } catch {
      return 50;
    }
  };

  const daylightPct = getDaylightProgress();

  return (
    <div className="rounded-3xl bg-white/15 dark:bg-black/25 backdrop-blur-2xl border border-white/20 p-6 md:p-8 shadow-2xl text-white transition-all duration-300">
      {/* Top Bar: Location & Date & Pin Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={22} className="text-amber-300 shrink-0" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {location.name}
            </h1>
            {location.isCurrentLocation && (
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-sky-400/25 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full">
                Your Location
              </span>
            )}
          </div>
          <p className="text-sm text-white/70 mt-0.5 flex items-center gap-2">
            <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-white/60">
              <Clock size={12} />
              Updated {current.lastUpdated}
            </span>
          </p>
        </div>

        {/* Pin / Bookmark Action */}
        <button
          type="button"
          onClick={onToggleSave}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
            isSaved
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-400/30'
              : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
          }`}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark size={15} className={isSaved ? 'fill-slate-950' : ''} />
          <span>{isSaved ? 'Saved' : 'Save Location'}</span>
        </button>
      </div>

      {/* Main Temperature and Weather Icon Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pb-8 border-b border-white/15">
        <div className="flex items-center gap-6">
          <div className="relative">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={88}
              className="drop-shadow-xl"
            />
          </div>

          <div>
            <div className="flex items-baseline">
              <span className="text-6xl md:text-7xl font-extrabold tracking-tighter drop-shadow-md">
                {formatTemp(current.temperature, unit).replace('°', '')}
              </span>
              <span className="text-3xl md:text-4xl font-light text-white/80 ml-1">
                °{unit}
              </span>
            </div>

            <div className="text-lg md:text-xl font-medium text-white/95 mt-1 capitalize">
              {current.conditionText}
            </div>

            <div className="flex items-center gap-3 text-xs md:text-sm text-white/70 mt-1">
              <span>Feels like {formatTemp(current.feelsLike, unit)}</span>
              {todayDaily && (
                <>
                  <span>•</span>
                  <span>
                    ↑ {formatTemp(todayDaily.maxTempC, unit)} ↓{' '}
                    {formatTemp(todayDaily.minTempC, unit)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Highlights / Daylight Summary */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-white/70 mb-3">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-white/50">
              Sun & Daylight Progress
            </span>
            <span>{current.isDay ? 'Daytime' : 'Nighttime'}</span>
          </div>

          {/* Daylight Sun Path Progress Bar */}
          <div className="relative my-2">
            <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-sky-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${daylightPct}%` }}
              />
            </div>
            <div
              className="absolute -top-1.5 transition-all duration-700 transform -translate-x-1/2"
              style={{ left: `${daylightPct}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center">
                <Sun size={11} className="text-amber-950" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-white/80 pt-2">
            <div className="flex items-center gap-1.5">
              <Sunrise size={16} className="text-amber-300" />
              <span>Sunrise: {formatTimeDisplay(current.sunrise)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sunset size={16} className="text-orange-300" />
              <span>Sunset: {formatTimeDisplay(current.sunset)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Secondary Weather Metrics (8 Google-Style Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-6">
        {/* 1. Humidity */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Humidity</span>
            <Droplets size={16} className="text-cyan-300" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{current.humidity}%</span>
          </div>
          <div className="text-[11px] text-white/60">
            Dew point: {formatTemp(current.dewPoint, unit)}
          </div>
        </div>

        {/* 2. Wind & Direction */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Wind</span>
            <Wind size={16} className="text-sky-300" />
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold">{formatSpeed(current.windSpeed, unit)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/60">
            <Compass size={12} className="text-amber-300" />
            <span>
              Direction: {current.windDirectionCompass} ({Math.round(current.windDirection)}°)
            </span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">UV Index</span>
            <Sun size={16} className="text-amber-300" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{current.uvIndex.toFixed(1)}</span>
            <span className={`text-xs font-semibold ${uvInfo.color}`}>
              {uvInfo.text}
            </span>
          </div>
          <div className="text-[11px] text-white/60">
            {current.uvIndex <= 2 ? 'No protection required' : 'Wear sunscreen & shade'}
          </div>
        </div>

        {/* 4. Air Quality Index (AQI) */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Air Quality</span>
            <ShieldAlert size={16} className="text-emerald-300" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{current.aqi}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${aqiInfo.badgeBg}`}>
              {aqiInfo.text}
            </span>
          </div>
          <div className="text-[11px] text-white/60">US AQI Standard</div>
        </div>

        {/* 5. Pressure */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Pressure</span>
            <Gauge size={16} className="text-indigo-300" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{formatPressure(current.pressure, unit)}</span>
          </div>
          <div className="text-[11px] text-white/60">Atmospheric pressure</div>
        </div>

        {/* 6. Visibility */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Visibility</span>
            <Eye size={16} className="text-teal-300" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{formatDistance(current.visibility, unit)}</span>
          </div>
          <div className="text-[11px] text-white/60">
            {current.visibility >= 10 ? 'Crystal clear horizon' : 'Moderate haze/fog'}
          </div>
        </div>

        {/* 7. Moon Phase */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Moon Phase</span>
            <Moon size={16} className="text-blue-200" />
          </div>
          <div className="my-2">
            <span className="text-lg font-bold truncate block">{current.moonPhase}</span>
          </div>
          <div className="text-[11px] text-white/60">
            {current.moonIllumination}% illumination
          </div>
        </div>

        {/* 8. Cloud Cover / Conditions */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/60 text-xs">
            <span className="font-medium">Cloud Cover</span>
            <WeatherIcon code={3} size={16} className="text-slate-300" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold">{current.cloudCover}%</span>
          </div>
          <div className="text-[11px] text-white/60">
            {current.cloudCover < 20 ? 'Mostly sunny' : current.cloudCover < 70 ? 'Scattered clouds' : 'Overcast sky'}
          </div>
        </div>
      </div>
    </div>
  );
};
