import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Activity, CheckCircle2, Satellite, Scale, Sparkles, Terminal } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  language?: 'EN' | 'HI';
}

interface TelemetryStep {
  id: string;
  labelEn: string;
  labelHi: string;
  targetPct: number;
  system: string;
}

const TELEMETRY_STEPS: TelemetryStep[] = [
  {
    id: 'gis',
    labelEn: 'ISRO Bhuvan & Sentinel-2 NDVI Multi-Crop Classification',
    labelHi: 'इसरो भुवन एवं सेंटिनल-2 उपग्रह एनडीवीआई सत्यापन',
    targetPct: 25,
    system: 'GEO_SPATIAL',
  },
  {
    id: 'clocks',
    labelEn: 'RFCTLARR 2013 Sec 11 & NHAI 336-Day Statutory Engine',
    labelHi: 'सांविधिक धारा 11 एवं एनएचएआई 336-दिवसीय समयसीमा इंजन',
    targetPct: 55,
    system: 'STATUTORY_CLOCK',
  },
  {
    id: 'precedents',
    labelEn: '1,467 High Court Precedents & Compensation Database',
    labelHi: '1,467 उच्च न्यायालय नज़ीर एवं निष्पक्ष मुआवज़ा डेटाबेस',
    targetPct: 80,
    system: 'PRECEDENT_GRAPH',
  },
  {
    id: 'janseva',
    labelEn: 'Jan-Seva Multi-Generational Citizen Transparency Ready',
    labelHi: 'जन-सेवा नागरिक पारदर्शिता एवं डीबीटी प्रणाली तैयार',
    targetPct: 100,
    system: 'JAN_SEVA',
  },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'EN' }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Keyboard listener for quick skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 500);
          return 100;
        }
        const increment = 10;
        const next = Math.min(100, prev + increment);

        // Update active telemetry step
        const stepIdx = TELEMETRY_STEPS.findIndex((s) => next <= s.targetPct);
        if (stepIdx !== -1) {
          setCurrentStepIdx(stepIdx);
        } else {
          setCurrentStepIdx(TELEMETRY_STEPS.length - 1);
        }

        return next;
      });
    }, 140);

    return () => clearInterval(timer);
  }, []);

  const activeStep = TELEMETRY_STEPS[currentStepIdx] || TELEMETRY_STEPS[0];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-hidden select-none transition-all duration-600 ease-out ${isExiting ? 'opacity-0 scale-105 pointer-events-none blur-sm' : 'opacity-100 scale-100'
        }`}
    >
      {/* Dynamic Animated Ambient Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="splash-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#0ea5e9" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-grid)" />
          <rect width="100%" height="100%" fill="url(#splash-glow)" />
        </svg>
      </div>

      {/* Floating Animated Radar Pulse Rings */}
      <div
        className="absolute w-[640px] h-[640px] rounded-full border border-emerald-500/15 animate-ping pointer-events-none"
        style={{ animationDuration: '5s' }}
      />
      <div
        className="absolute w-[460px] h-[460px] rounded-full border border-cyan-500/20 animate-pulse pointer-events-none"
        style={{ animationDuration: '3s' }}
      />
      <div className="absolute w-[320px] h-[320px] rounded-full border border-amber-500/20 pointer-events-none" />

      {/* Main Terminal HUD Window */}
      <div className="relative z-10 max-w-xl w-full mx-4 p-8 sm:p-10 rounded-3xl bg-slate-900/85 border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)] backdrop-blur-2xl flex flex-col items-center text-center space-y-6">
        {/* Top Government & System Metadata Banner */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MINISTRY OF RURAL DEVELOPMENT • SIH26017</span>
        </div>

        {/* Central Glowing LUME Emblem */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center shadow-2xl p-4">
            <img
              src="/logo-dark.png"
              alt="LUME Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]"
            />
          </div>
        </div>

        {/* Typography & Subtitles */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              LUME
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              V9 COMMAND TOWER
            </span>
          </div>

          <h2 className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide uppercase font-mono">
            {language === 'HI'
              ? 'भूमि अधिग्रहण अनिश्चितता एवं हस्तक्षेप प्रबंधन इंजन'
              : 'Land-Acquisition Uncertainty Intervention Engine'}
          </h2>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {language === 'HI'
              ? 'सांविधिक समयसीमा ट्रैकिंग • उपग्रह एनडीवीआई सुरक्षा • नागरिक पारदर्शिता'
              : 'Predictive statutory delay prevention, satellite NDVI verification & evidence-weighted corridor foresight'}
          </p>
        </div>

        {/* Real-time Telemetry Sequence List */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              SYSTEM TELEMETRY CALIBRATION
            </span>
            <span className="text-slate-400 font-bold">{progress}% READY</span>
          </div>

          <div className="space-y-1.5">
            {TELEMETRY_STEPS.map((step, idx) => {
              const isDone = progress > step.targetPct;
              const isCurrent = progress <= step.targetPct && (idx === 0 || progress > TELEMETRY_STEPS[idx - 1].targetPct);

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between text-xs px-2.5 py-1 rounded-lg transition-all ${isCurrent
                      ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-semibold'
                      : isDone
                        ? 'text-slate-400'
                        : 'text-slate-600 opacity-60'
                    }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className="truncate">
                      {language === 'HI' ? step.labelHi : step.labelEn}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] shrink-0">
                    {isDone ? (
                      <span className="text-emerald-400 font-bold">OK</span>
                    ) : isCurrent ? (
                      <span className="text-amber-400 font-bold">SYNCING</span>
                    ) : (
                      <span className="text-slate-600">WAIT</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Glowing Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 relative p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-150 relative shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Instant Enter Button */}
        <button
          onClick={handleFinish}
          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>{language === 'HI' ? 'कमान केंद्र में प्रवेश करें' : 'Enter Command Center'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/20 ml-1">
            ↵ Enter
          </span>
        </button>
      </div>
    </div>
  );
};
