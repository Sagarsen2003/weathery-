import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import type { WeatherAlert } from '../types/weather';
import { playSevereAlertChime } from '../utils/audioAlert';

interface SevereAlertBannerProps {
  alerts: WeatherAlert[];
  onDismissAlert?: (id: string) => void;
  onOpenActionPlan: (alert: WeatherAlert) => void;
}

export const SevereAlertBanner: React.FC<SevereAlertBannerProps> = ({
  alerts,
  onDismissAlert,
  onOpenActionPlan,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    alerts.length > 0 ? alerts[0].id : null
  );
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  // If there are no active alerts for this location, do not show anything
  if (activeAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
    if (onDismissAlert) onDismissAlert(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleTestSiren = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSevereAlertChime(0.2);
  };

  return (
    <div className="mb-4 sm:mb-6 space-y-3 animate-fadeIn">
      {activeAlerts.map((alert) => {
        const isExpanded = expandedId === alert.id;
        const isExtreme = alert.severity === 'extreme' || alert.severity === 'severe';

        return (
          <div
            key={alert.id}
            className={`rounded-3xl sm:rounded-[2rem] liquid-glass transition-all duration-300 overflow-hidden ${
              isExtreme
                ? '!bg-rose-950/75 !border-rose-400/50 text-rose-100 ring-1 ring-rose-500/40'
                : '!bg-amber-950/75 !border-amber-400/50 text-amber-100 ring-1 ring-amber-500/40'
            }`}
          >
            {/* Responsive Header: stacked cleanly on mobile, horizontal row on sm+ */}
            <div
              onClick={() => toggleExpand(alert.id)}
              className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-white/5 transition-colors gap-3"
            >
              {/* Alert Icon + Title + Mobile Top-Right Expand/Close */}
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div
                  className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isExtreme
                      ? 'bg-rose-600/40 border-rose-400 text-rose-200 animate-pulse'
                      : 'bg-amber-600/40 border-amber-400 text-amber-200'
                  }`}
                >
                  <ShieldAlert size={22} className="sm:w-6 sm:h-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${
                          isExtreme ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                        }`}
                      >
                        {alert.severity} • {alert.urgency || 'Immediate'}
                      </span>
                      <span className="text-[11px] sm:text-xs text-white/75 whitespace-nowrap">
                        Until {alert.expiresTime}
                      </span>
                    </div>

                    {/* Mobile Expand/Dismiss Controls */}
                    <div className="flex sm:hidden items-center gap-0.5 shrink-0 -mr-1">
                      <button
                        type="button"
                        className="p-1.5 rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Expand alert details"
                      >
                        {isExpanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(alert.id, e)}
                        className="p-1.5 rounded-xl text-white/65 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Dismiss alert"
                        title="Dismiss alert"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm sm:text-base md:text-lg text-white leading-snug line-clamp-2 mt-1">
                    {alert.headline}
                  </h4>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenActionPlan(alert);
                  }}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>What Action To Take</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestSiren}
                  className="p-2 rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  title="Play alert siren"
                  aria-label="Play alert siren"
                >
                  <Volume2 size={17} />
                </button>

                {/* Desktop Expand/Dismiss Controls */}
                <button
                  type="button"
                  className="hidden sm:inline-flex p-2 rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  aria-label="Expand alert details"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDismiss(alert.id, e)}
                  className="hidden sm:inline-flex p-2 rounded-xl text-white/65 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                  aria-label="Dismiss alert"
                  title="Dismiss alert"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Content preview */}
            {isExpanded && (
              <div className="px-3.5 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-white/10 space-y-3 text-xs sm:text-sm text-white/90 animate-fadeIn">
                <p className="leading-relaxed bg-black/30 p-3 sm:p-3.5 rounded-2xl border border-white/10">
                  {alert.description}
                </p>

                {alert.instruction && (
                  <div className="flex items-start gap-2.5 sm:gap-3 bg-white/10 p-3 sm:p-3.5 rounded-2xl border border-white/15">
                    <AlertTriangle size={18} className="shrink-0 text-amber-300 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-200 block mb-0.5">
                        Urgent Recommended Safety Instructions:
                      </span>
                      <p className="text-white/90 leading-relaxed">{alert.instruction}</p>
                    </div>
                  </div>
                )}

                {/* Priority action highlights */}
                {alert.safetyActions && alert.safetyActions.immediateSteps.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-2">
                      Immediate Response Steps:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {alert.safetyActions.immediateSteps.slice(0, 4).map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-white/65 pt-2 border-t border-white/10">
                  <span>Issued by: {alert.senderName || 'Meteorological Authority'}</span>
                  <button
                    type="button"
                    onClick={() => onOpenActionPlan(alert)}
                    className="text-amber-300 hover:text-amber-200 font-semibold underline cursor-pointer text-left sm:text-right"
                  >
                    Open Full Step-by-Step Action Plan & Checklist →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
