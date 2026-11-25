import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  LocateFixed,
  Bookmark,
  Clock,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import type { GeoLocation, TemperatureUnit } from '../types/weather';
import { searchLocations } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: GeoLocation | null;
  onSelectLocation: (location: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  recentSearches: GeoLocation[];
  onClearRecent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  isLocating,
  unit,
  onToggleUnit,
  onOpenFavorites,
  favoritesCount,
  recentSearches,
  onClearRecent,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full relative z-30 mb-4 sm:mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap lg:gap-4">
        {/* Logo / App Name */}
        <div className="order-1 flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl liquid-glass-pill p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="./logo.png" alt="Weathery Logo" className="w-full h-full object-contain drop-shadow" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1 drop-shadow-sm">
              Weathery
            </span>
          </div>
        </div>

        {/* Controls: compact on mobile (<640px), full pills on sm+ */}
        <div className="order-2 lg:order-3 flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Geolocation button with label (tablet & desktop) */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full liquid-glass-pill text-white text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer disabled:opacity-50"
            title="Locate my position"
          >
            {isLocating ? (
              <Loader2 size={15} className="animate-spin text-amber-300" />
            ) : (
              <LocateFixed size={15} className="text-amber-300" />
            )}
            <span>Current Location</span>
          </button>

          {/* Unit Toggle (all screens) */}
          <div className="liquid-glass-pill p-1 rounded-full flex items-center text-xs font-semibold text-white shrink-0">
            <button
              type="button"
              onClick={() => onToggleUnit('C')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-white text-slate-950 shadow-[0_2px_10px_rgba(255,255,255,0.45)] font-bold'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('F')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-white text-slate-950 shadow-[0_2px_10px_rgba(255,255,255,0.45)] font-bold'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Mobile compact Favorites button (<640px) */}
          <button
            onClick={onOpenFavorites}
            aria-label="Open saved cities"
            className="sm:hidden relative p-2.5 rounded-full liquid-glass-pill text-white transition-all cursor-pointer shrink-0"
            title="Saved Cities"
          >
            <Bookmark size={17} className={favoritesCount > 0 ? 'text-amber-300 fill-amber-300' : ''} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Tablet/Desktop Favorites pill button (sm+) */}
          <button
            onClick={onOpenFavorites}
            className="hidden sm:flex relative items-center gap-2 px-3.5 py-2 rounded-full liquid-glass-pill text-white text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            <Bookmark size={15} className={favoritesCount > 0 ? 'text-amber-300 fill-amber-300' : ''} />
            <span>Saved Cities</span>
            {favoritesCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full ml-0.5 shadow-sm">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* Search input with Autocomplete & Recent History (Row 2 on <1024px, Center on lg+) */}
        <div ref={searchContainerRef} className="order-3 lg:order-2 relative w-full lg:flex-1 lg:max-w-md xl:max-w-lg">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 sm:left-4 text-white/75 pointer-events-none z-10" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder={
                currentLocation
                  ? `Search city (current: ${currentLocation.name})...`
                  : 'Search city, state, or country...'
              }
              className="w-full pl-10 sm:pl-11 pr-20 sm:pr-24 py-2.5 rounded-full liquid-glass-input text-white placeholder-white/65 text-sm focus:outline-none transition-all"
            />

            {/* Clear input or Loader */}
            <div className="absolute right-3 flex items-center gap-1.5 z-10">
              {isLoadingSuggestions ? (
                <Loader2 size={16} className="text-white/75 animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  aria-label="Clear search"
                  className="text-white/65 hover:text-white p-1 cursor-pointer"
                >
                  <X size={15} />
                </button>
              ) : null}

              {/* Geolocation Button inside search bar */}
              <button
                type="button"
                onClick={onUseCurrentLocation}
                disabled={isLocating}
                title="Use Current Location"
                aria-label="Use current location"
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLocating ? (
                  <Loader2 size={16} className="animate-spin text-amber-300" />
                ) : (
                  <LocateFixed size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Autocomplete & Recent Searches Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2.5 liquid-glass-panel rounded-3xl overflow-hidden z-50 text-white animate-fadeIn max-h-96 overflow-y-auto custom-scrollbar">
              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                    Locations
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={`${item.latitude}-${item.longitude}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <MapPin size={16} className="text-white/50 group-hover:text-amber-300 transition-colors shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-sm text-white block truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-white/60 block truncate">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results notice */}
              {!isLoadingSuggestions && query.trim().length >= 2 && suggestions.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-white/60">
                  No locations found for &quot;{query}&quot;. Try another search term.
                </div>
              )}

              {/* Recent Search History */}
              {recentSearches.length > 0 && !query && (
                <div className="py-2">
                  <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearRecent();
                      }}
                      className="text-[11px] lowercase text-white/40 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={11} />
                      clear
                    </button>
                  </div>
                  {recentSearches.map((item, idx) => (
                    <button
                      key={`recent-${item.latitude}-${item.longitude}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Clock size={15} className="text-white/40 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-medium text-sm text-white/90 block truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-white/50 block truncate">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
