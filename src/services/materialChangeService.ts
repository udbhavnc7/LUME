import {
  LandAcquisitionProject,
  MaterialChange,
  TemporalSnapshot,
} from '../types';

const MATERIALITY_THRESHOLDS = {
  RISK_PROBABILITY_CHANGE: 0.10,
  STAGE_ELAPSED_DAYS_CHANGE: 14,
  DEPENDENCY_AGE_THRESHOLD: 60,
  INACTIVITY_DAYS: 30,
  CRITICALITY_CHANGE: true,
  MILESTONE_APPROACHING_DAYS: 30,
};

export function detectMaterialChanges(
  previousProject: LandAcquisitionProject,
  currentProject: LandAcquisitionProject,
  previousSnapshot: TemporalSnapshot,
  currentSnapshot: TemporalSnapshot
): MaterialChange[] {
  const changes: MaterialChange[] = [];
  const now = new Date().toISOString();

  if (previousProject.currentStage !== currentProject.currentStage) {
    changes.push(createChange(
      currentProject.id,
      'currentStage',
      previousProject.currentStage,
      currentProject.currentStage,
      'STAGE_TRANSITION',
      0.9,
      'CRITICAL',
      now
    ));
  }

  const riskChange = currentProject.modelOutput.delayProbability - previousProject.modelOutput.delayProbability;
  if (Math.abs(riskChange) >= MATERIALITY_THRESHOLDS.RISK_PROBABILITY_CHANGE) {
    changes.push(createChange(
      currentProject.id,
      'delayProbability',
      previousProject.modelOutput.delayProbability,
      currentProject.modelOutput.delayProbability,
      riskChange > 0 ? 'MILESTONE_MISSED' : 'DEPENDENCY_RESOLVED',
      Math.min(1, Math.abs(riskChange) * 3),
      Math.abs(riskChange) > 0.25 ? 'CRITICAL' : 'MATERIAL',
      now
    ));
  }

  if (previousProject.criticality !== currentProject.criticality) {
    changes.push(createChange(
      currentProject.id,
      'criticality',
      previousProject.criticality,
      currentProject.criticality,
      'CRITICALITY_CHANGE',
      0.85,
      'CRITICAL',
      now
    ));
  }

  const prevDepIds = new Set(previousProject.dependencies.map(d => d.id));
  const currDepIds = new Set(currentProject.dependencies.map(d => d.id));

  for (const dep of currentProject.dependencies) {
    if (!prevDepIds.has(dep.id)) {
      changes.push(createChange(
        currentProject.id,
        `dependency.${dep.id}`,
        'None',
        dep.description,
        'NEW_DEPENDENCY',
        0.7,
        dep.status === 'CRITICAL' ? 'CRITICAL' : 'MATERIAL',
        now
      ));
    }
  }

  for (const dep of previousProject.dependencies) {
    if (!currDepIds.has(dep.id)) {
      changes.push(createChange(
        currentProject.id,
        `dependency.${dep.id}`,
        dep.description,
        'Resolved/Removed',
        'DEPENDENCY_RESOLVED',
        0.6,
        'MATERIAL',
        now
      ));
    }
  }

  for (const dep of currentProject.dependencies) {
    const prevDep = previousProject.dependencies.find(d => d.id === dep.id);
    if (prevDep && dep.status !== prevDep.status) {
      changes.push(createChange(
        currentProject.id,
        `dependency.${dep.id}.status`,
        prevDep.status,
        dep.status,
        dep.status === 'CRITICAL' ? 'NEW_DEPENDENCY' : 'DEPENDENCY_RESOLVED',
        dep.status === 'CRITICAL' ? 0.8 : 0.5,
        dep.status === 'CRITICAL' ? 'CRITICAL' : 'MATERIAL',
        now
      ));
    }
  }

  if (previousProject.currentStageElapsedDays > 0) {
    const elapsedDiff = currentProject.currentStageElapsedDays - previousProject.currentStageElapsedDays;
    if (elapsedDiff >= MATERIALITY_THRESHOLDS.INACTIVITY_DAYS) {
      changes.push(createChange(
        currentProject.id,
        'currentStageElapsedDays',
        previousProject.currentStageElapsedDays,
        currentProject.currentStageElapsedDays,
        'INACTIVITY',
        0.4,
        'MATERIAL',
        now
      ));
    }
  }

  const daysRemaining = currentProject.statutoryClockMaxDays - currentProject.currentStageElapsedDays;
  if (daysRemaining <= MATERIALITY_THRESHOLDS.MILESTONE_APPROACHING_DAYS && daysRemaining > 0) {
    changes.push(createChange(
      currentProject.id,
      'daysRemaining',
      -1,
      daysRemaining,
      'MILESTONE_APPROACHING',
      0.75,
      daysRemaining <= 14 ? 'CRITICAL' : 'MATERIAL',
      now
    ));
  }

  if (previousProject.modelOutput.evidenceHealth !== currentProject.modelOutput.evidenceHealth) {
    const isDegraded = currentProject.modelOutput.evidenceHealth === 'RED' ||
      (currentProject.modelOutput.evidenceHealth === 'AMBER' && previousProject.modelOutput.evidenceHealth === 'GREEN');
    changes.push(createChange(
      currentProject.id,
      'evidenceHealth',
      previousProject.modelOutput.evidenceHealth,
      currentProject.modelOutput.evidenceHealth,
      isDegraded ? 'EVIDENCE_STALE' : 'NEW_DEPENDENCY',
      isDegraded ? 0.65 : 0.4,
      isDegraded ? 'MATERIAL' : 'INFORMATIONAL',
      now
    ));
  }

  return changes.sort((a, b) => b.materialityScore - a.materialityScore);
}

function createChange(
  projectId: string,
  field: string,
  previousValue: string | number,
  currentValue: string | number,
  changeType: MaterialChange['changeType'],
  materialityScore: number,
  materialityLevel: MaterialChange['materialityLevel'],
  detectedAt: string
): MaterialChange {
  return {
    id: `mc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    projectId,
    field,
    previousValue,
    currentValue,
    changeType,
    materialityScore,
    materialityLevel,
    detectedAt,
    affectedFeatures: [field],
    triggersRescore: materialityLevel !== 'INFORMATIONAL',
  };
}

export function shouldTriggerRescore(changes: MaterialChange[]): boolean {
  return changes.some(c => c.triggersRescore);
}

export function getCriticalChanges(changes: MaterialChange[]): MaterialChange[] {
  return changes.filter(c => c.materialityLevel === 'CRITICAL');
}

export function getMaterialChanges(changes: MaterialChange[]): MaterialChange[] {
  return changes.filter(c => c.materialityLevel === 'MATERIAL' || c.materialityLevel === 'CRITICAL');
}

export function summarizeChanges(changes: MaterialChange[]): string {
  const critical = changes.filter(c => c.materialityLevel === 'CRITICAL').length;
  const material = changes.filter(c => c.materialityLevel === 'MATERIAL').length;
  const info = changes.filter(c => c.materialityLevel === 'INFORMATIONAL').length;

  if (critical === 0 && material === 0) return 'No material changes detected';
  return `${critical} critical, ${material} material, ${info} informational`;
}
