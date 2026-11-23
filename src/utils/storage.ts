import type { GeoLocation, SavedCity, TemperatureUnit } from '../types/weather';

const STORAGE_KEYS = {
  RECENT_SEARCHES: 'google_weather_recent_searches',
  SAVED_CITIES: 'google_weather_saved_cities',
  TEMP_UNIT: 'google_weather_temp_unit',
  LAST_LOCATION: 'google_weather_last_location',
};

// Default preset cities for quick start
export const DEFAULT_CITIES: GeoLocation[] = [
  {
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
  },
  {
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
  },
];

export function getStoredUnit(): TemperatureUnit {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TEMP_UNIT);
    return val === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

export function saveStoredUnit(unit: TemperatureUnit): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMP_UNIT, unit);
  } catch (e) {
    console.error('Failed to save temp unit:', e);
  }
}

export function getRecentSearches(): GeoLocation[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (!val) return [];
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function addRecentSearch(location: GeoLocation): GeoLocation[] {
  try {
    const current = getRecentSearches();
    const filtered = current.filter(
      (item) =>
        !(Math.abs(item.latitude - location.latitude) < 0.01 &&
          Math.abs(item.longitude - location.longitude) < 0.01)
    );
    const updated = [location, ...filtered].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
    return updated;
  } catch {
    return [location];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  } catch (e) {
    console.error(e);
  }
}

export function getSavedCities(): SavedCity[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
    if (!val) {
      // Initialize with friendly defaults
      const defaults: SavedCity[] = [
        {
          ...DEFAULT_CITIES[0],
          id: 'city-new-york',
          savedAt: Date.now(),
        },
        {
          ...DEFAULT_CITIES[1],
          id: 'city-london',
          savedAt: Date.now() - 1000,
        },
        {
          ...DEFAULT_CITIES[2],
          id: 'city-tokyo',
          savedAt: Date.now() - 2000,
        },
      ];
      localStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(val);
  } catch {
    return [];
  }
}

export function toggleSaveCity(location: GeoLocation): { isSaved: boolean; updated: SavedCity[] } {
  try {
    const current = getSavedCities();
    const existingIndex = current.findIndex(
      (c) =>
        Math.abs(c.latitude - location.latitude) < 0.01 &&
        Math.abs(c.longitude - location.longitude) < 0.01
    );

    let updated: SavedCity[];
    let isSaved: boolean;

    if (existingIndex >= 0) {
      // Remove
      updated = current.filter((_, idx) => idx !== existingIndex);
      isSaved = false;
    } else {
      // Add
      const newCity: SavedCity = {
        ...location,
        id: `city-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        savedAt: Date.now(),
      };
      updated = [newCity, ...current];
      isSaved = true;
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(updated));
    return { isSaved, updated };
  } catch (e) {
    console.error('Error toggling saved city:', e);
    return { isSaved: false, updated: [] };
  }
}

export function removeSavedCity(id: string): SavedCity[] {
  try {
    const current = getSavedCities();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function isCitySaved(location: GeoLocation | null, savedList: SavedCity[]): boolean {
  if (!location) return false;
  return savedList.some(
    (c) =>
      Math.abs(c.latitude - location.latitude) < 0.01 &&
      Math.abs(c.longitude - location.longitude) < 0.01
  );
}

export function getLastLocation(): GeoLocation | null {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function setLastLocation(loc: GeoLocation): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(loc));
  } catch (e) {
    console.error(e);
  }
}
