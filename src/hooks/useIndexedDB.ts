import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  statutoryIndexedDB, 
  StorageQuotaInfo, 
  FieldAuditLogItem 
} from '../utils/indexedDBStorage';
import { ScannedDocumentRecord, LocalDocumentAnnotation } from '../types';
import { StatutoryRuleCacheItem, OfflineFieldSurveyDraft } from '../utils/offlineStatutoryCache';

export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [documents, setDocuments] = useState<ScannedDocumentRecord[]>([]);
  const [rules, setRules] = useState<StatutoryRuleCacheItem[]>([]);
  const [drafts, setDrafts] = useState<OfflineFieldSurveyDraft[]>([]);
  const [auditLogs, setAuditLogs] = useState<FieldAuditLogItem[]>([]);
  const [annotations, setAnnotations] = useState<LocalDocumentAnnotation[]>([]);
  const [quota, setQuota] = useState<StorageQuotaInfo>({
    usageBytes: 0,
    quotaBytes: 0,
    usageKb: 0,
    usageMb: 0,
    percentUsed: 0,
    isPersistent: false
  });

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [docs, rls, dfts, logs, annots, qta] = await Promise.all([
        statutoryIndexedDB.getAllDocuments(),
        statutoryIndexedDB.getAllRules(),
        statutoryIndexedDB.getAllDrafts(),
        statutoryIndexedDB.getAllAuditLogs(),
        statutoryIndexedDB.getAllAnnotations(),
        statutoryIndexedDB.getStorageQuota()
      ]);

      setDocuments(docs);
      setRules(rls);
      setDrafts(dfts);
      setAuditLogs(logs);
      setAnnotations(annots);
      setQuota(qta);
      setIsReady(true);
    } catch (err: unknown) {
      console.error('Failed to load IndexedDB data:', err);
      setError(err instanceof Error ? err.message : 'Unknown IndexedDB error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize and seed if needed on first mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        await statutoryIndexedDB.seedDefaultStatutoryVault(false);
        if (isMounted) {
          await refreshData();
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to init IndexedDB');
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [refreshData]);

  const saveDocument = useCallback(async (doc: ScannedDocumentRecord, officerRole = 'CALA Officer') => {
    await statutoryIndexedDB.saveDocument(doc);
    await statutoryIndexedDB.logAuditAction({
      documentId: doc.id,
      action: 'SAVE_STATUTORY_DOCUMENT',
      officerRole,
      details: `Saved ${doc.documentTitle} (${doc.surveyKhasraNo}) to offline IndexedDB vault.`
    });
    await refreshData();
  }, [refreshData]);

  const deleteDocument = useCallback(async (id: string, officerRole = 'CALA Officer') => {
    await statutoryIndexedDB.deleteDocument(id);
    await statutoryIndexedDB.logAuditAction({
      documentId: id,
      action: 'DELETE_STATUTORY_DOCUMENT',
      officerRole,
      details: `Removed document ${id} from offline IndexedDB vault.`
    });
    await refreshData();
  }, [refreshData]);

  const saveFieldDraft = useCallback(async (draft: OfflineFieldSurveyDraft) => {
    await statutoryIndexedDB.saveDraft(draft);
    await statutoryIndexedDB.logAuditAction({
      action: 'SAVE_FIELD_DRAFT',
      officerRole: draft.officerAttestation || 'Revenue Surveyor',
      details: `Recorded ground survey draft for Survey #${draft.surveyNumber} (${draft.villageName})`
    });
    await refreshData();
  }, [refreshData]);

  const deleteFieldDraft = useCallback(async (id: string) => {
    await statutoryIndexedDB.deleteDraft(id);
    await refreshData();
  }, [refreshData]);

  const syncAllDrafts = useCallback(async () => {
    const count = await statutoryIndexedDB.syncAllDrafts();
    await statutoryIndexedDB.logAuditAction({
      action: 'SYNC_FIELD_DRAFTS_DILRMP',
      officerRole: 'Verification Authority',
      details: `Synchronized ${count} offline field survey drafts to central registry.`
    });
    await refreshData();
    return count;
  }, [refreshData]);

  // ==========================================
  // LOCAL ANNOTATIONS & HIGHLIGHTS HOOK ACTIONS
  // ==========================================

  const saveAnnotation = useCallback(async (annotation: LocalDocumentAnnotation, officerRole = 'CALA Officer') => {
    await statutoryIndexedDB.saveAnnotation(annotation);
    await statutoryIndexedDB.logAuditAction({
      documentId: annotation.documentId,
      action: 'SAVE_LOCAL_ANNOTATION',
      officerRole,
      details: `Created local-only annotation '${annotation.title}' on document ${annotation.documentId} (Sync status: ${annotation.syncStatus}).`
    });
    await refreshData();
  }, [refreshData]);

  const deleteAnnotation = useCallback(async (id: string, officerRole = 'CALA Officer') => {
    await statutoryIndexedDB.deleteAnnotation(id);
    await statutoryIndexedDB.logAuditAction({
      action: 'DELETE_LOCAL_ANNOTATION',
      officerRole,
      details: `Removed local annotation ${id}.`
    });
    await refreshData();
  }, [refreshData]);

  const syncAllAnnotations = useCallback(async () => {
    const result = await statutoryIndexedDB.syncAllAnnotations();
    await refreshData();
    return result;
  }, [refreshData]);

  const getAnnotationsForDocument = useCallback((documentId: string): LocalDocumentAnnotation[] => {
    return annotations.filter(a => a.documentId === documentId && !a.isDeleted);
  }, [annotations]);

  const pendingAnnotationsCount = useMemo(() => {
    return annotations.filter(a => a.syncStatus === 'LOCAL_PENDING_SYNC' && !a.isDeleted).length;
  }, [annotations]);

  const requestPersistence = useCallback(async () => {
    const granted = await statutoryIndexedDB.requestPersistentStorage();
    const updatedQuota = await statutoryIndexedDB.getStorageQuota();
    setQuota(updatedQuota);
    return granted;
  }, []);

  const exportBackup = useCallback(async () => {
    return await statutoryIndexedDB.exportVaultAsJson();
  }, []);

  const importBackup = useCallback(async (jsonStr: string) => {
    const res = await statutoryIndexedDB.importVaultFromJson(jsonStr);
    await refreshData();
    return res;
  }, [refreshData]);

  const reseedVault = useCallback(async () => {
    const counts = await statutoryIndexedDB.seedDefaultStatutoryVault(true);
    await refreshData();
    return counts;
  }, [refreshData]);

  return {
    isReady,
    isLoading,
    error,
    documents,
    rules,
    drafts,
    auditLogs,
    annotations,
    pendingAnnotationsCount,
    quota,
    saveDocument,
    deleteDocument,
    saveFieldDraft,
    deleteFieldDraft,
    syncAllDrafts,
    saveAnnotation,
    deleteAnnotation,
    syncAllAnnotations,
    getAnnotationsForDocument,
    requestPersistence,
    exportBackup,
    importBackup,
    reseedVault,
    refreshData
  };
}
