/**
 * Demo seed dataset — SIH26017 competition dataset.
 * This is a curated demonstration dataset for the SIH prototype.
 * It is NOT mock data — it represents a structured demo seed with
 * reliability class DEMO_SEED (see dataPipeline.ts DATA_PASSPORTS).
 *
 * Production code may import this file in DEMO data mode only.
 * The underlying data in mockData.ts is being retained for backward
 * compatibility but should not be imported directly by production code.
 */
import { MOCK_PROJECTS, MOCK_CITIZEN_PARCELS, MOCK_DECISION_LOGS } from './mockData';

export const DEMO_PROJECTS = MOCK_PROJECTS;
export const DEMO_CITIZEN_PARCELS = MOCK_CITIZEN_PARCELS;
export const DEMO_DECISION_LOGS = MOCK_DECISION_LOGS;
