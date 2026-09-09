import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  Filter,
  ShieldAlert,
  Satellite,
  Scale
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export interface SystemAlertItem {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  type: 'RISK_CROSSING' | 'MILESTONE_WINDOW' | 'INACTIVITY_GAP' | 'EVIDENCE_CHANGE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  timestamp: string;
  acknowledged: boolean;
}

const INITIAL_ALERTS: SystemAlertItem[] = [
  {
    id: 'alt-1',
    projectId: 'proj-nh48-pune-satara',
    projectCode: 'NHAI/MH/2025/NH48-EXP-04',
    projectTitle: 'NH-48 Pune-Satara 8-Laning Corridor Extension',
    type: 'RISK_CROSSING',
    severity: 'CRITICAL',
    title: 'Stage Delay Risk Escalated to 84% (+12% this week)',
    titleHindi: 'चरण विलंब जोखिम बढ़कर 84% हुआ (+12% इस सप्ताह)',
    description: 'High Court Writ Petition 4812/2025 by Khandala Farmers Samiti without rejoinder for 48 days triggered model escalation.',
    descriptionHindi: 'खंडाला किसान समिति द्वारा दायर उच्च न्यायालय रिट याचिका 4812/2025 पर 48 दिनों से कोई जवाब न दिए जाने से जोखिम बढ़ा।',
    timestamp: '2 hours ago',
    acknowledged: false
  },
  {
    id: 'alt-2',
    projectId: 'proj-nh48-pune-satara',
    projectCode: 'NHAI/MH/2025/NH48-EXP-04',
    projectTitle: 'NH-48 Pune-Satara 8-Laning Corridor Extension',
    type: 'MILESTONE_WINDOW',
    severity: 'CRITICAL',
    title: 'Statutory 336-Day NHAI Clock Window Approaching: 52 Days Left',
    titleHindi: 'एनएचएआई 336-दिवसीय सांविधिक समयसीमा नजदीक: केवल 52 दिन शेष',
    description: 'Section 3G Valuation award must be finalized before October 28, 2026 to prevent statutory lapse.',
    descriptionHindi: 'धारा 3G मूल्यांकन निर्णय 28 अक्टूबर 2026 से पूर्व अंतिम रूप दिया जाना अनिवार्य है।',
    timestamp: '5 hours ago',
    acknowledged: false
  },
  {
    id: 'alt-3',
    projectId: 'proj-dfc-dadri-rewari',
    projectCode: 'DFCCIL/WDFC/HR-2025/REV-02',
    projectTitle: 'Western Dedicated Freight Corridor (Dadri-Rewari Feeder)',
    type: 'MILESTONE_WINDOW',
    severity: 'CRITICAL',
    title: 'RFCTLARR Section 11 Preliminary Notification Clock: 48 Days to Lapse',
    titleHindi: 'आरएफसीटीएलएआरआर धारा 11 प्रारंभिक अधिसूचना: 48 दिन में व्यपगत (Lapse) का खतरा',
    description: 'Statutory 12-month limit from SIA Expert Group appraisal is expiring. If notification is not gazetted, SIA must be repeated.',
    descriptionHindi: 'एसआईए विशेषज्ञ समूह मूल्यांकन के 12 महीने पूरे हो रहे हैं। यदि अधिसूचना जारी नहीं हुई तो एसआईए प्रक्रिया दोबारा करनी होगी।',
    timestamp: '1 day ago',
    acknowledged: false
  },
  {
    id: 'alt-4',
    projectId: 'proj-seci-solar-jodhpur',
    projectCode: 'SECI/RJ/2025/SOLAR-PH4',
    projectTitle: 'Bhadla-Phalodi Mega Solar Ultra-Park Transmission Corridor',
    type: 'INACTIVITY_GAP',
    severity: 'WARNING',
    title: 'Inactivity Gap: No Revenue Mutations Recorded for 64 Days in Phalodi',
    titleHindi: 'निष्क्रियता अंतराल: फलौदी तहसील में 64 दिनों से कोई राजस्व नामांतरण दर्ज नहीं',
    description: 'LACRRIS portal synchronization shows stalling in common village grazing land (Gochar) title determination.',
    descriptionHindi: 'लाक्रिस (LACRRIS) पोर्टल सिंक्रोनाइज़ेशन दर्शाता है कि गौचर भूमि के वर्गीकरण में कोई प्रगति नहीं हुई है।',
    timestamp: '2 days ago',
    acknowledged: false
  },
  {
    id: 'alt-5',
    projectId: 'proj-bmrcl-phase3-sarjapur',
    projectCode: 'BMRCL/PH3/2025/ORR-SARJ',
    projectTitle: 'Namma Metro Phase 3 Sarjapur-Hebbal Radial Transit Line',
    type: 'EVIDENCE_CHANGE',
    severity: 'INFO',
    title: 'Evidence Health Update: Sentinel-2 NDVI Post-Monsoon Imagery Cleared',
    titleHindi: 'साक्ष्य स्वास्थ्य अद्यतन: मानसून पश्चात सेंटिनल-2 उपग्रह दृश्य स्पष्ट हुआ',
    description: 'Monsoon cloud cover cleared; multi-crop classification confirmed at 88% confidence for Sarjapur urban fringe.',
    descriptionHindi: 'बादल साफ होने के बाद बहु-फसली वर्गीकरण 88% सटीकता के साथ सत्यापित हुआ।',
    timestamp: '3 days ago',
    acknowledged: true
  }
];

interface AlertsFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | 'HI';
  onSelectProject: (projectId: string) => void;
}

export const AlertsFeedDrawer: React.FC<AlertsFeedDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onSelectProject
}) => {
  const [alerts, setAlerts] = useState<SystemAlertItem[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {language === 'HI' ? 'सांविधिक अलर्ट एवं परिवर्तन फ़ीड (F11)' : 'Statutory Alerts & Change Feed (F11)'}
                </h3>
                {unacknowledgedCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unacknowledgedCount} {language === 'HI' ? 'नए' : 'new'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'HI' ? 'समयसीमा, जोखिम सीमा और साक्ष्य परिवर्तनों की वास्तविक समय ट्रैकिंग' : 'Real-time tracking of statutory deadlines and evidence shifts'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Filter Tabs */}
        <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-1">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterSeverity === sev ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev === 'ALL' ? (language === 'HI' ? 'सभी' : 'All') :
                 sev === 'CRITICAL' ? (language === 'HI' ? 'अति-गंभीर' : 'Critical') :
                 sev === 'WARNING' ? (language === 'HI' ? 'चेतावनी' : 'Warning') :
                 (language === 'HI' ? 'सूचना' : 'Info')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })))}
            className="text-[11px] text-emerald-400 hover:underline"
          >
            {language === 'HI' ? 'सभी स्वीकारें' : 'Acknowledge All'}
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {language === 'HI' ? 'कोई नया अलर्ट नहीं है' : 'No alerts in this category'}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className={`border rounded-2xl p-4 transition-all ${
                    alert.acknowledged ? 'bg-slate-900/40 border-slate-800 opacity-80' :
                    isCritical ? 'bg-rose-950/20 border-rose-500/40 shadow-sm' :
                    isWarning ? 'bg-amber-950/20 border-amber-500/40' :
                    'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                        isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        isWarning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      }`}>
                        {alert.type === 'RISK_CROSSING' ? <AlertTriangle className="w-4 h-4" /> :
                         alert.type === 'MILESTONE_WINDOW' ? <Clock className="w-4 h-4" /> :
                         alert.type === 'INACTIVITY_GAP' ? <Activity className="w-4 h-4" /> :
                         <Satellite className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                            {alert.projectCode}
                          </span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                          {language === 'HI' ? alert.titleHindi : alert.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {language === 'HI' ? alert.descriptionHindi : alert.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.acknowledgeBtn}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'HI' ? 'स्वीकृत' : 'Acknowledged'}</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProject(alert.projectId);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{t.investigateBtn}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
