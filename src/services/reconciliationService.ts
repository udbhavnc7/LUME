import {
  DataConflict,
  LandAcquisitionProject,
} from '../types';

const SOURCE_PRIORITY: Record<string, number> = {
  'NJDG_eCourts': 5,
  'PARIVESH': 4,
  'BhoomiRashi': 4,
  'NGDRS': 3,
  'DILRMP': 3,
  'LACRRIS': 3,
  'IMPORTED': 2,
  'DEMO_SEED': 1,
};

export function detectConflicts(
  project: LandAcquisitionProject,
  sourceAData: Record<string, unknown>,
  sourceBData: Record<string, unknown>,
  sourceAName: string,
  sourceBName: string
): DataConflict[] {
  const conflicts: DataConflict[] = [];
  const fieldsToCheck = [
    { field: 'compensation_state', label: 'Compensation Status' },
    { field: 'stage', label: 'Current Stage' },
    { field: 'dependency_state', label: 'Dependency State' },
    { field: 'criticality', label: 'Criticality Level' },
    { field: 'notification_date', label: 'Notification Date' },
    { field: 'latitude', label: 'Latitude' },
    { field: 'longitude', label: 'Longitude' },
  ];

  for (const { field, label } of fieldsToCheck) {
    const valA = sourceAData[field];
    const valB = sourceBData[field];

    if (valA !== undefined && valB !== undefined && String(valA) !== String(valB)) {
      const priorityA = SOURCE_PRIORITY[sourceAName] || 2;
      const priorityB = SOURCE_PRIORITY[sourceBName] || 2;

      const now = new Date().toISOString();
      const selectedValue = priorityA >= priorityB ? valA : valB;
      const reason = priorityA > priorityB
        ? `Higher source authority (${sourceAName} priority ${priorityA} > ${sourceBName} priority ${priorityB})`
        : priorityA < priorityB
        ? `Higher source authority (${sourceBName} priority ${priorityB} > ${sourceAName} priority ${priorityA})`
        : 'Equal priority - using most recent timestamp';

      conflicts.push({
        id: `conflict-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        projectId: project.id,
        field,
        fieldLabel: label,
        sourceA: { value: valA as string | number, source: sourceAName, timestamp: now },
        sourceB: { value: valB as string | number, source: sourceBName, timestamp: now },
        resolution: 'SOURCE_PRIORITY',
        selectedValue: selectedValue as string | number,
        reason,
        detectedAt: now,
        conflictType: field === 'stage' ? 'CONTRADICTORY_STAGE'
          : field.includes('date') ? 'DATE'
          : field.includes('latitude') || field.includes('longitude') ? 'LOCATION'
          : 'STATUS',
      });
    }
  }

  return conflicts;
}

export function detectMultiSourceConflicts(
  project: LandAcquisitionProject,
  sources: Array<{ name: string; data: Record<string, unknown>; timestamp: string }>
): DataConflict[] {
  const allConflicts: DataConflict[] = [];

  for (let i = 0; i < sources.length; i++) {
    for (let j = i + 1; j < sources.length; j++) {
      const conflicts = detectConflicts(
        project,
        sources[i].data,
        sources[j].data,
        sources[i].name,
        sources[j].name
      );
      allConflicts.push(...conflicts);
    }
  }

  return allConflicts;
}

export function resolveConflictManually(
  conflict: DataConflict,
  selectedValue: string | number,
  reason: string
): DataConflict {
  return {
    ...conflict,
    resolution: 'MANUAL_REVIEW',
    selectedValue,
    reason,
    resolvedAt: new Date().toISOString(),
  };
}

export function getSourcePriority(sourceName: string): number {
  return SOURCE_PRIORITY[sourceName] || 2;
}

export function getSourceClassificationLabel(classification: string): string {
  switch (classification) {
    case 'CONNECTED': return 'Connected (Authorized API)';
    case 'IMPORTED': return 'Imported (User Upload)';
    case 'PUBLIC_REFERENCE': return 'Public Reference';
    case 'DEMO': return 'Demo (Synthetic)';
    default: return classification;
  }
}
