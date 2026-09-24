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

export const VERIFIED_COMPENSATION_FORMULAS: readonly VerifiedCompensationFormula[] =
  Object.freeze<VerifiedCompensationFormula[]>([]);

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
