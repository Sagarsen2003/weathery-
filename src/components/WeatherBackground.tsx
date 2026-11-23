import React from 'react';
import type { WeatherConditionInfo } from '../utils/weatherUtils';

interface WeatherBackgroundProps {
  condition: WeatherConditionInfo;
  isDay: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, isDay }) => {
  const theme = condition.theme;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-1000 ease-in-out">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          theme === 'clear-day'
            ? 'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600'
            : theme === 'clear-night'
            ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900'
            : theme === 'cloudy-day'
            ? 'bg-gradient-to-b from-slate-400 via-sky-600 to-blue-700'
            : theme === 'cloudy-night'
            ? 'bg-gradient-to-b from-slate-900 via-zinc-900 to-black'
            : theme === 'rain'
            ? 'bg-gradient-to-b from-slate-800 via-cyan-950 to-slate-900'
            : theme === 'thunderstorm'
            ? 'bg-gradient-to-b from-zinc-950 via-purple-950 to-slate-950'
            : theme === 'snow'
            ? 'bg-gradient-to-b from-sky-300 via-indigo-300 to-blue-400'
            : 'bg-gradient-to-b from-stone-500 via-slate-600 to-zinc-700'
        }`}
      />

      {/* Atmospheric Sun Glow (Day) */}
      {isDay && theme.includes('clear') && (
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-300/25 blur-3xl animate-pulse" />
      )}

      {/* Atmospheric Moon Glow & Stars (Night) */}
      {!isDay && (
        <>
          <div className="absolute top-12 right-20 w-48 h-48 rounded-full bg-blue-300/15 blur-2xl" />
          {/* Subtle Twinkling Stars */}
          <div className="absolute inset-0 opacity-40">
            <span className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-ping" />
            <span className="absolute top-[18%] left-[75%] w-1.5 h-1.5 bg-white rounded-full opacity-70" />
            <span className="absolute top-[35%] left-[45%] w-1 h-1 bg-sky-200 rounded-full opacity-60" />
            <span className="absolute top-[25%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse" />
            <span className="absolute top-[50%] left-[12%] w-1.5 h-1.5 bg-white rounded-full opacity-50" />
            <span className="absolute top-[65%] left-[60%] w-1 h-1 bg-sky-100 rounded-full opacity-75" />
          </div>
        </>
      )}

      {/* Subtle floating cloud layers */}
      {(theme.includes('cloud') || theme === 'rain') && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 -left-20 w-80 h-32 bg-white/40 rounded-full blur-2xl transform translate-x-10 animate-pulse" />
          <div className="absolute top-44 -right-10 w-96 h-36 bg-white/30 rounded-full blur-3xl transform -translate-x-10" />
        </div>
      )}

      {/* Rainy Mist effect */}
      {theme === 'rain' && (
        <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-[0.5px]" />
      )}

      {/* Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/25 pointer-events-none" />
    </div>
  );
};
