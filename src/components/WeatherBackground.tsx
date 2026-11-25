import React from 'react';
import type { WeatherConditionInfo } from '../utils/weatherUtils';

interface WeatherBackgroundProps {
  condition: WeatherConditionInfo;
  isDay: boolean;
  weatherCode?: number;
  temperatureC?: number;
}

// Deterministic particle coordinates (module-level constants keep render 100% pure)
const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: `${((i * 37) % 68) + 4}%`,
  left: `${((i * 53 + 11) % 94) + 3}%`,
  size: i % 5 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5,
  duration: `${2.8 + (i % 5) * 0.9}s`,
  delay: `${(i % 7) * 0.45}s`,
}));

const RAINDROPS = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  left: `${((i * 29 + 5) % 104) - 2}%`,
  height: `${18 + (i % 4) * 10}px`,
  duration: `${0.68 + (i % 5) * 0.14}s`,
  delay: `${-((i * 0.27) % 2.2)}s`,
  opacity: 0.25 + (i % 4) * 0.14,
}));

const SNOWFLAKES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${((i * 31 + 7) % 96) + 2}%`,
  size: 4 + (i % 4) * 2.5,
  duration: `${6 + (i % 6) * 1.8}s`,
  delay: `${-((i * 0.85) % 7)}s`,
  blur: i % 3 === 0 ? 'blur-[1.5px]' : '',
  opacity: 0.45 + (i % 4) * 0.14,
}));

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  condition,
  isDay,
  weatherCode = 0,
  temperatureC = 20,
}) => {
  const theme = condition.theme;
  const isHotDay = isDay && temperatureC >= 33 && theme === 'clear-day';
  const isOvercast = weatherCode === 3;
  const isHeavyRain = [63, 65, 81, 82].includes(weatherCode);

  const getSkyGradient = () => {
    if (isHotDay) {
      return 'from-sky-500 via-blue-600 to-amber-700/90';
    }
    switch (theme) {
      case 'clear-day':
        return 'from-sky-400 via-blue-600 to-indigo-800';
      case 'clear-night':
        return 'from-slate-950 via-indigo-950 to-slate-900';
      case 'cloudy-day':
        return isOvercast
          ? 'from-slate-500 via-slate-600 to-slate-800'
          : 'from-sky-500 via-slate-500 to-blue-800';
      case 'cloudy-night':
        return 'from-slate-950 via-slate-900 to-zinc-950';
      case 'rain':
        return isHeavyRain
          ? 'from-slate-900 via-cyan-950 to-slate-950'
          : 'from-slate-800 via-cyan-900 to-slate-950';
      case 'thunderstorm':
        return 'from-zinc-950 via-purple-950 to-slate-950';
      case 'snow':
        return isDay
          ? 'from-sky-600 via-indigo-700 to-slate-800'
          : 'from-slate-900 via-indigo-950 to-slate-950';
      case 'fog':
        return isDay
          ? 'from-slate-500 via-zinc-600 to-slate-700'
          : 'from-slate-800 via-zinc-900 to-slate-950';
      default:
        return 'from-sky-500 via-blue-600 to-indigo-800';
    }
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* 1. Base Sky Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ease-in-out ${getSkyGradient()}`}
      />

      {/* 2. Liquid Luminous Mesh Orbs (enhance refractive depth behind Liquid Glass cards) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full blur-3xl animate-orb-float transition-colors duration-1000 ${
            theme === 'clear-day'
              ? isHotDay
                ? 'bg-amber-400/35'
                : 'bg-cyan-300/30'
              : theme === 'clear-night'
              ? 'bg-indigo-600/25'
              : theme === 'thunderstorm'
              ? 'bg-purple-600/30'
              : theme === 'rain'
              ? 'bg-cyan-500/20'
              : theme === 'snow'
              ? 'bg-sky-300/30'
              : 'bg-sky-200/20'
          }`}
        />
        <div
          className={`absolute bottom-[-8rem] right-[-6rem] w-[36rem] h-[36rem] rounded-full blur-3xl animate-orb-float transition-colors duration-1000 ${
            theme === 'clear-day'
              ? isHotDay
                ? 'bg-orange-500/30'
                : 'bg-indigo-500/35'
              : theme === 'clear-night'
              ? 'bg-sky-700/20'
              : theme === 'thunderstorm'
              ? 'bg-fuchsia-800/25'
              : theme === 'rain'
              ? 'bg-blue-600/25'
              : theme === 'snow'
              ? 'bg-indigo-400/25'
              : 'bg-slate-400/20'
          }`}
          style={{ animationDelay: '-6s' }}
        />
      </div>

      {/* 3. Clear / Partly Cloudy Day: Glowing Sun Disc & Volumetric Sunbeams */}
      {isDay && (theme === 'clear-day' || (theme === 'cloudy-day' && !isOvercast)) && (
        <div className="absolute -top-20 -right-16 w-[30rem] h-[30rem] flex items-center justify-center">
          {/* Rotating Sunbeams */}
          <div
            className="absolute inset-0 rounded-full opacity-35 animate-sun-spin"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(253, 224, 71, 0.35) 18deg, transparent 36deg, transparent 72deg, rgba(255, 255, 255, 0.25) 90deg, transparent 108deg, transparent 144deg, rgba(253, 224, 71, 0.3) 162deg, transparent 180deg, transparent 216deg, rgba(255, 255, 255, 0.25) 234deg, transparent 252deg, transparent 288deg, rgba(253, 224, 71, 0.35) 306deg, transparent 324deg)',
              maskImage: 'radial-gradient(circle, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 70%)',
            }}
          />
          {/* Solar Halo */}
          <div
            className={`w-56 h-56 rounded-full blur-2xl ${
              isHotDay ? 'bg-orange-300/55' : 'bg-amber-200/45'
            }`}
          />
          {/* Core Solar Orb */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-amber-400/80 shadow-[0_0_80px_rgba(253,224,71,0.65)] opacity-85" />
        </div>
      )}

      {/* 4. Night Sky: Lunar Glow & Twinkling Starfield */}
      {!isDay && (
        <>
          {(theme === 'clear-night' || theme === 'cloudy-night') && (
            <div className="absolute top-10 right-14 md:right-24 w-44 h-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-sky-200/15 blur-2xl" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 via-sky-100 to-indigo-200 shadow-[0_0_50px_rgba(186,230,253,0.45)] opacity-80" />
            </div>
          )}

          {theme === 'clear-night' && (
            <div className="absolute inset-0">
              {STARS.map((star) => (
                <span
                  key={star.id}
                  className="absolute rounded-full bg-white animate-twinkle"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    animationDuration: star.duration,
                    animationDelay: star.delay,
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 5. Volumetric Drifting Clouds (Cloudy / Rain / Thunderstorm) */}
      {(theme.includes('cloud') || theme === 'rain' || theme === 'thunderstorm') && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-10 left-[5%] w-[34rem] h-44 rounded-full blur-3xl animate-cloud-drift ${
              theme === 'thunderstorm'
                ? 'bg-purple-900/50'
                : isDay && theme === 'cloudy-day'
                ? 'bg-white/40'
                : 'bg-slate-400/25'
            }`}
          />
          <div
            className={`absolute top-20 right-[4%] w-[42rem] h-52 rounded-full blur-3xl animate-cloud-drift-slow ${
              theme === 'thunderstorm'
                ? 'bg-slate-950/60'
                : isDay && theme === 'cloudy-day'
                ? 'bg-white/30'
                : 'bg-slate-500/20'
            }`}
          />
          <div
            className={`absolute top-44 left-[28%] w-[30rem] h-36 rounded-full blur-3xl animate-cloud-drift ${
              theme === 'thunderstorm' ? 'bg-indigo-950/50' : 'bg-white/20'
            }`}
            style={{ animationDelay: '-12s' }}
          />
        </div>
      )}

      {/* 6. Animated Rain Streaks (Rain & Thunderstorm) */}
      {(theme === 'rain' || theme === 'thunderstorm') && (
        <div className="absolute inset-0 overflow-hidden">
          {RAINDROPS.slice(0, isHeavyRain || theme === 'thunderstorm' ? 38 : 22).map((drop) => (
            <span
              key={drop.id}
              className="absolute top-0 w-[1.5px] rounded-full bg-gradient-to-b from-transparent via-sky-200/75 to-white/90 animate-rain"
              style={{
                left: drop.left,
                height: drop.height,
                opacity: drop.opacity,
                animationDuration:
                  theme === 'thunderstorm' || isHeavyRain
                    ? drop.duration
                    : `${parseFloat(drop.duration) * 1.35}s`,
                animationDelay: drop.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* 7. Sheet Lightning Flashes (Thunderstorm) */}
      {theme === 'thunderstorm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-violet-200/55 via-indigo-300/20 to-transparent animate-lightning" />
      )}

      {/* 8. Gently Drifting Snowflakes (Snow) */}
      {theme === 'snow' && (
        <div className="absolute inset-0 overflow-hidden">
          {SNOWFLAKES.map((flake) => (
            <span
              key={flake.id}
              className={`absolute top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.65)] animate-snow ${flake.blur}`}
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: flake.opacity,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* 9. Rolling Fog Mist Bands (Fog) */}
      {theme === 'fog' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[12%] -left-16 right-[-4rem] h-48 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-3xl animate-fog" />
          <div
            className="absolute top-[46%] -left-16 right-[-4rem] h-56 bg-gradient-to-r from-transparent via-slate-200/25 to-transparent blur-3xl animate-fog"
            style={{ animationDelay: '-7s' }}
          />
          <div
            className="absolute bottom-[6%] -left-16 right-[-4rem] h-44 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-3xl animate-fog"
            style={{ animationDelay: '-13s' }}
          />
        </div>
      )}

      {/* 10. Subtle Edge Vignette for Liquid Glass Readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35" />
    </div>
  );
};
