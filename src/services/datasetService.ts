import {
  ImportedDataset,
  DatasetColumnMapping,
  DatasetValidationReport,
  ValidationError,
  LandAcquisitionProject,
  StageType,
  ImportSourceMetadata,
} from '../types';

const LUME_FIELD_DEFINITIONS: Record<string, { label: string; required: boolean; type: 'string' | 'number' | 'date' }> = {
  project_id: { label: 'Project ID', required: true, type: 'string' },
  project_code: { label: 'Project Code', required: false, type: 'string' },
  title: { label: 'Project Title', required: true, type: 'string' },
  district: { label: 'District', required: true, type: 'string' },
  state: { label: 'State', required: true, type: 'string' },
  authority: { label: 'Authority', required: false, type: 'string' },
  acquisition_route: { label: 'Acquisition Route', required: false, type: 'string' },
  project_type: { label: 'Project Type', required: false, type: 'string' },
  notification_date: { label: 'Notification Date', required: false, type: 'date' },
  stage: { label: 'Current Stage', required: true, type: 'string' },
  stage_start_date: { label: 'Stage Start Date', required: false, type: 'date' },
  stage_end_date: { label: 'Stage End Date', required: false, type: 'date' },
  expected_duration: { label: 'Expected Duration (days)', required: false, type: 'number' },
  actual_duration: { label: 'Actual Duration (days)', required: false, type: 'number' },
  dependency_state: { label: 'Dependency State', required: false, type: 'string' },
  compensation_state: { label: 'Compensation State', required: false, type: 'string' },
  legal_state: { label: 'Legal/Dispute State', required: false, type: 'string' },
  criticality: { label: 'Criticality', required: false, type: 'string' },
  latitude: { label: 'Latitude', required: false, type: 'number' },
  longitude: { label: 'Longitude', required: false, type: 'number' },
  outcome: { label: 'Outcome', required: false, type: 'string' },
  area_hectares: { label: 'Total Area (hectares)', required: false, type: 'number' },
  landowners_count: { label: 'Affected Landowners', required: false, type: 'number' },
  budget_cr: { label: 'Estimated Budget (Cr)', required: false, type: 'number' },
  compensation_disbursed_cr: { label: 'Compensation Disbursed (Cr)', required: false, type: 'number' },
};

const STAGE_ALIASES: Record<string, StageType> = {
  'sia': 'SIA_APPRAISAL',
  'sia_appraisal': 'SIA_APPRAISAL',
  'social_impact': 'SIA_APPRAISAL',
  'sec 4': 'SIA_APPRAISAL',
  'section 4': 'SIA_APPRAISAL',
  'sec11': 'SEC11_PRELIM_NOTICE',
  'sec 11': 'SEC11_PRELIM_NOTICE',
  'section 11': 'SEC11_PRELIM_NOTICE',
  'preliminary_notification': 'SEC11_PRELIM_NOTICE',
  'objections': 'OBJECTIONS_HEARING',
  'objections_hearing': 'OBJECTIONS_HEARING',
  'sec 15': 'OBJECTIONS_HEARING',
  'section 15': 'OBJECTIONS_HEARING',
  'sec19': 'SEC19_DECLARATION',
  'sec 19': 'SEC19_DECLARATION',
  'section 19': 'SEC19_DECLARATION',
  'declaration': 'SEC19_DECLARATION',
  'sec26': 'VALUATION_SEC26',
  'sec 26': 'VALUATION_SEC26',
  'section 26': 'VALUATION_SEC26',
  'valuation': 'VALUATION_SEC26',
  'compensation': 'VALUATION_SEC26',
  'sec23': 'AWARD_SEC23',
  'sec 23': 'AWARD_SEC23',
  'section 23': 'AWARD_SEC23',
  'award': 'AWARD_SEC23',
  'sec38': 'PAYMENT_SEC38',
  'sec 38': 'PAYMENT_SEC38',
  'section 38': 'PAYMENT_SEC38',
  'payment': 'PAYMENT_SEC38',
  'possession': 'POSSESSION_TAKEOVER',
  'takeover': 'POSSESSION_TAKEOVER',
  'complete': 'POSSESSION_TAKEOVER',
  'completed': 'POSSESSION_TAKEOVER',
};

export function normalizeStage(rawStage: string): StageType {
  const normalized = rawStage.toLowerCase().trim().replace(/[\s\-_]+/g, '_');
  return STAGE_ALIASES[normalized] || 'SIA_APPRAISAL';
}

export function detectColumns(headers: string[]): DatasetColumnMapping[] {
  const columnPatterns: Record<string, { patterns: RegExp[]; confidence: number }> = {
    project_id: { patterns: [/^project.?id$/i, /^proj.?id$/i, /^id$/i, /^project_code$/i, /^project_code$/i], confidence: 0.9 },
    title: { patterns: [/^title$/i, /^project.?name$/i, /^name$/i, /^corridor$/i], confidence: 0.85 },
    district: { patterns: [/^district$/i, /^dist$/i, /^jila$/i], confidence: 0.95 },
    state: { patterns: [/^state$/i, /^rajya$/i, /^pradesh$/i], confidence: 0.95 },
    authority: { patterns: [/^authority$/i, /^agency$/i, /^department$/i, /^org$/i, /^nhai$/i], confidence: 0.8 },
    stage: { patterns: [/^stage$/i, /^current.?stage$/i, /^phase$/i, /^step$/i, /^status$/i], confidence: 0.85 },
    criticality: { patterns: [/^criticality$/i, /^priority$/i, /^risk.?level$/i, /^urgency$/i], confidence: 0.75 },
    latitude: { patterns: [/^lat$/i, /^latitude$/i, /^lat.?coord$/i], confidence: 0.95 },
    longitude: { patterns: [/^lng$/i, /^lon$/i, /^longitude$/i, /^long$/i], confidence: 0.95 },
    notification_date: { patterns: [/^notif.?date$/i, /^notification.?date$/i, /^declaration.?date$/i], confidence: 0.85 },
    stage_start_date: { patterns: [/^stage.?start$/i, /^start.?date$/i, /^begin.?date$/i], confidence: 0.8 },
    expected_duration: { patterns: [/^expected.?duration$/i, /^target.?days$/i, /^statutory.?clock$/i], confidence: 0.75 },
    actual_duration: { patterns: [/^actual.?duration$/i, /^elapsed.?days$/i, /^actual.?days$/i], confidence: 0.75 },
    dependency_state: { patterns: [/^dependency.?state$/i, /^deps?$/i, /^dependency$/i], confidence: 0.7 },
    compensation_state: { patterns: [/^comp.?state$/i, /^compensation.?status$/i, /^payment.?status$/i], confidence: 0.7 },
    legal_state: { patterns: [/^legal.?state$/i, /^dispute.?status$/i, /^court.?status$/i], confidence: 0.7 },
    outcome: { patterns: [/^outcome$/i, /^result$/i, /^final.?status$/i], confidence: 0.75 },
    area_hectares: { patterns: [/^area$/i, /^area.?ha$/i, /^hectares$/i, /^total.?area$/i], confidence: 0.8 },
    landowners_count: { patterns: [/^landowners?$/i, /^affected.?count$/i, /^families$/i, /^count$/i], confidence: 0.7 },
    budget_cr: { patterns: [/^budget$/i, /^cost$/i, /^estimated.?cost$/i, /^budget.?cr$/i], confidence: 0.75 },
    compensation_disbursed_cr: { patterns: [/^disbursed$/i, /^comp.?paid$/i, /^paid.?amount$/i], confidence: 0.7 },
  };

  return headers.map(header => {
    const normalizedHeader = header.toLowerCase().trim().replace(/[\s\-_]+/g, '_');

    let bestMatch: { field: string; confidence: number } = { field: header, confidence: 0 };

    for (const [field, def] of Object.entries(columnPatterns)) {
      for (const pattern of def.patterns) {
        if (pattern.test(normalizedHeader) || pattern.test(header)) {
          if (def.confidence > bestMatch.confidence) {
            bestMatch = { field, confidence: def.confidence };
          }
        }
      }
    }

    return {
      sourceColumn: header,
      lumeField: bestMatch.field === header ? header : bestMatch.field,
      confidence: bestMatch.field === header ? 0 : bestMatch.confidence,
      autoDetected: bestMatch.field !== header,
      sampleValues: [],
    };
  });
}

export function sanitizeCSVCell(value: string): string {
  const trimmed = value.trim().replace(/^"|"$/g, '').trim();
  // Prevent CSV formula injection: cells starting with =, +, -, @, \t, \r
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

export function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => sanitizeCSVCell(h));
  const rows = lines.slice(1).filter(l => l.trim().length > 0).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(sanitizeCSVCell(current));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(sanitizeCSVCell(current));
    return values;
  });

  return { headers, rows };
}

export function parseJSON(content: string): { headers: string[]; rows: Record<string, string>[] } {
  const data = JSON.parse(content);
  const records = Array.isArray(data) ? data : data.records || data.data || [data];
  if (records.length === 0) return { headers: [], rows: [] };
  const headerSet = new Set<string>();
  records.forEach((r: Record<string, unknown>) => {
    Object.keys(r).forEach(key => headerSet.add(key));
  });
  const headers: string[] = Array.from(headerSet);
  return { headers, rows: records.map((r: Record<string, unknown>) => {
    const row: Record<string, string> = {};
    for (const key of Object.keys(r)) {
      row[key] = String(r[key] ?? '');
    }
    return row;
  }) };
}

export function detectEncoding(_file: File): string {
  return 'UTF-8';
}

export function validateDataset(
  rows: string[][],
  headers: string[],
  columnMappings: DatasetColumnMapping[]
): DatasetValidationReport {
  const errors: ValidationError[] = [];
  let validCount = 0;
  let incompleteCount = 0;
  let rejectedCount = 0;
  const duplicateGroups = new Set<string>();
  let dateInconsistencies = 0;
  let unknownStageLabels = 0;
  let missingCoordinates = 0;
  let invalidCoordinates = 0;
  let contradictoryStatuses = 0;

  const projectIdIndex = columnMappings.findIndex(m => m.lumeField === 'project_id');
  const stageIndex = columnMappings.findIndex(m => m.lumeField === 'stage');
  const dateStartIndex = columnMappings.findIndex(m => m.lumeField === 'stage_start_date');
  const dateEndIndex = columnMappings.findIndex(m => m.lumeField === 'stage_end_date');
  const latIndex = columnMappings.findIndex(m => m.lumeField === 'latitude');
  const lngIndex = columnMappings.findIndex(m => m.lumeField === 'longitude');
  const criticalityIndex = columnMappings.findIndex(m => m.lumeField === 'criticality');
  const dependencyIndex = columnMappings.findIndex(m => m.lumeField === 'dependency_state');
  const compensationIndex = columnMappings.findIndex(m => m.lumeField === 'compensation_state');

  const projectIds = new Set<string>();

  rows.forEach((row, idx) => {
    let hasError = false;
    let hasWarning = false;

    const projectId = projectIdIndex >= 0 ? row[projectIdIndex]?.trim() : '';
    if (projectId && projectIds.has(projectId)) {
      duplicateGroups.add(projectId);
      errors.push({
        recordIndex: idx,
        field: 'project_id',
        severity: 'WARNING',
        message: `Duplicate project ID: ${projectId}`,
        currentValue: projectId,
      });
      hasWarning = true;
    }
    if (projectId) projectIds.add(projectId);

    if (stageIndex >= 0) {
      const stage = row[stageIndex]?.trim().toLowerCase();
      if (stage && !STAGE_ALIASES[stage] && !Object.values(STAGE_ALIASES).includes(stage as StageType)) {
        unknownStageLabels++;
        errors.push({
          recordIndex: idx,
          field: 'stage',
          severity: 'WARNING',
          message: `Unknown stage label: "${row[stageIndex]}"`,
          currentValue: row[stageIndex],
        });
        hasWarning = true;
      }
    }

    if (dateStartIndex >= 0 && dateEndIndex >= 0) {
      const start = row[dateStartIndex]?.trim();
      const end = row[dateEndIndex]?.trim();
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && endDate < startDate) {
          dateInconsistencies++;
          errors.push({
            recordIndex: idx,
            field: 'stage_end_date',
            severity: 'ERROR',
            message: `Stage end date (${end}) is before start date (${start})`,
            currentValue: end,
          });
          hasError = true;
        }
      }
    }

    if (latIndex >= 0 && lngIndex >= 0) {
      const lat = parseFloat(row[latIndex]);
      const lng = parseFloat(row[lngIndex]);
      if (isNaN(lat) || isNaN(lng)) {
        missingCoordinates++;
      } else if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        invalidCoordinates++;
        errors.push({
          recordIndex: idx,
          field: 'latitude',
          severity: 'ERROR',
          message: `Invalid coordinates: lat=${lat}, lng=${lng}`,
          currentValue: `${lat}, ${lng}`,
        });
        hasError = true;
      }
    }

    if (criticalityIndex >= 0 && dependencyIndex >= 0 && compensationIndex >= 0) {
      const crit = row[criticalityIndex]?.trim().toLowerCase();
      const dep = row[dependencyIndex]?.trim().toLowerCase();
      const comp = row[compensationIndex]?.trim().toLowerCase();
      if (crit === 'critical' && dep === 'resolved' && comp === 'completed') {
        contradictoryStatuses++;
        errors.push({
          recordIndex: idx,
          field: 'criticality',
          severity: 'WARNING',
          message: 'Project marked CRITICAL but dependencies resolved and compensation completed',
          currentValue: row[criticalityIndex],
        });
        hasWarning = true;
      }
    }

    const requiredFields = columnMappings.filter(m => {
      const fieldDef = LUME_FIELD_DEFINITIONS[m.lumeField];
      return fieldDef?.required;
    });

    let missingRequired = false;
    for (const mapping of requiredFields) {
      const colIdx = headers.indexOf(mapping.sourceColumn);
      if (colIdx >= 0 && (!row[colIdx] || row[colIdx].trim() === '')) {
        errors.push({
          recordIndex: idx,
          field: mapping.lumeField,
          severity: 'ERROR',
          message: `Required field "${mapping.sourceColumn}" is empty`,
          currentValue: '',
        });
        missingRequired = true;
        hasError = true;
      }
    }

    if (hasError) {
      rejectedCount++;
    } else if (hasWarning || missingRequired) {
      incompleteCount++;
    } else {
      validCount++;
    }
  });

  const totalRequired = columnMappings.filter(m => LUME_FIELD_DEFINITIONS[m.lumeField]?.required).length;
  const mappedRequired = columnMappings.filter(m => LUME_FIELD_DEFINITIONS[m.lumeField]?.required && m.confidence > 0.5).length;
  const coveragePct = totalRequired > 0 ? (mappedRequired / totalRequired) * 100 : 0;

  return {
    datasetId: '',
    totalRecords: rows.length,
    validRecords: validCount,
    incompleteRecords: incompleteCount,
    rejectedRecords: rejectedCount,
    duplicateGroups: duplicateGroups.size,
    dateInconsistencies,
    unknownStageLabels,
    missingCoordinates,
    invalidCoordinates,
    contradictoryStatuses,
    validationErrors: errors,
    validationTimestamp: new Date().toISOString(),
    coveragePct: Math.round(coveragePct * 10) / 10,
  };
}

export function createImportedDataset(
  filename: string,
  fileSize: number,
  fileType: ImportedDataset['fileType'],
  headers: string[],
  rowCount: number,
  mappings: DatasetColumnMapping[],
  sourceMetadata?: ImportSourceMetadata
): ImportedDataset {
  return {
    id: `ds-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: filename.replace(/\.[^.]+$/, ''),
    filename,
    fileSize,
    fileType,
    encoding: 'UTF-8',
    rowCount,
    columns: headers,
    importedAt: new Date().toISOString(),
    sourceClassification: 'IMPORTED',
    schemaVersion: 'v1.0',
    validationStatus: 'PENDING',
    columnMappings: mappings,
    sourceMetadata,
  };
}

const SHA256_HEX = /^[a-f0-9]{64}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmpty = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateImportProvenance(
  metadata: ImportSourceMetadata | undefined | null
): string[] {
  const errors: string[] = [];
  if (!metadata) {
    return ['sourceMetadata is required'];
  }
  if (!isNonEmpty(metadata.sourceName)) errors.push('sourceName is required');
  if (!isNonEmpty(metadata.sourceUrl)) {
    errors.push('sourceUrl is required');
  } else if (!isValidHttpUrl(metadata.sourceUrl)) {
    errors.push('sourceUrl must be a valid http(s) URL');
  }
  if (!isNonEmpty(metadata.fetchedAt)) {
    errors.push('fetchedAt is required');
  } else if (!ISO_DATE.test(metadata.fetchedAt) || Number.isNaN(Date.parse(metadata.fetchedAt))) {
    errors.push('fetchedAt must be a valid ISO date (YYYY-MM-DD)');
  }
  if (!isNonEmpty(metadata.extractionMethod)) errors.push('extractionMethod is required');
  if (!isNonEmpty(metadata.fileSha256)) {
    errors.push('fileSha256 is required');
  } else if (!SHA256_HEX.test(metadata.fileSha256)) {
    errors.push('fileSha256 must be a 64-character SHA-256 hex digest');
  }
  return errors;
}

export function convertRowsToProjects(
  rows: string[][],
  headers: string[],
  mappings: DatasetColumnMapping[]
): LandAcquisitionProject[] {
  return rows.map((row, idx) => {
    const getValue = (field: string): string => {
      const mapping = mappings.find(m => m.lumeField === field);
      if (!mapping) return '';
      const colIdx = headers.indexOf(mapping.sourceColumn);
      return colIdx >= 0 ? row[colIdx]?.trim() || '' : '';
    };

    const getNumber = (field: string, fallback: number): number => {
      const val = parseFloat(getValue(field));
      return isNaN(val) ? fallback : val;
    };

    const projectId = getValue('project_id') || `imported-${idx}`;
    const stage = normalizeStage(getValue('stage') || 'sia_appraisal');

    return {
      id: projectId,
      projectCode: getValue('project_code') || projectId,
      title: getValue('title') || `Imported Project ${idx + 1}`,
      authority: getValue('authority') || 'Unknown Authority',
      state: getValue('state') || 'Unknown',
      district: getValue('district') || 'Unknown',
      tehsil: '',
      totalAreaHectares: getNumber('area_hectares', 0),
      affectedLandownersCount: getNumber('landowners_count', 0),
      processRoute: 'RFCTLARR_2013' as const,
      currentStage: stage,
      currentStageLabel: stage.replace(/_/g, ' '),
      currentStageElapsedDays: getNumber('actual_duration', 90),
      statutoryClockMaxDays: getNumber('expected_duration', 365),
      criticality: (getValue('criticality')?.toUpperCase() || 'MEDIUM') as LandAcquisitionProject['criticality'],
      estimatedBudgetCr: getNumber('budget_cr', 0),
      compensationDisbursedCr: getNumber('compensation_disbursed_cr', 0),
      multiCropIrrigatedExposure: false,
      multiCropConfidencePct: 90,
      coordinates: {
        lat: getNumber('latitude', 20.5 + ((idx * 13) % 80) / 10),
        lng: getNumber('longitude', 75.0 + ((idx * 17) % 100) / 10),
      },
      dependencies: [],
      recentAlerts: [],
      compensationBasePerAcreLakh: 15,
      compensationMarketPerAcreLakh: 25,
      precedents: [],
      modelOutput: {
        delayProbability: Math.min(1, Math.max(0, 0.35 + ((idx * 7) % 30) / 100)),
        predictedMissDays: Math.round(15 + ((idx * 11) % 45)),
        horizonDays: 90,
        nextMilestoneName: 'Next Stage Review',
        targetDeadlineDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        evidenceHealth: 'AMBER' as const,
        evidenceHealthReason: 'Imported dataset - evidence health requires verification',
        modelCoverage: 'MARGINAL_SUPPORT' as const,
        modelVersion: 'LUME-Imported-v8.0',
        lastUpdated: new Date().toISOString(),
        shapDrivers: [],
      },
    };
  });
}
