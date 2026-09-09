import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Scale,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { AppTheme, AppView, RBACRole } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ContextRoleClarifierProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  language: 'EN' | 'HI';
  onOpenHelp: () => void;
  onOpenTutorial: () => void;
  theme: AppTheme;
  onToggleTheme: (theme: AppTheme) => void;
  activeRole: RBACRole;
  onSelectRole: (role: RBACRole) => void;
}

export const ContextRoleClarifier: React.FC<ContextRoleClarifierProps> = ({
  currentView,
  onSelectView,
  language,
  onOpenHelp,
  onOpenTutorial,
  theme,
  onToggleTheme,
  activeRole,
  onSelectRole
}) => {
  const [showPlainGuide, setShowPlainGuide] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const t = TRANSLATIONS[language];

  const roleDefinitions: Record<RBACRole, { title: string; titleHindi: string; jobQuery: string; jobQueryHindi: string }> = {
    DISTRICT_OFFICER: {
      title: 'District Acquisition Officer (CALA)',
      titleHindi: 'जिला सक्षम प्राधिकारी (CALA)',
      jobQuery: 'What deserves attention today? Ranked intervention queue & statutory clock countdowns.',
      jobQueryHindi: 'आज किन मामलों पर कार्रवाई की आवश्यकता है? प्राथमिकता कार्य सूची और समयसीमा।'
    },
    SENIOR_DEPARTMENTAL: {
      title: 'Senior Departmental Officer (MoRTH/DoLR)',
      titleHindi: 'वरिष्ठ विभागीय अधिकारी (सड़क परिवहन/DoLR)',
      jobQuery: 'Which projects threaten portfolio execution? Criticality-aware ranking & review packets.',
      jobQueryHindi: 'कौन सी परियोजनाएं समग्र पोर्टफोलियो निष्पादन को खतरे में डालती हैं? समीक्षा सारांश।'
    },
    PMU_EXECUTION: {
      title: 'Project / PMU Execution Team',
      titleHindi: 'परियोजना निष्पादन दल (PMU)',
      jobQuery: 'Where can acquisition block the wider project? Milestone risk & critical dependencies.',
      jobQueryHindi: 'भूमि अधिग्रहण कहाँ संपूर्ण परियोजना को रोक सकता है? निर्भरता विश्लेषण।'
    },
    LEGAL_GRIEVANCE: {
      title: 'Legal & Grievance Team (NJDG)',
      titleHindi: 'विधिक एवं शिकायत निवारण दल (NJDG)',
      jobQuery: 'Where is dispute-related process risk emerging? Court writ signals & precedent resolutions.',
      jobQueryHindi: 'न्यायिक विवाद कहाँ उत्पन्न हो रहे हैं? उच्च न्यायालय रिट संकेत एवं नज़ीरें।'
    },
    DATA_ADMIN: {
      title: 'Data & IT Governance Admin',
      titleHindi: 'डेटा एवं आईटी प्रशासन',
      jobQuery: 'Can the intelligence be trusted and governed? Data freshness, connectors & model audit.',
      jobQueryHindi: 'क्या डेटा और मॉडल पर भरोसा किया जा सकता है? डेटा गुणवत्ता और मॉडल ऑडिट।'
    },
    POLICY_ANALYST: {
      title: 'Program & Policy Analyst',
      titleHindi: 'कार्यक्रम एवं नीति विश्लेषक',
      jobQuery: 'Where are systemic bottlenecks repeating? Comparative analytics across routes and districts.',
      jobQueryHindi: 'व्यवस्थागत बाधाएं कहाँ दोहराई जा रही हैं? विधिक मार्गों और जिलों का तुलनात्मक अध्ययन।'
    },
    CITIZEN: {
      title: 'Landowner Citizen / Farmer',
      titleHindi: 'प्रभावित भू-स्वामी / किसान नागरिक',
      jobQuery: 'What is the official status and fair compensation for my land under Section 26?',
      jobQueryHindi: 'मेरी भूमि की आधिकारिक स्थिति और धारा 26 के तहत निष्पक्ष मुआवजा क्या है?'
    }
  };

  const viewDetails = {
    OFFICER: {
      title: language === 'HI' ? 'अधिकारी कमान केंद्र' : 'Officer Intelligence & Command Center',
      tag: language === 'HI' ? 'प्रशासनिक व निर्णय मोड' : 'Decision Mode',
      color: 'emerald',
      icon: Building2,
      summary: language === 'HI'
        ? 'राष्ट्रीय राजमार्ग एवं रेल कॉरिडोर परियोजनाओं के सांविधिक समयसीमा (धारा 11 एवं एनएचएआई 336-दिवसीय) तथा हस्तक्षेप प्रयोगशाला।'
        : 'Tactical project risk scores, statutory clock countdowns (RFCTLARR Sec 11 & NHAI 336-day clock), and precedent intervention labs.',
      alternatePrompt: language === 'HI' ? 'अपनी निजी ज़मीन या मुआवज़ा जांचने के लिए:' : 'Looking for your private land parcel or fair compensation?',
      alternateLabel: language === 'HI' ? 'नागरिक जन-सेवा पोर्टल पर जाएँ' : 'Switch to Citizen Jan-Seva',
      alternateTarget: 'CITIZEN' as AppView
    },
    CITIZEN: {
      title: language === 'HI' ? 'नागरिक जन-सेवा पारदर्शिता पोर्टल' : 'Citizen Jan-Seva Transparency Portal',
      tag: language === 'HI' ? 'किसान व भूस्वामी मोड' : 'Citizen Public Mode',
      color: 'amber',
      icon: Users,
      summary: language === 'HI'
        ? 'नागरिकों और किसानों के लिए: अपना 14-अंक भू-आधार (ULPIN) खोजें, आवाज़ में स्थिति सुनें, और धारा 26 निष्पक्ष मुआवज़ा जानें।'
        : 'Public portal for landowners and families. Enter your 14-digit Bhu-Aadhaar (ULPIN), listen to audio narration, and inspect fair compensation rights.',
      alternatePrompt: language === 'HI' ? 'प्रशासनिक या एनएचएआई अधिकारी हैं?' : 'District Officer or Highway Authority?',
      alternateLabel: language === 'HI' ? 'अधिकारी कमान केंद्र पर जाएँ' : 'Switch to Officer Intelligence',
      alternateTarget: 'OFFICER' as AppView
    },
    GIS: {
      title: language === 'HI' ? 'जीआईएस उपग्रह एवं बहु-फसली मानचित्र' : 'Satellite GIS & Section 10 Multi-Crop Intelligence',
      tag: language === 'HI' ? 'स्थानिक विश्लेषण मोड' : 'Spatial Mode',
      color: 'teal',
      icon: MapPin,
      summary: language === 'HI'
        ? 'सेंटिनल-2 एवं इसरो भुवन उपग्रह एनडीवीआई के माध्यम से बहु-फसली सिंचित भूमि का स्वतः वर्गीकरण ताकि धारा 10 का उल्लंघन न हो।'
        : 'Automated multi-temporal Sentinel-2 NDVI agriculture classification to protect irrigated multi-cropped land under RFCTLARR Section 10.',
      alternatePrompt: language === 'HI' ? 'परियोजनाओं की सूची पर लौटना है?' : 'Want to view project risk priority list?',
      alternateLabel: language === 'HI' ? 'परियोजना डैशबोर्ड' : 'Back to Portfolio',
      alternateTarget: 'OFFICER' as AppView
    },
    ANALYTICS: {
      title: language === 'HI' ? 'तुलनात्मक विश्लेषण एवं सांविधिक बेंचमार्क' : 'Comparative Analytics & Statutory Benchmarks',
      tag: language === 'HI' ? 'नीतिगत विश्लेषण मोड' : 'F18 Analytics Mode',
      color: 'teal',
      icon: BarChart3,
      summary: language === 'HI'
        ? 'विभिन्न विधिक मार्गों (RFCTLARR vs NHAI Sec 3), जिलों और प्रक्रिया चरणों में विलंब के ऐतिहासिक पैटर्न का तुलनात्मक विश्लेषण।'
        : 'Cross-route cycle times, stage-duration overshoots, and district-level litigation benchmarks anchored to MoSPI infrastructure tracking.',
      alternatePrompt: language === 'HI' ? 'कमान केंद्र पर लौटना है?' : 'Back to Project Command?',
      alternateLabel: language === 'HI' ? 'कमान केंद्र' : 'Officer Intelligence',
      alternateTarget: 'OFFICER' as AppView
    },
    TRUST_REGISTRY: {
      title: language === 'HI' ? 'मॉडल साक्ष्य एवं वैज्ञानिक विश्वसनीयता' : 'Model Grounding & Statistical Trust Registry',
      tag: language === 'HI' ? 'पारदर्शिता व ऑडिट मोड' : 'Auditable ML Grounding',
      color: 'slate',
      icon: ShieldCheck,
      summary: language === 'HI'
        ? '4.2 मिलियन भारतीय अदालती मामलों (arXiv:2307.16285) पर आधारित मॉडल का वैज्ञानिक प्रमाण एवं मोनोटोनिक संवेदनशीलता।'
        : 'Empirical model benchmarking against 4.2M judicial and infrastructure records (arXiv:2307.16285) with strict monotonic constraints.',
      alternatePrompt: language === 'HI' ? 'सक्रिय परियोजनाओं का प्रबंधन करें:' : 'Manage active corridor acquisitions:',
      alternateLabel: language === 'HI' ? 'कमान केंद्र' : 'Officer Intelligence',
      alternateTarget: 'OFFICER' as AppView
    }
  };

  const current = viewDetails[currentView];
  const Icon = current.icon;
  const currentRoleInfo = roleDefinitions[activeRole];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 space-y-2">
        {/* Row 1: View Context & Role Switcher */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Active View Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                currentView === 'CITIZEN'
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                  : currentView === 'OFFICER'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                  : currentView === 'GIS'
                  ? 'bg-teal-500/20 border-teal-400/40 text-teal-300'
                  : currentView === 'ANALYTICS'
                  ? 'bg-teal-500/20 border-teal-400/40 text-teal-300'
                  : 'bg-slate-700/50 border-slate-600 text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  {current.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentView === 'CITIZEN'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : currentView === 'OFFICER'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : currentView === 'ANALYTICS'
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  }`}
                >
                  {current.tag}
                </span>

                <button
                  onClick={() => setShowPlainGuide(!showPlainGuide)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 ml-1 underline decoration-dotted cursor-pointer"
                  title="Click to toggle plain language guide"
                >
                  <Info className="w-3 h-3 text-amber-400" />
                  <span>{language === 'HI' ? 'यह स्क्रीन क्या है?' : 'What does this screen do?'}</span>
                  {showPlainGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-1 sm:line-clamp-none">
                {current.summary}
              </p>
            </div>
          </div>

          {/* Persona Switcher & Direct Alternate */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            {/* RBAC Role Switcher (PRD Section 5) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                title="Switch Persona Role"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-slate-400">{t.activeRoleLabel}:</span>
                <span className="text-emerald-300 font-bold max-w-[140px] truncate">
                  {language === 'HI' ? currentRoleInfo.titleHindi : currentRoleInfo.title}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    {language === 'HI' ? 'उपयोगकर्ता भूमिका चुनें (PRD Section 5)' : 'Select User Role (PRD Section 5)'}
                  </div>
                  {(Object.keys(roleDefinitions) as RBACRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onSelectRole(r);
                        setShowRoleMenu(false);
                        if (r === 'CITIZEN') {
                          onSelectView('CITIZEN');
                        } else if (r === 'POLICY_ANALYST') {
                          onSelectView('ANALYTICS');
                        } else if (r === 'DATA_ADMIN') {
                          onSelectView('TRUST_REGISTRY');
                        } else {
                          onSelectView('OFFICER');
                        }
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex flex-col ${
                        activeRole === r ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{language === 'HI' ? roleDefinitions[r].titleHindi : roleDefinitions[r].title}</span>
                      <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">
                        {language === 'HI' ? roleDefinitions[r].jobQueryHindi : roleDefinitions[r].jobQuery}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Switch to Alternate Persona */}
            <button
              onClick={() => onSelectView(current.alternateTarget)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm cursor-pointer"
              title={`Switch directly to ${current.alternateLabel}`}
            >
              <span className="hidden sm:inline text-slate-400 font-normal text-[11px]">
                {current.alternatePrompt}
              </span>
              <span className="text-amber-300 font-bold">{current.alternateLabel}</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Row 2: Role Focus Sub-bar */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Scale className="w-3 h-3" />
              <span>{language === 'HI' ? 'भूमिका फोकस:' : 'Persona Objective:'}</span>
            </span>
            <span className="text-slate-200">
              {language === 'HI' ? currentRoleInfo.jobQueryHindi : currentRoleInfo.jobQuery}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTutorial}
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.tourBtn}</span>
            </button>
            <span>•</span>
            <button
              onClick={onOpenHelp}
              className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{t.helpDeskBtn}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Plain Language Explainer Box */}
        {showPlainGuide && (
          <div className="p-4 bg-slate-950/90 border border-amber-500/30 rounded-2xl text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {language === 'HI' ? 'सरल भाषा में समझें (Plain Language Guide)' : 'Understanding This Screen in Plain Language'}
              </span>
              <button
                onClick={() => setShowPlainGuide(false)}
                className="text-slate-400 hover:text-white text-[11px] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 pt-1">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">1. Statutory Clock Tracker</strong>
                <p className="text-[11px] text-slate-400">
                  Monitors statutory limits: RFCTLARR Section 11 notice (must publish declaration within 12 months) and NHAI 336-day clock so preliminary notices do not lapse.
                </p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">2. Delay Forecasting (SHAP)</strong>
                <p className="text-[11px] text-slate-400">
                  Instead of guessing, the ML model pinpoints the exact driver: e.g. forest clearance under PARIVESH, joint family succession, or a 36% valuation gap.
                </p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <strong className="text-white block mb-1">3. Citizen Voice & Solatium</strong>
                <p className="text-[11px] text-slate-400">
                  Landowners can hear status aloud in Hindi/English, inspect Section 26 fair compensation with 100% solatium, and file objections with 48-hr SLA.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
