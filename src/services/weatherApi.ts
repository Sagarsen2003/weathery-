import type {
  GeoLocation,
  WeatherData,
  HourlyForecast,
  DailyForecast,
  WeatherAlert,
} from '../types/weather';
import {
  getWeatherCondition,
  getWindCompass,
  getUVDescription,
  getAQIDescription,
  calculateMoonPhase,
  formatHourlyTime,
} from '../utils/weatherUtils';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const REVERSE_GEO_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch location suggestions: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.error('Location search error:', err);
    return [];
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  try {
    const res = await fetch(
      `${REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: `current-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
        name,
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        latitude,
        longitude,
        isCurrentLocation: true,
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, falling back to coordinates:', err);
  }

  return {
    id: `current-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: 'Current Location',
    country: '',
    latitude,
    longitude,
    isCurrentLocation: true,
  };
}

export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;

  // 1. Fetch forecast & hourly & daily
  const forecastParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'visibility',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '10',
  });

  // 2. Fetch air quality
  const aqiParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'us_aqi,pm2_5,pm10',
    timezone: 'auto',
  });

  const [forecastRes, aqiRes] = await Promise.all([
    fetch(`${FORECAST_BASE_URL}?${forecastParams.toString()}`),
    fetch(`${AIR_QUALITY_BASE_URL}?${aqiParams.toString()}`).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Weather forecast request failed: ${forecastRes.statusText}`);
  }

  const forecastData = await forecastRes.json();
  let aqiValue = 42; // Fallback default
  if (aqiRes && aqiRes.ok) {
    try {
      const aqiData = await aqiRes.json();
      if (aqiData.current?.us_aqi !== undefined) {
        aqiValue = aqiData.current.us_aqi;
      }
    } catch (e) {
      console.warn('AQI parsing error:', e);
    }
  }

  const currentRaw = forecastData.current;
  const hourlyRaw = forecastData.hourly;
  const dailyRaw = forecastData.daily;

  // Process Current Weather
  const weatherCode = currentRaw.weather_code ?? 0;
  const isDay = Boolean(currentRaw.is_day ?? 1);
  const condition = getWeatherCondition(weatherCode, isDay);
  const uvCategory = getUVDescription(hourlyRaw.uv_index ? hourlyRaw.uv_index[0] ?? 0 : 0).text;
  const aqiCategory = getAQIDescription(aqiValue).text;
  const moon = calculateMoonPhase(new Date());

  const currentSunrise = dailyRaw.sunrise && dailyRaw.sunrise[0] ? dailyRaw.sunrise[0] : '';
  const currentSunset = dailyRaw.sunset && dailyRaw.sunset[0] ? dailyRaw.sunset[0] : '';
  const currentVisibilityMeters = hourlyRaw.visibility && hourlyRaw.visibility[0] ? hourlyRaw.visibility[0] : 10000;
  const currentUV = hourlyRaw.uv_index && hourlyRaw.uv_index[0] !== undefined ? hourlyRaw.uv_index[0] : 0;

  // Process Hourly Forecast (next 48 hours)
  const nowIndex = getNearestCurrentHourIndex(hourlyRaw.time);
  const hourlyList: HourlyForecast[] = [];
  const maxHourlyCount = Math.min(48, hourlyRaw.time.length - nowIndex);

  for (let i = 0; i < maxHourlyCount; i++) {
    const idx = nowIndex + i;
    const timeStr = hourlyRaw.time[idx];
    const isDaySlot = Boolean(hourlyRaw.is_day ? hourlyRaw.is_day[idx] : 1);
    const code = hourlyRaw.weather_code[idx] ?? 0;
    const cond = getWeatherCondition(code, isDaySlot);

    hourlyList.push({
      time: timeStr,
      displayTime: formatHourlyTime(timeStr, i),
      dateKey: timeStr.split('T')[0],
      tempC: hourlyRaw.temperature_2m[idx],
      feelsLikeC: hourlyRaw.apparent_temperature[idx],
      weatherCode: code,
      conditionText: cond.text,
      isDay: isDaySlot,
      precipitationProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[idx] ?? 0 : 0,
      precipitationAmount: hourlyRaw.precipitation ? hourlyRaw.precipitation[idx] ?? 0 : 0,
      windSpeed: hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[idx] ?? 0 : 0,
      humidity: hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[idx] ?? 0 : 0,
      uvIndex: hourlyRaw.uv_index ? hourlyRaw.uv_index[idx] ?? 0 : 0,
    });
  }

  // Process Daily Forecast (7 to 10 days)
  const dailyList: DailyForecast[] = [];
  const totalDays = dailyRaw.time ? dailyRaw.time.length : 0;

  for (let d = 0; d < totalDays; d++) {
    const dateStr = dailyRaw.time[d];
    const dObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = d === 0 ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayCode = dailyRaw.weather_code[d] ?? 0;
    const dayCond = getWeatherCondition(dayCode, true);

    // Filter hourly breakdown for this specific day
    const dayHourly = hourlyRaw.time
      .map((t: string, idx: number) => ({ t, idx }))
      .filter((item: any) => item.t.startsWith(dateStr))
      .map((item: any) => {
        const idx = item.idx;
        const isDaySlot = Boolean(hourlyRaw.is_day ? hourlyRaw.is_day[idx] : 1);
        const code = hourlyRaw.weather_code[idx] ?? 0;
        return {
          time: hourlyRaw.time[idx],
          displayTime: formatHourlyTime(hourlyRaw.time[idx], idx === 0 ? 0 : 1),
          dateKey: dateStr,
          tempC: hourlyRaw.temperature_2m[idx],
          feelsLikeC: hourlyRaw.apparent_temperature[idx],
          weatherCode: code,
          conditionText: getWeatherCondition(code, isDaySlot).text,
          isDay: isDaySlot,
          precipitationProbability: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[idx] ?? 0 : 0,
          precipitationAmount: hourlyRaw.precipitation ? hourlyRaw.precipitation[idx] ?? 0 : 0,
          windSpeed: hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[idx] ?? 0 : 0,
          humidity: hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[idx] ?? 0 : 0,
          uvIndex: hourlyRaw.uv_index ? hourlyRaw.uv_index[idx] ?? 0 : 0,
        };
      });

    dailyList.push({
      date: dateStr,
      dayName: dayOfWeek,
      fullDate,
      weatherCode: dayCode,
      conditionText: dayCond.text,
      maxTempC: dailyRaw.temperature_2m_max[d],
      minTempC: dailyRaw.temperature_2m_min[d],
      precipitationProbability: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[d] ?? 0 : 0,
      precipitationSum: dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[d] ?? 0 : 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[d] ?? 0 : 0,
      uvIndexMax: dailyRaw.uv_index_max ? dailyRaw.uv_index_max[d] ?? 0 : 0,
      sunrise: dailyRaw.sunrise ? dailyRaw.sunrise[d] : '',
      sunset: dailyRaw.sunset ? dailyRaw.sunset[d] : '',
      hourly: dayHourly,
    });
  }

  // Derive severe alerts if conditions warrant or check third-party alerts
  const alerts = evaluateSevereWeatherAlerts({
    weatherCode,
    tempC: currentRaw.temperature_2m,
    windSpeed: currentRaw.wind_speed_10m,
    aqi: aqiValue,
    uvIndex: currentUV,
    locationName: location.name,
  });

  return {
    location,
    current: {
      temperature: currentRaw.temperature_2m,
      feelsLike: currentRaw.apparent_temperature ?? currentRaw.temperature_2m,
      humidity: currentRaw.relative_humidity_2m ?? 50,
      windSpeed: currentRaw.wind_speed_10m ?? 0,
      windDirection: currentRaw.wind_direction_10m ?? 0,
      windDirectionCompass: getWindCompass(currentRaw.wind_direction_10m ?? 0),
      uvIndex: currentUV,
      uvCategory,
      pressure: currentRaw.surface_pressure ?? currentRaw.pressure_msl ?? 1013,
      visibility: currentVisibilityMeters / 1000,
      weatherCode,
      conditionText: condition.text,
      isDay,
      sunrise: currentSunrise,
      sunset: currentSunset,
      moonPhase: moon.phaseName,
      moonIllumination: moon.illumination,
      aqi: aqiValue,
      aqiCategory,
      dewPoint: Math.round(currentRaw.temperature_2m - ((100 - currentRaw.relative_humidity_2m) / 5)),
      cloudCover: currentRaw.cloud_cover ?? 0,
      lastUpdated: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    },
    hourly: hourlyList,
    daily: dailyList,
    alerts,
  };
}

function getNearestCurrentHourIndex(times: string[]): number {
  if (!times || times.length === 0) return 0;
  const now = new Date();
  let closestIdx = 0;
  let minDiff = Infinity;

  for (let i = 0; i < Math.min(24, times.length); i++) {
    const d = new Date(times[i]);
    const diff = Math.abs(d.getTime() - now.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }

  return closestIdx;
}

import { SEVERE_PROTOCOLS } from '../utils/severeWeatherProtocols';

function evaluateSevereWeatherAlerts(params: {
  weatherCode: number;
  tempC: number;
  windSpeed: number;
  aqi: number;
  uvIndex: number;
  locationName: string;
}): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const now = new Date();
  const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  const nowIso = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const expiresIso = expires.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Thunderstorm warnings
  if ([95, 96, 99].includes(params.weatherCode)) {
    const proto = SEVERE_PROTOCOLS.thunderstorm;
    alerts.push({
      id: 'alert-thunderstorm',
      category: 'thunderstorm',
      urgency: 'Immediate',
      event: 'Severe Thunderstorm & Lightning Warning',
      headline: `Severe Thunderstorm Warning in effect for ${params.locationName}`,
      severity: 'severe',
      description:
        'Dangerous lightning strikes, heavy downpours, and gusty winds observed. Hail is possible in localized areas. Take immediate shelter.',
      instruction:
        'Remain indoors away from windows until the storm passes. Unplug sensitive equipment and avoid contact with plumbing.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'National Meteorological Service',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  // 2. Extreme wind warning
  if (params.windSpeed > 45) {
    const proto = SEVERE_PROTOCOLS.wind;
    alerts.push({
      id: 'alert-wind',
      category: 'wind',
      urgency: 'Immediate',
      event: 'High Wind & Gale Warning',
      headline: `High Wind Advisory: Gusts up to ${Math.round(params.windSpeed * 1.35)} km/h`,
      severity: params.windSpeed > 60 ? 'extreme' : 'moderate',
      description:
        'Strong, damaging sustained winds expected. Downed tree limbs and power interruptions are probable.',
      instruction:
        'Stay indoors away from exterior windows. Secure outdoor furniture and avoid driving high-profile vehicles.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'Weather Warning Center',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  // 3. Extreme Heat Advisory
  if (params.tempC >= 38) {
    const proto = SEVERE_PROTOCOLS.heat;
    alerts.push({
      id: 'alert-heat',
      category: 'heat',
      urgency: 'Immediate',
      event: 'Excessive Heat & Heat Stroke Warning',
      headline: `Excessive Heat Emergency in effect for ${params.locationName}`,
      severity: 'extreme',
      description:
        'Dangerously high daytime temperatures approaching dangerous thresholds. Heat exhaustion or life-threatening heat stroke likely with prolonged exposure.',
      instruction:
        'Drink plenty of water and electrolytes, stay inside air-conditioned rooms, and do not leave children or pets in vehicles.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'Climate & Health Authority',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  // 4. Extreme Frost / Freeze
  if (params.tempC <= -12) {
    const proto = SEVERE_PROTOCOLS.freeze;
    alerts.push({
      id: 'alert-freeze',
      category: 'freeze',
      urgency: 'Immediate',
      event: 'Hard Freeze & Frostbite Warning',
      headline: `Sub-zero Arctic Freeze Warning in effect`,
      severity: 'severe',
      description:
        'Life-threatening sub-zero wind chills. Frostbite can occur within 15 minutes on exposed skin. Hypothermia risk is elevated.',
      instruction:
        'Wear multiple thermal layers, protect exposed plumbing from bursting, and bring household animals indoors immediately.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'National Weather Bureau',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  // 5. Severe AQI Warning
  if (params.aqi > 150) {
    const proto = SEVERE_PROTOCOLS.aqi;
    alerts.push({
      id: 'alert-aqi',
      category: 'aqi',
      urgency: 'Immediate',
      event: 'Hazardous Air Quality Emergency',
      headline: `Hazardous Air Quality Warning (AQI: ${params.aqi})`,
      severity: params.aqi > 200 ? 'extreme' : 'severe',
      description:
        'Serious air pollution emergency. High particulate concentrations (PM2.5) pose serious health hazards to entire population.',
      instruction:
        'Wear certified N95/FFP2 masks if going outdoors, seal doors and windows, and run HEPA air purifiers indoors.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'Environmental Protection Agency',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  // 6. Extreme UV Radiation Warning
  if (params.uvIndex >= 9) {
    const proto = SEVERE_PROTOCOLS.uv;
    alerts.push({
      id: 'alert-uv',
      category: 'uv',
      urgency: 'Expected',
      event: 'Extreme UV Radiation Advisory',
      headline: `Dangerous UV Radiation Alert (UV Index: ${params.uvIndex.toFixed(1)})`,
      severity: 'moderate',
      description:
        'Extreme ultraviolet radiation level. Unprotected skin can burn in minutes. High risk of solar eye damage.',
      instruction:
        'Seek shade between 10 AM and 4 PM, wear wide-brim hats, UV400 sunglasses, and apply broad-spectrum SPF 50+ sunscreen.',
      effectiveTime: nowIso,
      expiresTime: expiresIso,
      senderName: 'Solar Radiation Center',
      safetyActions: proto.safetyActions,
      checklist: proto.checklist,
    });
  }

  return alerts;
}
