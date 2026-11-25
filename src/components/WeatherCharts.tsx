import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyForecast, TemperatureUnit } from '../types/weather';
import { cToF } from '../utils/weatherUtils';
import { Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherChartsProps {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
}

type ChartMetric = 'temperature' | 'precipitation' | 'wind';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metric: ChartMetric;
  unit: TemperatureUnit;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, metric, unit }) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl text-white text-xs min-w-[130px]">
        <span className="font-semibold text-white/80 block pb-1 border-b border-white/10">
          {label}
        </span>
        <div className="pt-1.5 space-y-1">
          {metric === 'temperature' && (
            <>
              <p className="flex items-center justify-between gap-2">
                <span className="text-amber-300 font-medium">Temp:</span>
                <span className="font-bold">{p.temp}°{unit}</span>
              </p>
              <p className="flex items-center justify-between gap-2 text-white/60">
                <span>Feels like:</span>
                <span>{p.feelsLike}°{unit}</span>
              </p>
            </>
          )}
          {metric === 'precipitation' && (
            <>
              <p className="flex items-center justify-between gap-2">
                <span className="text-sky-300 font-medium">Rain Chance:</span>
                <span className="font-bold">{p.pop}%</span>
              </p>
              {p.rainMm > 0 && (
                <p className="flex items-center justify-between gap-2 text-white/60">
                  <span>Rain amount:</span>
                  <span>{p.rainMm} mm</span>
                </p>
              )}
            </>
          )}
          {metric === 'wind' && (
            <p className="flex items-center justify-between gap-2">
              <span className="text-indigo-300 font-medium">Wind:</span>
              <span className="font-bold">{p.wind} {unit === 'C' ? 'km/h' : 'mph'}</span>
            </p>
          )}
          <p className="text-[10px] text-white/50 pt-0.5">{p.condition}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourly, unit }) => {
  const [metric, setMetric] = useState<ChartMetric>('temperature');

  // Next 24 hours for chart
  const data = hourly.slice(0, 24).map((h) => ({
    time: h.displayTime,
    temp: unit === 'C' ? Math.round(h.tempC) : Math.round(cToF(h.tempC)),
    feelsLike: unit === 'C' ? Math.round(h.feelsLikeC) : Math.round(cToF(h.feelsLikeC)),
    pop: h.precipitationProbability,
    rainMm: h.precipitationAmount,
    wind: unit === 'C' ? Math.round(h.windSpeed) : Math.round(h.windSpeed * 0.621371),
    condition: h.conditionText,
  }));

  const renderTooltip = (props: any) => <CustomTooltip {...props} metric={metric} unit={unit} />;

  return (
    <div className="mt-5 pt-4 border-t border-white/10">
      {/* Metric selection tabs */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
          24-Hour Trend Visualizer
        </span>

        <div className="bg-black/25 backdrop-blur-md p-1 rounded-xl border border-white/15 flex items-center gap-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMetric('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'temperature'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Thermometer size={13} />
            <span>Temperature</span>
          </button>

          <button
            type="button"
            onClick={() => setMetric('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'precipitation'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Droplets size={13} />
            <span>Precipitation</span>
          </button>

          <button
            type="button"
            onClick={() => setMetric('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === 'wind'
                ? 'bg-indigo-400 text-slate-950 font-bold shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Wind size={13} />
            <span>Wind</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 md:h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'temperature' ? (
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                dataKey="temp"
                stroke="#ffffff40"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                unit={`°`}
                width={36}
              />
              <Tooltip content={renderTooltip} />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#fbbf24"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : metric === 'precipitation' ? (
            <BarChart data={data} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                dataKey="pop"
                stroke="#ffffff40"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
                width={36}
              />
              <Tooltip content={renderTooltip} />
              <Bar
                dataKey="pop"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 12, right: 12, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#ffffff60"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                dataKey="wind"
                stroke="#ffffff40"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit={` ${unit === 'C' ? 'km/h' : 'mph'}`}
                width={60}
              />
              <Tooltip content={renderTooltip} />
              <Area
                type="monotone"
                dataKey="wind"
                stroke="#a5b4fc"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
                activeDot={{ r: 6, fill: '#a5b4fc', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
