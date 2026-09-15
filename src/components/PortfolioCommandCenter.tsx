import React, { useState, useMemo } from 'react';
import { LandAcquisitionProject, ActionQueueItem, PortfolioHealthMetrics, QueueExplanation, AttentionBudget, DataMode } from '../types';
import { buildActionQueue, calculatePortfolioHealth } from '../services/dataPipeline';
import { buildActionQueueV8 } from '../services/actionQueueV8';
import { MOCK_DECISION_LOGS } from '../data/mockData';
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight,
  Layers,
  Scale,
  AlertCircle,
  MapPin,
  Sliders,
  Target,
  Zap,
  Activity,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  ShieldCheck,
  TrendingDown,
  Info,
  Brain,
  ChevronDown,
  Upload,
} from 'lucide-react';

interface PortfolioCommandCenterProps {
  projects: LandAcquisitionProject[];
  onSelectProject: (projectId: string) => void;
  onOpenGIS: () => void;
  language: 'EN' | 'HI';
  onOpenIPIModal?: () => void;
  dataMode?: DataMode;
  onOpenImport?: () => void;
}

export const PortfolioCommandCenter: React.FC<PortfolioCommandCenterProps> = ({
  projects,
  onSelectProject,
  onOpenGIS,
  language,
  onOpenIPIModal,
  dataMode = 'DEMO',
  onOpenImport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [showDataHealth, setShowDataHealth] = useState(false);
  const [attentionBudget, setAttentionBudget] = useState<number>(10);
  const [showQueueExplanation, setShowQueueExplanation] = useState<string | null>(null);

  const { queue: fullQueue } = useMemo(() => buildActionQueueV8(projects, MOCK_DECISION_LOGS, 999), [projects]);
  const { queue: selectedQueue, explanations, budget } = useMemo(
    () => buildActionQueueV8(projects, MOCK_DECISION_LOGS, attentionBudget),
    [projects, attentionBudget]
  );
  const portfolioHealth = useMemo(() => calculatePortfolioHealth(projects, fullQueue, MOCK_DECISION_LOGS), [projects, fullQueue]);

  const filteredQueue = selectedQueue.filter(item => {
    const matchesSearch =
      item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const totalBudgetCr = projects.reduce((sum, p) => sum + p.estimatedBudgetCr, 0);
  const totalLandowners = projects.reduce((sum, p) => sum + p.affectedLandownersCount, 0);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/40';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OVERDUE': return 'bg-rose-600 text-white animate-pulse';
      case 'ASSIGNED': return 'bg-amber-500/20 text-amber-300';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-300';
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-300';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getRiskGauge = (riskPct: number) => {
    if (riskPct >= 70) return { class: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-600/50', label: 'CRITICAL' };
    if (riskPct >= 30) return { class: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-600/50', label: 'HIGH' };
    if (riskPct >= 15) return { class: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-600/50', label: 'MODERATE' };
    return { class: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-600/50', label: 'ON TRACK' };
  };

  return (
    <div className="space-y-6">
      {/* V8: Control Tower Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-800 to-emerald-500/15 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === 'HI' ? 'अधिग्रहण नियंत्रण टॉवर' : 'Acquisition Control Tower'}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  V9
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  dataMode === 'DEMO'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {dataMode === 'DEMO' ? 'DEMO MODE' : 'REAL DATA'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-4xl leading-relaxed">
                {language === 'HI'
                  ? 'ल्यूमे अब बताता है कि कहां ध्यान देना है, न कि केवल क्या मौजूद है। प्राथमिकता स्कोर = तत्कालता x महत्वपूर्णता x कार्यान्वयनीयता।'
                  : 'LUME now tells officers where attention is needed, not just what exists. Priority scored by urgency x criticality x actionability. Every decision has a next-best investigation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {dataMode === 'REAL_DATA' && onOpenImport && (
              <button
                onClick={onOpenImport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{language === 'HI' ? 'डेटा आयात' : 'Import Data'}</span>
              </button>
            )}
            <button
              onClick={() => setShowDataHealth(!showDataHealth)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-xl shadow-sm transition-colors cursor-pointer ${
                showDataHealth
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'डेटा स्वास्थ्य' : 'Data Health'}</span>
            </button>
            {onOpenIPIModal && (
              <button
                onClick={onOpenIPIModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'HI' ? 'आईपीआई भार' : 'IPI Weights'}</span>
              </button>
            )}
            <button
              onClick={onOpenGIS}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'मानचित्र' : 'GIS Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* V7: Portfolio Health Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'सक्रिय परियोजनाएं' : 'Active Portfolios'}</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{portfolioHealth.totalProjects}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">1,941 central base</span> tracked
          </div>
        </div>

        <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-rose-950/20 to-transparent">
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
            <span>{language === 'HI' ? 'अति-जोखिम' : 'Critical Risk'}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-2">
            {portfolioHealth.criticalRiskCount}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {portfolioHealth.totalProjects}</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">Delay probability &gt; 70%</div>
        </div>

        <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-amber-950/20 to-transparent">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>{language === 'HI' ? 'बैकलॉग कार्य' : 'Action Backlog'}</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">
            {portfolioHealth.actionQueueBacklog}
            <span className="text-xs font-normal text-slate-400 ml-1.5">open</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            {portfolioHealth.overdueActions} overdue
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'प्रभावित परिवार' : 'Affected Families'}</span>
            <Scale className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{totalLandowners.toLocaleString()}</div>
          <div className="text-[11px] text-teal-400 mt-1">Direct DBT entitlement</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'निगरानी मूल्य' : 'Monitored Value'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            ₹{totalBudgetCr.toLocaleString()} <span className="text-xs font-normal text-slate-400">Cr</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">MoSPI Flash aligned</div>
        </div>
      </div>

      {/* V7: Data Health Panel (collapsible) */}
      {showDataHealth && (
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              {language === 'HI' ? 'डेटा पासपोर्ट स्वास्थ्य स्क्रीन' : 'Data Passport Health Screen'}
            </h3>
            <button
              onClick={() => setShowDataHealth(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'BhoomiRashi Portal', tier: 'B', records: 1847, fresh: '2h', errors: 3, reliability: 'VERIFIED' },
              { name: 'NGDRS Deeds', tier: 'B', records: 42891, fresh: '6h', errors: 12, reliability: 'VERIFIED' },
              { name: 'PARIVESH Clearances', tier: 'B', records: 2341, fresh: '1h', errors: 0, reliability: 'VERIFIED' },
              { name: 'NJDG/eCourts', tier: 'B', records: 15623, fresh: '4h', errors: 8, reliability: 'VERIFIED' },
              { name: 'DILRMP Land Records', tier: 'B', records: 128453, fresh: '12h', errors: 45, reliability: 'VERIFIED' },
              { name: 'Sentinel-2 NDVI', tier: 'C', records: 5, fresh: '3d', errors: 0, reliability: 'VERIFIED' },
            ].map(source => (
              <div key={source.name} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{source.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    source.reliability === 'VERIFIED' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    Tier {source.tier}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                  <div>Records: <span className="text-slate-200">{source.records.toLocaleString()}</span></div>
                  <div>Fresh: <span className="text-slate-200">{source.fresh}</span></div>
                  <div>Errors: <span className={source.errors > 0 ? 'text-amber-400' : 'text-emerald-400'}>{source.errors}</span></div>
                  <div>Status: <span className="text-emerald-400">SYNCED</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
            <strong className="text-slate-300">Pipeline Health:</strong> Last full refresh completed 2h ago. Evidence freshness score: {Math.round(portfolioHealth.dataFreshnessScore * 100)}%. Model coverage: {Math.round(portfolioHealth.modelCoverageScore * 100)}%.
          </div>
        </div>
      )}

      {/* V8: Attention Budget Selector */}
      <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {language === 'HI' ? 'ध्यान बजट' : 'Attention Budget'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'HI'
                ? `आज आप ${budget.selectedCases} मामलों पर ध्यान दे सकते हैं`
                : `${budget.selectedCases} cases selected for today's attention`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">
              {language === 'HI' ? 'सीमा:' : 'Budget:'}
            </span>
            {[5, 10, 20].map(limit => (
              <button
                key={limit}
                onClick={() => setAttentionBudget(limit)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  attentionBudget === limit
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {limit}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
            <div className="text-slate-400 text-[10px]">{language === 'HI' ? 'कुल मामले' : 'Total Cases'}</div>
            <div className="text-white font-bold">{budget.totalCases}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
            <div className="text-slate-400 text-[10px]">{language === 'HI' ? 'चयनित' : 'Selected'}</div>
            <div className="text-emerald-400 font-bold">{budget.selectedCases}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-center">
            <div className="text-slate-400 text-[10px]">{language === 'HI' ? 'बहिष्कृत' : 'Excluded'}</div>
            <div className="text-amber-400 font-bold">{budget.totalCases - budget.selectedCases}</div>
          </div>
        </div>
      </div>

      {/* V8: Filter & Search Bar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'HI' ? 'कार्य सूची खोजें...' : 'Search action queue by project, code, authority, district...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-300">
            <span className="text-slate-500 text-[11px]">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* V8: Action Queue List - Sorted by IPI Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Action Queue - {filteredQueue.length} items ranked by IPI Score (Evidence-Weighted)
          </span>
          <span className="font-mono text-[11px]">Urgency x Criticality x Actionability</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredQueue.map((item) => {
            const riskPct = Math.round(item.urgencyScore);
            const riskGauge = getRiskGauge(100 - item.daysToMilestone);
            const daysLeft = item.daysToMilestone;
            const isClockCritical = daysLeft <= 60;
            const explanation = explanations.find(e => e.projectId === item.projectId);
            const isExplanationOpen = showQueueExplanation === item.projectId;
            const rank = explanations.find(e => e.projectId === item.projectId)?.rank || 0;

            return (
              <div
                key={item.id}
                className={`group bg-slate-800/90 hover:bg-slate-800 border rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/40 ${
                  item.status === 'OVERDUE'
                    ? 'border-rose-500/50 hover:border-rose-400/60'
                    : item.priority === 'CRITICAL'
                    ? 'border-rose-500/30 hover:border-rose-400/50'
                    : 'border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Project Info + What Changed */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Rank Badge */}
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {rank}
                      </span>
                      {/* Priority Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(item.priority)}`}>
                        {item.priority === 'CRITICAL' && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />}
                        {item.priority}
                      </span>
                      {/* IPI Score */}
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                        IPI: {item.ipiScore}
                      </span>
                      {/* Status */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusStyle(item.status)}`}>
                        {item.status === 'OVERDUE' && <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />}
                        {item.status.replace('_', ' ')}
                      </span>
                      {/* Project Code */}
                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        {item.projectCode}
                      </span>
                      {/* Legal Route */}
                      <span className="text-[10px] text-slate-400">{item.authority}</span>
                      <span className="text-[10px] text-slate-400">{item.district}, {item.state}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {item.projectTitle}
                    </h3>

                    {/* V8: What Changed? */}
                    <div className="flex items-center gap-2 text-xs">
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-slate-400">Next:</span>
                      <span className="text-slate-200 font-medium">{item.nextMilestone}</span>
                      <span className="text-slate-400">•</span>
                      <span className={`font-semibold ${isClockCritical ? 'text-rose-400' : 'text-slate-200'}`}>
                        {item.daysToMilestone}d horizon
                      </span>
                    </div>

                    {/* Top Driver */}
                    <div className="text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-lg px-2.5 py-1 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item.topDriver}</span>
                    </div>

                    {/* Recommended Action */}
                    <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded-lg px-2.5 py-1 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium">{item.recommendedAction}</span>
                    </div>

                    {/* V8: Why is this #N? Toggle */}
                    {explanation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQueueExplanation(isExplanationOpen ? null : item.projectId);
                        }}
                        className="flex items-center gap-1.5 text-[10px] text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                      >
                        <Brain className="w-3 h-3" />
                        Why is this #{rank}?
                        <ChevronDown className={`w-3 h-3 transition-transform ${isExplanationOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Right: Scores & Action */}
                  <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/80 pt-3 lg:pt-0 lg:pl-5 w-full lg:w-auto justify-between lg:justify-end">
                    {/* Risk Gauge */}
                    <div className={`p-3 rounded-xl border text-center min-w-[100px] ${riskGauge.bg}`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">Risk</div>
                      <div className={`text-2xl font-black mt-0.5 ${riskGauge.class}`}>
                        {riskGauge.label}
                      </div>
                    </div>

                    {/* Owner & Due */}
                    <div className="text-right space-y-1">
                      <div className="text-[10px] text-slate-400">Owner</div>
                      <div className="text-xs font-semibold text-white max-w-[140px] truncate">{item.owner}</div>
                      <div className="text-[10px] text-slate-400">Due: {item.dueDate}</div>
                      {item.escalationLevel > 1 && (
                        <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1 justify-end">
                          <ArrowUpRight className="w-3 h-3" />
                          ESCALATED
                        </div>
                      )}
                    </div>

                    {/* Drill-down Arrow */}
                    <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-emerald-600 text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* V8: Queue Explanation Panel */}
                {isExplanationOpen && explanation && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">
                          Why is this #{explanation.rank}?
                        </span>
                      </div>
                      <button
                        onClick={() => setShowQueueExplanation(null)}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-400">IPI Score</div>
                        <div className="text-lg font-bold text-amber-400">{explanation.ipiScore}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-400">Urgency</div>
                        <div className="text-lg font-bold text-white">{explanation.contributions.urgency}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-400">Criticality</div>
                        <div className="text-lg font-bold text-white">{explanation.contributions.criticality}</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-400">Actionability</div>
                        <div className="text-lg font-bold text-white">{explanation.contributions.actionability}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-2.5">
                        <span className="text-blue-400 font-semibold">Primary reason: </span>
                        <span className="text-slate-200">{explanation.primaryReason}</span>
                      </div>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5">
                        <span className="text-slate-400 font-semibold">Secondary reason: </span>
                        <span className="text-slate-200">{explanation.secondaryReason}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Downstream impact: <strong className="text-white">{explanation.downstreamImpact}</strong></span>
                        <span>Evidence: <strong className={`${
                          explanation.evidenceQuality === 'GREEN' ? 'text-emerald-400' :
                          explanation.evidenceQuality === 'AMBER' ? 'text-amber-400' : 'text-rose-400'
                        }`}>{explanation.evidenceQuality}</strong></span>
                      </div>
                      {explanation.confidenceNote && (
                        <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-2.5 text-amber-300">
                          {explanation.confidenceNote}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* V7: Portfolio KPIs Footer */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          {language === 'HI' ? 'संचालन केपीआई' : 'Operational KPIs'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-500">{language === 'HI' ? 'चेतावनी लीड टाइम' : 'Warning Lead Time'}</div>
            <div className="text-lg font-bold text-white mt-0.5">{portfolioHealth.medianWarningLeadTimeDays}d</div>
            <div className="text-[10px] text-emerald-400">Median</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Precision@K</div>
            <div className="text-lg font-bold text-white mt-0.5">{Math.round(portfolioHealth.precisionAtK * 100)}%</div>
            <div className="text-[10px] text-emerald-400">Top-5 accuracy</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Recall@K</div>
            <div className="text-lg font-bold text-white mt-0.5">{Math.round(portfolioHealth.recallAtK * 100)}%</div>
            <div className="text-[10px] text-emerald-400">Coverage</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">{language === 'HI' ? 'कार्य रूपांतरण' : 'Action Conversion'}</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {portfolioHealth.completedActionsThisWeek}
            </div>
            <div className="text-[10px] text-emerald-400">This week</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">{language === 'HI' ? 'डेटा ताजगी' : 'Data Freshness'}</div>
            <div className="text-lg font-bold text-white mt-0.5">{Math.round(portfolioHealth.dataFreshnessScore * 100)}%</div>
            <div className="text-[10px] text-emerald-400">Score</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">{language === 'HI' ? 'मॉडल कवरेज' : 'Model Coverage'}</div>
            <div className="text-lg font-bold text-white mt-0.5">{Math.round(portfolioHealth.modelCoverageScore * 100)}%</div>
            <div className="text-[10px] text-emerald-400">Supported</div>
          </div>
        </div>
      </div>
    </div>
  );
};