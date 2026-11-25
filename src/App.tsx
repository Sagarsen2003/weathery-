import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type {
  GeoLocation,
  WeatherData,
  TemperatureUnit,
  SavedCity,
  WeatherAlert,
} from './types/weather';
import { fetchWeatherData, reverseGeocode } from './services/weatherApi';
import {
  getStoredUnit,
  saveStoredUnit,
  getSavedCities,
  toggleSaveCity,
  removeSavedCity,
  isCitySaved,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getLastLocation,
  setLastLocation,
  DEFAULT_CITIES,
} from './utils/storage';
import { getWeatherCondition } from './utils/weatherUtils';
import { playSevereAlertChime } from './utils/audioAlert';
import { WeatherBackground } from './components/WeatherBackground';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastTimeline } from './components/HourlyForecastTimeline';
import { WeeklyForecast } from './components/WeeklyForecast';
import { SevereAlertBanner } from './components/SevereAlertBanner';
import { EmergencyActionModal } from './components/EmergencyActionModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>(getStoredUnit);
  const [savedCities, setSavedCities] = useState<SavedCity[]>(getSavedCities);
  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>(getRecentSearches);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Severe Alert System: Action plan modal & audio chime tracker
  const [selectedActionAlert, setSelectedActionAlert] = useState<WeatherAlert | null>(null);
  const prevAlertsCountRef = useRef<number>(0);

  // Fetch weather data for a given location
  const loadWeather = useCallback(async (location: GeoLocation, showSkeleton: boolean = true) => {
    if (showSkeleton) {
      setIsLoading(true);
    }
    setErrorMessage(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
      setCurrentLocation(location);
      setLastLocation(location);
      setRecentSearches(addRecentSearch(location));
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setErrorMessage(
        err?.message || 'Unable to retrieve weather forecast for this location. Please check your network and try again.'
      );
    } finally {
      if (showSkeleton) {
        setIsLoading(false);
      }
    }
  }, []);

  // Use Browser Geolocation
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocode(latitude, longitude);
          await loadWeather(loc);
        } catch {
          setErrorMessage('Could not determine city name from your coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        let msg = 'Could not access your location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can search for your city in the search bar above.';
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [loadWeather]);

  // Initial startup: load last saved location or ask geolocation or use New York
  useEffect(() => {
    const lastLoc = getLastLocation();
    if (lastLoc) {
      loadWeather(lastLoc);
    } else {
      if (navigator.geolocation) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
            setIsLocating(false);
            loadWeather(loc);
          },
          () => {
            setIsLocating(false);
            loadWeather(DEFAULT_CITIES[0]);
          },
          { timeout: 5000 }
        );
      } else {
        loadWeather(DEFAULT_CITIES[0]);
      }
    }
  }, [loadWeather]);

  // Real-Time 60-Second Background Telemetry Polling Loop to check for weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLocation) {
        // Quiet background telemetry check
        loadWeather(currentLocation, false);
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [currentLocation, loadWeather]);

  // Unit switch
  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    saveStoredUnit(newUnit);
  };

  // Toggle saving current location
  const handleToggleSaveCurrent = () => {
    if (!currentLocation) return;
    const { updated } = toggleSaveCity(currentLocation);
    setSavedCities(updated);
  };

  const handleRemoveCity = (id: string) => {
    const updated = removeSavedCity(id);
    setSavedCities(updated);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const activeAlerts = useMemo(() => weatherData?.alerts || [], [weatherData?.alerts]);

  // When location changes to severe, play chime and dispatch browser notification
  useEffect(() => {
    if (activeAlerts.length > 0 && prevAlertsCountRef.current === 0) {
      playSevereAlertChime(0.18);

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification(`🚨 Severe Weather Alert: ${activeAlerts[0].event}`, {
              body: `${activeAlerts[0].headline}\nTap to view recommended safety actions.`,
              icon: './logo.png',
            });
          } catch {
            // Notification dispatch may be blocked by permissions
          }
        } else if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    }
    prevAlertsCountRef.current = activeAlerts.length;
  }, [activeAlerts]);

  // Derive condition info for background theme
  const conditionInfo = weatherData
    ? getWeatherCondition(weatherData.current.weatherCode, weatherData.current.isDay)
    : { text: 'Clear sky', theme: 'clear-day' as const, iconType: 'Sun' };

  const isCurrentSaved = isCitySaved(currentLocation, savedCities);

  return (
    <div className="relative min-h-screen text-white font-sans antialiased selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      {/* Dynamic Background with Weather Gradients & Atmospheric Effects */}
      <WeatherBackground
        condition={conditionInfo}
        isDay={weatherData ? weatherData.current.isDay : true}
      />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex-1">
        {/* Navigation & Header */}
        <Header
          currentLocation={currentLocation}
          onSelectLocation={loadWeather}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          favoritesCount={savedCities.length}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
        />

        {/* Real-time Severe Alert Banner (only shows when corresponding location actually has severe weather) */}
        <SevereAlertBanner
          alerts={activeAlerts}
          onOpenActionPlan={(alert) => setSelectedActionAlert(alert)}
        />

        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-100 backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-rose-400 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentLocation && loadWeather(currentLocation)}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Content Body: Skeleton vs Loaded Weather */}
        {isLoading && !weatherData ? (
          <WeatherSkeleton />
        ) : weatherData ? (
          <main className="space-y-6">
            {/* Current Weather Showcase Card */}
            <CurrentWeatherCard
              weather={weatherData}
              unit={unit}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSaveCurrent}
              savedCities={savedCities}
            />

            {/* Hourly Forecast Timeline & Interactive 24-hr Charts */}
            <HourlyForecastTimeline
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* 7-10 Days Weekly Outlook with detailed daily expansion */}
            <WeeklyForecast
              daily={weatherData.daily}
              unit={unit}
            />
          </main>
        ) : null}
      </div>

      {/* Emergency Action Plan Modal: "What Action To Take" */}
      <EmergencyActionModal
        alert={selectedActionAlert}
        isOpen={Boolean(selectedActionAlert)}
        onClose={() => setSelectedActionAlert(null)}
      />

      {/* Favorites Off-Canvas Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedCities={savedCities}
        currentLocation={currentLocation}
        onSelectCity={loadWeather}
        onRemoveCity={handleRemoveCity}
        onToggleSaveCurrent={handleToggleSaveCurrent}
        isCurrentSaved={isCurrentSaved}
        unit={unit}
      />

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-8 text-center text-xs text-white/50 border-t border-white/10 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center flex-wrap justify-center sm:justify-start gap-1 text-white/90 text-xs sm:text-sm">
            <span>© 2026 Weathery. All rights reserved. | Developed by</span>
            <a
              href="https://github.com/Sagarsen2003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white transition-colors font-semibold drop-shadow-sm ml-1 cursor-pointer underline underline-offset-2"
              title="Sagar Sengupta's GitHub Profile"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Sagar Sengupta</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <span>Data powered by Open-Meteo & BigDataCloud</span>
            <span>•</span>
            <button
              onClick={() => currentLocation && loadWeather(currentLocation)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
