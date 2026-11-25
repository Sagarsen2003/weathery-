import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  Wind,
  Sun,
} from 'lucide-react';
import type { DailyForecast, TemperatureUnit } from '../types/weather';
import { formatTemp, formatSpeed } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface WeeklyForecastProps {
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ daily, unit }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(
    daily.length > 0 ? daily[0].date : null
  );

  // Determine global min and max temperature across all days for proportional range bars
  const allMins = daily.map((d) => d.minTempC);
  const allMaxs = daily.map((d) => d.maxTempC);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="rounded-3xl sm:rounded-[2rem] liquid-glass p-4 sm:p-6 text-white">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-amber-300 drop-shadow shrink-0" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight">10-Day Outlook</h2>
        </div>
        <span className="text-[11px] sm:text-xs text-white/60">Tap day for hourly details</span>
      </div>

      {/* Daily List */}
      <div className="space-y-2.5">
        {daily.map((day) => {
          const isExpanded = expandedDate === day.date;

          // Compute horizontal bar percentages
          const leftPct = Math.max(
            0,
            Math.min(100, ((day.minTempC - globalMin) / tempRange) * 100)
          );
          const rightPct = Math.max(
            0,
            Math.min(100, ((globalMax - day.maxTempC) / tempRange) * 100)
          );

          return (
            <div
              key={day.date}
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                isExpanded ? 'liquid-glass-active' : 'liquid-glass-subtle'
              }`}
            >
              {/* Main Daily Row */}
              <div
                onClick={() => toggleExpand(day.date)}
                className="p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer select-none"
              >
                {/* Left: Day & Date */}
                <div className="w-14 sm:w-24 md:w-28 shrink-0">
                  <span className="font-semibold text-xs sm:text-sm md:text-base text-white block truncate">
                    {day.dayName}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-white/65 block">{day.fullDate}</span>
                </div>

                {/* Condition & Rain Chance */}
                <div className="flex-1 min-w-0 sm:flex-none sm:w-36 md:w-40 flex items-center gap-2 sm:gap-3">
                  <WeatherIcon code={day.weatherCode} size={24} className="shrink-0 sm:w-[28px] sm:h-[28px]" />
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-medium text-white/90 truncate block">
                      {day.conditionText}
                    </span>
                    {day.precipitationProbability > 0 && (
                      <span className="text-[10px] sm:text-[11px] text-sky-300 font-semibold flex items-center gap-1">
                        <Droplets size={10} className="shrink-0" />
                        {day.precipitationProbability}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Min/Max range bar (sm+) */}
                <div className="flex-1 hidden sm:flex items-center gap-2.5 md:gap-3 px-1 md:px-2">
                  <span className="text-xs font-medium text-white/75 w-8 text-right shrink-0">
                    {formatTemp(day.minTempC, unit)}
                  </span>

                  {/* Range visual track */}
                  <div className="flex-1 bg-white/15 h-2 rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-orange-400 shadow-sm"
                      style={{
                        left: `${leftPct}%`,
                        right: `${rightPct}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white w-8 shrink-0">
                    {formatTemp(day.maxTempC, unit)}
                  </span>
                </div>

                {/* Mobile temp display when range bar is hidden */}
                <div className="flex sm:hidden items-center gap-1 text-xs whitespace-nowrap shrink-0">
                  <span className="text-white/65">{formatTemp(day.minTempC, unit)}</span>
                  <span className="text-white/40">/</span>
                  <span className="font-bold text-white">{formatTemp(day.maxTempC, unit)}</span>
                </div>

                {/* Expand Chevron */}
                <div className="shrink-0 text-white/65">
                  {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </div>
              </div>

              {/* Expanded Detailed Hourly Info for this specific Day */}
              {isExpanded && (
                <div className="p-3 sm:p-4 bg-black/20 border-t border-white/10 space-y-3 sm:space-y-4 animate-fadeIn">
                  {/* Secondary stats for this day */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="liquid-glass-subtle p-2.5 rounded-xl flex items-center gap-2">
                      <Sunrise size={16} className="text-amber-300 shrink-0" />
                      <div>
                        <span className="text-white/65 block text-[10px]">Sunrise</span>
                        <span className="font-semibold text-white">
                          {day.sunrise ? new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </span>
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl flex items-center gap-2">
                      <Sunset size={16} className="text-orange-300 shrink-0" />
                      <div>
                        <span className="text-white/65 block text-[10px]">Sunset</span>
                        <span className="font-semibold text-white">
                          {day.sunset ? new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </span>
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl flex items-center gap-2">
                      <Wind size={16} className="text-sky-300 shrink-0" />
                      <div>
                        <span className="text-white/65 block text-[10px]">Max Wind</span>
                        <span className="font-semibold text-white">
                          {formatSpeed(day.windSpeedMax, unit)}
                        </span>
                      </div>
                    </div>

                    <div className="liquid-glass-subtle p-2.5 rounded-xl flex items-center gap-2">
                      <Sun size={16} className="text-amber-300 shrink-0" />
                      <div>
                        <span className="text-white/65 block text-[10px]">Max UV</span>
                        <span className="font-semibold text-white">
                          {day.uvIndexMax.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Breakdown Strip for this specific Day */}
                  {day.hourly && day.hourly.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-white/65 uppercase tracking-wider block mb-2">
                        Hourly breakdown for {day.dayName}
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {day.hourly.map((h, i) => (
                          <div
                            key={`${h.time}-${i}`}
                            className="shrink-0 w-20 p-2.5 rounded-xl liquid-glass-subtle text-center flex flex-col items-center justify-between"
                          >
                            <span className="text-[11px] text-white/70 font-medium">
                              {h.displayTime}
                            </span>
                            <div className="my-1.5">
                              <WeatherIcon code={h.weatherCode} isDay={h.isDay} size={22} />
                            </div>
                            <span className="text-xs font-bold text-white">
                              {formatTemp(h.tempC, unit)}
                            </span>
                            {h.precipitationProbability > 0 && (
                              <span className="text-[10px] text-sky-300 font-semibold flex items-center gap-0.5 mt-1">
                                <Droplets size={8} />
                                {h.precipitationProbability}%
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
