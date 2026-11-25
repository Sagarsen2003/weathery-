import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Trash2,
  BookmarkPlus,
  BookmarkCheck,
  Globe,
} from 'lucide-react';
import type { GeoLocation, SavedCity, TemperatureUnit } from '../types/weather';
import { DEFAULT_CITIES } from '../utils/storage';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCities: SavedCity[];
  currentLocation: GeoLocation | null;
  onSelectCity: (city: GeoLocation) => void;
  onRemoveCity: (id: string) => void;
  onToggleSaveCurrent: () => void;
  isCurrentSaved: boolean;
  unit: TemperatureUnit;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedCities,
  currentLocation,
  onSelectCity,
  onRemoveCity,
  onToggleSaveCurrent,
  isCurrentSaved,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md liquid-glass-panel border-l border-white/25 text-white flex flex-col animate-slideLeft">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Favorite Locations</h3>
                <p className="text-xs text-white/60">
                  {savedCities.length} {savedCities.length === 1 ? 'city' : 'cities'} pinned
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close favorites drawer"
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Action: Pin Current City */}
          {currentLocation && (
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block">
                  Active View
                </span>
                <span className="font-semibold text-sm text-white truncate block">
                  {currentLocation.name}
                  {currentLocation.admin1 ? `, ${currentLocation.admin1}` : ''}
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleSaveCurrent}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isCurrentSaved
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                }`}
              >
                {isCurrentSaved ? (
                  <>
                    <BookmarkCheck size={14} />
                    <span>Pinned</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={14} />
                    <span>Pin City</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Saved Cities List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
            {savedCities.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MapPin size={36} className="mx-auto text-white/30 mb-3" />
                <p className="text-sm font-medium text-white/80">No saved cities yet</p>
                <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
                  Click the bookmark icon or select one of the suggested world capitals below to pin your favorite places.
                </p>
              </div>
            ) : (
              savedCities.map((city) => {
                const isSelected =
                  currentLocation &&
                  Math.abs(currentLocation.latitude - city.latitude) < 0.01 &&
                  Math.abs(currentLocation.longitude - city.longitude) < 0.01;

                return (
                  <div
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'liquid-glass-active ring-1 ring-amber-400/50'
                        : 'liquid-glass-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white truncate">
                            {city.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/30 text-amber-300 px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/60 block truncate">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCity(city.id);
                        }}
                        className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-white/10 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Suggestions / Preset Cities */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
                Suggested World Cities
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_CITIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      onSelectCity(c);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl liquid-glass-subtle text-left transition-all cursor-pointer text-xs"
                  >
                    <span className="font-medium text-white block truncate">{c.name}</span>
                    <span className="text-[11px] text-white/50 block truncate">{c.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
