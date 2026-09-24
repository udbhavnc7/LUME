import { OutcomeRecord, InstitutionalMemory, DecisionLogEntry } from '../types';

const DEMO_OUTCOMES: OutcomeRecord[] = [
  {
    id: 'out-01',
    projectId: 'proj-nh48-pune-satara',
    actionId: 'dec-01',
    actionTaken: 'Compensation verification',
    owner: 'Smt. Ananya Deshmukh, IAS',
    startDate: '2026-09-05',
    expectedResult: 'Resolve compensation gap using Sec 26 formula',
    actualResult: 'Dependency resolved - revised compensation accepted',
    resolutionDate: '2026-09-18',
    outcomeStatus: 'SUCCESS',
    resolutionTimeDays: 13,
    recordCreatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'out-02',
    projectId: 'proj-bengaluru-metro-ph4',
    actionId: 'dec-03',
    actionTaken: 'Utility shifting fund deposit',
    owner: 'K. Venkatesh, KAS',
    startDate: '2026-09-02',
    expectedResult: 'Unblock KPTCL 66kV transmission tower shifting',
    actualResult: 'Funds deposited, KPTCL initiated shifting within 5 days',
    resolutionDate: '2026-09-10',
    outcomeStatus: 'SUCCESS',
    resolutionTimeDays: 8,
    recordCreatedAt: '2026-09-10T10:00:00Z',
  },
];

export function recordOutcome(
  actionEntry: DecisionLogEntry,
  actualResult: string,
  outcomeStatus: OutcomeRecord['outcomeStatus']
): OutcomeRecord {
  const startDate = new Date(actionEntry.timestamp);
  const resolutionDate = new Date();
  const resolutionTimeDays = Math.round(
    (resolutionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    id: `out-${Date.now()}`,
    projectId: actionEntry.projectId,
    actionId: actionEntry.id,
    actionTaken: actionEntry.actionTaken,
    owner: actionEntry.officerName,
    startDate: startDate.toISOString().split('T')[0],
    expectedResult: actionEntry.notes || 'Action completed',
    actualResult,
    resolutionDate: resolutionDate.toISOString().split('T')[0],
    outcomeStatus,
    resolutionTimeDays,
    recordCreatedAt: resolutionDate.toISOString(),
  };
}

export function getOutcomesForProject(projectId: string): OutcomeRecord[] {
  return DEMO_OUTCOMES.filter(o => o.projectId === projectId);
}

export function getInstitutionalMemory(): InstitutionalMemory[] {
  return DEMO_OUTCOMES.map(outcome => ({
    id: `mem-${outcome.id}`,
    signalType: 'DEPENDENCY_RESOLVED',
    predictionSnapshot: 'Prior risk assessment showed elevated delay probability',
    recommendation: outcome.actionTaken,
    humanAction: `Assigned to ${outcome.owner}`,
    outcome: outcome.actualResult,
    outcomeRecordId: outcome.id,
    projectId: outcome.projectId,
    interventionType: outcome.actionTaken,
    resolutionTimeDays: outcome.resolutionTimeDays,
    createdAt: outcome.recordCreatedAt,
    reusableInsight: `${outcome.actionTaken} resolved in ${outcome.resolutionTimeDays} days - consider similar approach for comparable cases`,
  }));
}

export function getOutcomeStats(projectIds: string[]): {
  total: number;
  successful: number;
  avgResolutionDays: number;
} {
  const outcomes = projectIds.flatMap(id => getOutcomesForProject(id));
  const successful = outcomes.filter(o => o.outcomeStatus === 'SUCCESS').length;
  const avgResolutionDays = outcomes.length > 0
    ? outcomes.reduce((sum, o) => sum + o.resolutionTimeDays, 0) / outcomes.length
    : 0;
  return {
    total: outcomes.length,
    successful,
    avgResolutionDays: Math.round(avgResolutionDays),
  };
}
