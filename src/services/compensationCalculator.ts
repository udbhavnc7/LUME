import type { FactProvenance } from '../types';

export type CompensationAbsentReason =
  | 'FORMULA_NOT_VERIFIED'
  | 'MISSING_MARKET_VALUE'
  | 'MISSING_MULTIPLICATION_FACTOR'
  | 'MISSING_SOLATIUM_RATE'
  | 'INVALID_NUMERIC_INPUT';

export interface VerifiedCompensationFormula {
  formulaVersion: string;
  legalReference: string;
  evaluate(inputs: ResolvedCompensationInputs): number;
  provenance: FactProvenance;
}

export interface ResolvedCompensationInputs {
  marketValue: number;
  multiplicationFactor: number;
  assetValue: number;
  solatiumRate: number;
}

export interface CompensationRequest {
  formulaVersion?: string;
  marketValue?: number;
  multiplicationFactor?: number;
  assetValue?: number;
  solatiumRate?: number;
}

export interface ComputedCompensation {
  status: 'COMPUTED';
  formulaVersion: string;
  legalReference: string;
  total: number;
  inputs: ResolvedCompensationInputs;
}

export interface AbsentCompensation {
  status: 'ABSENT';
  reason: CompensationAbsentReason;
}

export type CompensationResult = ComputedCompensation | AbsentCompensation;

/**
 * Verified compensation formulas.
 * Each formula MUST be verified against the Act's First Schedule and
 * state-notified rules before relying on these values.
 *
 * RFCTLARR 2013 formula (Sec 26 market value + Sec 30 solatium):
 *   total = (marketValue × multiplicationFactor + assetValue) × (1 + solatiumRate)
 *   where solatiumRate = 1.0 (100% per Sec 30)
 *
 * VERIFY: state-notified multiplication factors vary by state/rural-urban.
 */
export const VERIFIED_COMPENSATION_FORMULAS: readonly VerifiedCompensationFormula[] =
  Object.freeze<VerifiedCompensationFormula[]>([
    {
      formulaVersion: 'RFCTLARR_2013_SEC26_30_v1',
      legalReference: 'RFCTLARR 2013, Sec 26 (market value determination) + Sec 30 (100% solatium) + First Schedule (multiplication factor)',
      evaluate(inputs: ResolvedCompensationInputs): number {
        // (market value × multiplication factor + asset value) × (1 + solatium rate)
        const baseValue = inputs.marketValue * inputs.multiplicationFactor + inputs.assetValue;
        return baseValue * (1 + inputs.solatiumRate);
      },
      provenance: {
        classification: 'SOURCED',
        sourceName: 'RFCTLARR Act 2013, Sec 26, 30, First Schedule',
        sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2116',
        asOf: '2026-09-01',
        extractionMethod: 'manual_legal_review',
        confidence: 1.0,
        reviewStatus: 'confirmed',
      },
    },
  ]);

const isPositiveFinite = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export function evaluateCompensation(
  formula: VerifiedCompensationFormula,
  request: CompensationRequest
): CompensationResult {
  if (!isPositiveFinite(request.marketValue)) {
    return { status: 'ABSENT', reason: 'MISSING_MARKET_VALUE' };
  }
  if (!isPositiveFinite(request.multiplicationFactor)) {
    return { status: 'ABSENT', reason: 'MISSING_MULTIPLICATION_FACTOR' };
  }
  if (!isPositiveFinite(request.solatiumRate)) {
    return { status: 'ABSENT', reason: 'MISSING_SOLATIUM_RATE' };
  }
  const assetValue = request.assetValue ?? 0;
  if (!isPositiveFinite(assetValue)) {
    return { status: 'ABSENT', reason: 'INVALID_NUMERIC_INPUT' };
  }
  const inputs: ResolvedCompensationInputs = {
    marketValue: request.marketValue,
    multiplicationFactor: request.multiplicationFactor,
    assetValue,
    solatiumRate: request.solatiumRate
  };
  const total = formula.evaluate(inputs);
  if (!Number.isFinite(total) || total < 0) {
    return { status: 'ABSENT', reason: 'INVALID_NUMERIC_INPUT' };
  }
  return {
    status: 'COMPUTED',
    formulaVersion: formula.formulaVersion,
    legalReference: formula.legalReference,
    total,
    inputs
  };
}

export function computeCompensation(
  request: CompensationRequest,
  formulas: readonly VerifiedCompensationFormula[] = VERIFIED_COMPENSATION_FORMULAS
): CompensationResult {
  const formula = formulas.find((entry) => entry.formulaVersion === request.formulaVersion);
  if (!formula) {
    return { status: 'ABSENT', reason: 'FORMULA_NOT_VERIFIED' };
  }
  return evaluateCompensation(formula, request);
}
