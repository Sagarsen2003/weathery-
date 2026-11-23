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
    <header className="w-full relative z-30 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / App Name */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md p-1 flex items-center justify-center shadow-md border border-white/30 shrink-0 overflow-hidden">
              <img src="./logo.png" alt="Weathery Logo" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 drop-shadow-sm">
                Weathery
              </span>
            </div>
          </div>

          {/* Mobile buttons: Unit toggle & Favorites */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Unit toggle */}
            <div className="bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/20 flex items-center text-xs font-semibold text-white">
              <button
                type="button"
                onClick={() => onToggleUnit('C')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  unit === 'C' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => onToggleUnit('F')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  unit === 'F' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'
                }`}
              >
                °F
              </button>
            </div>

            {/* Favorites drawer button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/25 transition-colors cursor-pointer"
              title="Saved Cities"
            >
              <Bookmark size={20} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Search input with Autocomplete & Recent History */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md lg:max-w-lg">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-white/70 pointer-events-none" />
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
              className="w-full pl-10 pr-24 py-2.5 rounded-full bg-black/25 hover:bg-black/30 focus:bg-black/40 text-white placeholder-white/60 text-sm backdrop-blur-xl border border-white/25 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
            />

            {/* Clear input or Loader */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {isLoadingSuggestions ? (
                <Loader2 size={16} className="text-white/70 animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="text-white/60 hover:text-white p-1"
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 text-white animate-fadeIn max-h-96 overflow-y-auto custom-scrollbar">
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

        {/* Desktop Controls: Unit toggle & Saved Cities Drawer Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Geolocation button with label */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Locate my position"
          >
            {isLocating ? (
              <Loader2 size={15} className="animate-spin text-amber-300" />
            ) : (
              <LocateFixed size={15} className="text-amber-300" />
            )}
            <span>Current Location</span>
          </button>

          {/* Unit Toggle */}
          <div className="bg-black/25 backdrop-blur-md p-1 rounded-full border border-white/25 flex items-center text-xs font-semibold text-white shadow-inner">
            <button
              type="button"
              onClick={() => onToggleUnit('C')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('F')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm"
          >
            <Bookmark size={15} className={favoritesCount > 0 ? 'text-amber-300 fill-amber-300' : ''} />
            <span>Saved Cities</span>
            {favoritesCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
