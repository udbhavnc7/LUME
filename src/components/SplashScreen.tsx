import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ThreeLumeConstellation } from './ThreeLumeConstellation';

interface SplashScreenProps {
  onComplete: () => void;
  language?: 'EN' | 'HI';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'EN' }) => {
  const [progress, setProgress] = useState(0);
  const [activeLetter, setActiveLetter] = useState<'L' | 'U' | 'M' | 'E'>('L');
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
    }, 500);
  };

  useEffect(() => {
    // Smooth progress increment through all 4 letters in ~4 seconds
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 450);
          return 100;
        }
        return prev + 1;
      });
    }, 38);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-hidden select-none transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Cyber Grid & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="splash-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.15" />
              <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-grid)" />
          <rect width="100%" height="100%" fill="url(#splash-glow)" />
        </svg>
      </div>

      {/* Atmospheric Radar Rings */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full border border-emerald-500/15 animate-ping pointer-events-none"
        style={{ animationDuration: '6s' }}
      />
      <div
        className="absolute w-[480px] h-[480px] rounded-full border border-cyan-500/20 animate-pulse pointer-events-none"
        style={{ animationDuration: '3.5s' }}
      />

      {/* Main Container HUD */}
      <div className="relative z-10 max-w-3xl w-full mx-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)] backdrop-blur-2xl flex flex-col items-center text-center space-y-4">
        {/* Top HUD Badges matching user signal field screenshot */}
        <div className="flex flex-wrap items-center justify-between w-full gap-2 px-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>PORTFOLIO SIGNAL FIELD • STATUTORY CONSTELLATION</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEMO SEED · PRECEDENTS ABSENT</span>
          </div>
        </div>

        {/* 3D Interactive Three.js Scene: Words Forming L - U - M - E */}
        <div className="w-full relative">
          <ThreeLumeConstellation progress={progress} onLetterComplete={setActiveLetter} />

          {/* Dynamic Floating Letter Assembly Status */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <div className="bg-slate-950/85 border border-emerald-500/40 rounded-xl px-3 py-1 text-left font-mono text-[11px] text-emerald-300 backdrop-blur-md">
              <span className="text-slate-400">Assembling: </span>
              <strong className="text-emerald-400 font-bold">
                {progress < 25
                  ? 'Letter L [Litigations & Stays]'
                  : progress < 50
                  ? 'Letter U [ULPIN & Cadastral]'
                  : progress < 75
                  ? 'Letter M [Monitoring & Compensation]'
                  : 'Letter E [Enactment & Execution]'}
              </strong>
            </div>
          </div>
        </div>

        {/* 4 Interactive Letter Assembly Checkpoints */}
        <div className="grid grid-cols-4 gap-2 w-full pt-1">
          {[
            { letter: 'L', labelEn: 'Litigations', labelHi: 'अदालती मामले', threshold: 25 },
            { letter: 'U', labelEn: 'ULPIN Records', labelHi: 'भू-आधार रिकॉर्ड', threshold: 50 },
            { letter: 'M', labelEn: 'Monitoring', labelHi: 'निगरानी एवं मुआवज़ा', threshold: 75 },
            { letter: 'E', labelEn: 'Enactment', labelHi: 'सांविधिक कार्यान्वयन', threshold: 100 },
          ].map((item) => {
            const isCompleted = progress >= item.threshold;
            const isCurrent = progress >= item.threshold - 25 && progress < item.threshold;

            return (
              <div
                key={item.letter}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-cyan-950/40 border-cyan-400/60 text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : isCurrent
                    ? 'bg-slate-900/90 border-cyan-400/80 text-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-xl font-black font-mono leading-none tracking-wider">
                  {item.letter}
                </div>
                <div className="text-[10px] font-mono mt-1 truncate">
                  {language === 'HI' ? item.labelHi : item.labelEn}
                </div>
                {isCompleted && (
                  <div className="text-[9px] text-cyan-400 font-bold flex items-center justify-center gap-0.5 mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full space-y-1.5 pt-1">
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 relative p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-150 relative shadow-[0_0_14px_rgba(52,211,153,0.7)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>{progress}% CONVERGENCE</span>
            <span className="text-cyan-400 font-bold">
              {progress >= 95 ? 'LUME LOGO CONSTELLATION ASSEMBLED' : 'SYNCHRONIZING STATUTORY CORPUS'}
            </span>
          </div>
        </div>

        {/* Instant Enter / Skip Button */}
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
