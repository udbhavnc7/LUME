import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { FreshnessBadge } from '../src/components/FreshnessBadge';
import { RECONSTRUCTED_CASE_FILES } from '../src/services/caseFileService';

describe('freshness badge', () => {
  it('renders ABSENT when asOf is missing', () => {
    const html = renderToStaticMarkup(<FreshnessBadge language="EN" asOf={null} />);
    assert.match(html, /data-freshness="absent"/);
    assert.match(html, /Freshness ABSENT/);
  });

  it('renders data-as-of when asOf is a valid date', () => {
    const html = renderToStaticMarkup(
      <FreshnessBadge language="EN" asOf="2026-01-01" sourceName="e-Gazette" sourceUrl="https://example.com" />
    );
    assert.match(html, /data-freshness="present"/);
    assert.match(html, /Data as of 2026-01-01/);
    assert.match(html, /Source/);
  });

  it('keeps Hindi labels', () => {
    const html = renderToStaticMarkup(<FreshnessBadge language="HI" asOf={null} />);
    assert.match(html, /ताज़गी ABSENT/);
  });
});

describe('case file registry', () => {
  it('ships empty reconstructed registry for Phase 0', () => {
    assert.equal(RECONSTRUCTED_CASE_FILES.length, 0);
  });
});
