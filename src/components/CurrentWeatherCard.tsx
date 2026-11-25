import React, { useMemo } from 'react';
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
  const daylightPct = useMemo(() => {
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
  }, [current.sunrise, current.sunset]);

  return (
    <div className="rounded-3xl sm:rounded-[2rem] liquid-glass p-4 sm:p-6 md:p-8 text-white transition-all duration-300">
      {/* Top Bar: Location & Date & Pin Button */}
      <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <MapPin size={20} className="text-amber-300 shrink-0 drop-shadow sm:w-[22px] sm:h-[22px]" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight drop-shadow-sm truncate">
              {location.name}
            </h1>
            {location.isCurrentLocation && (
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-sky-400/25 text-sky-100 border border-sky-300/40 px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-md whitespace-nowrap">
                Your Location
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-white/75 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="truncate max-w-full">{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
            <span className="hidden xs:inline">•</span>
            <span className="flex items-center gap-1 text-white/65 whitespace-nowrap">
              <Clock size={12} />
              Updated {current.lastUpdated}
            </span>
          </p>
        </div>

        {/* Pin / Bookmark Action */}
        <button
          type="button"
          onClick={onToggleSave}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
            isSaved
              ? 'bg-amber-400 text-slate-950 border border-amber-200 shadow-[0_6px_20px_rgba(251,191,36,0.4)]'
              : 'liquid-glass-pill text-white'
          }`}
          title={isSaved ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark size={14} className={isSaved ? 'fill-slate-950' : ''} />
          <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Location'}</span>
          <span className="sm:hidden">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Main Temperature and Weather Icon Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-center pb-6 md:pb-8 border-b border-white/15">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl liquid-glass-subtle shrink-0">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={64}
              className="drop-shadow-xl sm:w-[84px] sm:h-[84px]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-baseline">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter drop-shadow-md">
                {formatTemp(current.temperature, unit).replace('°', '')}
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white/85 ml-1">
                °{unit}
              </span>
            </div>

            <div className="text-base sm:text-lg md:text-xl font-semibold text-white/95 mt-0.5 sm:mt-1 capitalize drop-shadow-sm truncate">
              {current.conditionText}
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs md:text-sm text-white/75 mt-1">
              <span>Feels like {formatTemp(current.feelsLike, unit)}</span>
              {todayDaily && (
                <>
                  <span>•</span>
                  <span className="whitespace-nowrap">
                    ↑ {formatTemp(todayDaily.maxTempC, unit)} ↓{' '}
                    {formatTemp(todayDaily.minTempC, unit)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Highlights / Daylight Summary */}
        <div className="liquid-glass-subtle rounded-2xl p-3.5 sm:p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/75 mb-3">
            <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] text-white/60">
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

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-white/85 pt-2">
            <div className="flex items-center gap-1.5">
              <Sunrise size={15} className="text-amber-300 shrink-0" />
              <span>Sunrise: {formatTimeDisplay(current.sunrise)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sunset size={15} className="text-orange-300 shrink-0" />
              <span>Sunset: {formatTimeDisplay(current.sunset)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Secondary Weather Metrics (8 Liquid Glass Tiles) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mt-5 sm:mt-6">
        {/* 1. Humidity */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Humidity</span>
            <Droplets size={15} className="text-cyan-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2">
            <span className="text-xl sm:text-2xl font-bold">{current.humidity}%</span>
          </div>
          <div className="text-[11px] text-white/65 truncate">
            Dew point: {formatTemp(current.dewPoint, unit)}
          </div>
        </div>

        {/* 2. Wind & Direction */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Wind</span>
            <Wind size={15} className="text-sky-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold truncate">{formatSpeed(current.windSpeed, unit)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/65 leading-snug">
            <Compass size={12} className="text-amber-300 shrink-0" />
            <span className="truncate">
              {current.windDirectionCompass} ({Math.round(current.windDirection)}°)
            </span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">UV Index</span>
            <Sun size={15} className="text-amber-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-xl sm:text-2xl font-bold">{current.uvIndex.toFixed(1)}</span>
            <span className={`text-xs font-semibold ${uvInfo.color}`}>
              {uvInfo.text}
            </span>
          </div>
          <div className="text-[11px] text-white/65 leading-snug">
            {current.uvIndex <= 2 ? 'No protection required' : 'Wear sunscreen & shade'}
          </div>
        </div>

        {/* 4. Air Quality Index (AQI) */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Air Quality</span>
            <ShieldAlert size={15} className="text-emerald-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-bold">{current.aqi}</span>
            <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md leading-tight ${aqiInfo.badgeBg}`}>
              {aqiInfo.text}
            </span>
          </div>
          <div className="text-[11px] text-white/65">US AQI Standard</div>
        </div>

        {/* 5. Pressure */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Pressure</span>
            <Gauge size={15} className="text-indigo-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2">
            <span className="text-lg sm:text-2xl font-bold truncate block">{formatPressure(current.pressure, unit)}</span>
          </div>
          <div className="text-[11px] text-white/65 truncate">Atmospheric pressure</div>
        </div>

        {/* 6. Visibility */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Visibility</span>
            <Eye size={15} className="text-teal-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2">
            <span className="text-xl sm:text-2xl font-bold">{formatDistance(current.visibility, unit)}</span>
          </div>
          <div className="text-[11px] text-white/65 leading-snug">
            {current.visibility >= 10 ? 'Crystal clear horizon' : 'Moderate haze/fog'}
          </div>
        </div>

        {/* 7. Moon Phase */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Moon Phase</span>
            <Moon size={15} className="text-blue-200 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2">
            <span className="text-base sm:text-lg font-bold leading-tight block">{current.moonPhase}</span>
          </div>
          <div className="text-[11px] text-white/65">
            {current.moonIllumination}% illumination
          </div>
        </div>

        {/* 8. Cloud Cover / Conditions */}
        <div className="liquid-glass-subtle rounded-2xl p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between text-white/70 text-[11px] sm:text-xs">
            <span className="font-medium">Cloud Cover</span>
            <WeatherIcon code={3} size={15} className="text-slate-300 shrink-0" />
          </div>
          <div className="my-1.5 sm:my-2">
            <span className="text-xl sm:text-2xl font-bold">{current.cloudCover}%</span>
          </div>
          <div className="text-[11px] text-white/65 leading-snug">
            {current.cloudCover < 20 ? 'Mostly sunny' : current.cloudCover < 70 ? 'Scattered clouds' : 'Overcast sky'}
          </div>
        </div>
      </div>
    </div>
  );
};
