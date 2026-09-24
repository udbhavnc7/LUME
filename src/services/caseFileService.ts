import type { ProcessRoute } from '../types';

export interface CaseFileSourceRef {
  url: string;
  documentHash: string;
}

export interface CaseFileTimelineEvent {
  event: string;
  date: string;
  source: CaseFileSourceRef;
}

export interface CaseFileDelayReason {
  cause: string;
  paraphrase: string;
  source: CaseFileSourceRef;
}

export interface CaseFileIntervention {
  action: string;
  source: CaseFileSourceRef;
}

export interface CaseFileOutcome {
  finalStatus: string;
  totalDays: number;
  source: CaseFileSourceRef;
}

export interface ReconstructedCaseFile {
  id: string;
  project: string;
  agency: string;
  corridor: string;
  statuteRoute: ProcessRoute;
  state: string;
  districts: string[];
  timeline: CaseFileTimelineEvent[];
  delayReasons: CaseFileDelayReason[];
  interventions: CaseFileIntervention[];
  outcome: CaseFileOutcome | null;
  extractionNotes: string;
  reviewer: string;
}

export const RECONSTRUCTED_CASE_FILES: readonly ReconstructedCaseFile[] =
  Object.freeze<ReconstructedCaseFile[]>([]);

const SHA256_HEX = /^[a-f0-9]{64}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmpty = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isValidUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateSourceRef = (source: CaseFileSourceRef | undefined, path: string, errors: string[]): void => {
  if (!source) {
    errors.push(`${path}: missing source`);
    return;
  }
  if (!isValidUrl(source.url)) {
    errors.push(`${path}: source URL must be a valid http(s) URL`);
  }
  if (!SHA256_HEX.test(source.documentHash)) {
    errors.push(`${path}: documentHash must be a 64-character SHA-256 hex digest`);
  }
};

export function validateCaseFile(file: ReconstructedCaseFile): string[] {
  const errors: string[] = [];

  if (!isNonEmpty(file.id)) errors.push('id is required');
  if (!isNonEmpty(file.project)) errors.push('project is required');
  if (!isNonEmpty(file.agency)) errors.push('agency is required');
  if (!isNonEmpty(file.corridor)) errors.push('corridor is required');
  if (!isNonEmpty(file.state)) errors.push('state is required');
  if (!Array.isArray(file.districts) || file.districts.length === 0 || !file.districts.every(isNonEmpty)) {
    errors.push('districts must be a non-empty list of names');
  }
  if (!isNonEmpty(file.extractionNotes)) errors.push('extractionNotes is required');
  if (!isNonEmpty(file.reviewer)) errors.push('reviewer is required');

  if (!Array.isArray(file.timeline) || file.timeline.length === 0) {
    errors.push('timeline must contain at least one event');
  } else {
    file.timeline.forEach((entry, index) => {
      if (!isNonEmpty(entry.event)) errors.push(`timeline[${index}]: event is required`);
      if (!ISO_DATE.test(entry.date) || Number.isNaN(Date.parse(entry.date))) {
        errors.push(`timeline[${index}]: date must be a valid ISO date (YYYY-MM-DD)`);
      }
      validateSourceRef(entry.source, `timeline[${index}]`, errors);
    });
  }

  if (!Array.isArray(file.delayReasons)) {
    errors.push('delayReasons must be an array');
  } else {
    file.delayReasons.forEach((entry, index) => {
      if (!isNonEmpty(entry.cause)) errors.push(`delayReasons[${index}]: cause is required`);
      if (!isNonEmpty(entry.paraphrase)) errors.push(`delayReasons[${index}]: paraphrase is required`);
      validateSourceRef(entry.source, `delayReasons[${index}]`, errors);
    });
  }

  if (!Array.isArray(file.interventions)) {
    errors.push('interventions must be an array');
  } else {
    file.interventions.forEach((entry, index) => {
      if (!isNonEmpty(entry.action)) errors.push(`interventions[${index}]: action is required`);
      validateSourceRef(entry.source, `interventions[${index}]`, errors);
    });
  }

  if (file.outcome !== null) {
    if (!isNonEmpty(file.outcome.finalStatus)) errors.push('outcome.finalStatus is required');
    if (!Number.isInteger(file.outcome.totalDays) || file.outcome.totalDays < 0) {
      errors.push('outcome.totalDays must be a non-negative integer');
    }
    validateSourceRef(file.outcome.source, 'outcome', errors);
  }

  return errors;
}
