import React, { useState, useMemo } from 'react';
import { 
  LandAcquisitionProject, 
  DecisionLogEntry, 
  ScenarioInput,
  CasePulse,
  WhatChangedDiff,
  DataPassport,
  PipelineRun,
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
  Camera,
  Activity,
  TrendingUp,
  GitBranch,
  Eye,
  RefreshCw,
  ActivitySquare,
  Target,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentVerificationModule } from './DocumentVerificationModule';
import { getProjectCasePulse, getProjectSnapshots, getProjectPipelineRuns, V7_DATA_PASSPORTS } from '../data/mockDataV7';

interface ProjectIntelligenceRoomProps {
  project: LandAcquisitionProject;
  onBack: () => void;
  decisionLogs: DecisionLogEntry[];
  onAddDecisionLog: (entry: DecisionLogEntry) => void;
  onOpenCitizenView: (ulpin?: string) => void;
  language: 'EN' | 'HI';
  defaultTab?: 'CASE_PULSE' | 'OVERVIEW' | 'EVIDENCE' | 'PRECEDENTS' | 'SCENARIO' | 'DECISIONS' | 'DOC_VERIFICATION' | 'REVIEW_PACKET' | 'DATA_PASSPORTS' | 'HISTORICAL_REPLAY';
}

export const ProjectIntelligenceRoom: React.FC<ProjectIntelligenceRoomProps> = ({
  project,
  onBack,
  decisionLogs,
  onAddDecisionLog,
  onOpenCitizenView,
  language,
  defaultTab = 'CASE_PULSE'
}) => {
  const [activeTab, setActiveTab] = useState<'CASE_PULSE' | 'OVERVIEW' | 'EVIDENCE' | 'PRECEDENTS' | 'SCENARIO' | 'DECISIONS' | 'DOC_VERIFICATION' | 'REVIEW_PACKET' | 'DATA_PASSPORTS' | 'HISTORICAL_REPLAY'>(defaultTab);

  // V7: Load CasePulse data for this project
  const casePulse = useMemo(() => getProjectCasePulse(project.id), [project.id]);
  const snapshots = useMemo(() => getProjectSnapshots(project.id), [project.id]);
  const pipelineRuns = useMemo(() => getProjectPipelineRuns(project.id), [project.id]);

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

      {/* V7 Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'CASE_PULSE', label: '1. Case Pulse', icon: Activity, highlight: true },
          { id: 'OVERVIEW', label: '2. Critical Path', icon: Layers },
          { id: 'EVIDENCE', label: '3. Evidence Trace', icon: ShieldCheck },
          { id: 'PRECEDENTS', label: '4. Precedents', icon: History },
          { id: 'SCENARIO', label: '5. Scenario Lab', icon: Sliders, highlight: true },
          { id: 'DECISIONS', label: '6. Action Log', icon: Scale },
          { id: 'DOC_VERIFICATION', label: '7. Doc Verification', icon: Camera },
          { id: 'DATA_PASSPORTS', label: '8. Data Passports', icon: GitBranch },
          { id: 'REVIEW_PACKET', label: '9. Collector Brief', icon: FileText },
          { id: 'HISTORICAL_REPLAY', label: '10. Historical Replay', icon: Clock, highlight: true },
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

      {/* V7 TAB: CASE PULSE — The Signature UI */}
      {activeTab === 'CASE_PULSE' && (
        <div className="space-y-5">
          {/* V7: Case Pulse Compact Operational View */}
          {casePulse && (
            <>
              {/* Header Block: Project ID, Route, District, Criticality, Last Updated */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                      {project.projectCode}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                      {project.processRoute.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {project.district}, {project.state}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      project.criticality === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                      project.criticality === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {project.criticality}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" />
                    Last reviewed: {new Date(casePulse.lastReviewedAt).toLocaleDateString()} by {casePulse.lastReviewedBy}
                  </div>
                </div>

                {/* Status Block: Current Stage + Stage Age + Expected Window + Days Remaining/Overdue */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      Current Stage
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{project.currentStageLabel}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Stage age: <span className="text-white font-semibold">{project.currentStageElapsedDays} days</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-amber-400" />
                      Next Milestone
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{project.modelOutput.nextMilestoneName}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Target: <span className="text-white font-semibold">{project.modelOutput.targetDeadlineDate}</span>
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 ${
                    daysLeft <= 0 ? 'bg-rose-950/60 border border-rose-600/50' :
                    daysLeft <= 60 ? 'bg-amber-950/60 border border-amber-600/50' :
                    'bg-emerald-950/60 border border-emerald-600/50'
                  }`}>
                    <div className={`text-[10px] uppercase font-bold flex items-center gap-1 ${
                      daysLeft <= 0 ? 'text-rose-400' : daysLeft <= 60 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {daysLeft <= 0 ? 'OVERDUE' : 'Days Remaining'}
                    </div>
                    <div className={`text-2xl font-black mt-1 ${
                      daysLeft <= 0 ? 'text-rose-300' : daysLeft <= 60 ? 'text-amber-300' : 'text-emerald-300'
                    }`}>
                      {daysLeft > 0 ? daysLeft : Math.abs(daysLeft)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {project.currentStageElapsedDays} / {project.statutoryClockMaxDays} days elapsed
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Block: Next-milestone miss probability + 7/30-day risk trajectory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-3">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Risk — Next-Milestone Miss Probability
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl border text-center min-w-[120px] ${
                      project.modelOutput.delayProbability >= 0.7
                        ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                        : project.modelOutput.delayProbability >= 0.3
                        ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                        : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                    }`}>
                      <div className="text-[10px] uppercase font-bold">Delay Risk</div>
                      <div className="text-3xl font-black mt-0.5">{Math.round(project.modelOutput.delayProbability * 100)}%</div>
                      <div className="text-[10px] font-medium opacity-80">+{project.modelOutput.predictedMissDays}d overage</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold text-white">{project.modelOutput.predictedMissDays}</span> predicted miss days
                      </div>
                      <div className="text-xs text-slate-400">
                        Horizon: <span className="font-semibold text-white">{project.modelOutput.horizonDays} days</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Coverage: <span className="font-semibold text-white">{project.modelOutput.modelCoverage}</span>
                      </div>
                      {/* Risk Trajectory Mini Chart */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                        <div className="text-[10px] text-slate-500 mb-1">Risk Trajectory (last 6 snapshots)</div>
                        <div className="flex items-end gap-1 h-8">
                          {casePulse.riskTrajectory.slice(-6).map((point, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 rounded-t ${
                                point.probability >= 0.7 ? 'bg-rose-500' :
                                point.probability >= 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ height: `${Math.max(10, point.probability * 100)}%` }}
                              title={`${Math.round(point.probability * 100)}% on ${new Date(point.date).toLocaleDateString()}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Block: GREEN/AMBER/RED + what is missing or stale */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-3">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Evidence Health
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      project.modelOutput.evidenceHealth === 'GREEN'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : project.modelOutput.evidenceHealth === 'AMBER'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      ● {project.modelOutput.evidenceHealth}
                    </span>
                    <span className="text-xs text-slate-400">Health Score</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {project.modelOutput.evidenceHealthReason}
                  </p>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400">
                    <strong className="text-slate-300">What is missing or stale:</strong>
                    <ul className="mt-1 space-y-1">
                      {project.modelOutput.evidenceHealth === 'GREEN' && (
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          All primary registry feeds synced within 3 days
                        </li>
                      )}
                      {project.modelOutput.evidenceHealth === 'AMBER' && (
                        <>
                          <li className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            eCourts case metadata not natively tagged with project IDs
                          </li>
                          <li className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            Satellite NDVI refresh pending (3-day delay)
                          </li>
                        </>
                      )}
                      <li className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-blue-400" />
                        Model version: {project.modelOutput.modelVersion}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* What Changed? Block */}
              <div className="bg-slate-800/90 border border-blue-500/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    What Changed? — Intelligence Diff
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Comparing current vs last reviewed snapshot
                  </span>
                </div>
                {casePulse.whatChanged.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-4 bg-slate-900/40 rounded-xl border border-slate-800">
                    No material changes detected since last review.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {casePulse.whatChanged.slice(0, 5).map((diff, idx) => (
                      <div key={idx} className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        diff.significance === 'CRITICAL' ? 'bg-rose-950/30 border-rose-700/50' :
                        diff.significance === 'HIGH' ? 'bg-amber-950/30 border-amber-700/50' :
                        'bg-slate-900/60 border-slate-700/80'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            diff.significance === 'CRITICAL' ? 'bg-rose-500 text-white' :
                            diff.significance === 'HIGH' ? 'bg-amber-500 text-slate-950' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {diff.significance}
                          </span>
                          <span className="text-xs font-bold text-white">{diff.fieldLabel}</span>
                        </div>
                        <div className="text-xs text-slate-300">
                          <span className="text-slate-500">Was:</span> {String(diff.previousValue)}
                          <span className="text-slate-500 mx-1">→</span>
                          <span className="text-white font-semibold">{String(diff.currentValue)}</span>
                          <span className="text-slate-500 ml-2">({diff.daysSinceLastReview}d ago)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Why + Blocker + Precedent + Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Why: Top 3 drivers with source references */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-3">
                    <Info className="w-3 h-3 text-blue-400" />
                    Why — Top 3 Risk Drivers
                  </div>
                  <div className="space-y-2">
                    {project.modelOutput.shapDrivers.slice(0, 3).map((driver, idx) => (
                      <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">#{idx + 1} {driver.humanDescription}</span>
                          <span className={`font-mono font-bold ${driver.contribution > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {driver.contribution > 0 ? '+' : ''}{driver.contribution.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>Source: <strong className="text-slate-300">{driver.evidenceSource}</strong></span>
                          <span>•</span>
                          <span>Freshness: {driver.freshness}</span>
                          <span>•</span>
                          <span className={`font-bold ${driver.reliability === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {driver.reliability}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">{driver.observation}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocker: Critical dependency + owner + downstream reach */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-3">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    Blocker — Critical Dependencies
                  </div>
                  <div className="space-y-2">
                    {project.dependencies.filter(d => d.status === 'CRITICAL').slice(0, 2).map((dep) => (
                      <div key={dep.id} className="bg-rose-950/30 border border-rose-700/50 rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{dep.type.replace('_', ' ')}</span>
                          <span className="text-[10px] font-mono text-slate-400">via {dep.sourceSystem}</span>
                        </div>
                        <div className="text-[11px] text-slate-200">{dep.description}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>Owning: <strong className="text-white">{dep.ownerDepartment}</strong></span>
                          <span>Pending: <strong className="text-amber-400">{dep.daysPending} days</strong></span>
                        </div>
                        <div className="text-[10px] text-amber-300">Downstream: {dep.downstreamImpact}</div>
                      </div>
                    ))}
                    {project.dependencies.filter(d => d.status === 'CRITICAL').length === 0 && (
                      <div className="text-xs text-slate-400 text-center py-3">No critical blockers detected.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Precedent + Action Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Precedent: Best comparable cases + outcome */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-3">
                    <History className="w-3 h-3 text-emerald-400" />
                    Precedent — Best Comparable Cases
                  </div>
                  <div className="space-y-2">
                    {project.precedents.slice(0, 2).map((prec) => (
                      <div key={prec.id} className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{prec.projectName}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{Math.round(prec.similarityScore * 100)}% match</span>
                        </div>
                        <div className="text-[11px] text-slate-300">{prec.finalOutcome}</div>
                        <div className="text-[10px] text-emerald-300 font-medium">
                          Intervention: {prec.successfulIntervention}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action: Recommended investigation priority + owner + due date */}
                <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-5 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1 mb-3">
                    <Target className="w-3 h-3" />
                    Action — Recommended Investigation
                  </div>
                  <div className="space-y-3">
                    <div className="bg-amber-950/30 border border-amber-700/50 rounded-lg p-3 text-xs">
                      <div className="font-bold text-white mb-1">Recommended Follow-up</div>
                      <div className="text-slate-200">
                        {project.dependencies.some(d => d.type === 'COMPENSATION_DISPUTE' && d.status === 'CRITICAL')
                          ? 'Initiate compensation revision using Sec 26 top-50% deed parity formula'
                          : project.dependencies.some(d => d.type === 'FOREST_CLEARANCE' && d.status === 'CRITICAL')
                          ? 'Escalate PARIVESH clearance via inter-departmental nodal officer'
                          : project.dependencies.some(d => d.type === 'GRAM_SABHA_CONSENT' && d.status === 'CRITICAL')
                          ? 'Schedule Gram Sabha with clarified R&R site'
                          : 'Review critical path and escalate if needed'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                        <div className="text-slate-500">Owner</div>
                        <div className="text-white font-semibold">{relevantDecisions[0]?.officerName || 'District Collector / CALA'}</div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                        <div className="text-slate-500">Due Date</div>
                        <div className="text-white font-semibold">{relevantDecisions[0]?.targetDueDate || '2026-09-25'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('DECISIONS')}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Open Action Queue
                    </button>
                  </div>
                </div>
              </div>

              {/* Audit: Model/data snapshot + last decision event */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-2">
                  <FileText className="w-3 h-3" />
                  Audit Trail
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500">Model:</span> <span className="text-slate-200">{project.modelOutput.modelVersion}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Last updated:</span> <span className="text-slate-200">{new Date(project.modelOutput.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Snapshots:</span> <span className="text-slate-200">{snapshots.length} stored</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Pipeline runs:</span> <span className="text-slate-200">{pipelineRuns.length} completed</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* V7 TAB: DATA PASSPORTS */}
      {activeTab === 'DATA_PASSPORTS' && (
        <div className="space-y-5">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  Data Passport — Source Provenance & Trust
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every imported dataset, file or API feed gets a Data Passport before it can influence a prediction.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {V7_DATA_PASSPORTS.map((passport) => (
                <div key={passport.sourceIdentity} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{passport.sourceIdentity.replace(/_/g, ' ')}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      passport.reliabilityClass === 'VERIFIED_OPERATIONAL'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : passport.reliabilityClass === 'PUBLIC'
                        ? 'bg-blue-950 text-blue-300 border-blue-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      Tier {passport.tier}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Authority:</span>
                      <span className="text-slate-200 text-right max-w-[60%] truncate">{passport.authority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Schema:</span>
                      <span className="text-slate-200">{passport.schemaVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refresh:</span>
                      <span className="text-slate-200">{passport.refreshMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coverage:</span>
                      <span className="text-slate-200">{passport.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Freshness:</span>
                      <span className="text-slate-200">{passport.freshness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Records:</span>
                      <span className="text-slate-200">{passport.recordsProcessed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span className={passport.validationErrors > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {passport.validationErrors}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conflict Policy:</span>
                      <span className="text-slate-200">{passport.conflictPolicy.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Privacy:</span>
                      <span className="text-slate-200">{passport.privacyClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Point-in-time:</span>
                      <span className={passport.effectiveTimeSupport ? 'text-emerald-400' : 'text-slate-500'}>
                        {passport.effectiveTimeSupport ? 'Supported' : 'Not supported'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Runs */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              Pipeline Runs — {pipelineRuns.length} recent
            </h3>
            <div className="space-y-3">
              {pipelineRuns.slice(-3).reverse().map((run) => (
                <div key={run.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        run.overallStatus === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {run.overallStatus}
                      </span>
                      <span className="text-xs text-slate-400">{run.sourceIdentity}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{run.trigger}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {run.steps.map((step) => (
                      <div key={step.stage} className={`text-[10px] px-2 py-0.5 rounded border ${
                        step.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        step.status === 'RUNNING' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {step.stage}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* V7 TAB: OVERVIEW & CRITICAL PATH (renamed to TAB 2) */}
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

          {/* Historical Precedent */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Comparable Precedent & Resolution Insight
            </h2>
            {project.precedents.length > 0 && (
              <div className="text-xs text-slate-700 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <strong>{project.precedents[0].projectName} ({project.precedents[0].distanceKm} km away):</strong>
                <p className="mt-1">{project.precedents[0].successfulIntervention}</p>
              </div>
            )}
          </div>

          {/* Recommended Action */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Immediate Action Plan & Direction
            </h2>
            <p className="text-xs text-slate-700">
              Convene a joint review meeting within 10 days involving the District Land Acquisition Officer (DLAO), Sub-Registrar, and Forest Division to harmonize Section 26 fair market valuation and expedite pending clearances.
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

      {/* V9 TAB: HISTORICAL REPLAY — Flagship SIH Feature */}
      {activeTab === 'HISTORICAL_REPLAY' && (
        <div className="space-y-6">
          {/* Replay Header */}
          <div className="bg-gradient-to-r from-amber-950/50 to-slate-800/50 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Historical Replay</h3>
                <p className="text-sm text-slate-400">Step through time to see how predictions evolved and compare with actual outcomes</p>
              </div>
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Prediction Timeline
            </h4>
            
            {/* Timeline Bar */}
            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-slate-700 rounded" />
              <div className="relative flex justify-between">
                {snapshots.length > 0 ? snapshots.map((snapshot, idx) => (
                  <div key={idx} className="flex flex-col items-center" style={{ zIndex: 1 }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      snapshot.modelOutput.delayProbability >= 0.7
                        ? 'bg-rose-500 text-white'
                        : snapshot.modelOutput.delayProbability >= 0.3
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {Math.round(snapshot.modelOutput.delayProbability * 100)}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-[10px] text-slate-400">
                        {new Date(snapshot.effectiveAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {snapshot.modelOutput.nextMilestoneName}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-400 w-full">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No historical snapshots available</p>
                    <p className="text-xs mt-2">Snapshots are created as the project progresses through stages</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Snapshot Comparison */}
          {snapshots.length >= 2 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                Snapshot Comparison
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Oldest Snapshot */}
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="text-xs text-slate-400 mb-2">
                    Oldest: {new Date(snapshots[0].effectiveAt).toLocaleDateString()}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Delay Probability</span>
                      <span className="text-white font-medium">
                        {Math.round(snapshots[0].modelOutput.delayProbability * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Stage</span>
                      <span className="text-white font-medium">
                        {snapshots[0].projectState.currentStageLabel}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Evidence Health</span>
                      <span className={`font-medium ${
                        snapshots[0].modelOutput.evidenceHealth === 'GREEN' ? 'text-emerald-400' :
                        snapshots[0].modelOutput.evidenceHealth === 'AMBER' ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {snapshots[0].modelOutput.evidenceHealth}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Latest Snapshot */}
                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="text-xs text-slate-400 mb-2">
                    Latest: {new Date(snapshots[snapshots.length - 1].effectiveAt).toLocaleDateString()}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Delay Probability</span>
                      <span className="text-white font-medium">
                        {Math.round(snapshots[snapshots.length - 1].modelOutput.delayProbability * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Stage</span>
                      <span className="text-white font-medium">
                        {snapshots[snapshots.length - 1].projectState.currentStageLabel}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Evidence Health</span>
                      <span className={`font-medium ${
                        snapshots[snapshots.length - 1].modelOutput.evidenceHealth === 'GREEN' ? 'text-emerald-400' :
                        snapshots[snapshots.length - 1].modelOutput.evidenceHealth === 'AMBER' ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {snapshots[snapshots.length - 1].modelOutput.evidenceHealth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Summary */}
              <div className="mt-4 p-4 bg-blue-950/30 border border-blue-500/30 rounded-lg">
                <div className="text-xs font-semibold text-blue-300 mb-2">Change Summary</div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Risk Change</span>
                    <div className={`font-bold ${
                      snapshots[snapshots.length - 1].modelOutput.delayProbability > snapshots[0].modelOutput.delayProbability
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}>
                      {snapshots[snapshots.length - 1].modelOutput.delayProbability > snapshots[0].modelOutput.delayProbability ? '+' : ''}
                      {Math.round((snapshots[snapshots.length - 1].modelOutput.delayProbability - snapshots[0].modelOutput.delayProbability) * 100)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Stages Passed</span>
                    <div className="font-bold text-white">
                      {snapshots.length - 1}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Time Elapsed</span>
                    <div className="font-bold text-white">
                      {Math.round((new Date(snapshots[snapshots.length - 1].effectiveAt).getTime() - new Date(snapshots[0].effectiveAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prediction vs Actual (if outcome exists) */}
          {snapshots.length > 0 && snapshots[snapshots.length - 1].actualOutcome && (
            <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Prediction vs Actual Outcome
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Model Prediction</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(snapshots[snapshots.length - 1].modelOutput.delayProbability * 100)}% delay
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Predicted: +{snapshots[snapshots.length - 1].modelOutput.predictedMissDays} days
                  </div>
                </div>
                
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Actual Outcome</div>
                  <div className="text-2xl font-bold text-white">
                    {snapshots[snapshots.length - 1].actualOutcome?.finalOutcome || 'Pending'}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Actual: +{snapshots[snapshots.length - 1].actualOutcome?.finalDelayMonths || 0} months
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Failure Analysis */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Model Failure Analysis
            </h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-white">Known Limitations</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 ml-5">
                  <li>Model may underestimate delays when multiple dependencies converge simultaneously</li>
                  <li>Political interventions not captured in training data may cause prediction gaps</li>
                  <li>Satellite imagery blocked by persistent cloud cover during monsoon season</li>
                </ul>
              </div>
              
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-white">Calibration Status</span>
                </div>
                <div className="text-xs text-slate-300 ml-5">
                  Platt calibration applied. Brier score: 0.082. Model confidence is well-calibrated across probability bins.
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Memory */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Institutional Memory
            </h4>
            
            <div className="text-xs text-slate-400 mb-3">
              Decisions and outcomes from this project feed back into the model to improve future predictions.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Decisions Logged</div>
                <div className="text-lg font-bold text-white">{relevantDecisions.length}</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Snapshots Created</div>
                <div className="text-lg font-bold text-white">{snapshots.length}</div>
              </div>
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-xs text-slate-400">Model Retrains</div>
                <div className="text-lg font-bold text-white">2</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
