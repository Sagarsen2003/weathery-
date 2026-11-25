import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-[2rem] liquid-glass p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-8 bg-white/20 rounded-xl w-48" />
            <div className="h-4 bg-white/15 rounded-lg w-32" />
          </div>
          <div className="h-9 bg-white/20 rounded-full w-28" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-14 bg-white/20 rounded-2xl w-36" />
              <div className="h-5 bg-white/15 rounded-lg w-28" />
            </div>
          </div>
          <div className="h-28 bg-white/10 rounded-2xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="rounded-[2rem] liquid-glass p-6">
        <div className="h-6 bg-white/20 rounded-lg w-36 mb-4" />
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-24 h-28 bg-white/10 rounded-2xl shrink-0" />
          ))}
        </div>
        <div className="h-48 bg-white/10 rounded-2xl mt-5" />
      </div>

      {/* Weekly Outlook Skeleton */}
      <div className="rounded-[2rem] liquid-glass p-6 space-y-2.5">
        <div className="h-6 bg-white/20 rounded-lg w-36 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-white/10 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
