import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderInsufficientDataState } from '../src/components/InsufficientDataState';

describe('InsufficientDataState', () => {
  it('renders the INSUFFICIENT_DATA badge', () => {
    const html = renderInsufficientDataState({ language: 'EN' });
    assert.ok(html.includes('INSUFFICIENT_DATA'));
    assert.ok(html.includes('data-state="insufficient"'));
  });

  it('renders English defaults', () => {
    const html = renderInsufficientDataState({ language: 'EN' });
    assert.ok(html.includes('Insufficient data'));
    assert.ok(html.includes('No confirmed, sourced data is available'));
  });

  it('renders Hindi defaults', () => {
    const html = renderInsufficientDataState({ language: 'HI' });
    assert.ok(html.includes('अपर्याप्त डेटा'));
    assert.ok(html.includes('स्रोत-सहित'));
  });

  it('accepts custom title and description overrides', () => {
    const html = renderInsufficientDataState({
      language: 'EN',
      title: 'No case files',
      description: 'Import reconstructed case files to populate this view.'
    });
    assert.ok(html.includes('No case files'));
    assert.ok(html.includes('Import reconstructed case files'));
  });
});
