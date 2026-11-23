export type TemperatureUnit = 'C' | 'F';

export interface GeoLocation {
  id?: number | string;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string; // state/province
  latitude: number;
  longitude: number;
  timezone?: string;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  temperature: number; // In Celsius base
  feelsLike: number;
  humidity: number; // %
  windSpeed: number; // km/h base
  windDirection: number; // degrees
  windDirectionCompass: string; // e.g. "NNE"
  uvIndex: number;
  uvCategory: string; // Low, Moderate, High, Very High, Extreme
  pressure: number; // hPa
  visibility: number; // km
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  moonIllumination: number; // 0 - 100%
  aqi: number; // US AQI scale
  aqiCategory: string;
  dewPoint: number;
  cloudCover: number;
  lastUpdated: string;
}

export interface HourlyForecast {
  time: string; // ISO string
  displayTime: string; // e.g. "10 AM", "Now"
  dateKey: string; // "YYYY-MM-DD"
  tempC: number;
  feelsLikeC: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  precipitationProbability: number; // %
  precipitationAmount: number; // mm
  windSpeed: number; // km/h
  humidity: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string; // "YYYY-MM-DD"
  dayName: string; // "Today", "Mon", "Tue"
  fullDate: string; // "Nov 23"
  weatherCode: number;
  conditionText: string;
  maxTempC: number;
  minTempC: number;
  precipitationProbability: number;
  precipitationSum: number; // mm
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
}

export type AlertCategory =
  | 'thunderstorm'
  | 'flood'
  | 'wind'
  | 'heat'
  | 'freeze'
  | 'aqi'
  | 'fog'
  | 'uv';

export interface AlertSafetyActions {
  immediateSteps: string[];
  travelAdvice: string[];
  healthPrecautions: string[];
  dos: string[];
  donts: string[];
  emergencyContacts: { label: string; number: string; description: string }[];
}

export interface AlertChecklistItem {
  id: string;
  label: string;
  detail?: string;
  completed?: boolean;
}

export interface WeatherAlert {
  id: string;
  headline: string;
  event: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  category: AlertCategory;
  urgency: 'Immediate' | 'Expected' | 'Advisory';
  description: string;
  instruction?: string;
  effectiveTime: string;
  expiresTime: string;
  senderName?: string;
  safetyActions: AlertSafetyActions;
  checklist: AlertChecklistItem[];
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
}

export interface SavedCity extends GeoLocation {
  id: string;
  savedAt: number;
  cachedTempC?: number;
  cachedWeatherCode?: number;
  cachedCondition?: string;
}
