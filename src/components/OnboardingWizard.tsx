import React, { useState } from 'react';
import { 
  AppTheme, 
  AppFontSize, 
  UserRole, 
  UserPreferences 
} from '../types';
import { 
  Sparkles, 
  Users, 
  Building2, 
  Satellite, 
  Sun, 
  Moon, 
  Eye, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  Scale, 
  ShieldCheck, 
  Compass, 
  HelpCircle,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingWizardProps {
  initialPrefs: UserPreferences;
  onComplete: (prefs: UserPreferences) => void;
  onSkip: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialPrefs,
  onComplete,
  onSkip
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Preference state
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialPrefs.preferredRole || 'CITIZEN');
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(initialPrefs.theme || 'dark');
  const [selectedFontSize, setSelectedFontSize] = useState<AppFontSize>(initialPrefs.fontSize || 'normal');
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI'>(initialPrefs.language || 'EN');
  const [highContrast, setHighContrast] = useState<boolean>(initialPrefs.highContrast || false);

  // Feature highlight tab in step 3
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const handleFinish = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    onComplete({
      theme: highContrast ? 'high-contrast' : selectedTheme,
      fontSize: selectedFontSize,
      highContrast,
      language: selectedLanguage,
      hasCompletedOnboarding: true,
      preferredRole: selectedRole
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 text-white relative">
        {/* Top Header Bar with Progress Dots */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 flex items-center justify-center font-black text-slate-950 text-sm">
              L
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                {selectedLanguage === 'HI' ? 'ल्युमे स्वागत एवं परिचय' : 'Welcome to LUME'}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {selectedLanguage === 'HI' ? 'सुगम मार्गदर्शन' : 'Intuitive Setup'}
                </span>
              </h2>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === i
                    ? 'w-6 bg-amber-400'
                    : step > i
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Welcoming Introduction for All Ages */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white">
                {selectedLanguage === 'HI'
                  ? 'भूमि अधिग्रहण में पारदर्शिता एवं समयबद्ध निर्णय'
                  : 'Fair, Transparent & Timely Land Acquisition'}
              </h3>

              <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                {selectedLanguage === 'HI'
                  ? 'ल्युमे (LUME) भारत सरकार के सांविधिक नियमों (RFCTLARR 2013) के तहत किसानों, नागरिकों और प्रशासनिक अधिकारियों को एक साथ लाता है। कोई बिचौलिया नहीं, कोई भ्रम नहीं।'
                  : 'LUME unites citizens, landowners, and district administrators on a single statutory platform. Designed for all generations to understand rights, track deadlines, and eliminate costly delays.'}
              </p>
            </div>

            {/* Quick 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedLanguage === 'HI' ? 'सुलभ व सरल' : 'All-Ages Usability'}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedLanguage === 'HI'
                    ? 'आवाज़ से सुनने की सुविधा, बड़े अक्षर और स्पष्ट भाषा।'
                    : 'Speech narration, scalable typography, and zero confusing legal jargon.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Scale className="w-4 h-4" />
                  <span>{selectedLanguage === 'HI' ? 'उचित मुआवज़ा' : 'Fair Compensation'}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedLanguage === 'HI'
                    ? 'धारा 26 के तहत सर्किल दर + 100% सोलेशियम की सटीक जानकारी।'
                    : 'Transparent market valuation benchmarks plus mandatory 100% solatium.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-teal-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{selectedLanguage === 'HI' ? 'समयसीमा रक्षा' : 'Statutory Clocks'}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {selectedLanguage === 'HI'
                    ? 'धारा 11 की 12 माह सीमा और एनएचएआई 336-दिवसीय घड़ियां।'
                    : 'Early warning alerts before preliminary legal notices lapse.'}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={onSkip}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors"
              >
                {selectedLanguage === 'HI' ? 'सीधे शुरू करें (Skip)' : 'Skip Setup'}
              </button>

              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <span>{selectedLanguage === 'HI' ? 'अपनी भूमिका चुनें' : 'Choose Your Role & Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Role Selection & Personalized Preferences */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">
                {selectedLanguage === 'HI' ? 'आप ल्युमे का उपयोग किस रूप में करना चाहते हैं?' : 'How would you like to use LUME?'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedLanguage === 'HI'
                  ? 'अपनी प्राथमिक भूमिका चुनें। आप बाद में कभी भी ऊपर दिए गए मेनू से इसे बदल सकते हैं।'
                  : 'Select your primary view. You can easily switch anytime from the top navigation.'}
              </p>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('CITIZEN')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRole === 'CITIZEN'
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 text-amber-300 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-white">
                  {selectedLanguage === 'HI' ? 'नागरिक / किसान' : 'Citizen & Landowner'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {selectedLanguage === 'HI'
                    ? 'अपनी भूमि का ULPIN खोजें, मुआवज़ा अधिकार देखें, आवाज़ में सुनें।'
                    : 'Lookup parcel status, listen to voice status, view fair compensation.'}
                </p>
                {selectedRole === 'CITIZEN' && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('OFFICER')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRole === 'OFFICER'
                    ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-white">
                  {selectedLanguage === 'HI' ? 'प्रशासनिक अधिकारी' : 'Acquisition Officer'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {selectedLanguage === 'HI'
                    ? 'सांविधिक घड़ियां, पूर्ववृत्त विश्लेषण, और क्या-अगर (Scenario) लैब।'
                    : 'Track statutory clocks, precedent interventions & what-if scenarios.'}
                </p>
                {selectedRole === 'OFFICER' && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('GIS')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedRole === 'GIS'
                    ? 'bg-teal-500/20 border-teal-400 ring-2 ring-teal-400/30'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center mb-2">
                  <Satellite className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-white">
                  {selectedLanguage === 'HI' ? 'जीआईएस नियोजक' : 'GIS & Infrastructure'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {selectedLanguage === 'HI'
                    ? 'धारा 10 बहु-फसली उपग्रह वर्गीकरण एवं कॉरिडोर नक्शा।'
                    : 'Sentinel-2 NDVI multi-crop protection and corridor alignments.'}
                </p>
                {selectedRole === 'GIS' && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-teal-300 bg-teal-500/30 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            </div>

            {/* Accessibility & Visual Customization */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  {selectedLanguage === 'HI' ? 'दृश्य थीम एवं सुगमता (Accessibility):' : 'Visual Theme & Accessibility:'}
                </span>
                <span className="text-[11px] text-slate-400">WCAG AAA Ready</span>
              </div>

              {/* 3 Distinct Themes */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTheme('dark');
                    setHighContrast(false);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedTheme === 'dark' && !highContrast
                      ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="text-[11px] font-bold block text-white">Dark Theme</span>
                  <span className="text-[10px] text-slate-400 block">Twilight Slate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTheme('light');
                    setHighContrast(false);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedTheme === 'light' && !highContrast
                      ? 'bg-slate-100 border-amber-600 ring-1 ring-amber-600'
                      : 'bg-slate-100/90 border-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span className="text-[11px] font-bold block text-slate-900">Light Theme</span>
                  <span className="text-[10px] text-slate-600 block">Pristine Day</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTheme('high-contrast');
                    setHighContrast(true);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    selectedTheme === 'high-contrast' || highContrast
                      ? 'bg-black border-yellow-400 ring-2 ring-yellow-400'
                      : 'bg-black border-slate-600'
                  }`}
                >
                  <Eye className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                  <span className="text-[11px] font-black block text-yellow-300">High Contrast</span>
                  <span className="text-[10px] text-yellow-200 block">Senior & Vision</span>
                </button>
              </div>

              {/* Font Size & Language Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-300 pl-1">Text Size:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedFontSize('normal')}
                      className={`px-2 py-0.5 text-xs rounded font-bold ${
                        selectedFontSize === 'normal' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFontSize('large')}
                      className={`px-2 py-0.5 text-sm rounded font-bold ${
                        selectedFontSize === 'large' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFontSize('extra-large')}
                      className={`px-2 py-0.5 text-base rounded font-bold ${
                        selectedFontSize === 'extra-large' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      A++
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-300 pl-1">Language:</span>
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('EN')}
                      className={`px-2.5 py-1 rounded font-bold ${
                        selectedLanguage === 'EN' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLanguage('HI')}
                      className={`px-2.5 py-1 rounded font-bold ${
                        selectedLanguage === 'HI' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{selectedLanguage === 'HI' ? 'पीछे' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <span>{selectedLanguage === 'HI' ? 'मुख्य विशेषताएं देखें' : 'See Key Features'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Brief Feature Highlights Tutorial */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">
                {selectedLanguage === 'HI' ? 'मुख्य कार्यप्रणाली का संक्षेप' : 'Quick Tour of Core Capabilities'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedLanguage === 'HI'
                  ? 'ल्युमे के 4 प्रमुख स्तंभ जो आपकी मदद करते हैं:'
                  : 'Click each pillar below to see how LUME empowers your workflow:'}
              </p>
            </div>

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { title: selectedLanguage === 'HI' ? '1. विलंब रोकथाम' : '1. Delay Forecasts', icon: Sparkles },
                { title: selectedLanguage === 'HI' ? '2. नागरिक जन-सेवा' : '2. Citizen Jan-Seva', icon: Users },
                { title: selectedLanguage === 'HI' ? '3. उपग्रह बहु-फसल' : '3. Satellite NDVI', icon: Satellite },
                { title: selectedLanguage === 'HI' ? '4. परिदृश्य लैब' : '4. Scenario Lab', icon: Scale }
              ].map((tab, idx) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveFeatureIdx(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      activeFeatureIdx === idx
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Feature Content Box */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
              {activeFeatureIdx === 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Machine Learning Delay Prevention (arXiv:2307.16285)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trained on 4.2 million Indian court cases and registry timelines. Flags forest clearances (PARIVESH), revenue mutation delays, and valuation gaps before RFCTLARR Section 11 (12-month SIA clock) lapses.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400">
                    Statutory Alert: Section 11 clock countdown triggers at 90 days remaining.
                  </div>
                </div>
              )}

              {activeFeatureIdx === 1 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Users className="w-4 h-4" />
                    <span>Multi-Generational Citizen Transparency Portal</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Designed for farmers and senior citizens: enter your 14-digit Bhu-Aadhaar (ULPIN) or Khasra/Gut number to view statutory status, fair compensation estimates with 100% solatium, and listen aloud via Web Speech synthesis.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300">
                    Privacy Protection: Personal bank details are never published (PRD Sec 16).
                  </div>
                </div>
              )}

              {activeFeatureIdx === 2 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                    <Satellite className="w-4 h-4" />
                    <span>Section 10 Multi-Crop Irrigated Satellite Verification</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sentinel-2 and ISRO Bhuvan multi-temporal NDVI auto-classifies parcels with dual Kharif/Rabi cropping. Prevents costly High Court acquisition quashing by mandating "last resort" certification before notification.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-teal-300">
                    Confidence threshold: &gt;0.62 NDVI across consecutive seasons flags Section 10.
                  </div>
                </div>
              )}

              {activeFeatureIdx === 3 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Scale className="w-4 h-4" />
                    <span>Monotonically Constrained Intervention Scenario Lab</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Simulate policy adjustments: test Section 26 fair compensation revisions, expedited inter-departmental clearances, and mobile Lekhpal succession camps. Monotonic curves guarantee mathematically realistic outcomes.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300">
                    Intervention Priority Index (IPI) computes ROI in carrying cost savings.
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{selectedLanguage === 'HI' ? 'पीछे' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <span>{selectedLanguage === 'HI' ? 'तैयार हैं' : 'Ready to Launch'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation & Call To Action */}
        {step === 4 && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/60 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                {selectedLanguage === 'HI' ? 'आपकी प्राथमिकताएं सुरक्षित कर ली गई हैं!' : 'You Are All Set!'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {selectedLanguage === 'HI'
                  ? `आप ${selectedRole === 'CITIZEN' ? 'नागरिक पोर्टल' : selectedRole === 'OFFICER' ? 'अधिकारी कमान केंद्र' : 'जीआईएस उपग्रह मंच'} में प्रवेश कर रहे हैं।`
                  : `Configured for ${selectedRole === 'CITIZEN' ? 'Citizen Jan-Seva' : selectedRole === 'OFFICER' ? 'Officer Intelligence' : 'GIS Satellite Planning'} in ${selectedTheme.toUpperCase()} theme.`}
              </p>
            </div>

            {/* Summary Pill */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Role</span>
                <strong className="text-amber-300 capitalize">{selectedRole}</strong>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Theme</span>
                <strong className="text-emerald-400 capitalize">{highContrast ? 'High Contrast' : selectedTheme}</strong>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Language</span>
                <strong className="text-teal-300">{selectedLanguage === 'HI' ? 'हिन्दी' : 'English'}</strong>
              </div>
            </div>

            {/* Big Launch CTA */}
            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                {selectedLanguage === 'HI' ? 'ल्युमे शुरू करें (Launch LUME)' : 'Launch LUME Platform'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
