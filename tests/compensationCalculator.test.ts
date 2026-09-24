import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { FactProvenance } from '../src/types';
import {
  computeCompensation,
  evaluateCompensation,
  VERIFIED_COMPENSATION_FORMULAS,
  type VerifiedCompensationFormula
} from '../src/services/compensationCalculator';

const confirmedProvenance: FactProvenance = {
  classification: 'SOURCED',
  sourceName: 'Test fixture source',
  sourceUrl: 'https://example.invalid/fixture',
  asOf: '2026-01-01',
  extractionMethod: 'manual-transcription',
  confidence: 1,
  reviewStatus: 'confirmed'
};

const fixtureFormula: VerifiedCompensationFormula = {
  formulaVersion: 'TEST_FIXTURE_v1',
  legalReference: 'TEST FIXTURE — not a statute citation',
  provenance: confirmedProvenance,
  evaluate: ({ marketValue, multiplicationFactor, assetValue, solatiumRate }) => {
    const base = marketValue * multiplicationFactor + assetValue;
    return base + base * solatiumRate;
  }
};

describe('compensation calculator', () => {
  it('ships an empty production formula registry', () => {
    assert.equal(VERIFIED_COMPENSATION_FORMULAS.length, 0);
  });

  it('returns ABSENT with FORMULA_NOT_VERIFIED when no formula matches', () => {
    const result = computeCompensation({
      formulaVersion: 'UNVERIFIED_v1',
      marketValue: 1000,
      multiplicationFactor: 1.5,
      solatiumRate: 1
    });
    assert.deepEqual(result, { status: 'ABSENT', reason: 'FORMULA_NOT_VERIFIED' });
  });

  it('returns ABSENT when formulaVersion is omitted', () => {
    const result = computeCompensation({ marketValue: 1000, multiplicationFactor: 1.5, solatiumRate: 1 });
    assert.deepEqual(result, { status: 'ABSENT', reason: 'FORMULA_NOT_VERIFIED' });
  });

  it('returns ABSENT when market value is missing', () => {
    const result = evaluateCompensation(fixtureFormula, { multiplicationFactor: 1.5, solatiumRate: 1 });
    assert.deepEqual(result, { status: 'ABSENT', reason: 'MISSING_MARKET_VALUE' });
  });

  it('returns ABSENT when multiplication factor is missing', () => {
    const result = evaluateCompensation(fixtureFormula, { marketValue: 1000, solatiumRate: 1 });
    assert.deepEqual(result, { status: 'ABSENT', reason: 'MISSING_MULTIPLICATION_FACTOR' });
  });

  it('returns ABSENT when solatium rate is missing', () => {
    const result = evaluateCompensation(fixtureFormula, { marketValue: 1000, multiplicationFactor: 1.5 });
    assert.deepEqual(result, { status: 'ABSENT', reason: 'MISSING_SOLATIUM_RATE' });
  });

  it('returns ABSENT on negative or non-finite inputs', () => {
    const negative = evaluateCompensation(fixtureFormula, {
      marketValue: -1,
      multiplicationFactor: 1.5,
      solatiumRate: 1
    });
    assert.deepEqual(negative, { status: 'ABSENT', reason: 'MISSING_MARKET_VALUE' });

    const badAsset = evaluateCompensation(fixtureFormula, {
      marketValue: 1000,
      multiplicationFactor: 1.5,
      assetValue: Number.NaN,
      solatiumRate: 1
    });
    assert.deepEqual(badAsset, { status: 'ABSENT', reason: 'INVALID_NUMERIC_INPUT' });
  });

  it('computes a total from a verified formula and echoes inputs', () => {
    const result = evaluateCompensation(fixtureFormula, {
      marketValue: 1000,
      multiplicationFactor: 1.5,
      assetValue: 200,
      solatiumRate: 1
    });
    assert.equal(result.status, 'COMPUTED');
    assert.equal(result.total, 3400);
    assert.equal(result.formulaVersion, 'TEST_FIXTURE_v1');
    assert.equal(result.legalReference, 'TEST FIXTURE — not a statute citation');
    assert.deepEqual(result.inputs, {
      marketValue: 1000,
      multiplicationFactor: 1.5,
      assetValue: 200,
      solatiumRate: 1
    });
  });

  it('treats a missing asset value as zero', () => {
    const result = evaluateCompensation(fixtureFormula, {
      marketValue: 1000,
      multiplicationFactor: 2,
      solatiumRate: 0
    });
    assert.equal(result.status, 'COMPUTED');
    assert.equal(result.total, 2000);
    assert.equal(result.inputs.assetValue, 0);
  });

  it('routes through computeCompensation when a formula is injected', () => {
    const result = computeCompensation(
      { formulaVersion: 'TEST_FIXTURE_v1', marketValue: 1000, multiplicationFactor: 1.5, solatiumRate: 1 },
      [fixtureFormula]
    );
    assert.equal(result.status, 'COMPUTED');
  });
});
