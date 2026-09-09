import React, { useState } from 'react';
import { LandAcquisitionProject } from '../types';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck2, 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  Layers, 
  Scale, 
  AlertCircle,
  BarChart3,
  MapPin,
  FileText,
  Sliders
} from 'lucide-react';

interface PortfolioCommandCenterProps {
  projects: LandAcquisitionProject[];
  onSelectProject: (projectId: string) => void;
  onOpenGIS: () => void;
  language: 'EN' | 'HI';
  onOpenIPIModal?: () => void;
}

export const PortfolioCommandCenter: React.FC<PortfolioCommandCenterProps> = ({
  projects,
  onSelectProject,
  onOpenGIS,
  language,
  onOpenIPIModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthority, setFilterAuthority] = useState<string>('ALL');
  const [filterRoute, setFilterRoute] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAuthority = filterAuthority === 'ALL' || p.authority.includes(filterAuthority);
    const matchesRoute = filterRoute === 'ALL' || p.processRoute === filterRoute;
    const matchesRisk = 
      filterRisk === 'ALL' ||
      (filterRisk === 'HIGH' && p.modelOutput.delayProbability >= 0.7) ||
      (filterRisk === 'MEDIUM' && p.modelOutput.delayProbability >= 0.3 && p.modelOutput.delayProbability < 0.7) ||
      (filterRisk === 'LOW' && p.modelOutput.delayProbability < 0.3);

    return matchesSearch && matchesAuthority && matchesRoute && matchesRisk;
  });

  // Calculate Macro Stats
  const totalProjects = projects.length;
  const criticalRiskCount = projects.filter(p => p.modelOutput.delayProbability >= 0.7).length;
  const multiCropSec10Count = projects.filter(p => p.multiCropIrrigatedExposure).length;
  const totalLandowners = projects.reduce((sum, p) => sum + p.affectedLandownersCount, 0);
  const totalBudgetCr = projects.reduce((sum, p) => sum + p.estimatedBudgetCr, 0);

  return (
    <div className="space-y-6">
      {/* Statutory & Parliamentary Context Bar */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-800 to-emerald-500/15 border border-amber-500/30 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === 'HI' ? 'संसदीय समिति एवं सांविधिक निगरानी 2025-26' : 'Parliamentary Standing Committee & Statutory Oversight'}
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Live Clock Tracking
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-4xl leading-relaxed">
                {language === 'HI'
                  ? '74.8% एनएचएआई सड़क परियोजनाएं भूमि अधिग्रहण में देरी के कारण प्रभावित हुईं (राज्यसभा 2019-24)। ल्यूमे धारा 11 (12 माह की सीमा) और एनएचएआई 336-दिवसीय सांविधिक समयसीमा के उल्लंघन से पहले जोखिम की पहचान करता है।'
                  : '74.8% of completed NHAI road projects were historically delayed, with land acquisition as primary bottleneck (MoSPI Flash Report & Parliament replies). LUME monitors breaches of RFCTLARR Section 11 (12-month SIA clock) & NHAI 336-day Section 3 clock before deadlines lapse.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenIPIModal && (
              <button
                onClick={onOpenIPIModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl shadow-sm transition-colors cursor-pointer"
                title="Configure Intervention Priority Index formula weights (F09)"
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
              <span>{language === 'HI' ? 'मानचित्र दृश्य' : 'GIS Risk Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Macro Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'सक्रिय अधिग्रहण' : 'Active Portfolios'}</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {totalProjects}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">1,941 central base</span>
            <span>tracked nationwide</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-rose-950/20 to-transparent">
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
            <span>{language === 'HI' ? 'अति-जोखिम कॉरिडोर' : 'Critical Stage Risk'}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mt-2">
            {criticalRiskCount}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ {totalProjects} corridors</span>
          </div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            Delay probability &gt; 70%
          </div>
        </div>

        <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-amber-950/20 to-transparent">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>{language === 'HI' ? 'धारा 10 बहु-फसली' : 'Sec 10 Multi-Crop Flag'}</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">
            {multiCropSec10Count}
            <span className="text-xs font-normal text-slate-400 ml-1.5">corridors</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mandatory "last resort" rule
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'प्रभावित भू-स्वामी' : 'Affected Families'}</span>
            <Scale className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {totalLandowners.toLocaleString()}
          </div>
          <div className="text-[11px] text-teal-400 mt-1">
            Direct DBT entitlement
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>{language === 'HI' ? 'निगरानी पूंजी' : 'Monitored Value'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            ₹{totalBudgetCr.toLocaleString()} <span className="text-xs font-normal text-slate-400">Cr</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            MoSPI Flash aligned
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'HI' ? 'परियोजना, कोड, जिला या राज्य खोजें...' : 'Search corridor by name, authority, district, or code...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Authority filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-300">
            <span className="text-slate-500 text-[11px]">Agency:</span>
            <select
              value={filterAuthority}
              onChange={(e) => setFilterAuthority(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Agencies</option>
              <option value="NHAI">NHAI</option>
              <option value="DFCCIL">DFCCIL (Railways)</option>
              <option value="BMRCL">Metro (BMRCL)</option>
              <option value="SECI">Solar (SECI)</option>
            </select>
          </div>

          {/* Route filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-300">
            <span className="text-slate-500 text-[11px]">Legal Route:</span>
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Legal Routes</option>
              <option value="RFCTLARR_2013">RFCTLARR 2013</option>
              <option value="NH_ACT_SEC3">NH Act Section 3</option>
              <option value="STATE_SPECIFIC">State Industrial (KIADB)</option>
            </select>
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-300">
            <span className="text-slate-500 text-[11px]">Risk Tier:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="HIGH">Critical (&gt;70%)</option>
              <option value="MEDIUM">Moderate (30-70%)</option>
              <option value="LOW">On Track (&lt;30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects List / Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredProjects.length} of {projects.length} Acquisition Corridors</span>
          <span className="font-mono text-[11px]">Next Milestone Probability scored via Champion Gradient Trees</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredProjects.map((project) => {
            const riskPct = Math.round(project.modelOutput.delayProbability * 100);
            const isHighRisk = riskPct >= 70;
            const isMediumRisk = riskPct >= 30 && riskPct < 70;

            const daysRemaining = project.statutoryClockMaxDays - project.currentStageElapsedDays;
            const isClockCritical = daysRemaining <= 60;

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="group bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/40"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: Project Overview */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        {project.projectCode}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        project.processRoute === 'RFCTLARR_2013'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/50'
                          : project.processRoute === 'NH_ACT_SEC3'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          : 'bg-teal-950/60 text-teal-300 border-teal-800/50'
                      }`}>
                        {project.processRoute === 'RFCTLARR_2013' ? 'RFCTLARR 2013 Route' : project.processRoute === 'NH_ACT_SEC3' ? 'NH Act Sec 3 Route' : 'State Act Route'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {project.state} • {project.district}
                      </span>
                      {project.multiCropIrrigatedExposure && (
                        <span className="text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Sec 10 Multi-Crop (NDVI {project.multiCropConfidencePct}%)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>

                    {/* Current Stage & Statutory Clock */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Current Process Stage:</span>
                        <span className="font-semibold text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60">
                          {project.currentStageLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isClockCritical ? 'text-rose-400' : 'text-slate-400'}`} />
                        <span className="text-slate-500">Statutory Clock:</span>
                        <span className={`font-semibold ${isClockCritical ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                          {project.currentStageElapsedDays} / {project.statutoryClockMaxDays} days elapsed ({daysRemaining} days left)
                        </span>
                      </div>
                    </div>

                    {/* Alert Pill */}
                    {project.recentAlerts.length > 0 && (
                      <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded-lg px-2.5 py-1 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{project.recentAlerts[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Predictive Delay Risk Gauge & Evidence Health */}
                  <div className="flex items-center gap-5 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/80 pt-3 lg:pt-0 lg:pl-5 w-full lg:w-auto justify-between lg:justify-end">
                    {/* Next milestone info */}
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Next Evaluated Milestone</div>
                      <div className="text-xs font-semibold text-white max-w-[180px] truncate">
                        {project.modelOutput.nextMilestoneName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                        <span>Horizon:</span>
                        <span className="text-slate-200 font-medium">{project.modelOutput.horizonDays} days</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          project.modelOutput.evidenceHealth === 'GREEN'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {project.modelOutput.evidenceHealth} Health
                        </span>
                      </div>
                    </div>

                    {/* Delay Probability Gauge Card */}
                    <div className={`p-3 rounded-xl border text-center min-w-[110px] ${
                      isHighRisk
                        ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                        : isMediumRisk
                        ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                        : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                    }`}>
                      <div className="text-[10px] uppercase font-bold tracking-wider">
                        Delay Risk
                      </div>
                      <div className="text-2xl font-black mt-0.5">
                        {riskPct}%
                      </div>
                      <div className="text-[10px] font-medium opacity-80">
                        +{project.modelOutput.predictedMissDays}d overage
                      </div>
                    </div>

                    {/* Drill-down Arrow */}
                    <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-emerald-600 text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
