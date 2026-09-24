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

export const STATUTORY_CLOCK_RULES: readonly StatutoryClockRule[] = Object.freeze<StatutoryClockRule[]>([]);

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
