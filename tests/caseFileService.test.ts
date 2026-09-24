import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  RECONSTRUCTED_CASE_FILES,
  validateCaseFile,
  type ReconstructedCaseFile
} from '../src/services/caseFileService';

const SOURCE = {
  url: 'https://example.invalid/gazette/notice.pdf',
  documentHash: 'a'.repeat(64)
};

const validCaseFile: ReconstructedCaseFile = {
  id: 'case-001',
  project: 'TEST FIXTURE project',
  agency: 'TEST FIXTURE agency',
  corridor: 'TEST FIXTURE corridor',
  statuteRoute: 'RFCTLARR_2013',
  state: 'TEST FIXTURE state',
  districts: ['TEST FIXTURE district'],
  timeline: [
    { event: 'Sec 11 preliminary notification', date: '2024-01-15', source: SOURCE },
    { event: 'Sec 19 declaration', date: '2024-11-20', source: SOURCE }
  ],
  delayReasons: [
    {
      cause: 'TEST FIXTURE cause',
      paraphrase: 'TEST FIXTURE paraphrase derived from source document',
      source: SOURCE
    }
  ],
  interventions: [
    { action: 'TEST FIXTURE action', source: SOURCE }
  ],
  outcome: {
    finalStatus: 'TEST FIXTURE completed',
    totalDays: 420,
    source: SOURCE
  },
  extractionNotes: 'TEST FIXTURE extraction notes',
  reviewer: 'TEST FIXTURE reviewer'
};

describe('case file format', () => {
  it('ships an empty reconstructed case-file registry', () => {
    assert.equal(RECONSTRUCTED_CASE_FILES.length, 0);
  });

  it('accepts a fully sourced fixture case file', () => {
    assert.deepEqual(validateCaseFile(validCaseFile), []);
  });

  it('rejects a case file with an empty timeline', () => {
    const errors = validateCaseFile({ ...validCaseFile, timeline: [] });
    assert.ok(errors.some((e) => e.includes('timeline')));
  });

  it('rejects timeline entries without a source URL or hash', () => {
    const errors = validateCaseFile({
      ...validCaseFile,
      timeline: [
        { event: 'Sec 11', date: '2024-01-15', source: { url: '', documentHash: '' } }
      ]
    });
    assert.ok(errors.some((e) => e.includes('timeline[0]: source URL')));
    assert.ok(errors.some((e) => e.includes('timeline[0]: documentHash')));
  });

  it('rejects non-http(s) source URLs', () => {
    const errors = validateCaseFile({
      ...validCaseFile,
      timeline: [
        { event: 'Sec 11', date: '2024-01-15', source: { url: 'ftp://example.invalid/x', documentHash: 'b'.repeat(64) } }
      ]
    });
    assert.ok(errors.some((e) => e.includes('valid http(s) URL')));
  });

  it('rejects malformed timeline dates', () => {
    const errors = validateCaseFile({
      ...validCaseFile,
      timeline: [{ event: 'Sec 11', date: '15/01/2024', source: SOURCE }]
    });
    assert.ok(errors.some((e) => e.includes('valid ISO date')));
  });

  it('allows a null outcome but validates a present one', () => {
    assert.deepEqual(validateCaseFile({ ...validCaseFile, outcome: null }), []);

    const badOutcome = validateCaseFile({
      ...validCaseFile,
      outcome: { finalStatus: '', totalDays: -1, source: { url: 'not-a-url', documentHash: 'short' } }
    });
    assert.ok(badOutcome.some((e) => e.includes('outcome.finalStatus')));
    assert.ok(badOutcome.some((e) => e.includes('outcome.totalDays')));
    assert.ok(badOutcome.some((e) => e.includes('outcome: source URL')));
  });

  it('requires reviewer and extraction notes', () => {
    const errors = validateCaseFile({ ...validCaseFile, reviewer: '', extractionNotes: '  ' });
    assert.ok(errors.includes('reviewer is required'));
    assert.ok(errors.includes('extractionNotes is required'));
  });

  it('requires non-empty districts', () => {
    const errors = validateCaseFile({ ...validCaseFile, districts: [] });
    assert.ok(errors.some((e) => e.includes('districts')));
  });

  it('validates delay reasons and interventions sources', () => {
    const errors = validateCaseFile({
      ...validCaseFile,
      delayReasons: [{ cause: '', paraphrase: '', source: { url: 'nope', documentHash: 'x' } }],
      interventions: [{ action: '', source: { url: 'nope', documentHash: 'x' } }]
    });
    assert.ok(errors.some((e) => e.includes('delayReasons[0]: cause')));
    assert.ok(errors.some((e) => e.includes('delayReasons[0]: paraphrase')));
    assert.ok(errors.some((e) => e.includes('interventions[0]: action')));
    assert.ok(errors.some((e) => e.includes('delayReasons[0]: source URL')));
    assert.ok(errors.some((e) => e.includes('interventions[0]: documentHash')));
  });
});
