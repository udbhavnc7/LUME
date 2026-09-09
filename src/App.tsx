import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfflineStatutoryBar } from './components/OfflineStatutoryBar';
import { ContextRoleClarifier } from './components/ContextRoleClarifier';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { HelpSupportModal } from './components/HelpSupportModal';
import { PortfolioCommandCenter } from './components/PortfolioCommandCenter';
import { ProjectIntelligenceRoom } from './components/ProjectIntelligenceRoom';
import { GISIntelligenceView } from './components/GISIntelligenceView';
import { CitizenTransparencyPortal } from './components/CitizenTransparencyPortal';
import { TrustAndModelRegistry } from './components/TrustAndModelRegistry';
import { ComparativeAnalyticsView } from './components/ComparativeAnalyticsView';
import { AlertsFeedDrawer } from './components/AlertsFeedDrawer';
import { IPIConfiguratorModal } from './components/IPIConfiguratorModal';
import { DemoTourGuide, TOUR_STEPS } from './components/DemoTourGuide';
import { MOCK_PROJECTS, MOCK_CITIZEN_PARCELS, MOCK_DECISION_LOGS } from './data/mockData';
import { 
  LandAcquisitionProject, 
  DecisionLogEntry, 
  CitizenParcelRecord, 
  AppTheme, 
  AppFontSize, 
  UserPreferences,
  UserRole,
  AppView,
  RBACRole,
  IPIWeights
} from './types';
import { ShieldCheck, HeartHandshake, Compass, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('OFFICER');
  const [activeRole, setActiveRole] = useState<RBACRole>('DISTRICT_OFFICER');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectTab, setSelectedProjectTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'PRECEDENTS' | 'SCENARIO' | 'DECISIONS' | 'DOC_VERIFICATION' | 'REVIEW_PACKET'>('OVERVIEW');
  const [citizenTargetUlpin, setCitizenTargetUlpin] = useState<string | undefined>(undefined);
  
  // Alerts Drawer & IPI Modal State
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isIPIModalOpen, setIsIPIModalOpen] = useState<boolean>(false);
  const [ipiWeights, setIpiWeights] = useState<IPIWeights>(() => {
    const saved = localStorage.getItem('lume_ipi_weights');
    return saved ? JSON.parse(saved) : {
      w1RiskMovement: 0.35,
      w2Urgency: 0.30,
      w3Criticality: 0.20,
      w4Actionability: 0.15,
      version: '2026.1-champion'
    };
  });

  // Theme & Accessibility Preferences
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('lume_theme');
    return (saved as AppTheme) || 'dark';
  });
  const [fontSize, setFontSize] = useState<AppFontSize>(() => {
    const saved = localStorage.getItem('lume_font_size');
    return (saved as AppFontSize) || 'normal';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('lume_high_contrast') === 'true';
  });
  const [language, setLanguage] = useState<'EN' | 'HI'>(() => {
    const saved = localStorage.getItem('lume_language');
    return (saved as 'EN' | 'HI') || 'EN';
  });

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash on every initial load/refresh for a cinematic experience
    return true;
  });

  // Onboarding Wizard State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('lume_onboarding_completed') === 'true';
  });

  // Help & Support Modal State
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Mutable state for decision logs
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>(() => {
    const saved = localStorage.getItem('lume_decision_logs');
    return saved ? JSON.parse(saved) : MOCK_DECISION_LOGS;
  });

  const [projects] = useState<LandAcquisitionProject[]>(MOCK_PROJECTS);
  const [parcels] = useState<CitizenParcelRecord[]>(MOCK_CITIZEN_PARCELS);

  // Synchronize theme classes to document root and body for global styling and modals
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('app-theme-light', 'app-theme-dark', 'app-theme-high-contrast', 'dark', 'light');
    body.classList.remove('app-theme-light', 'app-theme-dark', 'app-theme-high-contrast', 'dark', 'light');

    const effectiveThemeClass = highContrast || theme === 'high-contrast'
      ? 'app-theme-high-contrast'
      : theme === 'light'
      ? 'app-theme-light'
      : 'app-theme-dark';

    root.classList.add(effectiveThemeClass);
    body.classList.add(effectiveThemeClass);
    if (theme === 'light' && !highContrast) {
      root.classList.add('light');
      body.classList.add('light');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
    }
  }, [theme, highContrast]);

  // When splash completes, check if onboarding is needed
  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  // Replay splash screen
  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setTheme(prefs.theme);
    setFontSize(prefs.fontSize);
    setHighContrast(prefs.highContrast);
    setLanguage(prefs.language);
    setCurrentView(prefs.preferredRole === 'CITIZEN' ? 'CITIZEN' : prefs.preferredRole === 'GIS' ? 'GIS' : 'OFFICER');
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);

    // Save all to localStorage
    localStorage.setItem('lume_theme', prefs.theme);
    localStorage.setItem('lume_font_size', prefs.fontSize);
    localStorage.setItem('lume_high_contrast', String(prefs.highContrast));
    localStorage.setItem('lume_language', prefs.language);
    localStorage.setItem('lume_onboarding_completed', 'true');
  };

  // Theme change handler
  const handleChangeTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    if (newTheme === 'high-contrast') {
      setHighContrast(true);
      localStorage.setItem('lume_high_contrast', 'true');
    } else {
      setHighContrast(false);
      localStorage.setItem('lume_high_contrast', 'false');
    }
    localStorage.setItem('lume_theme', newTheme);
  };

  // High contrast direct toggle
  const handleToggleHighContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    if (nextVal) {
      setTheme('high-contrast');
      localStorage.setItem('lume_theme', 'high-contrast');
    } else {
      setTheme('dark');
      localStorage.setItem('lume_theme', 'dark');
    }
    localStorage.setItem('lume_high_contrast', String(nextVal));
  };

  // Font size change handler
  const handleChangeFontSize = (newSize: AppFontSize) => {
    setFontSize(newSize);
    localStorage.setItem('lume_font_size', newSize);
  };

  // Language toggle handler
  const handleToggleLanguage = () => {
    const nextLang = language === 'EN' ? 'HI' : 'EN';
    setLanguage(nextLang);
    localStorage.setItem('lume_language', nextLang);
  };

  // Save decisions to localStorage
  const handleAddDecisionLog = (entry: DecisionLogEntry) => {
    const updated = [entry, ...decisionLogs];
    setDecisionLogs(updated);
    localStorage.setItem('lume_decision_logs', JSON.stringify(updated));
  };

  // Save IPI formula weights
  const handleSaveIPIWeights = (newWeights: IPIWeights) => {
    setIpiWeights(newWeights);
    localStorage.setItem('lume_ipi_weights', JSON.stringify(newWeights));
  };

  // Tour Navigation Controller
  const handleStartTour = () => {
    setIsTourActive(true);
    setTourStepIndex(0);
    applyTourStep(0);
  };

  const applyTourStep = (stepIdx: number) => {
    const step = TOUR_STEPS[stepIdx];
    setCurrentView(step.targetView as AppView);
    if (step.targetProjectId) {
      setSelectedProjectId(step.targetProjectId);
    } else if (step.targetView === 'OFFICER' && !step.targetProjectId) {
      setSelectedProjectId(null);
    }
    if (step.targetTab) {
      setSelectedProjectTab(step.targetTab as any);
    }
  };

  const handleNextTourStep = () => {
    if (tourStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = tourStepIndex + 1;
      setTourStepIndex(nextIdx);
      applyTourStep(nextIdx);
    } else {
      setIsTourActive(false);
    }
  };

  const handlePrevTourStep = () => {
    if (tourStepIndex > 0) {
      const prevIdx = tourStepIndex - 1;
      setTourStepIndex(prevIdx);
      applyTourStep(prevIdx);
    }
  };

  const handleGoToTourStep = (index: number) => {
    setTourStepIndex(index);
    applyTourStep(index);
  };

  // Project selection handler
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setSelectedProjectTab('OVERVIEW');
    setCurrentView('OFFICER');
  };

  // Navigate to Citizen view with parcel context
  const handleOpenCitizenForProject = (ulpin?: string) => {
    setCitizenTargetUlpin(ulpin || 'MH270412889201');
    setCurrentView('CITIZEN');
  };

  const activeProject = projects.find(p => p.id === selectedProjectId);

  // Active Critical Alerts
  const criticalAlertsCount = projects.reduce((count, p) => count + (p.modelOutput.delayProbability >= 0.7 ? 1 : 0), 0);

  // Current effective theme class
  const activeThemeClass = highContrast || theme === 'high-contrast' 
    ? 'app-theme-high-contrast' 
    : theme === 'light' 
    ? 'app-theme-light' 
    : 'app-theme-dark';

  const fontSizeClass = `font-size-${fontSize}`;

  return (
    <div className={`min-h-screen ${activeThemeClass} ${fontSizeClass} bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 transition-colors duration-200`}>
      {/* 1. LUME Animated Splash Screen */}
      {showSplash && (
        <SplashScreen
          language={language}
          onComplete={handleSplashComplete}
        />
      )}

      {/* 2. Onboarding Wizard (Accessible Setup for All Ages) */}
      {showOnboarding && !showSplash && (
        <OnboardingWizard
          initialPrefs={{
            theme,
            fontSize,
            highContrast,
            language,
            hasCompletedOnboarding: false,
            preferredRole: currentView === 'CITIZEN' ? 'CITIZEN' : currentView === 'GIS' ? 'GIS' : 'OFFICER'
          }}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      {/* 3. Dedicated Help & Support Modal */}
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
        onOpenTutorial={() => {
          setIsHelpOpen(false);
          handleStartTour();
        }}
        onReplaySplash={() => {
          setIsHelpOpen(false);
          handleReplaySplash();
        }}
      />

      {/* 4. Live Alerts & Change Feed Drawer (F11) */}
      <AlertsFeedDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        language={language}
        onSelectProject={(projId) => {
          setIsAlertsOpen(false);
          handleSelectProject(projId);
        }}
      />

      {/* 5. IPI Formula Configurator Modal (F09) */}
      <IPIConfiguratorModal
        isOpen={isIPIModalOpen}
        onClose={() => setIsIPIModalOpen(false)}
        weights={ipiWeights}
        onSaveWeights={handleSaveIPIWeights}
        language={language}
      />

      {/* 5.5. PWA Service Worker Offline Statutory Bar & Field Cache Sync */}
      <OfflineStatutoryBar language={language} />

      {/* 6. Universal Header with Theme, Language, Analytics & Alerts */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          if (view === 'OFFICER' && selectedProjectId) {
            // Keep selected project or go to overview
          }
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        fontSize={fontSize}
        onChangeFontSize={handleChangeFontSize}
        theme={theme}
        onChangeTheme={handleChangeTheme}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleHighContrast}
        onStartDemoTour={handleStartTour}
        isTourActive={isTourActive}
        activeAlertCount={criticalAlertsCount}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
      />

      {/* 7. Context Role Clarifier Banner with RBAC Role Switcher */}
      <ContextRoleClarifier
        currentView={currentView}
        onSelectView={setCurrentView}
        language={language}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenTutorial={handleStartTour}
        theme={theme}
        onToggleTheme={handleChangeTheme}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
      />

      {/* 8. Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* VIEW 1: OFFICER INTELLIGENCE */}
        {currentView === 'OFFICER' && (
          selectedProjectId && activeProject ? (
            <ProjectIntelligenceRoom
              project={activeProject}
              onBack={() => setSelectedProjectId(null)}
              decisionLogs={decisionLogs}
              onAddDecisionLog={handleAddDecisionLog}
              onOpenCitizenView={handleOpenCitizenForProject}
              language={language}
              defaultTab={selectedProjectTab}
            />
          ) : (
            <PortfolioCommandCenter
              projects={projects}
              onSelectProject={handleSelectProject}
              onOpenGIS={() => setCurrentView('GIS')}
              language={language}
              onOpenIPIModal={() => setIsIPIModalOpen(true)}
            />
          )
        )}

        {/* VIEW 2: CITIZEN JAN-SEVA TRANSPARENCY (Accessible for ALL AGES) */}
        {currentView === 'CITIZEN' && (
          <CitizenTransparencyPortal
            parcels={parcels}
            initialUlpin={citizenTargetUlpin}
            language={language}
            onSwitchToOfficer={() => setCurrentView('OFFICER')}
          />
        )}

        {/* VIEW 3: GIS & SATELLITE SECTION 10 INTELLIGENCE */}
        {currentView === 'GIS' && (
          <GISIntelligenceView
            projects={projects}
            onSelectProject={handleSelectProject}
            language={language}
          />
        )}

        {/* VIEW 4: COMPARATIVE ANALYTICS & STATUTORY BENCHMARKS (F18) */}
        {currentView === 'ANALYTICS' && (
          <ComparativeAnalyticsView
            language={language}
            onSelectProject={handleSelectProject}
          />
        )}

        {/* VIEW 5: MODEL REGISTRY, REST APIS & SCIENTIFIC TRUST (F15 / F16) */}
        {currentView === 'TRUST_REGISTRY' && (
          <TrustAndModelRegistry
            language={language}
          />
        )}
      </main>

      {/* Floating 7-Minute SIH Demo Tour Guide */}
      {isTourActive && (
        <DemoTourGuide
          currentStepIndex={tourStepIndex}
          onNextStep={handleNextTourStep}
          onPrevStep={handlePrevTourStep}
          onCloseTour={() => setIsTourActive(false)}
          onGoToStep={handleGoToTourStep}
        />
      )}

      {/* Professional GovTech Footer with Quick Accessibility & Help Links */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 flex items-center justify-center font-black text-slate-950 text-sm">
              L
            </div>
            <div>
              <div className="text-slate-200 font-semibold flex items-center gap-2">
                <span>LUME • Land-Acquisition Uncertainty Intervention-Management Engine</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  GovTech 2026
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Ministry of Rural Development • RFCTLARR 2013 & NHAI Sec 3 Statutory Grounding
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'सहायता एवं अक्सर पूछे जाने वाले प्रश्न' : 'FAQs & Helpline'}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsIPIModalOpen(true)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              {language === 'HI' ? 'आईपीआई फॉर्मूला (F09)' : 'IPI Formula'}
            </button>
            <span>•</span>
            <button
              onClick={() => setShowOnboarding(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {language === 'HI' ? 'पुनः परिचय (Onboarding)' : 'Revisit Setup'}
            </button>
            <span>•</span>
            <button
              onClick={handleReplaySplash}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {language === 'HI' ? 'ल्युमे परिचय स्क्रीन' : 'Replay Splash'}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('TRUST_REGISTRY')}
              className="text-teal-400 hover:underline cursor-pointer"
            >
              arXiv:2307.16285 Grounding
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
