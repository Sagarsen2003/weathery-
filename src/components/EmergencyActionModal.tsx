import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  PhoneCall,
  Car,
  HeartPulse,
  Printer,
  Volume2,
} from 'lucide-react';
import type { WeatherAlert } from '../types/weather';
import { playCheckmarkBeep, playSevereAlertChime } from '../utils/audioAlert';

interface EmergencyActionModalProps {
  alert: WeatherAlert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyActionModal: React.FC<EmergencyActionModalProps> = ({
  alert,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'immediate' | 'checklist' | 'dosAndDonts' | 'contacts'>('immediate');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !alert) return null;

  const toggleChecklist = (id: string) => {
    setCompletedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        playCheckmarkBeep();
      }
      return next;
    });
  };

  const checklistItems = alert.checklist || [];
  const completedCount = checklistItems.filter((item) => completedItems[item.id]).length;
  const progressPct =
    checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : 0;

  const isExtreme = alert.severity === 'extreme' || alert.severity === 'severe';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col liquid-glass-panel rounded-3xl sm:rounded-[2rem] overflow-hidden text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Emergency Beacon */}
        <div
          className={`p-4 sm:p-6 border-b shrink-0 transition-colors ${
            isExtreme
              ? 'bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border-rose-500/30'
              : 'bg-gradient-to-r from-amber-950/90 via-orange-900/80 to-amber-950/90 border-amber-500/30'
          }`}
        >
          <div className="flex items-start justify-between gap-2.5 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isExtreme
                    ? 'bg-rose-500/30 text-rose-300 border-rose-400/50 animate-pulse'
                    : 'bg-amber-500/30 text-amber-300 border-amber-400/50'
                }`}
              >
                <AlertTriangle size={22} className="sm:w-[26px] sm:h-[26px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isExtreme ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {alert.severity} • {alert.urgency} Action Required
                  </span>
                  <span className="text-[11px] sm:text-xs text-white/75">
                    Active until {alert.expiresTime}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight text-white mt-1 leading-snug">
                  {alert.event}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-1 mt-0.5">
                  {alert.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => playSevereAlertChime(0.2)}
                className="p-1.5 sm:p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Play emergency alert siren"
                aria-label="Play emergency alert siren"
              >
                <Volume2 size={17} />
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Print action plan"
                aria-label="Print action plan"
              >
                <Printer size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-5 overflow-x-auto no-scrollbar border-b border-white/10 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('immediate')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'immediate'
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              1. Immediate Steps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>2. Safety Checklist</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.2 rounded-full">
                {completedCount}/{checklistItems.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dosAndDonts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'dosAndDonts'
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              3. Do's & Don'ts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              4. Emergency Contacts
            </button>
          </div>
        </div>

        {/* Modal Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar space-y-5 sm:space-y-6">
          {/* TAB 1: IMMEDIATE STEPS */}
          {activeTab === 'immediate' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  Official Warning Description
                </span>
                <p className="text-sm text-white/90 leading-relaxed">{alert.description}</p>
                {alert.instruction && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-100 text-xs sm:text-sm font-medium">
                    ⚡ {alert.instruction}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm sm:text-base text-white mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  Priority Steps to Take Right Now:
                </h4>
                <div className="space-y-2.5">
                  {alert.safetyActions.immediateSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-white/90 leading-normal">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel and Health summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider">
                    <Car size={16} />
                    <span>Travel & Commute Guidance</span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
                    {alert.safetyActions.travelAdvice.map((t, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <HeartPulse size={16} />
                    <span>Health & Vulnerability Precautions</span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
                    {alert.safetyActions.healthPrecautions.map((h, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80">Safety Readiness Progress</span>
                    <span className="text-amber-300">{progressPct}% Complete</span>
                  </div>
                  <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right text-xs text-white/60 shrink-0">
                  {completedCount} of {checklistItems.length} checked
                </div>
              </div>

              <div className="space-y-2.5">
                {checklistItems.map((item) => {
                  const isChecked = Boolean(completedItems[item.id]);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`p-4 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-sm'
                          : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-white/30 bg-black/20'
                        }`}
                      >
                        {isChecked && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <span
                        className={`text-sm font-medium leading-relaxed ${
                          isChecked ? 'line-through text-white/60' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DO'S & DON'TS */}
          {activeTab === 'dosAndDonts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* DO's */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-2">
                  <CheckCircle2 size={18} />
                  <span>Recommended (DO)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-100">
                  {alert.safetyActions.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONT's */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-rose-500/20 pb-2">
                  <XCircle size={18} />
                  <span>Hazardous (DO NOT)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-rose-100">
                  {alert.safetyActions.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs sm:text-sm text-white/70">
                Keep these numbers accessible for emergency assistance and disaster relief:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alert.safetyActions.emergencyContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span className="text-xs text-white/60 block">{contact.description}</span>
                      <h5 className="font-bold text-sm text-white mt-0.5">{contact.label}</h5>
                    </div>
                    <a
                      href={`tel:${contact.number.split('/')[0].trim()}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors w-fit shadow"
                    >
                      <PhoneCall size={14} />
                      <span>{contact.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-white/65 shrink-0">
          <span className="text-center sm:text-left">Authority: {alert.senderName || 'Meteorological Authority'}</span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-all cursor-pointer"
          >
            I Understand & Stay Safe
          </button>
        </div>
      </div>
    </div>
  );
};
