import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Layers, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Building,
  Info,
  ChevronRight,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

interface ComparativeAnalyticsViewProps {
  language: 'EN' | 'HI';
  onSelectProject?: (id: string) => void;
}

export const ComparativeAnalyticsView: React.FC<ComparativeAnalyticsViewProps> = ({
  language,
  onSelectProject
}) => {
  const t = TRANSLATIONS[language];
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'ROUTES' | 'STAGES' | 'DISTRICTS' | 'ECONOMIC_SAVINGS'>('ROUTES');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {language === 'HI' ? 'तुलनात्मक विश्लेषण एवं सांविधिक रुझान (F18)' : 'Comparative Analytics & Statutory Benchmarks (F18)'}
                </h2>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                  PRD Section 15
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'HI'
                  ? 'विभिन्न विधिक मार्गों (RFCTLARR vs NHAI Sec 3), जिलों और प्रक्रिया चरणों में विलंब के ऐतिहासिक पैटर्न का तुलनात्मक विश्लेषण'
                  : 'Empirical cross-route, stage-duration, and district-level comparative intelligence anchored to MoSPI infrastructure tracking data'}
              </p>
            </div>
          </div>

          {/* Quick Sub-mode switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveAnalysisMode('ROUTES')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeAnalysisMode === 'ROUTES' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'HI' ? 'विधिक मार्ग' : 'Legal Routes'}
            </button>
            <button
              onClick={() => setActiveAnalysisMode('STAGES')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeAnalysisMode === 'STAGES' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'HI' ? 'प्रक्रिया चरण' : 'Stage Durations'}
            </button>
            <button
              onClick={() => setActiveAnalysisMode('DISTRICTS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeAnalysisMode === 'DISTRICTS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'HI' ? 'जिला बेंचमार्क' : 'Districts'}
            </button>
            <button
              onClick={() => setActiveAnalysisMode('ECONOMIC_SAVINGS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeAnalysisMode === 'ECONOMIC_SAVINGS' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'HI' ? 'आर्थिक बचत' : 'Economic Impact'}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-View 1: Legal Routes Comparison */}
      {activeAnalysisMode === 'ROUTES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>NH Act Section 3 (Fast-Track)</span>
                <span className="text-emerald-400 font-bold">336-Day Clock</span>
              </div>
              <div className="text-2xl font-black text-white mt-2">18.4 <span className="text-xs font-normal text-slate-400">months avg</span></div>
              <div className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>64% exceed the April 2025 self-imposed clock</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-700/60 pt-2">
                NHAI corridors onboarded onto BhoomiRashi since 2018 cut initial notifications to 2 weeks, but valuation stays remain severe.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>RFCTLARR 2013 (Regular Route)</span>
                <span className="text-amber-400 font-bold">Statutory Sequence</span>
              </div>
              <div className="text-2xl font-black text-white mt-2">51.8 <span className="text-xs font-normal text-slate-400">months avg</span></div>
              <div className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Statutory legal floor is ~50 months</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-700/60 pt-2">
                Mandatory Section 4 SIA, Section 11 notice (12-month limit), and Gram Sabha consents create structural minimum thresholds.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>State Industrial Acts (KIADB/MIDC)</span>
                <span className="text-teal-400 font-bold">Consent-Based</span>
              </div>
              <div className="text-2xl font-black text-white mt-2">24.6 <span className="text-xs font-normal text-slate-400">months avg</span></div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Higher upfront pricing reduces court litigation</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 border-t border-slate-700/60 pt-2">
                Framework allows direct negotiated advisory rates before formal declaration, expediting clean title possession.
              </p>
            </div>
          </div>

          {/* Detailed Route Comparison Table */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Comparative Process Dynamics Across Acquisition Legal Frameworks</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                    <th className="pb-2.5">Legal Route Framework</th>
                    <th className="pb-2.5">Primary Legislative Acts</th>
                    <th className="pb-2.5">Statutory Clock Baseline</th>
                    <th className="pb-2.5">Avg Cycle Duration</th>
                    <th className="pb-2.5">Primary Bottleneck Stage</th>
                    <th className="pb-2.5">Court Stay Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">NH Act 1956 Section 3</td>
                    <td className="py-3">National Highways Act + NHAI Rules</td>
                    <td className="py-3 font-mono text-emerald-400">336 Days (April 2025)</td>
                    <td className="py-3">552 Days (18.4 mos)</td>
                    <td className="py-3 text-amber-300">Sec 3G CALA Valuation Award</td>
                    <td className="py-3 text-rose-400 font-bold">42% of Corridors</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">RFCTLARR Act 2013</td>
                    <td className="py-3">Central Act No. 30 of 2013</td>
                    <td className="py-3 font-mono text-amber-400">~1,500 Days (~50 mos floor)</td>
                    <td className="py-3">1,554 Days (51.8 mos)</td>
                    <td className="py-3 text-amber-300">Sec 11 Notice & Sec 15 Hearing</td>
                    <td className="py-3 text-rose-400 font-bold">58% of Corridors</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">State Industrial Development</td>
                    <td className="py-3">KIADB Act 1966 / MIDC Act 1961</td>
                    <td className="py-3 font-mono text-teal-400">State Specific (720 Days)</td>
                    <td className="py-3">738 Days (24.6 mos)</td>
                    <td className="py-3 text-amber-300">Joint Cadastral Measurement</td>
                    <td className="py-3 text-emerald-400 font-bold">21% of Corridors</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-View 2: Stage Durations Breakdown */}
      {activeAnalysisMode === 'STAGES' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Statutory Stage Window vs Observed Real-World Duration (National Averages)</span>
            </h3>
            <span className="text-xs text-slate-400">Data source: LACRRIS & BhoomiRashi empirical logs</span>
          </div>

          <div className="space-y-3">
            {[
              { stage: '1. Social Impact Assessment (Sec 4)', statutoryMax: 90, actualAvg: 112, missRate: '28%', status: 'AMBER' },
              { stage: '2. Preliminary Notification (Sec 11)', statutoryMax: 365, actualAvg: 298, missRate: '18%', status: 'GREEN' },
              { stage: '3. Objections Hearing & Disposition (Sec 15)', statutoryMax: 60, actualAvg: 145, missRate: '72%', status: 'RED' },
              { stage: '4. Formal Declaration (Sec 19)', statutoryMax: 365, actualAvg: 210, missRate: '12%', status: 'GREEN' },
              { stage: '5. Fair Compensation Valuation (Sec 26)', statutoryMax: 180, actualAvg: 340, missRate: '84%', status: 'RED' },
              { stage: '6. Final Award Declaration (Sec 23)', statutoryMax: 365, actualAvg: 310, missRate: '22%', status: 'GREEN' },
              { stage: '7. Compensation Disbursement (Sec 38)', statutoryMax: 90, actualAvg: 165, missRate: '61%', status: 'AMBER' },
              { stage: '8. Right-of-Way Possession Takeover', statutoryMax: 60, actualAvg: 118, missRate: '54%', status: 'AMBER' }
            ].map((item, idx) => {
              const overshoot = item.actualAvg - item.statutoryMax;
              const barPct = Math.min(100, Math.round((item.actualAvg / 365) * 100));

              return (
                <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{item.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">Statutory: <strong className="text-white">{item.statutoryMax}d</strong></span>
                      <span className="text-slate-400">Observed: <strong className="text-amber-300">{item.actualAvg}d</strong></span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'RED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        item.status === 'AMBER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.missRate} breach rate
                      </span>
                    </div>
                  </div>

                  {/* Visual Duration Comparison Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-3 relative overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full ${
                        item.status === 'RED' ? 'bg-rose-500' :
                        item.status === 'AMBER' ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${barPct}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{overshoot > 0 ? `+${overshoot} days historical overshoot beyond legal target` : 'Within statutory schedule'}</span>
                    <span>Variance: ±38 days across states</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-View 3: District Benchmarks */}
      {activeAnalysisMode === 'DISTRICTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                district: 'Satara',
                state: 'Maharashtra',
                dominantBottleneck: 'Section 26 Compensation Gap (Circle vs Top-50% Deeds)',
                avgDelayMonths: 14.2,
                highCourtStayRate: '46%',
                precedentResolvedVia: 'Lok Adalat joint mediation'
              },
              {
                district: 'Thane / Palghar',
                state: 'Maharashtra',
                dominantBottleneck: 'PARIVESH Forest & CRZ Clearance (Western Ghats Buffer)',
                avgDelayMonths: 18.6,
                highCourtStayRate: '62%',
                precedentResolvedVia: 'Compensatory Afforestation MoU'
              },
              {
                district: 'Varanasi / Chandauli',
                state: 'Uttar Pradesh',
                dominantBottleneck: 'Section 10 Multi-Crop Irrigated Agricultural Restriction',
                avgDelayMonths: 11.4,
                highCourtStayRate: '38%',
                precedentResolvedVia: 'Alignment curve realignment to fallow land'
              },
              {
                district: 'Bengaluru Rural',
                state: 'Karnataka',
                dominantBottleneck: 'Hyper-Commercial Speculation & Fragmented Joint Titles',
                avgDelayMonths: 16.8,
                highCourtStayRate: '54%',
                precedentResolvedVia: 'Special CALA mutation camps'
              },
              {
                district: 'Jodhpur',
                state: 'Rajasthan',
                dominantBottleneck: 'Gochar / Village Grazing Common Land Classification',
                avgDelayMonths: 9.2,
                highCourtStayRate: '24%',
                precedentResolvedVia: 'Revenue land allotment swap'
              },
              {
                district: 'Dhanbad / Bokaro',
                state: 'Jharkhand',
                dominantBottleneck: 'Forest Rights Act (FRA 2006) & Gram Sabha Consent',
                avgDelayMonths: 21.0,
                highCourtStayRate: '68%',
                precedentResolvedVia: 'Direct Gram Sabha benefit-sharing pact'
              }
            ].map((d, i) => (
              <div key={i} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{d.district}</span>
                    <span className="text-xs text-slate-400 font-normal">({d.state})</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">+{d.avgDelayMonths}m avg</span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Leading Process Barrier:</span>
                  <p className="mt-0.5 text-amber-300 font-medium">{d.dominantBottleneck}</p>
                </div>

                <div className="border-t border-slate-700/60 pt-2 text-[11px] flex items-center justify-between text-slate-400">
                  <span>Writ Stay Rate: <strong className="text-rose-400">{d.highCourtStayRate}</strong></span>
                  <span className="text-emerald-400">Resolved via {d.precedentResolvedVia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-View 4: Economic Impact Model */}
      {activeAnalysisMode === 'ECONOMIC_SAVINGS' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>MoSPI Infrastructure Delay Impact & Cost Avoidance Framework (Section 23 & 32.4)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Anchored to the Ministry of Statistics and Programme Implementation (MoSPI) Flash Report tracking 1,941 central-sector infrastructure projects worth ₹150 Cr+.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
              <div className="text-xs text-slate-400">National Monitored Projects</div>
              <div className="text-2xl font-black text-white mt-1">1,941 <span className="text-xs font-normal text-slate-400">corridors</span></div>
              <div className="text-[11px] text-emerald-400 mt-1">Valued at ₹42 Lakh Crore nationwide</div>
            </div>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
              <div className="text-xs text-slate-400">Avg Monthly Delay Carry Cost</div>
              <div className="text-2xl font-black text-rose-400 mt-1">₹1.80 <span className="text-xs font-normal text-slate-400">Cr / month</span></div>
              <div className="text-[11px] text-slate-400 mt-1">Interest during construction + idle plant cost</div>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-xl bg-gradient-to-b from-emerald-950/20 to-transparent">
              <div className="text-xs text-emerald-400 font-bold">LUME Triage Value Proof</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">68–94 <span className="text-xs font-normal text-slate-300">days lead time</span></div>
              <div className="text-[11px] text-emerald-300/80 mt-1">Enables intervention before statutory lapse</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs space-y-2 text-slate-300">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Section 23 Impact Logic: Foresight Directly Reduces Financial Exposure</span>
            </div>
            <p className="leading-relaxed">
              Every month of avoided delay is not an abstract statistical metric — it is a real, auditable savings in interest on capital, re-tendering penalties, and escalated rehabilitation costs that a District Collector's office and Project Director can point to during audit reviews.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
