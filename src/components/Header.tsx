import React from 'react';
import { assetUrl } from '../utils/assetUrl';
import { 
  Building2, 
  Users, 
  Sparkles, 
  Languages, 
  Bell, 
  ShieldCheck, 
  MapPin,
  HelpCircle,
  Sun,
  Moon,
  Eye,
  BarChart3,
  Activity,
  Database,
  Brain,
  Cpu,
  FileText,
  ClipboardList,
} from 'lucide-react';
import { AppTheme, AppFontSize, AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
  fontSize: AppFontSize;
  onChangeFontSize: (size: AppFontSize) => void;
  theme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onStartDemoTour: () => void;
  isTourActive: boolean;
  activeAlertCount: number;
  onOpenHelp: () => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  language,
  onToggleLanguage,
  fontSize,
  onChangeFontSize,
  theme,
  onChangeTheme,
  highContrast,
  onToggleHighContrast,
  onStartDemoTour,
  isTourActive,
  activeAlertCount,
  onOpenHelp,
  onOpenAlerts
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md transition-colors duration-200">
      {/* Top Ministry Banner */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-300">
            {language === 'HI' ? 'ग्रामीण विकास मंत्रालय | भारत सरकार' : 'Ministry of Rural Development | Government of India'}
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
            RFCTLARR 2013 &amp; National Highways Act 1956
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden sm:inline text-emerald-400 font-mono font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {language === 'HI' ? 'संवैधानिक घड़ी इंजन सक्रिय' : 'Statutory clock engine live'}
          </span>
          <button
            onClick={onOpenHelp}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded-md hover:bg-amber-400/10 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'सहायता केंद्र' : 'Help Desk'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-3 cursor-pointer text-left"
          onClick={() => onSelectView('OFFICER')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelectView('OFFICER');
            }
          }}
          aria-label={language === 'HI' ? 'मुख्य कमान केंद्र पर जाएँ' : 'Go to Command Center'}
        >
          <div className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-sm logo-badge">
            <img
              src={assetUrl('/logo-dark.png')}
              alt="LUME Logo"
              className="h-6 w-auto object-contain app-logo-dark"
            />
            <img
              src={assetUrl('/logo-light.png')}
              alt="LUME Logo"
              className="h-6 w-auto object-contain app-logo-light hidden"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono font-medium">Early preview</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {language === 'HI' 
                ? 'भूमि अधिग्रहण अनिश्चितता एवं हस्तक्षेप प्रबंधन इंजन' 
                : 'Land-Acquisition Uncertainty Intervention-Management Engine'}
            </p>
          </div>
        </div>

        {/* Persona Mode Switcher: V9 Navigation */}
        <nav
          aria-label={language === 'HI' ? 'मुख्य नेविगेशन' : 'Primary navigation'}
          className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-700/60 shadow-inner backdrop-blur-md max-w-full overflow-x-auto lume-nav-scroll"
        >
          <button
            id="nav-officer-btn"
            onClick={() => onSelectView('OFFICER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'OFFICER'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_14px_rgba(52,211,153,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'कमान केंद्र' : 'Command Center'}</span>
          </button>

          <button
            id="nav-management-btn"
            onClick={() => onSelectView('MANAGEMENT_ATTENTION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'MANAGEMENT_ATTENTION'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'प्रबंधन' : 'Management'}</span>
          </button>

          <button
            id="nav-gis-btn"
            onClick={() => onSelectView('GIS')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'GIS'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_14px_rgba(20,184,166,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'मानचित्र' : 'Map'}</span>
          </button>

          <button
            id="nav-model-btn"
            onClick={() => onSelectView('MODEL_EVALUATION')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'MODEL_EVALUATION'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'मॉडल' : 'Model'}</span>
          </button>

          <button
            id="nav-data-btn"
            onClick={() => onSelectView('DATA')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'DATA'
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_14px_rgba(59,130,246,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'डेटा' : 'Data'}</span>
          </button>

          <button
            id="nav-trust-btn"
            onClick={() => onSelectView('TRUST_REGISTRY')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'TRUST_REGISTRY'
                ? 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-[0_0_14px_rgba(148,163,184,0.3)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'विश्वास' : 'Trust'}</span>
          </button>

          <button
            id="nav-case-files-btn"
            onClick={() => onSelectView('CASE_FILES')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'CASE_FILES'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-[0_0_14px_rgba(13,148,136,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'केस' : 'Cases'}</span>
          </button>

          <button
            id="nav-actions-btn"
            onClick={() => onSelectView('ACTIONS')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              currentView === 'ACTIONS'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-[0_0_14px_rgba(234,88,12,0.4)] scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === 'HI' ? 'कार्य' : 'Actions'}</span>
          </button>
        </nav>

        {/* Global Utilities: Theme Switcher, Font Scaler, Language Toggle, Tour */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 3-Theme Switcher: Light, Dark, High-Contrast */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700" role="group" aria-label={language === 'HI' ? 'थीम चुनें' : 'Choose theme'}>
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={`min-h-9 min-w-9 p-2 rounded transition-colors ${
                theme === 'light' && !highContrast ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Light Theme (Pristine GovTech)"
              aria-label={language === 'HI' ? 'लाइट थीम' : 'Light theme'}
              aria-pressed={theme === 'light' && !highContrast}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={`min-h-9 min-w-9 p-2 rounded transition-colors ${
                theme === 'dark' && !highContrast ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Dark Theme (Command Center)"
              aria-label={language === 'HI' ? 'डार्क थीम' : 'Dark theme'}
              aria-pressed={theme === 'dark' && !highContrast}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('high-contrast')}
              className={`min-h-9 min-w-9 p-2 rounded transition-colors ${
                theme === 'high-contrast' || highContrast ? 'bg-yellow-400 text-black font-black' : 'text-slate-400 hover:text-yellow-300'
              }`}
              title="High-Contrast WCAG AAA Mode"
              aria-label={language === 'HI' ? 'उच्च कंट्रास्ट मोड' : 'High-contrast mode'}
              aria-pressed={theme === 'high-contrast' || highContrast}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Guided Demo Tour Button */}
          <button
            type="button"
            id="tour-guide-btn"
            onClick={onStartDemoTour}
            className={`flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isTourActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Start interactive guided walk-through"
            aria-label={language === 'HI' ? 'इंटरैक्टिव डेमो दौरा शुरू करें' : 'Start interactive demo tour'}
            aria-pressed={isTourActive}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">
              {isTourActive ? (language === 'HI' ? 'डेमो चालू' : 'Demo Active') : (language === 'HI' ? 'डेमो दौरा' : 'Guided Tour')}
            </span>
          </button>

          {/* Accessibility Font Scaler */}
          <div className="hidden lg:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700" role="group" aria-label={language === 'HI' ? 'टेक्स्ट का आकार' : 'Text size'}>
            <button
              type="button"
              onClick={() => onChangeFontSize('normal')}
              className={`min-h-9 px-2.5 py-1 text-xs rounded font-bold transition-colors ${
                fontSize === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Standard font size"
              aria-label={language === 'HI' ? 'सामान्य टेक्स्ट' : 'Normal text size'}
              aria-pressed={fontSize === 'normal'}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('large')}
              className={`min-h-9 px-2.5 py-1 text-sm rounded font-bold transition-colors ${
                fontSize === 'large' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Larger font for comfortable reading"
              aria-label={language === 'HI' ? 'बड़ा टेक्स्ट' : 'Large text size'}
              aria-pressed={fontSize === 'large'}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('extra-large')}
              className={`min-h-9 px-2.5 py-1 text-base rounded font-bold transition-colors ${
                fontSize === 'extra-large' ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Extra large text for elderly users"
              aria-label={language === 'HI' ? 'अति बड़ा टेक्स्ट' : 'Extra-large text size'}
              aria-pressed={fontSize === 'extra-large'}
            >
              A++
            </button>
          </div>

          {/* Bilingual Language Switcher */}
          <button
            type="button"
            id="lang-toggle-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 min-h-9 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Toggle between English and Hindi"
            aria-label={language === 'EN' ? 'हिंदी में बदलें' : 'Switch to English'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'EN' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Notification Indicator with Click Trigger */}
          <button
            type="button"
            onClick={onOpenAlerts}
            className="relative min-h-9 min-w-9 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Open Live Alerts & Change Feed"
            aria-label={`${language === 'HI' ? 'लाइव अलर्ट खोलें' : 'Open live alerts'}${activeAlertCount > 0 ? ` (${activeAlertCount})` : ''}`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
