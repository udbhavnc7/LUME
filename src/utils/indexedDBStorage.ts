/**
 * Robust, type-safe IndexedDB Wrapper for Statutory Land Acquisition Documents
 * 
 * Provides durable, client-side structured storage for:
 * 1. Statutory documents (Scanned records, 7/12 Satbara, awards, mutation entries)
 * 2. Statutory legal provisions (RFCTLARR 2013 & NHAI Act 1956 limitation rules)
 * 3. Cadastral parcel benchmarks (Circle rates, RoW corridors)
 * 4. Field survey drafts & offline officer measurements
 * 5. Audit logs for field modifications
 * 
 * Guarantees that field-based CALA verification officers and revenue surveyors
 * can access critical records on the ground even after PWA cache eviction.
 */

import { ScannedDocumentRecord, LocalDocumentAnnotation } from '../types';
import { 
  StatutoryRuleCacheItem, 
  CORE_STATUTORY_PROVISIONS, 
  DEFAULT_OFFLINE_CADASTRAL_PARCELS, 
  OfflineFieldSurveyDraft 
} from './offlineStatutoryCache';
import { PRESET_SCANNED_DOCUMENTS } from '../data/documentVerificationData';

export const DB_NAME = 'LUME_Statutory_Vault_v1';
export const DB_VERSION = 2;

export const STORES = {
  DOCUMENTS: 'statutory_documents',
  RULES: 'statutory_rules',
  PARCELS: 'cadastral_parcels',
  DRAFTS: 'field_survey_drafts',
  AUDIT_LOGS: 'field_audit_logs',
  ANNOTATIONS: 'document_annotations',
} as const;

export const PRESET_LOCAL_ANNOTATIONS: LocalDocumentAnnotation[] = [
  {
    id: 'annot-seed-001',
    documentId: 'doc-satbara-712-001',
    documentTitle: '7/12 Satbara Extract (Village Khed)',
    surveyKhasraNo: 'Survey 142/2A',
    color: 'amber',
    category: 'CO_PARCENER_DISPUTE',
    title: 'Omitted Co-Parcener on Record',
    notes: 'Ground inquiry indicates deceased brother legal heir Ramesh Patil possesses 50% physical possession, but not updated in mutation extract. Requires legal notice before Sec 23 award.',
    boundingBox: {
      top: 54,
      left: 10,
      width: 80,
      height: 14
    },
    authorOfficer: 'Vijay Deshmukh (CALA Verification Officer)',
    authorRole: 'CALA Officer',
    statutoryCitation: 'RFCTLARR 2013 Sec 23 & Sec 64',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    syncStatus: 'LOCAL_PENDING_SYNC'
  },
  {
    id: 'annot-seed-002',
    documentId: 'doc-satbara-712-001',
    documentTitle: '7/12 Satbara Extract (Village Khed)',
    surveyKhasraNo: 'Survey 142/2A',
    color: 'rose',
    category: 'BOUNDARY_VARIANCE',
    title: 'East Boundary Dimension Variance',
    notes: 'Physical field chainage shows East boundary at 68.4m while 7/12 record indicates 78.0m (-9.6m variance due to canal bund encroachment).',
    boundingBox: {
      top: 38,
      left: 12,
      width: 76,
      height: 12
    },
    authorOfficer: 'P. K. Shinde (Talathi / Revenue Surveyor)',
    authorRole: 'Revenue Surveyor',
    statutoryCitation: 'Maharashtra Land Revenue Code 1966 Sec 136',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    syncStatus: 'LOCAL_PENDING_SYNC'
  }
];

export interface StorageQuotaInfo {
  usageBytes: number;
  quotaBytes: number;
  usageKb: number;
  usageMb: number;
  percentUsed: number;
  isPersistent: boolean;
}

export interface FieldAuditLogItem {
  id: string;
  documentId?: string;
  action: string;
  officerRole: string;
  details: string;
  timestamp: string;
}

class IndexedDBStorageManager {
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initializes or returns the open IndexedDB connection
   */
  public async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Statutory Documents Store
        if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
          const docStore = db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
          docStore.createIndex('projectId', 'projectId', { unique: false });
          docStore.createIndex('surveyKhasraNo', 'surveyKhasraNo', { unique: false });
          docStore.createIndex('village', 'village', { unique: false });
          docStore.createIndex('documentType', 'documentType', { unique: false });
        }

        // 2. Statutory Legal Rules Store
        if (!db.objectStoreNames.contains(STORES.RULES)) {
          const ruleStore = db.createObjectStore(STORES.RULES, { keyPath: 'id' });
          ruleStore.createIndex('statute', 'statute', { unique: false });
          ruleStore.createIndex('section', 'section', { unique: false });
        }

        // 3. Cadastral Reference Parcels Store
        if (!db.objectStoreNames.contains(STORES.PARCELS)) {
          const parcelStore = db.createObjectStore(STORES.PARCELS, { keyPath: 'khasraSurvey' });
          parcelStore.createIndex('village', 'village', { unique: false });
        }

        // 4. Offline Field Survey Drafts Store
        if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
          const draftStore = db.createObjectStore(STORES.DRAFTS, { keyPath: 'id' });
          draftStore.createIndex('surveyNumber', 'surveyNumber', { unique: false });
          draftStore.createIndex('syncedToCentral', 'syncedToCentral', { unique: false });
          draftStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 5. Audit Logs Store
        if (!db.objectStoreNames.contains(STORES.AUDIT_LOGS)) {
          const auditStore = db.createObjectStore(STORES.AUDIT_LOGS, { keyPath: 'id' });
          auditStore.createIndex('documentId', 'documentId', { unique: false });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 6. Local Document Annotations & Highlights Store (Local-Only Metadata until Online Sync)
        if (!db.objectStoreNames.contains(STORES.ANNOTATIONS)) {
          const annotStore = db.createObjectStore(STORES.ANNOTATIONS, { keyPath: 'id' });
          annotStore.createIndex('documentId', 'documentId', { unique: false });
          annotStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          annotStore.createIndex('createdAt', 'createdAt', { unique: false });
          annotStore.createIndex('category', 'category', { unique: false });
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event: Event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        this.dbPromise = null;
        reject(error || new Error('Failed to open IndexedDB database'));
      };
    });

    return this.dbPromise;
  }

  // ==========================================
  // DOCUMENT OPERATIONS (Scanned Land Records)
  // ==========================================

  /**
   * Save or update a statutory document in IndexedDB
   */
  public async saveDocument(doc: ScannedDocumentRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readwrite');
      const store = tx.objectStore(STORES.DOCUMENTS);
      const req = store.put(doc);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Save multiple documents in a single atomic transaction
   */
  public async saveDocumentsBulk(docs: ScannedDocumentRecord[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readwrite');
      const store = tx.objectStore(STORES.DOCUMENTS);

      for (const doc of docs) {
        store.put(doc);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Get a single statutory document by its ID
   */
  public async getDocument(id: string): Promise<ScannedDocumentRecord | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readonly');
      const store = tx.objectStore(STORES.DOCUMENTS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get all stored statutory documents
   */
  public async getAllDocuments(): Promise<ScannedDocumentRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readonly');
      const store = tx.objectStore(STORES.DOCUMENTS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Delete a statutory document by ID
   */
  public async deleteDocument(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readwrite');
      const store = tx.objectStore(STORES.DOCUMENTS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Count documents in the store
   */
  public async getDocumentsCount(): Promise<number> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DOCUMENTS, 'readonly');
      const store = tx.objectStore(STORES.DOCUMENTS);
      const req = store.count();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // STATUTORY RULES OPERATIONS
  // ==========================================

  public async saveRule(rule: StatutoryRuleCacheItem): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.RULES, 'readwrite');
      const store = tx.objectStore(STORES.RULES);
      const req = store.put(rule);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAllRules(): Promise<StatutoryRuleCacheItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.RULES, 'readonly');
      const store = tx.objectStore(STORES.RULES);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // CADASTRAL PARCEL OPERATIONS
  // ==========================================

  public async saveParcel(parcel: typeof DEFAULT_OFFLINE_CADASTRAL_PARCELS[0]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PARCELS, 'readwrite');
      const store = tx.objectStore(STORES.PARCELS);
      const req = store.put(parcel);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAllParcels(): Promise<typeof DEFAULT_OFFLINE_CADASTRAL_PARCELS> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PARCELS, 'readonly');
      const store = tx.objectStore(STORES.PARCELS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // FIELD SURVEY DRAFTS OPERATIONS
  // ==========================================

  public async saveDraft(draft: OfflineFieldSurveyDraft): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DRAFTS, 'readwrite');
      const store = tx.objectStore(STORES.DRAFTS);
      const req = store.put(draft);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAllDrafts(): Promise<OfflineFieldSurveyDraft[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DRAFTS, 'readonly');
      const store = tx.objectStore(STORES.DRAFTS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteDraft(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DRAFTS, 'readwrite');
      const store = tx.objectStore(STORES.DRAFTS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async syncAllDrafts(): Promise<number> {
    const drafts = await this.getAllDrafts();
    const unsynced = drafts.filter(d => !d.syncedToCentral);
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.DRAFTS, 'readwrite');
      const store = tx.objectStore(STORES.DRAFTS);

      for (const d of unsynced) {
        store.put({ ...d, syncedToCentral: true });
      }

      tx.oncomplete = () => resolve(unsynced.length);
      tx.onerror = () => reject(tx.error);
    });
  }

  // ==========================================
  // LOCAL DOCUMENT ANNOTATIONS & HIGHLIGHTS
  // ==========================================

  /**
   * Save or update a local-only annotation on a statutory document
   */
  public async saveAnnotation(annotation: LocalDocumentAnnotation): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readwrite');
      const store = tx.objectStore(STORES.ANNOTATIONS);
      const req = store.put(annotation);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Save multiple annotations in bulk
   */
  public async saveAnnotationsBulk(annotations: LocalDocumentAnnotation[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readwrite');
      const store = tx.objectStore(STORES.ANNOTATIONS);

      for (const annot of annotations) {
        store.put(annot);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Retrieve all annotations for a specific document
   */
  public async getAnnotationsByDocument(documentId: string): Promise<LocalDocumentAnnotation[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readonly');
      const store = tx.objectStore(STORES.ANNOTATIONS);
      const index = store.index('documentId');
      const req = index.getAll(documentId);

      req.onsuccess = () => {
        const results = (req.result || []).filter(a => !a.isDeleted);
        // Sort newest first
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve all local annotations across all documents
   */
  public async getAllAnnotations(): Promise<LocalDocumentAnnotation[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readonly');
      const store = tx.objectStore(STORES.ANNOTATIONS);
      const req = store.getAll();

      req.onsuccess = () => {
        const results = (req.result || []).filter(a => !a.isDeleted);
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Delete an annotation by ID (or soft-delete if synced)
   */
  public async deleteAnnotation(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readwrite');
      const store = tx.objectStore(STORES.ANNOTATIONS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Sync all pending local annotations to central DILRMP server
   * Marks local-only metadata as 'SYNCED' with current timestamp
   */
  public async syncAllAnnotations(): Promise<{ syncedCount: number; syncedIds: string[] }> {
    const all = await this.getAllAnnotations();
    const unsynced = all.filter(a => a.syncStatus === 'LOCAL_PENDING_SYNC');
    
    if (unsynced.length === 0) {
      return { syncedCount: 0, syncedIds: [] };
    }

    const timestamp = new Date().toISOString();
    const syncedIds: string[] = [];
    const db = await this.getDB();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.ANNOTATIONS, 'readwrite');
      const store = tx.objectStore(STORES.ANNOTATIONS);

      for (const annot of unsynced) {
        const updated: LocalDocumentAnnotation = {
          ...annot,
          syncStatus: 'SYNCED',
          syncedAt: timestamp,
          updatedAt: timestamp
        };
        store.put(updated);
        syncedIds.push(annot.id);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Log to Audit trail
    await this.logAuditAction({
      action: 'SYNC_LOCAL_ANNOTATIONS_CENTRAL',
      officerRole: 'Verification Authority / Field Surveyor',
      details: `Synchronized ${syncedIds.length} offline document annotations and spatial highlights to central Land Portal.`
    });

    return { syncedCount: syncedIds.length, syncedIds };
  }

  // ==========================================
  // AUDIT LOGS OPERATIONS
  // ==========================================

  public async logAuditAction(action: Omit<FieldAuditLogItem, 'id' | 'timestamp'>): Promise<void> {
    const db = await this.getDB();
    const item: FieldAuditLogItem = {
      ...action,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIT_LOGS, 'readwrite');
      const store = tx.objectStore(STORES.AUDIT_LOGS);
      const req = store.put(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getAllAuditLogs(): Promise<FieldAuditLogItem[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIT_LOGS, 'readonly');
      const store = tx.objectStore(STORES.AUDIT_LOGS);
      const req = store.getAll();

      req.onsuccess = () => {
        const sorted = (req.result || []).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // SEEDING & BACKUP MANAGEMENT
  // ==========================================

  /**
   * Populates default statutory documents, acts, and cadastral parcels if not already present.
   * Ensures the field officer has access immediately upon opening the app.
   */
  public async seedDefaultStatutoryVault(forceOverwrite: boolean = false): Promise<{
    docsCount: number;
    rulesCount: number;
    parcelsCount: number;
    annotationsCount?: number;
  }> {
    const currentDocsCount = await this.getDocumentsCount();

    if (currentDocsCount === 0 || forceOverwrite) {
      await this.saveDocumentsBulk(PRESET_SCANNED_DOCUMENTS);
    }

    // Seed Rules
    const db = await this.getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.RULES, 'readwrite');
      const store = tx.objectStore(STORES.RULES);
      for (const rule of CORE_STATUTORY_PROVISIONS) {
        store.put(rule);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Seed Parcels
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.PARCELS, 'readwrite');
      const store = tx.objectStore(STORES.PARCELS);
      for (const parcel of DEFAULT_OFFLINE_CADASTRAL_PARCELS) {
        store.put(parcel);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Seed Initial Local Annotations (if none exist)
    const existingAnnotations = await this.getAllAnnotations();
    if (existingAnnotations.length === 0 || forceOverwrite) {
      await this.saveAnnotationsBulk(PRESET_LOCAL_ANNOTATIONS);
    }

    const finalDocs = await this.getAllDocuments();
    const finalRules = await this.getAllRules();
    const finalParcels = await this.getAllParcels();
    const finalAnnotations = await this.getAllAnnotations();

    return {
      docsCount: finalDocs.length,
      rulesCount: finalRules.length,
      parcelsCount: finalParcels.length,
      annotationsCount: finalAnnotations.length
    };
  }

  /**
   * Requests persistent storage from the browser to protect against storage eviction
   */
  public async requestPersistentStorage(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
    return false;
  }

  /**
   * Retrieves storage quota and usage information
   */
  public async getStorageQuota(): Promise<StorageQuotaInfo> {
    let usageBytes = 0;
    let quotaBytes = 0;
    let isPersistent = false;

    if (typeof navigator !== 'undefined' && navigator.storage) {
      if (navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
      }
      if (navigator.storage.persisted) {
        isPersistent = await navigator.storage.persisted();
      }
    }

    const usageKb = Math.round(usageBytes / 1024);
    const usageMb = +(usageBytes / (1024 * 1024)).toFixed(2);
    const percentUsed = quotaBytes > 0 ? +((usageBytes / quotaBytes) * 100).toFixed(2) : 0;

    return {
      usageBytes,
      quotaBytes,
      usageKb,
      usageMb,
      percentUsed,
      isPersistent
    };
  }

  /**
   * Exports full IndexedDB statutory vault as JSON string
   */
  public async exportVaultAsJson(): Promise<string> {
    const docs = await this.getAllDocuments();
    const rules = await this.getAllRules();
    const parcels = await this.getAllParcels();
    const drafts = await this.getAllDrafts();
    const auditLogs = await this.getAllAuditLogs();
    const annotations = await this.getAllAnnotations();

    const payload = {
      exportVersion: '2.0',
      exportedAt: new Date().toISOString(),
      statuteCompliance: 'RFCTLARR 2013 & NHAI Act 1956',
      records: {
        documents: docs,
        rules,
        parcels,
        drafts,
        auditLogs,
        annotations
      }
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Imports JSON payload into IndexedDB
   */
  public async importVaultFromJson(jsonString: string): Promise<{ importedDocs: number; importedDrafts: number; importedAnnotations: number }> {
    const data = JSON.parse(jsonString);
    if (!data.records) {
      throw new Error('Invalid vault backup file format');
    }

    let importedDocs = 0;
    let importedDrafts = 0;
    let importedAnnotations = 0;

    if (Array.isArray(data.records.documents)) {
      await this.saveDocumentsBulk(data.records.documents);
      importedDocs = data.records.documents.length;
    }

    if (Array.isArray(data.records.drafts)) {
      for (const d of data.records.drafts) {
        await this.saveDraft(d);
        importedDrafts++;
      }
    }

    if (Array.isArray(data.records.annotations)) {
      await this.saveAnnotationsBulk(data.records.annotations);
      importedAnnotations = data.records.annotations.length;
    }

    return { importedDocs, importedDrafts, importedAnnotations };
  }

  /**
   * Clears all stores in the database
   */
  public async clearAllStores(): Promise<void> {
    const db = await this.getDB();
    const storeNames = [STORES.DOCUMENTS, STORES.RULES, STORES.PARCELS, STORES.DRAFTS, STORES.AUDIT_LOGS, STORES.ANNOTATIONS];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeNames, 'readwrite');
      for (const name of storeNames) {
        tx.objectStore(name).clear();
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

// Export singleton instance
export const statutoryIndexedDB = new IndexedDBStorageManager();
