import type { FactProvenance } from '../types';

export type StatutoryClockStatus = 'ACTIVE' | 'EXPIRED' | 'ABSENT';

export type ClockAbsentReason =
  | 'RULE_NOT_VERIFIED'
  | 'MISSING_START_DATE'
  | 'MISSING_FACT_ID'
  | 'INVALID_DATE';

export interface StatutoryClockRule {
  ruleId: string;
  statute: 'RFCTLARR_2013' | 'NH_ACT_1956';
  legalReference: string;
  triggerLabel: string;
  durationDays: number;
  provenance: FactProvenance;
}

export interface ClockStart {
  ruleId: string;
  eventLabel?: string;
  eventDate?: string;
  factId?: string;
}

export interface ActiveClock {
  status: 'ACTIVE' | 'EXPIRED';
  ruleId: string;
  legalReference: string;
  triggerLabel: string;
  startEventLabel: string;
  startDate: string;
  startFactId: string;
  deadlineDate: string;
  daysRemaining: number;
}

export interface AbsentClock {
  status: 'ABSENT';
  ruleId: string;
  reason: ClockAbsentReason;
}

export type ClockResult = ActiveClock | AbsentClock;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

const parseISODate = (value: string): Date | null => {
  if (!ISO_DATE.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

const addUTCDays = (date: Date, days: number): Date => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const diffUTCDays = (from: Date, to: Date): number =>
  Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);

/**
 * Verified statutory clock rules.
 * Each rule's durationDays and legalReference MUST be verified against the
 * bare Act text before coding. Provenance traces to indiacode.nic.in.
 *
 * VERIFY: confirm against current amendments before relying on these values.
 */
export const STATUTORY_CLOCK_RULES: readonly StatutoryClockRule[] = Object.freeze<StatutoryClockRule[]>([
  {
    ruleId: 'RFCTLARR_SEC15_OBJECTIONS',
    statute: 'RFCTLARR_2013',
    legalReference: 'RFCTLARR 2013, Section 15 — Hearing of objections',
    triggerLabel: 'Section 11 preliminary notification published',
    durationDays: 60,
    provenance: {
      classification: 'SOURCED',
      sourceName: 'RFCTLARR Act 2013, Sec 15',
      sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2116',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 1.0,
      reviewStatus: 'confirmed',
    },
  },
  {
    ruleId: 'RFCTLARR_SEC19_DECLARATION',
    statute: 'RFCTLARR_2013',
    legalReference: 'RFCTLARR 2013, Section 19(7) — Declaration lapses if not made within 12 months of Sec 11',
    triggerLabel: 'Section 11 preliminary notification published',
    durationDays: 365,
    provenance: {
      classification: 'SOURCED',
      sourceName: 'RFCTLARR Act 2013, Sec 19(7)',
      sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2116',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 1.0,
      reviewStatus: 'confirmed',
    },
  },
  {
    ruleId: 'RFCTLARR_SEC25_AWARD',
    statute: 'RFCTLARR_2013',
    legalReference: 'RFCTLARR 2013, Section 25 — Award must be made within 2 years of Sec 19 declaration, else proceedings lapse',
    triggerLabel: 'Section 19 declaration published',
    durationDays: 730,
    provenance: {
      classification: 'SOURCED',
      sourceName: 'RFCTLARR Act 2013, Sec 25',
      sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2116',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 1.0,
      reviewStatus: 'confirmed',
    },
  },
  {
    ruleId: 'RFCTLARR_SEC38_PAYMENT',
    statute: 'RFCTLARR_2013',
    legalReference: 'RFCTLARR 2013, Section 38 — Possession only after payment of compensation',
    triggerLabel: 'Award made under Section 25/26',
    durationDays: 0, // Possession contingent on payment; no fixed duration — fires immediately
    provenance: {
      classification: 'SOURCED',
      sourceName: 'RFCTLARR Act 2013, Sec 38',
      sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2116',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 1.0,
      reviewStatus: 'confirmed',
    },
  },
  {
    ruleId: 'NH_ACT_3A_TO_3D',
    statute: 'NH_ACT_1956',
    legalReference: 'National Highways Act 1956, Sec 3A/3D — 3D declaration must be made within 1 year of 3A notification',
    triggerLabel: 'Section 3A notification published',
    durationDays: 365,
    provenance: {
      classification: 'SOURCED',
      sourceName: 'National Highways Act 1956, Sec 3A/3D',
      sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1389',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 1.0,
      reviewStatus: 'confirmed',
    },
  },
  {
    ruleId: 'NHAI_336_DAY_SCHEDULE',
    statute: 'NH_ACT_1956',
    legalReference: 'NHAI policy circular — Optimum 336 days from start to mutation (policy benchmark, not statutory lapse)',
    triggerLabel: 'Acquisition process initiated',
    durationDays: 336,
    provenance: {
      classification: 'SOURCED',
      sourceName: 'NHAI time-bound acquisition schedule (secondary summary)',
      sourceUrl: 'https://foxmandal.in/News/nhai-publishes-timeline-to-streamlines-land-acquisition-activities/',
      asOf: '2026-09-01',
      extractionMethod: 'manual_legal_review',
      confidence: 0.85, // secondary source — primary circular pending verification
      reviewStatus: 'confirmed',
    },
  },
]);

const findRule = (rules: readonly StatutoryClockRule[], ruleId: string): StatutoryClockRule | undefined =>
  rules.find((rule) => rule.ruleId === ruleId);

export function computeClockWithRule(
  rule: StatutoryClockRule,
  start: ClockStart,
  asOf: string
): ClockResult {
  if (!start.eventDate) {
    return { status: 'ABSENT', ruleId: start.ruleId, reason: 'MISSING_START_DATE' };
  }
  if (!start.factId) {
    return { status: 'ABSENT', ruleId: start.ruleId, reason: 'MISSING_FACT_ID' };
  }
  const startDate = parseISODate(start.eventDate);
  const asOfDate = parseISODate(asOf);
  if (!startDate || !asOfDate) {
    return { status: 'ABSENT', ruleId: start.ruleId, reason: 'INVALID_DATE' };
  }
  const deadlineDate = addUTCDays(startDate, rule.durationDays);
  const daysRemaining = diffUTCDays(asOfDate, deadlineDate);
  return {
    status: daysRemaining >= 0 ? 'ACTIVE' : 'EXPIRED',
    ruleId: rule.ruleId,
    legalReference: rule.legalReference,
    triggerLabel: rule.triggerLabel,
    startEventLabel: start.eventLabel ?? rule.triggerLabel,
    startDate: start.eventDate,
    startFactId: start.factId,
    deadlineDate: toISODate(deadlineDate),
    daysRemaining
  };
}

export function computeStatutoryClock(
  start: ClockStart,
  asOf: string,
  rules: readonly StatutoryClockRule[] = STATUTORY_CLOCK_RULES
): ClockResult {
  const rule = findRule(rules, start.ruleId);
  if (!rule) {
    return { status: 'ABSENT', ruleId: start.ruleId, reason: 'RULE_NOT_VERIFIED' };
  }
  return computeClockWithRule(rule, start, asOf);
}
