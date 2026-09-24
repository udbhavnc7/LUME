import React from 'react';
import { FactProvenance } from '../types';

interface FactProps {
  value: React.ReactNode;
  provenance?: FactProvenance | null;
  className?: string;
  absentLabel?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isValidDate = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
};

const isValidConfidence = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1;

const validateProvenance = (provenance?: FactProvenance | null): provenance is FactProvenance => {
  if (!provenance || provenance.reviewStatus !== 'confirmed') return false;
  if (!isNonEmptyString(provenance.sourceName) || !isValidDate(provenance.asOf)) return false;

  if (provenance.classification === 'SOURCED') {
    return (
      isNonEmptyString(provenance.sourceUrl) &&
      isNonEmptyString(provenance.extractionMethod) &&
      isValidConfidence(provenance.confidence)
    );
  }

  return (
    Array.isArray(provenance.inputFactIds) &&
    provenance.inputFactIds.length > 0 &&
    provenance.inputFactIds.every(isNonEmptyString) &&
    isNonEmptyString(provenance.formulaVersion)
  );
};

const buildTooltip = (provenance: FactProvenance) => {
  const common = `${provenance.classification} • ${provenance.sourceName} • as of ${provenance.asOf}`;
  if (provenance.classification === 'SOURCED') {
    return `${common} • ${provenance.extractionMethod} • confidence ${(provenance.confidence * 100).toFixed(1)}%`;
  }
  const sample = provenance.sampleSize ? ` • n=${provenance.sampleSize}` : '';
  return `${common} • ${provenance.formulaVersion} • inputs ${provenance.inputFactIds.join(', ')}${sample}`;
};

export function Fact({ value, provenance, className = '', absentLabel = 'ABSENT' }: FactProps) {
  if (!validateProvenance(provenance)) {
    return (
      <span className={`lume-fact lume-fact--absent ${className}`.trim()} data-fact-state="absent" title="Insufficient confirmed provenance">
        {absentLabel}
      </span>
    );
  }

  const tooltip = buildTooltip(provenance);

  return (
    <span className={`lume-fact lume-fact--present ${className}`.trim()} data-fact-state="present" title={tooltip}>
      <span className="lume-fact__value">{value}</span>
      <span className="lume-fact__freshness">Data as of {provenance.asOf}</span>
      {provenance.classification === 'SOURCED' && (
        <a
          className="lume-fact__source"
          href={provenance.sourceUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          Source
        </a>
      )}
    </span>
  );
}
