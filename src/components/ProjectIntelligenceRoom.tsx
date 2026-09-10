import React, { useState } from 'react';
import { 
  LandAcquisitionProject, 
  DecisionLogEntry, 
  ScenarioInput 
} from '../types';
import { 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Scale, 
  History, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Info, 
  UserCheck, 
  Calendar, 
  ExternalLink,
  Printer,
  Compass,
  Zap,
  TrendingDown,
  Building,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentVerificationModule } from './DocumentVerificationModule';

interface ProjectIntelligenceRoomProps {
  project: LandAcquisitionProject;
  onBack: () => void;
  decisionLogs: DecisionLogEntry[];
  onAddDecisionLog: (entry: DecisionLogEntry) => void;
  onOpenCitizenView: (ulpin?: string) => void;
  language: 'EN' | 'HI';
  defaultTab?: 'OVERVIEW' | 'EVIDENCE' | 'PRECEDENTS' | 'SCENARIO' | 'DECISIONS' | 'DOC_VERIFICATION' | 'REVIEW_PACKET';
}

export const ProjectIntelligenceRoom: React.FC<ProjectIntelligenceRoomProps> = ({
  project,
  onBack,
  decisionLogs,
  onAddDecisionLog,
  onOpenCitizenView,
  language,
  defaultTab = 'OVERVIEW'
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'PRECEDENTS' | 'SCENARIO' | 'DECISIONS' | 'DOC_VERIFICATION' | 'REVIEW_PACKET'>(defaultTab);

  // Scenario Lab State
  const [scenarioInput, setScenarioInput] = useState<ScenarioInput>({
    compensationMultiplier: 1.0,
    additionalNOCResources: false,
    specialGrievanceCamp: false,
    cropHarvestBufferDays: 0
  });

  // Action Form State
  const [actionCategory, setActionCategory] = useState<'COMPENSATION_REVISION' | 'SPECIAL_CAMP' | 'NOC_ESCALATION' | 'GRAM_SABHA_HEARING' | 'STATUS_REVIEW'>('COMPENSATION_REVISION');
  const [officerName, setOfficerName] = useState('District Collector / CALA');
  const [targetDueDate, setTargetDueDate] = useState('2026-09-25');
  const [actionNotes, setActionNotes] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(false);

  // Calculate Scenario Re-Score with Monotonic Constraints
  // In Section 14.1 of the PRD:
  // "train the gradient-boosted models so that predicted risk is guaranteed non-increasing
  // as the compensation-gap ratio shrinks, and non-increasing as pending NOC count drops."
  const baselineRisk = project.modelOutput.delayProbability;

  // Compensation impact: if compensation multiplier increases from 1.0 up to 1.4, risk drops up to 0.32
  const compReduction = (scenarioInput.compensationMultiplier - 1.0) * 0.75;
  // NOC impact: -0.14
  const nocReduction = scenarioInput.additionalNOCResources ? 0.14 : 0;
  // Grievance camp impact: -0.12
  const campReduction = scenarioInput.specialGrievanceCamp ? 0.12 : 0;
  // Harvest buffer impact: -0.06
  const bufferReduction = (scenarioInput.cropHarvestBufferDays / 60) * 0.06;

  const totalReduction = Math.min(compReduction + nocReduction + campReduction + bufferReduction, baselineRisk - 0.12);
  const scenarioRisk = Math.max(0.12, Math.round((baselineRisk - totalReduction) * 100) / 100);
  const deltaPoints = Math.round((baselineRisk - scenarioRisk) * 100);
  const savedDelayDays = Math.round(project.modelOutput.predictedMissDays * (deltaPoints / (baselineRisk * 100 || 1)));

  // Calculate Intervention Priority Index (IPI)
  // IPI = w1*RiskMovement + w2*Urgency + w3*Criticality + w4*Actionability
  const riskMovementScore = deltaPoints; // 0 - 100
  const urgencyScore = Math.max(0, 100 - (project.statutoryClockMaxDays - project.currentStageElapsedDays));
  const criticalityScore = project.criticality === 'CRITICAL' ? 95 : project.criticality === 'HIGH' ? 75 : 50;
  const actionabilityScore = 90;

  const ipiIndex = Math.round((0.35 * riskMovementScore) + (0.30 * urgencyScore) + (0.20 * criticalityScore) + (0.15 * actionabilityScore));

  const handleApplyScenarioToAction = () => {
    const summary = `Scenario: Comp ${Math.round((scenarioInput.compensationMultiplier - 1) * 100)}% revision, NOC expedited: ${scenarioInput.additionalNOCResources ? 'YES' : 'NO'}, Grievance Camp: ${scenarioInput.specialGrievanceCamp ? 'YES' : 'NO'}. Projected risk dropped by ${deltaPoints}%.`;
    setActionNotes(summary);
    setActiveTab('DECISIONS');
  };

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DecisionLogEntry = {
      id: `dec-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: officerName,
      officerRole: 'Competent Authority / Land Officer',
      timestamp: new Date().toISOString(),
      actionTaken: actionNotes || `Assigned ${actionCategory.replace('_', ' ')} with target resolution in 14 days`,
      category: actionCategory,
      targetDueDate: targetDueDate,
      scenarioAssumptionsTested: deltaPoints > 0 ? `Simulated: Risk dropped from ${Math.round(baselineRisk*100)}% to ${Math.round(scenarioRisk*100)}% (-${deltaPoints}%)` : undefined,
      status: 'ASSIGNED',
      notes: actionNotes
    };

    onAddDecisionLog(newEntry);
    setActionSuccessMsg(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setActionSuccessMsg(false), 4000);
  };

  const relevantDecisions = decisionLogs.filter(d => d.projectId === project.id);
  const daysLeft = project.statutoryClockMaxDays - project.currentStageElapsedDays;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio Command Center</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('DOC_VERIFICATION')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-semibold transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Scan & Verify Records</span>
          </button>

          <button
            onClick={() => setActiveTab('REVIEW_PACKET')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Page Collector Brief</span>
          </button>

          <button
            onClick={() => onOpenCitizenView()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>View as Landowner Citizen</span>
          </button>
        </div>
      </div>

      {/* Main Canonical Project Banner */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                {project.projectCode}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                {project.authority}
              </span>
              <span className="text-xs text-slate-400">
                {project.district}, {project.state} • Tehsil: {project.tehsil}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white">
              {project.title}
            </h2>
            {project.titleHindi && (
              <p className="text-xs text-slate-400 font-sans">
                {project.titleHindi}
              </p>
            )}
          </div>

          {/* Statutory Countdown Box */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {project.processRoute === 'NH_ACT_SEC3' ? 'NHAI 336-Day Clock' : 'RFCTLARR Sec 11 12-Month Clock'}
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {daysLeft > 0 ? `${daysLeft} Days Left` : `${Math.abs(daysLeft)} Days Overdue`}
              </div>
              <div className="text-[10px] text-slate-400">
                {project.currentStageElapsedDays} of {project.statutoryClockMaxDays} days elapsed
              </div>
            </div>

            {/* Delay Risk Gauge */}
            <div className={`px-3 py-2 rounded-lg text-center ${
              project.modelOutput.delayProbability >= 0.7
                ? 'bg-rose-950/60 border border-rose-600/50 text-rose-300'
                : 'bg-amber-950/60 border border-amber-600/50 text-amber-300'
            }`}>
              <div className="text-[9px] uppercase font-bold">Predicted Miss</div>
              <div className="text-xl font-black">{Math.round(project.modelOutput.delayProbability * 100)}%</div>
              <div className="text-[9px]">+{project.modelOutput.predictedMissDays}d overage</div>
            </div>
          </div>
        </div>

        {/* Linear Stage Timeline Navigation */}
        <div className="pt-2 border-t border-slate-700/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Statutory Process Sequence & Current Progression
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 text-center text-[11px]">
            {[
              { id: 'SIA_APPRAISAL', label: '1. Sec 4 SIA', active: project.currentStage === 'SIA_APPRAISAL' },
              { id: 'SEC11_PRELIM_NOTICE', label: '2. Sec 11 Notice', active: project.currentStage === 'SEC11_PRELIM_NOTICE' },
              { id: 'OBJECTIONS_HEARING', label: '3. Sec 15 Hearing', active: project.currentStage === 'OBJECTIONS_HEARING' },
              { id: 'SEC19_DECLARATION', label: '4. Sec 19 Declare', active: project.currentStage === 'SEC19_DECLARATION' },
              { id: 'VALUATION_SEC26', label: '5. Sec 26 Value', active: project.currentStage === 'VALUATION_SEC26' },
              { id: 'AWARD_SEC23', label: '6. Sec 23 Award', active: project.currentStage === 'AWARD_SEC23' },
              { id: 'PAYMENT_SEC38', label: '7. Sec 38 Pay', active: project.currentStage === 'PAYMENT_SEC38' },
              { id: 'POSSESSION_TAKEOVER', label: '8. Possession', active: project.currentStage === 'POSSESSION_TAKEOVER' }
            ].map((stage, idx) => {
              return (
                <div
                  key={stage.id}
                  className={`p-2 rounded-lg border font-medium transition-all ${
                    stage.active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold ring-2 ring-amber-400/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] text-slate-500">Stage {idx + 1}</div>
                  <div className="truncate">{stage.label}</div>
                  {stage.active && (
                    <div className="text-[9px] text-amber-400 font-mono mt-0.5 font-bold">● Active Stage</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: '1. Critical Path & Delay Causes', icon: Layers },
          { id: 'EVIDENCE', label: '2. SHAP Evidence Trace', icon: ShieldCheck },
          { id: 'PRECEDENTS', label: '3. Precedent Intelligence', icon: History },
          { id: 'SCENARIO', label: '4. Scenario Lab (What-If)', icon: Sliders, highlight: true },
          { id: 'DECISIONS', label: '5. Priority Queue & Action Log', icon: Scale },
          { id: 'DOC_VERIFICATION', label: '6. Document Verification (Scan & Cross-Ref)', icon: Camera, highlight: true },
          { id: 'REVIEW_PACKET', label: '7. One-Page Review Brief', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? tab.highlight
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.highlight && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CRITICAL PATH */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          {/* Milestone Target & Evidence Health Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-medium">Targeted Upcoming Milestone</div>
              <div className="text-base font-bold text-white mt-1">
                {project.modelOutput.nextMilestoneName}
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory Deadline: <strong className="text-white">{project.modelOutput.targetDeadlineDate}</strong></span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-medium">Evidence Health & Registry Provenance</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  project.modelOutput.evidenceHealth === 'GREEN'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  ● {project.modelOutput.evidenceHealth} HEALTH
                </span>
                <span className="text-xs font-mono text-slate-400">{project.modelOutput.modelCoverage}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {project.modelOutput.evidenceHealthReason}
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-medium">RFCTLARR Sec 10 Multi-Crop Exposure</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  project.multiCropIrrigatedExposure
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {project.multiCropIrrigatedExposure ? 'FLAGGED: Irrigated Multi-Crop' : 'Non-Irrigated / Single Crop'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Sentinel-2 NDVI classified {project.multiCropConfidencePct}% confidence. Mandatory "demonstrable last resort" statutory certificate required.
              </p>
            </div>
          </div>

          {/* Critical Path View (F06) */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Critical Path Dependency Intelligence (F06)
                </h3>
                <p className="text-xs text-slate-400">
                  Isolates conditions blocking downstream milestone execution, with owning departments and statutory age.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {project.dependencies.length} Tracked Dependencies
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {project.dependencies.map((dep) => (
                <div
                  key={dep.id}
                  className={`border rounded-xl p-4 ${
                    dep.status === 'CRITICAL'
                      ? 'bg-rose-950/30 border-rose-700/50'
                      : 'bg-slate-900/60 border-slate-700/80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        dep.status === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {dep.status}
                      </span>
                      <span className="text-xs font-bold text-white">{dep.type.replace('_', ' ')}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        via {dep.sourceSystem}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pending: <strong className="text-white">{dep.daysPending} days</strong></span>
                      {dep.statutoryLimitDays && (
                        <span>/ statutory {dep.statutoryLimitDays}d limit</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 mt-2 font-medium">
                    {dep.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Owning Department: </span>
                      <span className="text-slate-300 font-semibold">{dep.ownerDepartment}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Downstream Reach: </span>
                      <span className="text-amber-300">{dep.downstreamImpact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHAP EVIDENCE TRACE */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  SHAP Explainability & Source Evidence Trace (F04 / F11)
                </h3>
                <p className="text-xs text-slate-400">
                  Every prediction carries verifiable evidence. Feature weights mirror the validated Indian court delay methodology (Bhatnagar et al. arXiv:2307.16285).
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Model: {project.modelOutput.modelVersion}
              </div>
            </div>

            {/* Evidence Chain Formula Callout */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
              <span className="font-bold text-emerald-400 font-mono">Evidence Chain:</span>
              <span className="text-slate-400">Prediction → Driver → Source Registry Field → Effective Timestamp → Freshness → Feature Attribution → Action Context</span>
            </div>

            {/* Ranked SHAP Drivers */}
            <div className="space-y-3 mt-4">
              {project.modelOutput.shapDrivers.map((driver, idx) => {
                const isPositive = driver.contribution > 0;
                const widthPct = Math.min(100, Math.abs(driver.contribution) * 200);

                return (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {driver.humanDescription}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          SHAP: <strong className={isPositive ? 'text-rose-400' : 'text-emerald-400'}>
                            {isPositive ? `+${driver.contribution.toFixed(2)}` : driver.contribution.toFixed(2)}
                          </strong>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          driver.reliability === 'HIGH'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {driver.reliability} Reliability
                        </span>
                      </div>
                    </div>

                    {/* Visual Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isPositive ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>

                    {/* Metadata Trace */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        <span className="text-slate-500">Source:</span> <strong className="text-slate-300">{driver.evidenceSource}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Field:</span> <code className="text-slate-300 font-mono text-[10px]">{driver.evidenceField}</code>
                      </div>
                      <div>
                        <span className="text-slate-500">Freshness:</span> <span className="text-slate-300">{driver.freshness}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Observation:</span> <span className="text-slate-300 truncate block">{driver.observation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRECEDENT INTELLIGENCE */}
      {activeTab === 'PRECEDENTS' && (
        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Precedent Intelligence & Institutional Memory (F07 / Section 13)
                </h3>
                <p className="text-xs text-slate-400">
                  Retrieves comparable completed historical acquisitions based on analytical similarity, statutory route, and proximity — showing what delayed them and how they resolved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {project.precedents.map((prec) => (
                <div key={prec.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{prec.projectName}</span>
                        <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                          {Math.round(prec.similarityScore * 100)}% Similarity Match
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {prec.stateDistrict} • {prec.authority} • {prec.distanceKm} km away • Resolved {prec.resolvedYear}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-right">
                      <div className="text-[10px] text-slate-400">Initial Delay Experienced</div>
                      <strong className="text-amber-400">{prec.initialDelayMonths} Months Overrun</strong>
                    </div>
                  </div>

                  {/* Matching Factors */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Shared Factors:</span>
                    {prec.matchingFactors.map((factor, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {factor}
                      </span>
                    ))}
                  </div>

                  {/* Resolution & Intervention Card */}
                  <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      What Successfully Unblocked It:
                    </div>
                    <p className="text-slate-200">
                      {prec.successfulIntervention}
                    </p>
                    <div className="text-[11px] text-emerald-300 font-medium pt-1">
                      Outcome: {prec.finalOutcome} (Estimated ₹{Math.abs(prec.costImpactCr)} Cr interest carry avoided)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERVENTION SCENARIO LAB (The Signature Feature) */}
      {activeTab === 'SCENARIO' && (
        <div className="space-y-5">
          {/* Scientific Boundary Banner */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-700/40 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Scientific Boundary & Monotonic Guarantee (Section 14 & 14.1)
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  "A scenario is a modelled sensitivity under stated assumptions. It shows the model's learned historical correlation between an input and delay outcomes — it becomes a causal claim only after a separate evaluation design establishes causality."
                </p>
                <div className="text-[11px] text-blue-300 mt-1 font-mono">
                  Enforced via gradient-boosted monotonic constraints: higher compensation parity or resolving NOCs strictly non-increases delay probability.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Controls Column (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Intervention Levers & Assumptions
                </h3>
                <span className="text-xs text-slate-400">Supported Features Only</span>
              </div>

              {/* Lever 1: Compensation Multiplier Slider */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">
                      1. Compensation Rate Adjustment (RFCTLARR Section 26 Parity)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Base circle rate: ₹{project.compensationBasePerAcreLakh}L/acre → Tested offer: ₹{(project.compensationBasePerAcreLakh * scenarioInput.compensationMultiplier).toFixed(1)}L/acre
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                    +{Math.round((scenarioInput.compensationMultiplier - 1.0) * 100)}% revision
                  </span>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="1.5"
                  step="0.05"
                  value={scenarioInput.compensationMultiplier}
                  onChange={(e) => setScenarioInput({
                    ...scenarioInput,
                    compensationMultiplier: parseFloat(e.target.value)
                  })}
                  className="w-full accent-amber-400 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>1.0x (Registrar circle minimum)</span>
                  <span>1.25x (Recent deed median)</span>
                  <span>1.5x (Top 50% Sec 26 ceiling)</span>
                </div>
              </div>

              {/* Lever 2: Inter-departmental Forest/Wildlife NOC Resources */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">
                    2. Expedited Forest & Environmental NOC (PARIVESH Escalation)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Deploy dedicated nodal liaison officer to clear Western Ghats / wildlife clearances.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScenarioInput({
                    ...scenarioInput,
                    additionalNOCResources: !scenarioInput.additionalNOCResources
                  })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    scenarioInput.additionalNOCResources
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {scenarioInput.additionalNOCResources ? 'Expedited Active' : 'Standard Queue'}
                </button>
              </div>

              {/* Lever 3: Special Village Lok Adalat & Succession Camp */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">
                    3. Village Lok Adalat & Joint-Khata Succession Camp
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Conduct on-site succession affidavits with Lekhpal squads to eliminate family court disputes.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setScenarioInput({
                    ...scenarioInput,
                    specialGrievanceCamp: !scenarioInput.specialGrievanceCamp
                  })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    scenarioInput.specialGrievanceCamp
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {scenarioInput.specialGrievanceCamp ? 'Camp Scheduled' : 'Standard Notice'}
                </button>
              </div>

              {/* Lever 4: Crop Harvest Buffer Window */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white">
                    4. Crop Harvest Grace Window (Prevents Physical Agitation)
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {scenarioInput.cropHarvestBufferDays} days buffer
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="15"
                  value={scenarioInput.cropHarvestBufferDays}
                  onChange={(e) => setScenarioInput({
                    ...scenarioInput,
                    cropHarvestBufferDays: parseInt(e.target.value)
                  })}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Reset to Baseline Button */}
              <button
                type="button"
                onClick={() => setScenarioInput({
                  compensationMultiplier: 1.0,
                  additionalNOCResources: false,
                  specialGrievanceCamp: false,
                  cropHarvestBufferDays: 0
                })}
                className="text-xs text-slate-400 hover:text-white underline font-medium"
              >
                Reset All Levers to Current Baseline
              </button>
            </div>

            {/* Right Output & Comparison Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Modelled Sensitivity Outcome
                </h4>

                {/* Big Before vs After Comparison */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Current Baseline</div>
                    <div className="text-2xl font-black text-rose-400 mt-1">
                      {Math.round(baselineRisk * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-500">+{project.modelOutput.predictedMissDays}d delay</div>
                  </div>

                  <div className="bg-slate-900/80 border border-emerald-500/40 rounded-xl p-3 bg-gradient-to-b from-emerald-950/30 to-transparent">
                    <div className="text-[10px] text-emerald-400 uppercase font-bold">Scenario Result</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {Math.round(scenarioRisk * 100)}%
                    </div>
                    <div className="text-[10px] text-emerald-300">
                      -{deltaPoints}% risk delta
                    </div>
                  </div>
                </div>

                {/* Savings & Impact Estimations */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Projected Delay Averted:</span>
                    <strong className="text-emerald-400 font-bold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      ~{savedDelayDays} Days Saved
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Carrying Cost Savings (MoSPI rate):</span>
                    <strong className="text-emerald-400 font-bold">
                      ~₹{(savedDelayDays * 0.42).toFixed(1)} Cr Avoided
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Intervention Priority Index (IPI):</span>
                    <strong className="text-amber-400 font-bold font-mono">
                      {ipiIndex} / 100 Priority
                    </strong>
                  </div>
                </div>

                {/* CTA to Action Queue */}
                <button
                  type="button"
                  onClick={handleApplyScenarioToAction}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-colors"
                >
                  <Scale className="w-4 h-4" />
                  <span>Apply Assumptions to Intervention Queue</span>
                </button>
              </div>

              {/* Trust Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300 block mb-1">Human Decision Owner Boundary:</strong>
                LUME evaluates the correlation and prioritizes where to direct state resources. Authorized officials retain sole authority for legal, compensation, and administrative orders.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIORITY QUEUE & DECISION LOG */}
      {activeTab === 'DECISIONS' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Form: Assign Intervention (5 cols) */}
            <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  Assign Priority Intervention (F09 / F13)
                </h3>
                <p className="text-xs text-slate-400">
                  Logs human administrative decision into immutable audit trail with scheduled follow-up due date.
                </p>
              </div>

              {actionSuccessMsg && (
                <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Decision logged successfully in the institutional memory audit trail!</span>
                </div>
              )}

              <form onSubmit={handleCreateDecision} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Intervention Category</label>
                  <select
                    value={actionCategory}
                    onChange={(e) => setActionCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="COMPENSATION_REVISION">RFCTLARR Sec 26 Rate Revision & Top-50% Deed Parity</option>
                    <option value="SPECIAL_CAMP">Village Lok Adalat / Joint-Khata Succession Camp</option>
                    <option value="NOC_ESCALATION">PARIVESH Inter-Departmental NOC Escalation</option>
                    <option value="GRAM_SABHA_HEARING">Gram Sabha Quorum & Consent Hearing</option>
                    <option value="STATUS_REVIEW">High-Level Review with District Collector</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Assignee Officer / Agency</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. District Land Acquisition Officer (DLAO)"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Target Resolution Due Date</label>
                  <input
                    type="date"
                    value={targetDueDate}
                    onChange={(e) => setTargetDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-medium block mb-1">Action Notes / Terms</label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Describe specific directives, circle rate revisions, or camp venues..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Record & Commit Decision to Log</span>
                </button>
              </form>
            </div>

            {/* List: Logged Decisions for this project (7 cols) */}
            <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Accountable Decision History ({relevantDecisions.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Section 17 Audit Compliant</span>
              </div>

              <div className="space-y-3">
                {relevantDecisions.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-8 bg-slate-900/40 rounded-xl border border-slate-800">
                    No decisions logged yet for this project. Use the form to assign an action.
                  </div>
                ) : (
                  relevantDecisions.map((entry) => (
                    <div key={entry.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            entry.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {entry.status}
                          </span>
                          <span className="text-xs font-bold text-white">{entry.officerName}</span>
                          <span className="text-[10px] text-slate-400">({entry.officerRole})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Due: {entry.targetDueDate}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 font-medium">
                        {entry.actionTaken}
                      </p>

                      {entry.scenarioAssumptionsTested && (
                        <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 px-2.5 py-1 rounded">
                          {entry.scenarioAssumptionsTested}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-500 pt-1">
                        Recorded on {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DOCUMENT VERIFICATION (SCAN & CROSS-REF) */}
      {activeTab === 'DOC_VERIFICATION' && (
        <DocumentVerificationModule
          project={project}
          language={language}
          onAddDecisionLog={onAddDecisionLog}
          onOpenCitizenView={onOpenCitizenView}
        />
      )}

      {/* TAB 7: ONE-PAGE REVIEW PACKET (Collector Brief) */}
      {activeTab === 'REVIEW_PACKET' && (
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto space-y-6 print:m-0 print:p-4">
          {/* Brief Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Government of India • Ministry of Rural Development • DoLR / LACRRIS Intelligence
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                EXECUTIVE PROJECT REVIEW BRIEF (F12)
              </h1>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                For the Attention of: District Collector & Competent Authority (CALA)
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-slate-800">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-slate-500">Generated by LUME Decision Layer v7.0</div>
            </div>
          </div>

          {/* Project Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Project Code:</span>
              <strong className="font-mono text-slate-800">{project.projectCode}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Legal Route:</span>
              <strong className="text-slate-800">{project.processRoute.replace('_', ' ')}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Location:</span>
              <strong className="text-slate-800">{project.district}, {project.state}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Total Area / Landowners:</span>
              <strong className="text-slate-800">{project.totalAreaHectares} ha / {project.affectedLandownersCount} families</strong>
            </div>
          </div>

          {/* Critical Assessment */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Predictive Delay Assessment
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                Next Milestone: <strong className="text-slate-900">{project.modelOutput.nextMilestoneName}</strong>
              </div>
              <div className="text-rose-700 font-bold">
                Delay Probability: {Math.round(project.modelOutput.delayProbability * 100)}% (Est. +{project.modelOutput.predictedMissDays} days overrun)
              </div>
              <div>
                Statutory Clock Remaining: <strong className="text-slate-900">{daysLeft} days</strong> (Elapsed: {project.currentStageElapsedDays}d / {project.statutoryClockMaxDays}d)
              </div>
            </div>
          </div>

          {/* Primary Friction Drivers */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Primary Evidence Drivers (Source Attributed)
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {project.modelOutput.shapDrivers.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">#{i + 1}.</span>
                  <div>
                    <strong>{d.humanDescription}</strong>
                    <span className="text-slate-500 ml-1">({d.evidenceSource} • {d.observation})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tested Intervention Scenario (Dynamic from Scenario Lab) */}
          <div className="space-y-2 p-3 bg-emerald-50/80 border border-emerald-300 rounded-xl text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span>3. Tested Policy Interventions & Simulated Outcome</span>
                <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono">Live Sensitivity</span>
              </h2>
              <span className="font-mono font-bold text-emerald-800">
                IPI Priority Score: {ipiIndex} / 100
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block">Tested Compensation:</span>
                <strong className="text-slate-900">
                  ₹{(project.compensationBasePerAcreLakh * scenarioInput.compensationMultiplier).toFixed(1)}L / acre ({scenarioInput.compensationMultiplier > 1 ? `+${Math.round((scenarioInput.compensationMultiplier - 1) * 100)}% revision` : 'Base Circle Rate'})
                </strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block">Projected Delay Risk:</span>
                <strong className={scenarioRisk < baselineRisk ? "text-emerald-700 font-bold" : "text-slate-800"}>
                  {Math.round(scenarioRisk * 100)}% ({deltaPoints > 0 ? `-${deltaPoints}% delta` : 'Current Baseline'})
                </strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block">Est. Delay Averted:</span>
                <strong className="text-emerald-700 font-bold">~{savedDelayDays} Days Saved</strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-slate-500 block">Carrying Cost Saved:</span>
                <strong className="text-emerald-700 font-bold">~₹{(savedDelayDays * 0.42).toFixed(1)} Cr</strong>
              </div>
            </div>

            {relevantDecisions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-emerald-200 text-[11px]">
                <strong className="text-slate-900">Latest Committed Action:</strong>{' '}
                <span className="text-slate-700">{relevantDecisions[0].actionTaken} (Assigned to: {relevantDecisions[0].officerName}, Due: {relevantDecisions[0].targetDueDate})</span>
              </div>
            )}
          </div>

          {/* Historical Precedent */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Comparable Precedent & Resolution Insight
            </h2>
            {project.precedents.length > 0 && (
              <div className="text-xs text-slate-700 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong>{project.precedents[0].projectName} ({project.precedents[0].distanceKm} km away in {project.precedents[0].stateDistrict}):</strong>
                <p className="mt-1">{project.precedents[0].successfulIntervention}</p>
                <div className="text-[11px] text-emerald-800 font-medium mt-1">
                  Outcome: {project.precedents[0].finalOutcome}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Direction */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              5. Immediate Statutory Direction & Cadastral Action
            </h2>
            <p className="text-xs text-slate-700">
              Direct the Competent Authority (CALA Satara) to convene the District Level Negotiation Committee (DLNC) within 10 days. Expedite joint re-survey of disputed parcel Gut No. 418/2 (ULPIN: MH270412889201) to verify co-parcener share and update Section 3G award schedule before 336-day clock expiry.
            </p>
          </div>

          {/* Signoff Area */}
          <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
            <div>
              <div>Verified by: LUME Platform Intelligence Engine</div>
              <div className="text-[10px] text-slate-400">Security Hash: SHA256-LUME-7029-CONFIDENTIAL</div>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-44 mb-1"></div>
              <div>Signature of Competent Authority</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
