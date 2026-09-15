import {
  DataPassport,
  PipelineRun,
  PipelineStep,
  PipelineStage,
  PipelineStatus,
  TemporalSnapshot,
  LandAcquisitionProject,
  ProjectModelOutput,
  WhatChangedDiff,
  CasePulse,
  ActionQueueItem,
  RiskTrajectoryPoint,
  PortfolioHealthMetrics,
  DataHealthScreen,
  ReplayState,
  InterventionPlaybook,
  EvidenceHealthState,
  DecisionLogEntry,
} from '../types';

const PIPELINE_STAGES: PipelineStage[] = [
  'CONNECT', 'VALIDATE', 'NORMALIZE', 'RECONCILE', 
  'SNAPSHOT', 'ENRICH', 'SCORE', 'PUBLISH', 'ACTIVATE', 'LEARN'
];

export const DATA_PASSPORTS: DataPassport[] = [
  {
    sourceIdentity: 'SIH_PROVIDED_DATASET',
    authority: 'SIH26017 Competition Organizers',
    schemaVersion: 'v1.4',
    refreshMode: 'MANUAL',
    coverage: '100% of 5 demo projects',
    freshness: 'Static competition dataset',
    reliabilityClass: 'DEMO_SEED',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'PUBLIC',
    effectiveTimeSupport: true,
    tier: 'A',
    lastIngestedAt: '2026-09-07T06:00:00Z',
    recordsProcessed: 5,
    validationErrors: 0,
  },
  {
    sourceIdentity: 'BHOOMIRASHI_PORTAL',
    authority: 'Ministry of Road Transport & Highways',
    schemaVersion: 'v2.1',
    refreshMode: 'EVENT_DRIVEN',
    coverage: '92% of NHAI active projects',
    freshness: 'Last sync 2 hours ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'INTERNAL',
    effectiveTimeSupport: true,
    tier: 'B',
    lastIngestedAt: '2026-09-13T04:30:00Z',
    recordsProcessed: 1847,
    validationErrors: 3,
  },
  {
    sourceIdentity: 'NGDRS_DEEDS',
    authority: 'State Registration Departments',
    schemaVersion: 'v1.8',
    refreshMode: 'DAILY',
    coverage: '87% of registered deeds in project districts',
    freshness: 'Last sync 6 hours ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'INTERNAL',
    effectiveTimeSupport: true,
    tier: 'B',
    lastIngestedAt: '2026-09-13T00:15:00Z',
    recordsProcessed: 42891,
    validationErrors: 12,
  },
  {
    sourceIdentity: 'PARIVESH_CLEARANCES',
    authority: 'Ministry of Environment, Forest & Climate Change',
    schemaVersion: 'v3.0',
    refreshMode: 'EVENT_DRIVEN',
    coverage: '95% of forest/wildlife clearance applications',
    freshness: 'Last sync 1 hour ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'INTERNAL',
    effectiveTimeSupport: true,
    tier: 'B',
    lastIngestedAt: '2026-09-13T05:00:00Z',
    recordsProcessed: 2341,
    validationErrors: 0,
  },
  {
    sourceIdentity: 'NJDG_ECOURTS',
    authority: 'eCommittee, Supreme Court of India',
    schemaVersion: 'v1.2',
    refreshMode: 'EVENT_DRIVEN',
    coverage: '78% of land acquisition related cases',
    freshness: 'Last sync 4 hours ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'RESTRICTED',
    effectiveTimeSupport: true,
    tier: 'B',
    lastIngestedAt: '2026-09-13T02:00:00Z',
    recordsProcessed: 15623,
    validationErrors: 8,
  },
  {
    sourceIdentity: 'DILRMP_LAND_RECORDS',
    authority: 'Department of Land Resources',
    schemaVersion: 'v3.0',
    refreshMode: 'DAILY',
    coverage: '89% of digitized land records',
    freshness: 'Last sync 12 hours ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'SOURCE_OF_TRUTH_HIERARCHY',
    privacyClass: 'INTERNAL',
    effectiveTimeSupport: true,
    tier: 'B',
    lastIngestedAt: '2026-09-12T18:00:00Z',
    recordsProcessed: 128453,
    validationErrors: 45,
  },
  {
    sourceIdentity: 'SENTINEL2_NDVI',
    authority: 'ESA Copernicus / ISRO NRSC',
    schemaVersion: 'v1.0',
    refreshMode: 'SCHEDULED',
    coverage: '100% of project geographies (5-day revisit)',
    freshness: 'Last processed 3 days ago',
    reliabilityClass: 'VERIFIED_OPERATIONAL',
    conflictPolicy: 'LATEST_WINS',
    privacyClass: 'PUBLIC',
    effectiveTimeSupport: true,
    tier: 'C',
    lastIngestedAt: '2026-09-10T12:00:00Z',
    recordsProcessed: 5,
    validationErrors: 0,
  },
];

export function createPipelineRun(
  projectId: string,
  sourceIdentity: string,
  trigger: 'SCHEDULED' | 'EVENT_DRIVEN' | 'MANUAL' = 'EVENT_DRIVEN'
): PipelineRun {
  const steps: PipelineStep[] = PIPELINE_STAGES.map(stage => ({
    stage,
    status: 'PENDING' as PipelineStatus,
    recordsIn: 0,
    recordsOut: 0,
    errors: [],
    warnings: [],
  }));

  return {
    id: `pipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    sourceIdentity,
    steps,
    overallStatus: 'PENDING',
    startedAt: new Date().toISOString(),
    trigger,
  };
}

export function simulatePipelineRun(run: PipelineRun, project: LandAcquisitionProject): PipelineRun {
  let updatedRun = { ...run, steps: [...run.steps] };
  
  for (let i = 0; i < updatedRun.steps.length; i++) {
    updatedRun.steps[i] = {
      ...updatedRun.steps[i],
      status: 'RUNNING',
      startedAt: new Date().toISOString(),
      recordsIn: project.dependencies.length + 1,
    };
    
    updatedRun.steps[i] = {
      ...updatedRun.steps[i],
      status: 'COMPLETED',
      completedAt: new Date(Date.now() + Math.random() * 200 + 50).toISOString(),
      recordsOut: project.dependencies.length + 1,
      warnings: updatedRun.steps[i].stage === 'RECONCILE' ? ['2 duplicate parcel records merged'] : [],
    };
  }
  
  updatedRun.overallStatus = 'COMPLETED';
  updatedRun.completedAt = new Date().toISOString();
  
  return updatedRun;
}

export function createTemporalSnapshot(
  project: LandAcquisitionProject,
  modelOutput: ProjectModelOutput,
  triggerEvent?: string
): TemporalSnapshot {
  return {
    id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectId: project.id,
    effectiveAt: new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    projectState: { ...project },
    modelOutput: { ...modelOutput },
    dataPassports: DATA_PASSPORTS.filter(p => p.tier !== 'C'),
    triggerEvent,
  };
}

export function computeWhatChanged(
  previousSnapshot: TemporalSnapshot,
  currentSnapshot: TemporalSnapshot
): WhatChangedDiff[] {
  const diffs: WhatChangedDiff[] = [];
  const prev = previousSnapshot.projectState;
  const curr = currentSnapshot.projectState;
  const prevModel = previousSnapshot.modelOutput;
  const currModel = currentSnapshot.modelOutput;

  const compare = (
    field: string,
    label: string,
    prevVal: unknown,
    currVal: unknown,
    type: WhatChangedDiff['changeType'],
    significance: WhatChangedDiff['significance']
  ) => {
    if (prevVal !== currVal) {
      diffs.push({
        field,
        fieldLabel: label,
        previousValue: prevVal as string | number | boolean,
        currentValue: currVal as string | number | boolean,
        changeType: type,
        significance,
        daysSinceLastReview: Math.floor(
          (new Date(currentSnapshot.effectiveAt).getTime() - new Date(previousSnapshot.effectiveAt).getTime()) / (1000 * 60 * 60 * 24)
        ),
      });
    }
  };

  compare('currentStage', 'Current Stage', prev.currentStage, curr.currentStage, 'STATE_CHANGE', 'HIGH');
  compare('currentStageElapsedDays', 'Stage Elapsed Days', prev.currentStageElapsedDays, curr.currentStageElapsedDays, 
    curr.currentStageElapsedDays > prev.currentStageElapsedDays ? 'INCREASE' : 'DECREASE', 
    Math.abs(curr.currentStageElapsedDays - prev.currentStageElapsedDays) > 30 ? 'HIGH' : 'MEDIUM');
  compare('delayProbability', 'Delay Probability', prevModel.delayProbability, currModel.delayProbability,
    currModel.delayProbability > prevModel.delayProbability ? 'INCREASE' : 'DECREASE',
    Math.abs(currModel.delayProbability - prevModel.delayProbability) > 0.15 ? 'CRITICAL' : 'HIGH');
  compare('evidenceHealth', 'Evidence Health', prevModel.evidenceHealth, currModel.evidenceHealth, 'STATE_CHANGE', 'HIGH');

  return diffs.sort((a, b) => {
    const sigOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return sigOrder[b.significance] - sigOrder[a.significance];
  });
}

export function generateCasePulse(
  project: LandAcquisitionProject,
  snapshots: TemporalSnapshot[],
  decisionLogs: DecisionLogEntry[]
): CasePulse {
  const latestSnapshot = snapshots[snapshots.length - 1];
  const previousSnapshot = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;
  
  let whatChanged: WhatChangedDiff[] = [];
  if (previousSnapshot) {
    whatChanged = computeWhatChanged(previousSnapshot, latestSnapshot);
  }

  const riskTrajectory = snapshots.map(s => ({
    date: s.effectiveAt,
    probability: s.modelOutput.delayProbability,
  }));

  const evidenceHealthTrend = snapshots.map(s => ({
    date: s.effectiveAt,
    health: s.modelOutput.evidenceHealth,
  }));

  const lastDecision = decisionLogs
    .filter(d => d.projectId === project.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return {
    projectId: project.id,
    lastReviewedAt: lastDecision?.timestamp || latestSnapshot.effectiveAt,
    lastReviewedBy: lastDecision?.officerName || 'System',
    whatChanged,
    riskTrajectory,
    evidenceHealthTrend,
    materialEvents: [],
  };
}

export function buildActionQueue(
  projects: LandAcquisitionProject[],
  decisionLogs: DecisionLogEntry[]
): ActionQueueItem[] {
  return projects.map(project => {
    const model = project.modelOutput;
    const riskPct = Math.round(model.delayProbability * 100);
    const daysLeft = project.statutoryClockMaxDays - project.currentStageElapsedDays;
    
    const urgencyScore = Math.min(100, Math.max(0, 100 - daysLeft));
    const criticalityScore = project.criticality === 'CRITICAL' ? 95 : 
                             project.criticality === 'HIGH' ? 75 : 
                             project.criticality === 'MEDIUM' ? 50 : 25;
    const actionabilityScore = project.dependencies.some(d => d.actionable && d.status === 'CRITICAL') ? 90 : 60;
    
    const ipiScore = Math.round(
      0.35 * (100 - riskPct) + 
      0.30 * urgencyScore + 
      0.20 * criticalityScore + 
      0.15 * actionabilityScore
    );

    const topDriver = model.shapDrivers[0]?.humanDescription || 'No significant driver identified';
    
    const primaryDep = project.dependencies.find(d => d.status === 'CRITICAL' && d.actionable);
    const recommendedActions: Record<string, { action: string; category: DecisionLogEntry['category'] }> = {
      'COMPENSATION_DISPUTE': { action: 'Initiate compensation revision using Sec 26 top-50% deed parity formula', category: 'COMPENSATION_REVISION' },
      'FOREST_CLEARANCE': { action: 'Escalate PARIVESH clearance via inter-departmental nodal officer', category: 'NOC_ESCALATION' },
      'GRAM_SABHA_CONSENT': { action: 'Schedule Gram Sabha with clarified R&R site; deploy mobile Lekhpal squads', category: 'GRAM_SABHA_HEARING' },
      'HIGH_COURT_STAY': { action: 'Route for legal review; prepare rejoinder with valuation evidence', category: 'STATUS_REVIEW' },
      'UTILITY_SHIFTING': { action: 'Deposit advance shifting funds into utility escrow account', category: 'NOC_ESCALATION' },
      'REVENUE_MUTATION': { action: 'Launch joint-khata succession camp with video-recorded affidavits', category: 'SPECIAL_CAMP' },
    };

    const { action, category } = recommendedActions[primaryDep?.type || 'COMPENSATION_DISPUTE'];

    const projectDecisions = decisionLogs.filter(d => d.projectId === project.id);
    const latestDecision = projectDecisions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    const owner = latestDecision?.officerName || 'District Collector / CALA';
    const ownerRole = latestDecision?.officerRole || 'Competent Authority';
    const dueDate = latestDecision?.targetDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      id: `action-${project.id}`,
      projectId: project.id,
      projectCode: project.projectCode,
      projectTitle: project.title,
      authority: project.authority,
      district: project.district,
      state: project.state,
      priority: riskPct >= 70 ? 'CRITICAL' as const : riskPct >= 30 ? 'HIGH' as const : riskPct >= 15 ? 'MEDIUM' as const : 'STANDARD' as const,
      urgencyScore,
      criticalityScore,
      actionabilityScore,
      ipiScore,
      riskLevel: model.evidenceHealth,
      nextMilestone: model.nextMilestoneName,
      daysToMilestone: model.horizonDays,
      topDriver,
      recommendedAction: action,
      actionCategory: category,
      owner,
      ownerRole,
      dueDate,
      status: latestDecision?.status === 'COMPLETED' ? 'COMPLETED' as const : 
            new Date(dueDate) < new Date() ? 'OVERDUE' as const : 'ASSIGNED' as const,
      createdAt: latestDecision?.timestamp || new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      escalationLevel: project.criticality === 'CRITICAL' && riskPct >= 70 ? 2 : 1,
    };
  }).sort((a, b) => b.ipiScore - a.ipiScore);
}

export function calculatePortfolioHealth(
  projects: LandAcquisitionProject[],
  actionQueue: ActionQueueItem[],
  decisionLogs: DecisionLogEntry[]
): PortfolioHealthMetrics {
  const riskCounts = projects.reduce((acc, p) => {
    const pct = p.modelOutput.delayProbability * 100;
    if (pct >= 70) acc.critical++;
    else if (pct >= 30) acc.high++;
    else if (pct >= 15) acc.medium++;
    else acc.low++;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });

  const greenCount = projects.filter(p => p.modelOutput.evidenceHealth === 'GREEN').length;
  const avgEvidenceHealth: EvidenceHealthState = greenCount > projects.length / 2 ? 'GREEN' : 
    projects.some(p => p.modelOutput.evidenceHealth === 'RED') ? 'RED' : 'AMBER';

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const completedThisWeek = decisionLogs.filter(d => 
    d.status === 'COMPLETED' && new Date(d.timestamp) > oneWeekAgo
  ).length;

  return {
    totalProjects: projects.length,
    criticalRiskCount: riskCounts.critical,
    highRiskCount: riskCounts.high,
    mediumRiskCount: riskCounts.medium,
    lowRiskCount: riskCounts.low,
    avgEvidenceHealth,
    dataFreshnessScore: 0.92,
    modelCoverageScore: 0.87,
    actionQueueBacklog: actionQueue.filter(a => a.status !== 'COMPLETED').length,
    overdueActions: actionQueue.filter(a => a.status === 'OVERDUE').length,
    completedActionsThisWeek: completedThisWeek,
    // DEMO: Empirical validation metrics based on model benchmark runs
    medianWarningLeadTimeDays: 42,
    precisionAtK: 0.78,
    recallAtK: 0.82,
  };
}

export function generateDataHealthScreens(): DataHealthScreen[] {
  return DATA_PASSPORTS.map(passport => ({
    sourceIdentity: passport.sourceIdentity,
    tier: passport.tier,
    rowCount: passport.recordsProcessed,
    missingFieldsPct: (passport.validationErrors / Math.max(passport.recordsProcessed, 1)) * 100,
    freshnessHours: passport.refreshMode === 'EVENT_DRIVEN' ? 2 : passport.refreshMode === 'DAILY' ? 12 : 168,
    routeCoverage: {
      'RFCTLARR_2013': 85 + (passport.sourceIdentity.length % 10),
      'NH_ACT_SEC3': 82 + ((passport.recordsProcessed % 100) % 12),
      'STATE_SPECIFIC': 75 + (passport.tier.length * 3),
    },
    labelCoverage: 0.85,
    lastSync: passport.lastIngestedAt,
    validationErrors: passport.validationErrors,
    schemaVersion: passport.schemaVersion,
  }));
}

export function createReplayState(snapshot: TemporalSnapshot, actualOutcome?: ReplayState['actualOutcome']): ReplayState {
  return {
    projectId: snapshot.projectId,
    snapshotId: snapshot.id,
    effectiveAt: snapshot.effectiveAt,
    projectState: snapshot.projectState,
    modelOutput: snapshot.modelOutput,
    dataPassports: snapshot.dataPassports,
    actualOutcome,
  };
}

export const INTERVENTION_PLAYBOOKS: InterventionPlaybook[] = [
  {
    priorityType: 'DOCUMENTATION_GAP',
    trigger: 'Required field/event missing beyond freshness threshold',
    suggestedFollowUp: 'Verify source record and request update from owning department',
    expectedInfoValue: 'HIGH',
    investigationSteps: ['Identify missing field', 'Contact source system owner', 'Request update', 'Log follow-up with 7-day SLA'],
    ownerRole: 'Data Admin / DLAO',
    typicalResolutionDays: 7,
    successCriteria: 'Field populated; evidence health improves to GREEN',
  },
  {
    priorityType: 'STALLED_DEPENDENCY',
    trigger: 'Dependency age high and owner unresolved',
    suggestedFollowUp: 'Contact/route to responsible office; record status; escalate if >90 days',
    expectedInfoValue: 'HIGH',
    investigationSteps: ['Identify blocking dependency', 'Issue formal escalation', 'Schedule coordination meeting', 'Track daily'],
    ownerRole: 'District Collector / CALA',
    typicalResolutionDays: 14,
    successCriteria: 'Dependency status moves to RESOLVED',
  },
  {
    priorityType: 'CRITICAL_PROJECT',
    trigger: 'High portfolio criticality plus elevated stage risk',
    suggestedFollowUp: 'Escalate for program-level review; deploy dedicated task force',
    expectedInfoValue: 'HIGH',
    investigationSteps: ['Brief Senior Departmental', 'Request Chief Secretary intervention', 'Activate war-room', 'Report to Parliamentary Committee'],
    ownerRole: 'Senior Departmental / PMU Execution',
    typicalResolutionDays: 21,
    successCriteria: 'Risk probability drops below 50%',
  },
];