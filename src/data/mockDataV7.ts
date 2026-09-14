import { 
  LandAcquisitionProject, 
  CitizenParcelRecord, 
  DecisionLogEntry,
  TemporalSnapshot,
  CasePulse,
  PipelineRun,
  DataPassport,
  ReplayState,
  ProjectModelOutput,
} from '../types';
import { MOCK_PROJECTS, MOCK_CITIZEN_PARCELS, MOCK_DECISION_LOGS } from './mockData';
import { 
  createTemporalSnapshot, 
  generateCasePulse, 
  createPipelineRun,
  simulatePipelineRun,
  createReplayState,
  DATA_PASSPORTS,
} from '../services/dataPipeline';

function generateHistoricalSnapshots(project: LandAcquisitionProject): TemporalSnapshot[] {
  const snapshots: TemporalSnapshot[] = [];
  const baseDate = new Date('2026-08-01');
  
  let currentProbability = project.modelOutput.delayProbability;
  let currentMissDays = project.modelOutput.predictedMissDays;
  let currentStageElapsed = project.currentStageElapsedDays;
  let currentEvidenceHealth = project.modelOutput.evidenceHealth;
  
  for (let i = 0; i < 6; i++) {
    const snapshotDate = new Date(baseDate);
    snapshotDate.setDate(snapshotDate.getDate() + i * 7);
    
    if (i > 0) {
      const probChange = (Math.random() - 0.4) * 0.08;
      currentProbability = Math.max(0.05, Math.min(0.98, currentProbability + probChange));
      currentMissDays = Math.max(0, Math.round(currentMissDays + (Math.random() - 0.3) * 10));
      currentStageElapsed += 7;
      
      if (currentProbability > 0.7 && currentEvidenceHealth === 'GREEN') {
        currentEvidenceHealth = 'AMBER';
      } else if (currentProbability < 0.3 && currentEvidenceHealth !== 'GREEN') {
        currentEvidenceHealth = 'GREEN';
      }
    }
    
    const historicalModel: ProjectModelOutput = {
      ...project.modelOutput,
      delayProbability: Number(currentProbability.toFixed(2)),
      predictedMissDays: currentMissDays,
      horizonDays: project.modelOutput.horizonDays - i * 7,
      evidenceHealth: currentEvidenceHealth,
      lastUpdated: snapshotDate.toISOString(),
    };
    
    const historicalProject: LandAcquisitionProject = {
      ...project,
      currentStageElapsedDays: currentStageElapsed,
      modelOutput: historicalModel,
    };
    
    const triggerEvents = [
      'Initial SIH dataset load',
      'NGDRS deed update received',
      'PARIVESH clearance status change',
      'NJDG case metadata sync',
      'Sentinel-2 NDVI refresh',
      'Manual officer review',
    ];
    
    snapshots.push(createTemporalSnapshot(historicalProject, historicalModel, triggerEvents[i]));
  }
  
  snapshots.push(createTemporalSnapshot(project, project.modelOutput, 'Current live state'));
  
  return snapshots;
}

export const PROJECT_SNAPSHOTS: Record<string, TemporalSnapshot[]> = {};

MOCK_PROJECTS.forEach(project => {
  PROJECT_SNAPSHOTS[project.id] = generateHistoricalSnapshots(project);
});

export const PROJECT_CASE_PULSES: Record<string, CasePulse> = {};

MOCK_PROJECTS.forEach(project => {
  PROJECT_CASE_PULSES[project.id] = generateCasePulse(project, PROJECT_SNAPSHOTS[project.id], MOCK_DECISION_LOGS);
});

export const PIPELINE_RUNS: Record<string, PipelineRun[]> = {};

MOCK_PROJECTS.forEach(project => {
  const runs: PipelineRun[] = [];
  for (let i = 0; i < 3; i++) {
    const run = createPipelineRun(project.id, 'SIH_PROVIDED_DATASET', i === 0 ? 'MANUAL' : 'SCHEDULED');
    runs.push(simulatePipelineRun(run, project));
  }
  PIPELINE_RUNS[project.id] = runs;
});

export const REPLAY_STATES: ReplayState[] = MOCK_PROJECTS.map(project => {
  const snapshots = PROJECT_SNAPSHOTS[project.id];
  const midSnapshot = snapshots[Math.floor(snapshots.length / 2)];
  
  let actualOutcome: ReplayState['actualOutcome'] | undefined;
  if (project.id === 'proj-nh65-solapur-vijayawada') {
    actualOutcome = {
      finalDelayMonths: 3,
      finalOutcome: 'Completed on schedule after deployment of drone-based cadastral demarcation',
      resolutionDate: '2026-10-15',
    };
  } else if (project.id === 'proj-bengaluru-metro-ph4') {
    actualOutcome = {
      finalDelayMonths: 2,
      finalOutcome: 'Resolved via multi-agency taskforce weekly review under Chief Secretary',
      resolutionDate: '2026-11-28',
    };
  }
  
  return createReplayState(midSnapshot, actualOutcome);
});

export const V7_DATA_PASSPORTS = DATA_PASSPORTS;

export function getProjectSnapshots(projectId: string): TemporalSnapshot[] {
  return PROJECT_SNAPSHOTS[projectId] || [];
}

export function getProjectCasePulse(projectId: string): CasePulse | undefined {
  return PROJECT_CASE_PULSES[projectId];
}

export function getProjectPipelineRuns(projectId: string): PipelineRun[] {
  return PIPELINE_RUNS[projectId] || [];
}

export function getReplayState(projectId: string): ReplayState | undefined {
  return REPLAY_STATES.find(r => r.projectId === projectId);
}

export { MOCK_PROJECTS, MOCK_CITIZEN_PARCELS, MOCK_DECISION_LOGS };