import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateImportProvenance } from '../src/services/datasetService';
import type { ImportSourceMetadata } from '../src/types';

const validMetadata: ImportSourceMetadata = {
  sourceName: 'TEST FIXTURE source',
  sourceUrl: 'https://example.invalid/export.csv',
  fetchedAt: '2026-01-15',
  extractionMethod: 'manual-csv-export',
  fileSha256: 'c'.repeat(64)
};

describe('import provenance validation', () => {
  it('rejects missing metadata', () => {
    assert.deepEqual(validateImportProvenance(undefined), ['sourceMetadata is required']);
    assert.deepEqual(validateImportProvenance(null), ['sourceMetadata is required']);
  });

  it('accepts complete valid metadata', () => {
    assert.deepEqual(validateImportProvenance(validMetadata), []);
  });

  it('rejects empty source name', () => {
    const errors = validateImportProvenance({ ...validMetadata, sourceName: '  ' });
    assert.ok(errors.includes('sourceName is required'));
  });

  it('rejects invalid source URL', () => {
    const missing = validateImportProvenance({ ...validMetadata, sourceUrl: '' });
    assert.ok(missing.includes('sourceUrl is required'));

    const badProtocol = validateImportProvenance({ ...validMetadata, sourceUrl: 'ftp://example.invalid/x' });
    assert.ok(badProtocol.includes('sourceUrl must be a valid http(s) URL'));
  });

  it('rejects invalid fetchedAt', () => {
    const missing = validateImportProvenance({ ...validMetadata, fetchedAt: '' });
    assert.ok(missing.includes('fetchedAt is required'));

    const malformed = validateImportProvenance({ ...validMetadata, fetchedAt: '15/01/2026' });
    assert.ok(malformed.includes('fetchedAt must be a valid ISO date (YYYY-MM-DD)'));
  });

  it('rejects missing or malformed extraction method', () => {
    const errors = validateImportProvenance({ ...validMetadata, extractionMethod: '' });
    assert.ok(errors.includes('extractionMethod is required'));
  });

  it('rejects missing or malformed file hash', () => {
    const missing = validateImportProvenance({ ...validMetadata, fileSha256: '' });
    assert.ok(missing.includes('fileSha256 is required'));

    const short = validateImportProvenance({ ...validMetadata, fileSha256: 'abc' });
    assert.ok(short.includes('fileSha256 must be a 64-character SHA-256 hex digest'));
  });

  it('collects all field errors at once', () => {
    const errors = validateImportProvenance({
      sourceName: '',
      sourceUrl: '',
      fetchedAt: '',
      extractionMethod: '',
      fileSha256: ''
    });
    assert.equal(errors.length, 5);
  });
});
