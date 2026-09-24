export interface SurvivalObservation {
  daysToEventOrCensor: number;
  eventObserved: boolean;
  stratum?: string;
}

export interface SurvivalPoint {
  day: number;
  survivalProbability: number;
  nAtRisk: number;
}

export interface SurvivalEstimate {
  status: 'COMPUTED' | 'ABSENT';
  reason?: 'INSUFFICIENT_DATA' | 'NO_EVENTS' | 'EMPTY_REFERENCE_SET';
  method: 'KAPLAN_MEIER';
  n?: number;
  confidenceIntervalLow?: number;
  confidenceIntervalHigh?: number;
  points?: SurvivalPoint[];
  medianDays?: number | null;
}

const MIN_N = 5;

export function kaplanMeier(observations: readonly SurvivalObservation[]): SurvivalEstimate {
  const n = observations.length;
  if (n === 0) {
    return { status: 'ABSENT', reason: 'EMPTY_REFERENCE_SET', method: 'KAPLAN_MEIER' };
  }
  if (n < MIN_N) {
    return { status: 'ABSENT', reason: 'INSUFFICIENT_DATA', method: 'KAPLAN_MEIER' };
  }
  const events = observations.filter((o) => o.eventObserved).length;
  if (events === 0) {
    return { status: 'ABSENT', reason: 'NO_EVENTS', method: 'KAPLAN_MEIER', n };
  }

  const sorted = [...observations].sort((a, b) => a.daysToEventOrCensor - b.daysToEventOrCensor);
  const times = Array.from(new Set(sorted.map((o) => o.daysToEventOrCensor))).sort((a, b) => a - b);

  let atRisk = n;
  let survival = 1;
  const points: SurvivalPoint[] = [{ day: 0, survivalProbability: 1, nAtRisk: n }];
  let medianDays: number | null = null;

  for (const t of times) {
    const d = sorted.filter((o) => o.daysToEventOrCensor === t && o.eventObserved).length;
    const c = sorted.filter((o) => o.daysToEventOrCensor === t && !o.eventObserved).length;
    if (atRisk > 0 && d > 0) {
      survival *= 1 - d / atRisk;
      points.push({ day: t, survivalProbability: survival, nAtRisk: atRisk });
      if (medianDays === null && survival <= 0.5) {
        medianDays = t;
      }
    }
    atRisk -= d + c;
    if (atRisk <= 0) break;
  }

  const se = Math.sqrt(Math.max(survival * (1 - survival), 0) / Math.max(n, 1));
  return {
    status: 'COMPUTED',
    method: 'KAPLAN_MEIER',
    n,
    points,
    medianDays,
    confidenceIntervalLow: Math.max(0, survival - 1.96 * se),
    confidenceIntervalHigh: Math.min(1, survival + 1.96 * se),
  };
}

export function stratumReferenceCount(
  observations: readonly SurvivalObservation[],
  stratum: string
): number {
  return observations.filter((o) => o.stratum === stratum).length;
}
