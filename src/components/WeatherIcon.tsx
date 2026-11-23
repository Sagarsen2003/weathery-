import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloudy,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  Snowflake,
  Wind,
  Eye,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = '',
  size = 32,
}) => {
  // Clear sky
  if (code === 0) {
    return isDay ? (
      <Sun size={size} className={`text-amber-400 drop-shadow-md animate-pulse ${className}`} />
    ) : (
      <Moon size={size} className={`text-sky-200 drop-shadow-md ${className}`} />
    );
  }

  // Mainly clear
  if (code === 1) {
    return isDay ? (
      <Sun size={size} className={`text-amber-400 drop-shadow-md ${className}`} />
    ) : (
      <Moon size={size} className={`text-sky-200 drop-shadow-md ${className}`} />
    );
  }

  // Partly cloudy
  if (code === 2) {
    return isDay ? (
      <CloudSun size={size} className={`text-amber-300 drop-shadow-sm ${className}`} />
    ) : (
      <CloudMoon size={size} className={`text-indigo-200 drop-shadow-sm ${className}`} />
    );
  }

  // Overcast
  if (code === 3) {
    return <Cloudy size={size} className={`text-slate-300 drop-shadow-sm ${className}`} />;
  }

  // Fog
  if (code === 45 || code === 48) {
    return <Wind size={size} className={`text-zinc-300 drop-shadow-sm ${className}`} />;
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle size={size} className={`text-cyan-300 drop-shadow-sm ${className}`} />;
  }

  // Rain
  if (code >= 61 && code <= 67) {
    return <CloudRain size={size} className={`text-blue-300 drop-shadow-sm ${className}`} />;
  }

  // Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return <CloudSnow size={size} className={`text-sky-100 drop-shadow-sm ${className}`} />;
  }

  // Showers
  if (code >= 80 && code <= 82) {
    return <CloudRain size={size} className={`text-sky-300 drop-shadow-sm ${className}`} />;
  }

  // Thunderstorm
  if (code >= 95) {
    return <CloudLightning size={size} className={`text-yellow-300 drop-shadow-md ${className}`} />;
  }

  // Fallback
  return isDay ? (
    <Sun size={size} className={`text-amber-400 ${className}`} />
  ) : (
    <Moon size={size} className={`text-sky-200 ${className}`} />
  );
};

export {
  Sun,
  Moon,
  Wind,
  Eye,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  AlertTriangle,
  Compass,
  Snowflake,
};
