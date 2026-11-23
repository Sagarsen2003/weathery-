import type { TemperatureUnit } from '../types/weather';

export interface WeatherConditionInfo {
  text: string;
  theme: 'clear-day' | 'clear-night' | 'cloudy-day' | 'cloudy-night' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  iconType: string;
}

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        text: 'Clear sky',
        theme: isDay ? 'clear-day' : 'clear-night',
        iconType: isDay ? 'Sun' : 'Moon',
      };
    case 1:
      return {
        text: 'Mainly clear',
        theme: isDay ? 'clear-day' : 'clear-night',
        iconType: isDay ? 'SunMedium' : 'Moon',
      };
    case 2:
      return {
        text: 'Partly cloudy',
        theme: isDay ? 'cloudy-day' : 'cloudy-night',
        iconType: isDay ? 'CloudSun' : 'CloudMoon',
      };
    case 3:
      return {
        text: 'Overcast',
        theme: isDay ? 'cloudy-day' : 'cloudy-night',
        iconType: 'Cloudy',
      };
    case 45:
    case 48:
      return {
        text: code === 45 ? 'Foggy' : 'Depositing rime fog',
        theme: 'fog',
        iconType: 'Fog',
      };
    case 51:
      return {
        text: 'Light drizzle',
        theme: 'rain',
        iconType: 'CloudDrizzle',
      };
    case 53:
      return {
        text: 'Moderate drizzle',
        theme: 'rain',
        iconType: 'CloudDrizzle',
      };
    case 55:
      return {
        text: 'Dense drizzle',
        theme: 'rain',
        iconType: 'CloudRain',
      };
    case 56:
    case 57:
      return {
        text: 'Freezing drizzle',
        theme: 'rain',
        iconType: 'CloudHail',
      };
    case 61:
      return {
        text: 'Slight rain',
        theme: 'rain',
        iconType: 'CloudRain',
      };
    case 63:
      return {
        text: 'Moderate rain',
        theme: 'rain',
        iconType: 'CloudRain',
      };
    case 65:
      return {
        text: 'Heavy rain',
        theme: 'rain',
        iconType: 'CloudRainWind',
      };
    case 66:
    case 67:
      return {
        text: 'Freezing rain',
        theme: 'rain',
        iconType: 'CloudHail',
      };
    case 71:
      return {
        text: 'Slight snow',
        theme: 'snow',
        iconType: 'CloudSnow',
      };
    case 73:
      return {
        text: 'Moderate snow',
        theme: 'snow',
        iconType: 'CloudSnow',
      };
    case 75:
      return {
        text: 'Heavy snow',
        theme: 'snow',
        iconType: 'Snowflake',
      };
    case 77:
      return {
        text: 'Snow grains',
        theme: 'snow',
        iconType: 'Snowflake',
      };
    case 80:
      return {
        text: 'Slight rain showers',
        theme: 'rain',
        iconType: 'CloudDrizzle',
      };
    case 81:
      return {
        text: 'Moderate rain showers',
        theme: 'rain',
        iconType: 'CloudRain',
      };
    case 82:
      return {
        text: 'Violent rain showers',
        theme: 'rain',
        iconType: 'CloudRainWind',
      };
    case 85:
    case 86:
      return {
        text: 'Snow showers',
        theme: 'snow',
        iconType: 'CloudSnow',
      };
    case 95:
      return {
        text: 'Thunderstorm',
        theme: 'thunderstorm',
        iconType: 'CloudLightning',
      };
    case 96:
    case 99:
      return {
        text: 'Thunderstorm with hail',
        theme: 'thunderstorm',
        iconType: 'CloudLightning',
      };
    default:
      return {
        text: 'Partly cloudy',
        theme: isDay ? 'cloudy-day' : 'cloudy-night',
        iconType: isDay ? 'CloudSun' : 'CloudMoon',
      };
  }
}

// Temperature conversions
export function cToF(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(tempC: number, unit: TemperatureUnit): string {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return '--°';
  const val = unit === 'C' ? tempC : cToF(tempC);
  return `${Math.round(val)}°`;
}

export function formatSpeed(speedKmh: number, unit: TemperatureUnit): string {
  if (unit === 'C') {
    return `${Math.round(speedKmh)} km/h`;
  }
  const mph = speedKmh * 0.621371;
  return `${Math.round(mph)} mph`;
}

export function formatDistance(km: number, unit: TemperatureUnit): string {
  if (unit === 'C') {
    return `${km < 1 ? (km * 1000).toFixed(0) + ' m' : km.toFixed(1) + ' km'}`;
  }
  const miles = km * 0.621371;
  return `${miles.toFixed(1)} mi`;
}

export function formatPressure(hPa: number, unit: TemperatureUnit): string {
  if (unit === 'C') {
    return `${Math.round(hPa)} hPa`;
  }
  const inHg = hPa * 0.02953;
  return `${inHg.toFixed(2)} inHg`;
}

export function getWindCompass(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}

export function getUVDescription(uv: number): { text: string; color: string } {
  if (uv <= 2) return { text: 'Low', color: 'text-emerald-400' };
  if (uv <= 5) return { text: 'Moderate', color: 'text-yellow-400' };
  if (uv <= 7) return { text: 'High', color: 'text-orange-400' };
  if (uv <= 10) return { text: 'Very High', color: 'text-red-400' };
  return { text: 'Extreme', color: 'text-purple-400' };
}

export function getAQIDescription(aqi: number): { text: string; color: string; badgeBg: string } {
  if (aqi <= 50) {
    return { text: 'Good', color: 'text-emerald-300', badgeBg: 'bg-emerald-500/20 text-emerald-300' };
  }
  if (aqi <= 100) {
    return { text: 'Moderate', color: 'text-yellow-300', badgeBg: 'bg-yellow-500/20 text-yellow-300' };
  }
  if (aqi <= 150) {
    return { text: 'Unhealthy for Sensitive', color: 'text-orange-300', badgeBg: 'bg-orange-500/20 text-orange-300' };
  }
  if (aqi <= 200) {
    return { text: 'Unhealthy', color: 'text-red-400', badgeBg: 'bg-red-500/20 text-red-300' };
  }
  if (aqi <= 300) {
    return { text: 'Very Unhealthy', color: 'text-purple-300', badgeBg: 'bg-purple-500/20 text-purple-300' };
  }
  return { text: 'Hazardous', color: 'text-rose-400', badgeBg: 'bg-rose-600/20 text-rose-300' };
}

// Astronomical moon phase calculation
export function calculateMoonPhase(date: Date = new Date()): { phaseName: string; illumination: number; icon: string } {
  // Known reference new moon: January 11, 2024 at 11:57 UTC
  const refDate = new Date('2024-01-11T11:57:00Z').getTime();
  const synodicMonth = 29.53058867 * 86400 * 1000; // milliseconds
  const diff = date.getTime() - refDate;
  const phaseFraction = ((diff % synodicMonth) + synodicMonth) % synodicMonth / synodicMonth;

  // Illumination calculation (approximate 0 to 100%)
  const illumination = Math.round((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2 * 100);

  if (phaseFraction < 0.03 || phaseFraction >= 0.97) {
    return { phaseName: 'New Moon', illumination, icon: 'Circle' };
  } else if (phaseFraction < 0.22) {
    return { phaseName: 'Waxing Crescent', illumination, icon: 'Moon' };
  } else if (phaseFraction < 0.28) {
    return { phaseName: 'First Quarter', illumination, icon: 'CircleHalf' };
  } else if (phaseFraction < 0.47) {
    return { phaseName: 'Waxing Gibbous', illumination, icon: 'Moon' };
  } else if (phaseFraction < 0.53) {
    return { phaseName: 'Full Moon', illumination, icon: 'CircleDot' };
  } else if (phaseFraction < 0.72) {
    return { phaseName: 'Waning Gibbous', illumination, icon: 'Moon' };
  } else if (phaseFraction < 0.78) {
    return { phaseName: 'Last Quarter', illumination, icon: 'CircleHalf' };
  } else {
    return { phaseName: 'Waning Crescent', illumination, icon: 'Moon' };
  }
}

export function formatTimeDisplay(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatHourlyTime(isoString: string, index: number): string {
  if (index === 0) return 'Now';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return isoString;
  }
}

export function getThemeClasses(theme: string): {
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  skyIllustration: string;
} {
  switch (theme) {
    case 'clear-day':
      return {
        bgGradient: 'from-sky-400 via-sky-500 to-blue-600',
        cardBg: 'bg-white/15 dark:bg-black/20 backdrop-blur-xl border border-white/20',
        accentColor: 'text-amber-300',
        skyIllustration: 'sunny',
      };
    case 'clear-night':
      return {
        bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
        cardBg: 'bg-white/10 backdrop-blur-xl border border-white/10',
        accentColor: 'text-sky-300',
        skyIllustration: 'stars',
      };
    case 'cloudy-day':
      return {
        bgGradient: 'from-slate-400 via-sky-600 to-blue-700',
        cardBg: 'bg-white/20 backdrop-blur-xl border border-white/20',
        accentColor: 'text-sky-200',
        skyIllustration: 'clouds-day',
      };
    case 'cloudy-night':
      return {
        bgGradient: 'from-gray-900 via-slate-900 to-zinc-950',
        cardBg: 'bg-white/10 backdrop-blur-xl border border-white/10',
        accentColor: 'text-slate-300',
        skyIllustration: 'clouds-night',
      };
    case 'rain':
      return {
        bgGradient: 'from-blue-900 via-cyan-950 to-slate-900',
        cardBg: 'bg-white/10 backdrop-blur-xl border border-white/15',
        accentColor: 'text-cyan-300',
        skyIllustration: 'rain',
      };
    case 'thunderstorm':
      return {
        bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
        cardBg: 'bg-white/10 backdrop-blur-xl border border-purple-500/20',
        accentColor: 'text-yellow-300',
        skyIllustration: 'thunderstorm',
      };
    case 'snow':
      return {
        bgGradient: 'from-sky-300 via-indigo-400 to-blue-500',
        cardBg: 'bg-white/25 backdrop-blur-xl border border-white/30',
        accentColor: 'text-cyan-100',
        skyIllustration: 'snow',
      };
    case 'fog':
      return {
        bgGradient: 'from-slate-500 via-stone-500 to-zinc-600',
        cardBg: 'bg-white/20 backdrop-blur-xl border border-white/20',
        accentColor: 'text-zinc-200',
        skyIllustration: 'fog',
      };
    default:
      return {
        bgGradient: 'from-sky-500 via-blue-600 to-indigo-700',
        cardBg: 'bg-white/15 backdrop-blur-xl border border-white/20',
        accentColor: 'text-amber-300',
        skyIllustration: 'sunny',
      };
  }
}
