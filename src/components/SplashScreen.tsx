import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  language?: 'EN' | 'HI';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'EN' }) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState(
    language === 'HI' ? 'सांविधिक रजिस्ट्री को लोड किया जा रहा है...' : 'Syncing statutory registries (NGDRS, PARIVESH, LACRRIS)...'
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = prev + 12;
        if (next > 40 && next <= 70) {
          setPhaseText(
            language === 'HI' ? 'उपग्रह एनडीवीआई एवं अदालती पूर्ववृत्त विश्लेषण...' : 'Calibrating Sentinel-2 NDVI & 4.2M judicial delay baselines...'
          );
        } else if (next > 70) {
          setPhaseText(
            language === 'HI' ? 'पारदर्शिता एवं निर्णय प्रणाली तैयार है।' : 'Readying citizen transparency & officer command center...'
          );
        }
        return next > 100 ? 100 : next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete, language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Dynamic Animated Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#334155" strokeWidth="0.75" />
            </pattern>
            <radialGradient id="splash-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-grid)" />
          <rect width="100%" height="100%" fill="url(#splash-glow)" />
        </svg>
      </div>

      {/* Floating Animated Radial Pulse Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/20 animate-ping opacity-20 pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute w-[360px] h-[360px] rounded-full border border-amber-500/20 animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full mx-4 p-8 text-center flex flex-col items-center space-y-6">
        {/* Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 p-1 shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900/90 backdrop-blur-md rounded-[20px] flex items-center justify-center">
              <Shield className="w-10 h-10 text-amber-400 drop-shadow-md animate-pulse" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow border border-slate-900">
            v7.0
          </span>
        </div>

        {/* LUME Animated Typography */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-5xl sm:text-6xl font-black tracking-widest text-amber-400 drop-shadow-sm transition-all duration-500 hover:scale-110">
              L
            </span>
            <span className="text-5xl sm:text-6xl font-black tracking-widest text-emerald-400 drop-shadow-sm transition-all duration-500 hover:scale-110">
              U
            </span>
            <span className="text-5xl sm:text-6xl font-black tracking-widest text-teal-300 drop-shadow-sm transition-all duration-500 hover:scale-110">
              M
            </span>
            <span className="text-5xl sm:text-6xl font-black tracking-widest text-white drop-shadow-sm transition-all duration-500 hover:scale-110">
              E
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide uppercase">
            {language === 'HI'
              ? 'भूमि अधिग्रहण अनिश्चितता एवं हस्तक्षेप प्रबंधन इंजन'
              : 'Land-Acquisition Uncertainty Intervention-Management Engine'}
          </h2>

          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {language === 'HI'
              ? 'सांविधिक पारदर्शिता • उपग्रह एनडीवीआई सुरक्षा • सभी नागरिकों एवं अधिकारियों के लिए सुलभ'
              : 'Predictive delay prevention, statutory clock tracking & multi-generational citizen transparency'}
          </p>
        </div>

        {/* Key Statutory Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 text-[11px] text-slate-300">
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full font-medium">
            RFCTLARR 2013
          </span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full font-medium">
            NHAI Sec 3 Clocks
          </span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full font-medium text-emerald-400">
            Sentinel-2 Sec 10
          </span>
          <span className="bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-full font-medium text-amber-400">
            Jan-Seva Portal
          </span>
        </div>

        {/* Progress Bar & Phase Info */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-400 h-full transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="truncate max-w-[220px] text-left">{phaseText}</span>
            <span className="font-bold text-emerald-400">{progress}%</span>
          </div>
        </div>

        {/* Quick Skip Button */}
        <button
          onClick={onComplete}
          className="mt-2 text-xs text-slate-400 hover:text-white flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
        >
          <span>{language === 'HI' ? 'प्रारंभ करें' : 'Enter Workspace'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
