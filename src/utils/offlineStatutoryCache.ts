/**
 * Offline Statutory Cache Engine
 * Provides persistent local caching of critical statutory rules, compensation multipliers,
 * circle rate schedules, cadastral parcels, and offline field survey drafts for field-based
 * CALA verification officers and revenue surveyors under RFCTLARR 2013 and NHAI Act 1956.
 */

export interface StatutoryRuleCacheItem {
  id: string;
  statute: 'RFCTLARR_2013' | 'NHAI_ACT_1956' | 'STATE_REVENUE_CODE';
  section: string;
  title: string;
  mandate: string;
  limitationPeriodDays: number;
  penaltyOnLapse: string;
  applicableMultiplier?: string;
  statutoryPrecedentRef?: string;
}

export interface OfflineFieldSurveyDraft {
  id: string;
  surveyNumber: string;
  villageName: string;
  district: string;
  ownerName: string;
  measuredAreaAcre: number;
  recordedAreaAcre: number;
  variancePercentage: number;
  fieldNotes: string;
  geotagCoordinates?: { lat: number; lng: number; accuracyMeters: number };
  statutoryCategory: 'MATCH' | 'DISCREPANCY' | 'CRITICAL_ENCROACHMENT';
  timestamp: string;
  officerAttestation: string;
  syncedToCentral: boolean;
}

export interface OfflineCacheStats {
  lastUpdated: string;
  rulesCount: number;
  parcelsCount: number;
  draftsCount: number;
  pendingSyncCount: number;
  estimatedStorageKb: number;
  isReadyForFieldDuty: boolean;
}

const STATUTORY_RULES_CACHE_KEY = 'lume_statutory_rules_v1';
const CADASTRAL_PARCELS_CACHE_KEY = 'lume_cadastral_parcels_v1';
const OFFLINE_DRAFTS_CACHE_KEY = 'lume_offline_field_drafts_v1';
const CACHE_METADATA_KEY = 'lume_offline_cache_meta_v1';

/**
 * Standard Statutory Provisions Cached for Field Officers
 */
export const CORE_STATUTORY_PROVISIONS: StatutoryRuleCacheItem[] = [
  {
    id: 'rfctlarr-sec11',
    statute: 'RFCTLARR_2013',
    section: 'Section 11(1)',
    title: 'Preliminary Notification Publication',
    mandate: 'Publication of preliminary notification in Official Gazette, two daily newspapers (one in regional language), and Gram Panchayat office.',
    limitationPeriodDays: 365,
    penaltyOnLapse: 'If Section 19(1) declaration is not issued within 12 months, the entire acquisition proceeding lapses.',
    applicableMultiplier: 'Market Value benchmark date frozen at date of Sec 11 publication.'
  },
  {
    id: 'rfctlarr-sec15',
    statute: 'RFCTLARR_2013',
    section: 'Section 15(1)',
    title: 'Hearing of Objections by Collector/CALA',
    mandate: 'Any person interested in any land may, within sixty days from the date of the publication of the preliminary notification, object to the acquisition.',
    limitationPeriodDays: 60,
    penaltyOnLapse: 'Failure to give personal hearing renders subsequent declaration legally voidable under Article 300A.',
    statutoryPrecedentRef: 'Radhy Shyam v. State of UP (2011) 5 SCC 553'
  },
  {
    id: 'rfctlarr-sec19',
    statute: 'RFCTLARR_2013',
    section: 'Section 19(1)',
    title: 'Declaration of Acquisition and Resettlement Summary',
    mandate: 'Statutory declaration that land is required for public purpose, published with summary of Rehabilitation and Resettlement scheme.',
    limitationPeriodDays: 365,
    penaltyOnLapse: 'Absolute statutory bar: No declaration under Sec 19(1) shall be made after the expiry of 12 months from Sec 11(1).',
    applicableMultiplier: 'Multiplication factor 1.0x (Urban) or 1.25x to 2.0x (Rural based on radial distance from urban boundary).'
  },
  {
    id: 'rfctlarr-sec25',
    statute: 'RFCTLARR_2013',
    section: 'Section 25',
    title: 'Collector’s Award Limitation Period',
    mandate: 'Collector shall make an award within a period of twelve months from the date of the publication of the declaration under Section 19.',
    limitationPeriodDays: 365,
    penaltyOnLapse: 'Lapse of entire proceedings under Section 25 proviso if award not pronounced within 12 months.'
  },
  {
    id: 'rfctlarr-sec30',
    statute: 'RFCTLARR_2013',
    section: 'Section 30(1)',
    title: '100% Mandatory Solatium',
    mandate: 'The Collector having determined the total compensation shall impose a "Solatium" amount equivalent to one hundred percent of the market value.',
    limitationPeriodDays: 0,
    penaltyOnLapse: 'Mandatory statutory entitlement; non-inclusion constitutes illegal award vulnerable to writ quashing.',
    applicableMultiplier: '100% Solatium over aggregate (Market Value × Multiplier + Assets/Trees Value).'
  },
  {
    id: 'nhai-sec3a',
    statute: 'NHAI_ACT_1956',
    section: 'Section 3A',
    title: 'Power to Acquire Land for National Highways',
    mandate: 'Central Government notification declaring intention to acquire land for building, maintenance, management or operation of a national highway.',
    limitationPeriodDays: 365,
    penaltyOnLapse: 'Notification acts as boundary freeze for public utility alignment.',
    applicableMultiplier: 'Right of Way (RoW) corridor 45m to 60m standard width.'
  },
  {
    id: 'nhai-sec3c',
    statute: 'NHAI_ACT_1956',
    section: 'Section 3C',
    title: 'Hearing of Objections (21 Days Statutory Limit)',
    mandate: 'Any person interested in the land may, within twenty-one days from the date of publication under Section 3A, object to the use of land.',
    limitationPeriodDays: 21,
    penaltyOnLapse: 'Strict 21-day limitation; CALA must provide opportunity of being heard in person or by legal counsel.'
  },
  {
    id: 'nhai-sec3d',
    statute: 'NHAI_ACT_1956',
    section: 'Section 3D(1)',
    title: 'Declaration of Acquisition (Strict 1-Year Limitation)',
    mandate: 'Declaration published in Official Gazette; on publication, the land shall vest absolutely in the Central Government free from all encumbrances.',
    limitationPeriodDays: 365,
    penaltyOnLapse: 'Section 3D(3) Proviso: Where no declaration is published within one year from Sec 3A notification, the acquisition ceases to have any effect.',
    statutoryPrecedentRef: 'Union of India v. Tarsem Singh (2019) 9 SCC 304'
  },
  {
    id: 'nhai-sec3g',
    statute: 'NHAI_ACT_1956',
    section: 'Section 3G',
    title: 'Determination of Amount Payable as Compensation',
    mandate: 'CALA determines compensation applying the principles of First Schedule of RFCTLARR 2013 (Tarsem Singh doctrine: Solatium & Interest apply).',
    limitationPeriodDays: 180,
    penaltyOnLapse: 'If amount determined is unacceptable to either party, application lies to Arbitrator appointed by Central Government.',
    applicableMultiplier: 'Tarsem Singh Constitution Bench mandate: Solatium 100% and Interest 9%-15% compulsory under NHAI Act.'
  }
];

/**
 * Standard Cadastral Reference Parcels Cached for Field Verification
 */
export const DEFAULT_OFFLINE_CADASTRAL_PARCELS = [
  {
    khasraSurvey: '42/1-A',
    village: 'Rampur Kalan',
    tehsil: 'Haveli',
    district: 'Pune',
    recordedAreaAcre: 4.85,
    circleRatePerAcreInr: 4500000,
    landType: 'Jirayat (Dry Crop Agricultural)',
    rowOverlapMeters: 45.0,
    encumbranceStatus: 'Clear - DILRMP Verified',
    soilClassification: 'Medium Black Soil Class I'
  },
  {
    khasraSurvey: '42/1-B',
    village: 'Rampur Kalan',
    tehsil: 'Haveli',
    district: 'Pune',
    recordedAreaAcre: 3.20,
    circleRatePerAcreInr: 4500000,
    landType: 'Bagayat (Perennial Irrigated)',
    rowOverlapMeters: 38.5,
    encumbranceStatus: 'Mortgage registered with SBI Agri Branch',
    soilClassification: 'Deep Black Alluvial'
  },
  {
    khasraSurvey: '88/2-C',
    village: 'Somatane',
    tehsil: 'Maval',
    district: 'Pune',
    recordedAreaAcre: 2.75,
    circleRatePerAcreInr: 7800000,
    landType: 'Semi-Urban Commercial Corridor',
    rowOverlapMeters: 60.0,
    encumbranceStatus: 'Section 3D Gazetted - RoW Demarcated',
    soilClassification: 'Murrum Compact'
  }
];

/**
 * Initializes and refreshes the offline statutory cache in localStorage
 */
export function initStatutoryOfflineCache(): OfflineCacheStats {
  try {
    // Seed statutory provisions if not present
    if (!localStorage.getItem(STATUTORY_RULES_CACHE_KEY)) {
      localStorage.setItem(STATUTORY_RULES_CACHE_KEY, JSON.stringify(CORE_STATUTORY_PROVISIONS));
    }

    // Seed cadastral parcels if not present
    if (!localStorage.getItem(CADASTRAL_PARCELS_CACHE_KEY)) {
      localStorage.setItem(CADASTRAL_PARCELS_CACHE_KEY, JSON.stringify(DEFAULT_OFFLINE_CADASTRAL_PARCELS));
    }

    // Initialize drafts array if not present
    if (!localStorage.getItem(OFFLINE_DRAFTS_CACHE_KEY)) {
      localStorage.setItem(OFFLINE_DRAFTS_CACHE_KEY, JSON.stringify([]));
    }

    const metadata: OfflineCacheStats = {
      lastUpdated: new Date().toISOString(),
      rulesCount: CORE_STATUTORY_PROVISIONS.length,
      parcelsCount: DEFAULT_OFFLINE_CADASTRAL_PARCELS.length,
      draftsCount: getOfflineFieldDrafts().length,
      pendingSyncCount: getOfflineFieldDrafts().filter(d => !d.syncedToCentral).length,
      estimatedStorageKb: calculateEstimatedStorageKb(),
      isReadyForFieldDuty: true
    };

    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
    return metadata;
  } catch (error) {
    console.warn('Could not initialize statutory offline cache:', error);
    return {
      lastUpdated: new Date().toISOString(),
      rulesCount: CORE_STATUTORY_PROVISIONS.length,
      parcelsCount: DEFAULT_OFFLINE_CADASTRAL_PARCELS.length,
      draftsCount: 0,
      pendingSyncCount: 0,
      estimatedStorageKb: 45,
      isReadyForFieldDuty: true
    };
  }
}

/**
 * Retrieves cached statutory rules for field lookup
 */
export function getCachedStatutoryRules(): StatutoryRuleCacheItem[] {
  try {
    const raw = localStorage.getItem(STATUTORY_RULES_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading cached statutory rules:', e);
  }
  return CORE_STATUTORY_PROVISIONS;
}

/**
 * Retrieves cached cadastral land reference data
 */
export function getCachedCadastralParcels() {
  try {
    const raw = localStorage.getItem(CADASTRAL_PARCELS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading cached cadastral parcels:', e);
  }
  return DEFAULT_OFFLINE_CADASTRAL_PARCELS;
}

/**
 * Retrieves all offline field survey drafts saved by officers
 */
export function getOfflineFieldDrafts(): OfflineFieldSurveyDraft[] {
  try {
    const raw = localStorage.getItem(OFFLINE_DRAFTS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading offline drafts:', e);
  }
  return [];
}

/**
 * Saves a new field survey draft or updates existing offline record
 */
export function saveOfflineFieldDraft(draft: Omit<OfflineFieldSurveyDraft, 'id' | 'timestamp' | 'syncedToCentral'>): OfflineFieldSurveyDraft {
  const existing = getOfflineFieldDrafts();
  const newRecord: OfflineFieldSurveyDraft = {
    ...draft,
    id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    syncedToCentral: false
  };

  const updated = [newRecord, ...existing];
  try {
    localStorage.setItem(OFFLINE_DRAFTS_CACHE_KEY, JSON.stringify(updated));
    updateCacheMetadata();
  } catch (e) {
    console.warn('Error saving offline draft:', e);
  }
  return newRecord;
}

/**
 * Marks all pending offline drafts as synced
 */
export function syncOfflineDrafts(): number {
  const drafts = getOfflineFieldDrafts();
  const unsyncedCount = drafts.filter(d => !d.syncedToCentral).length;
  const synced = drafts.map(d => ({ ...d, syncedToCentral: true }));
  try {
    localStorage.setItem(OFFLINE_DRAFTS_CACHE_KEY, JSON.stringify(synced));
    updateCacheMetadata();
  } catch (e) {
    console.warn('Error syncing drafts:', e);
  }
  return unsyncedCount;
}

/**
 * Deletes a draft by id
 */
export function deleteOfflineFieldDraft(id: string) {
  const drafts = getOfflineFieldDrafts().filter(d => d.id !== id);
  try {
    localStorage.setItem(OFFLINE_DRAFTS_CACHE_KEY, JSON.stringify(drafts));
    updateCacheMetadata();
  } catch (e) {
    console.warn('Error deleting draft:', e);
  }
}

/**
 * Returns current cache statistics
 */
export function getOfflineCacheStats(): OfflineCacheStats {
  try {
    const raw = localStorage.getItem(CACHE_METADATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const drafts = getOfflineFieldDrafts();
      return {
        ...parsed,
        draftsCount: drafts.length,
        pendingSyncCount: drafts.filter(d => !d.syncedToCentral).length,
        estimatedStorageKb: calculateEstimatedStorageKb()
      };
    }
  } catch (e) {
    console.warn('Error reading cache stats:', e);
  }
  return initStatutoryOfflineCache();
}

function updateCacheMetadata() {
  const drafts = getOfflineFieldDrafts();
  const stats: OfflineCacheStats = {
    lastUpdated: new Date().toISOString(),
    rulesCount: getCachedStatutoryRules().length,
    parcelsCount: getCachedCadastralParcels().length,
    draftsCount: drafts.length,
    pendingSyncCount: drafts.filter(d => !d.syncedToCentral).length,
    estimatedStorageKb: calculateEstimatedStorageKb(),
    isReadyForFieldDuty: true
  };
  try {
    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Error updating cache meta:', e);
  }
}

function calculateEstimatedStorageKb(): number {
  try {
    let bytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lume_')) {
        const val = localStorage.getItem(key) || '';
        bytes += key.length + val.length;
      }
    }
    return Math.max(28, Math.round(bytes / 1024));
  } catch {
    return 35;
  }
}
