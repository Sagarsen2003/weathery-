import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Clock } from 'lucide-react';
import type { HourlyForecast, TemperatureUnit } from '../types/weather';
import { formatTemp } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';
import { WeatherCharts } from './WeatherCharts';

interface HourlyForecastTimelineProps {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
}

export const HourlyForecastTimeline: React.FC<HourlyForecastTimelineProps> = ({
  hourly,
  unit,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-3xl bg-white/15 dark:bg-black/25 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl text-white">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-amber-300" />
          <h2 className="text-lg md:text-xl font-bold tracking-tight">Hourly Forecast</h2>
          <span className="text-xs text-white/50 ml-1">Next 48 Hours</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline Strip */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar select-none"
      >
        {hourly.map((item, index) => {
          const isNow = index === 0;

          return (
            <div
              key={`${item.time}-${index}`}
              className={`shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl w-24 text-center transition-all duration-200 border ${
                isNow
                  ? 'bg-white/25 border-amber-400/50 shadow-md ring-1 ring-amber-300/40'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Time */}
              <span
                className={`text-xs font-semibold ${
                  isNow ? 'text-amber-300 font-bold' : 'text-white/80'
                }`}
              >
                {item.displayTime}
              </span>

              {/* Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={item.isDay}
                  size={32}
                  className="mx-auto"
                />
              </div>

              {/* Temperature */}
              <span className="text-base font-bold text-white tracking-tight">
                {formatTemp(item.tempC, unit)}
              </span>

              {/* Precipitation Chance */}
              <div className="flex items-center gap-1 text-[11px] font-medium text-sky-300 mt-2">
                <Droplets size={11} className="shrink-0" />
                <span>{item.precipitationProbability}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive 24-Hour Charts: Line / Area Chart for Temperature, Precipitation, Wind */}
      <WeatherCharts hourly={hourly} unit={unit} />
    </div>
  );
};
