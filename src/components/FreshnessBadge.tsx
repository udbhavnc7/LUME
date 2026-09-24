import React from 'react';

export interface FreshnessBadgeProps {
  language: 'EN' | 'HI';
  asOf?: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  className?: string;
}

export function FreshnessBadge({
  language,
  asOf,
  sourceUrl,
  sourceName,
  className = '',
}: FreshnessBadgeProps) {
  const hasAsOf = typeof asOf === 'string' && asOf.trim().length > 0 && !Number.isNaN(Date.parse(asOf));

  return (
    <span
      className={`lume-freshness-badge ${className}`.trim()}
      data-freshness={hasAsOf ? 'present' : 'absent'}
      title={
        hasAsOf
          ? sourceName
            ? `${sourceName} • ${asOf}`
            : String(asOf)
          : language === 'HI'
            ? 'स्रोत ताज़गी उपलब्ध नहीं'
            : 'Source freshness unavailable'
      }
    >
      <span className="lume-freshness-badge__dot" aria-hidden="true" />
      {hasAsOf ? (
        <span>
          {language === 'HI' ? 'डेटा तिथि' : 'Data as of'} {asOf}
          {sourceName ? ` • ${sourceName}` : ''}
        </span>
      ) : (
        <span className="lume-freshness-badge__absent">
          {language === 'HI' ? 'ताज़गी ABSENT' : 'Freshness ABSENT'}
        </span>
      )}
      {hasAsOf && sourceUrl ? (
        <a className="lume-freshness-badge__source" href={sourceUrl} target="_blank" rel="noreferrer">
          {language === 'HI' ? 'स्रोत' : 'Source'}
        </a>
      ) : null}
    </span>
  );
}
