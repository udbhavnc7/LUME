import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FactProvenance } from '../src/types';
import {
  computeClockWithRule,
  computeStatutoryClock,
  STATUTORY_CLOCK_RULES,
  type StatutoryClockRule
} from '../src/services/statutoryClockEngine';

const confirmedProvenance: FactProvenance = {
  classification: 'SOURCED',
  sourceName: 'Test fixture source',
  sourceUrl: 'https://example.invalid/fixture',
  asOf: '2026-01-01',
  extractionMethod: 'manual-transcription',
  confidence: 1,
  reviewStatus: 'confirmed'
};

const fixtureRule: StatutoryClockRule = {
  ruleId: 'TEST_FIXTURE_CLOCK',
  statute: 'RFCTLARR_2013',
  legalReference: 'TEST FIXTURE — not a statute citation',
  triggerLabel: 'Fixture publication',
  durationDays: 60,
  provenance: confirmedProvenance
};

describe('statutory clock engine', () => {
  it('ships an empty production rule registry', () => {
    assert.equal(STATUTORY_CLOCK_RULES.length, 0);
  });

  it('returns ABSENT with RULE_NOT_VERIFIED for any unregistered rule', () => {
    const result = computeStatutoryClock(
      { ruleId: 'UNVERIFIED_RULE', eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-01-15'
    );
    assert.deepEqual(result, {
      status: 'ABSENT',
      ruleId: 'UNVERIFIED_RULE',
      reason: 'RULE_NOT_VERIFIED'
    });
  });

  it('returns ABSENT when the start date is missing', () => {
    const result = computeClockWithRule(fixtureRule, { ruleId: fixtureRule.ruleId, factId: 'fact-1' }, '2026-01-15');
    assert.equal(result.status, 'ABSENT');
    assert.equal(result.status === 'ABSENT' && result.reason, 'MISSING_START_DATE');
  });

  it('returns ABSENT when the start fact id is missing', () => {
    const result = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventDate: '2026-01-01' },
      '2026-01-15'
    );
    assert.equal(result.status, 'ABSENT');
    assert.equal(result.status === 'ABSENT' && result.reason, 'MISSING_FACT_ID');
  });

  it('returns ABSENT on non-ISO or unparseable dates', () => {
    const badStart = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventDate: '01/01/2026', factId: 'fact-1' },
      '2026-01-15'
    );
    assert.equal(badStart.status, 'ABSENT');
    assert.equal(badStart.status === 'ABSENT' && badStart.reason, 'INVALID_DATE');

    const badAsOf = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventDate: '2026-01-01', factId: 'fact-1' },
      'not-a-date'
    );
    assert.equal(badAsOf.status, 'ABSENT');
    assert.equal(badAsOf.status === 'ABSENT' && badAsOf.reason, 'INVALID_DATE');
  });

  it('computes an ACTIVE clock with deadline, days remaining, and legal reference', () => {
    const result = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventLabel: 'Fixture notice', eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-01-15'
    );
    assert.equal(result.status, 'ACTIVE');
    assert.equal(result.deadlineDate, '2026-03-02');
    assert.equal(result.daysRemaining, 46);
    assert.equal(result.startFactId, 'fact-1');
    assert.equal(result.legalReference, 'TEST FIXTURE — not a statute citation');
    assert.equal(result.startEventLabel, 'Fixture notice');
  });

  it('flips to EXPIRED after the deadline day', () => {
    const result = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-03-02'
    );
    assert.equal(result.status, 'ACTIVE');
    assert.equal(result.daysRemaining, 0);

    const past = computeClockWithRule(
      fixtureRule,
      { ruleId: fixtureRule.ruleId, eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-03-03'
    );
    assert.equal(past.status, 'EXPIRED');
    assert.equal(past.daysRemaining, -1);
  });

  it('models clocks independently by rule id', () => {
    const otherRule: StatutoryClockRule = { ...fixtureRule, ruleId: 'TEST_FIXTURE_CLOCK_B', durationDays: 30 };
    const rules = [fixtureRule, otherRule];
    const short = computeStatutoryClock(
      { ruleId: 'TEST_FIXTURE_CLOCK_B', eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-01-15',
      rules
    );
    const long = computeStatutoryClock(
      { ruleId: 'TEST_FIXTURE_CLOCK', eventDate: '2026-01-01', factId: 'fact-1' },
      '2026-01-15',
      rules
    );
    assert.equal(short.status === 'ACTIVE' && short.daysRemaining, 16);
    assert.equal(long.status === 'ACTIVE' && long.daysRemaining, 46);
  });
});
