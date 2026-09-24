import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

interface InsufficientDataStateProps {
  language: 'EN' | 'HI';
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_COPY = {
  EN: {
    title: 'Insufficient data',
    description: 'No confirmed, sourced data is available for this view yet.'
  },
  HI: {
    title: 'अपर्याप्त डेटा',
    description: 'इस दृश्य के लिए अभी तक कोई पुष्ट, स्रोत-सहित डेटा उपलब्ध नहीं है।'
  }
} as const;

export function InsufficientDataState({
  language,
  title,
  description,
  className = ''
}: InsufficientDataStateProps) {
  const copy = DEFAULT_COPY[language];
  return (
    <div
      className={`lume-empty-state ${className}`.trim()}
      data-state="insufficient"
      role="status"
      aria-live="polite"
    >
      <span className="lume-empty-state__badge">INSUFFICIENT_DATA</span>
      <p className="lume-empty-state__title">{title ?? copy.title}</p>
      <p className="lume-empty-state__description">{description ?? copy.description}</p>
    </div>
  );
}

export function renderInsufficientDataState(
  props: InsufficientDataStateProps
): string {
  return renderToStaticMarkup(<InsufficientDataState {...props} />);
}
