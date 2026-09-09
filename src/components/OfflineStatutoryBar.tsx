import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Download, 
  Upload,
  Layers, 
  FileText, 
  Scale, 
  MapPin, 
  Smartphone, 
  Share2, 
  X, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  Trash2,
  HardDrive,
  Database,
  ArrowRight,
  Eye,
  Search,
  ShieldAlert,
  Sparkles,
  Highlighter,
  CloudOff
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { 
  getOfflineCacheStats, 
  initStatutoryOfflineCache, 
  getCachedStatutoryRules, 
  getCachedCadastralParcels, 
  getOfflineFieldDrafts, 
  saveOfflineFieldDraft, 
  deleteOfflineFieldDraft, 
  syncOfflineDrafts,
  OfflineCacheStats,
  StatutoryRuleCacheItem,
  OfflineFieldSurveyDraft
} from '../utils/offlineStatutoryCache';
import { ScannedDocumentRecord, LocalDocumentAnnotation } from '../types';

interface OfflineStatutoryBarProps {
  language?: 'EN' | 'HI';
}

export const OfflineStatutoryBar: React.FC<OfflineStatutoryBarProps> = ({ language = 'EN' }) => {
  const { isOnline } = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // IndexedDB Storage Hook
  const {
    isReady: isIdbReady,
    documents: idbDocuments,
    rules: idbRules,
    drafts: idbDrafts,
    auditLogs: idbAuditLogs,
    annotations: idbAnnotations,
    pendingAnnotationsCount,
    quota: idbQuota,
    saveDocument: saveIdbDoc,
    deleteDocument: deleteIdbDoc,
    saveFieldDraft: saveIdbDraft,
    deleteFieldDraft: deleteIdbDraft,
    syncAllDrafts: syncIdbDrafts,
    syncAllAnnotations: syncIdbAnnotations,
    deleteAnnotation: deleteIdbAnnotation,
    requestPersistence,
    exportBackup,
    importBackup,
    reseedVault,
    refreshData: refreshIdbData
  } = useIndexedDB();

  const [cacheStats, setCacheStats] = useState<OfflineCacheStats>(getOfflineCacheStats());
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'IDB_VAULT' | 'ANNOTATIONS' | 'RULES' | 'PARCELS' | 'DRAFTS' | 'NEW_DRAFT' | 'AUDIT_LOGS'>('IDB_VAULT');
  const [isPreCaching, setIsPreCaching] = useState<boolean>(false);
  const [preCacheSuccess, setPreCacheSuccess] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  // Document Inspection Modal
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocumentRecord | null>(null);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [vaultFeedback, setVaultFeedback] = useState<string | null>(null);

  // Annotations Management State
  const [annotationSearchQuery, setAnnotationSearchQuery] = useState('');
  const [annotationSyncFilter, setAnnotationSyncFilter] = useState<'ALL' | 'LOCAL_PENDING_SYNC' | 'SYNCED'>('ALL');
  const [isSyncingAnnots, setIsSyncingAnnots] = useState(false);

  // File input ref for backup import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Draft Form State
  const [surveyNo, setSurveyNo] = useState('');
  const [village, setVillage] = useState('');
  const [owner, setOwner] = useState('');
  const [measuredArea, setMeasuredArea] = useState('');
  const [recordedArea, setRecordedArea] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldCategory, setFieldCategory] = useState<'MATCH' | 'DISCREPANCY' | 'CRITICAL_ENCROACHMENT'>('MATCH');

  useEffect(() => {
    // Initialize cache on mount
    const stats = initStatutoryOfflineCache();
    setCacheStats(stats);
  }, []);

  const handlePreCacheNow = () => {
    setIsPreCaching(true);
    setTimeout(async () => {
      const stats = initStatutoryOfflineCache();
      setCacheStats(stats);
      await refreshIdbData();
      setIsPreCaching(false);
      setPreCacheSuccess(true);
      setTimeout(() => setPreCacheSuccess(false), 3000);
    }, 600);
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyNo.trim() || !village.trim()) return;

    const mArea = parseFloat(measuredArea) || 0;
    const rArea = parseFloat(recordedArea) || mArea;
    const variance = rArea > 0 ? +(((mArea - rArea) / rArea) * 100).toFixed(1) : 0;

    const newDraft: OfflineFieldSurveyDraft = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      surveyNumber: surveyNo.trim(),
      villageName: village.trim(),
      district: 'Pune Revenue Division',
      ownerName: owner.trim() || 'Verified Land Holder',
      measuredAreaAcre: mArea,
      recordedAreaAcre: rArea,
      variancePercentage: variance,
      fieldNotes: notes.trim() || 'Physical boundary inspection completed in offline field mode.',
      geotagCoordinates: {
        lat: 18.5204 + (Math.random() - 0.5) * 0.05,
        lng: 73.8567 + (Math.random() - 0.5) * 0.05,
        accuracyMeters: 4.2
      },
      statutoryCategory: fieldCategory,
      officerAttestation: 'CALA Field Survey Officer #4092',
      syncedToCentral: false
    };

    // Save in both localStorage and IndexedDB for maximum survivability
    saveOfflineFieldDraft(newDraft);
    await saveIdbDraft(newDraft);

    // Reset Form
    setSurveyNo('');
    setVillage('');
    setOwner('');
    setMeasuredArea('');
    setRecordedArea('');
    setNotes('');
    setCacheStats(getOfflineCacheStats());
    setActiveTab('DRAFTS');

    setVaultFeedback('Field survey draft saved to local IndexedDB and cache.');
    setTimeout(() => setVaultFeedback(null), 3500);
  };

  const handleSyncAllDrafts = async () => {
    syncOfflineDrafts();
    const idbSynced = await syncIdbDrafts();
    setCacheStats(getOfflineCacheStats());
    setVaultFeedback(`Successfully synchronized ${idbSynced} offline field drafts to DILRMP.`);
    setTimeout(() => setVaultFeedback(null), 4000);
  };

  const handleSyncAnnotations = async () => {
    setIsSyncingAnnots(true);
    try {
      const result = await syncIdbAnnotations();
      setVaultFeedback(`Successfully synchronized ${result.syncedCount} local document annotations to Central Land Portal.`);
      setTimeout(() => setVaultFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to sync annotations:', err);
    } finally {
      setIsSyncingAnnots(false);
    }
  };

  const handleRequestPersistence = async () => {
    const granted = await requestPersistence();
    if (granted) {
      setVaultFeedback('Browser granted persistent storage guarantee. Data will not be evicted even when disk space is low.');
    } else {
      setVaultFeedback('Browser storage persistence request completed. IndexedDB remains active.');
    }
    setTimeout(() => setVaultFeedback(null), 4500);
  };

  const handleExportBackup = async () => {
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LUME-Statutory-Vault-Backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setVaultFeedback('Vault JSON backup exported successfully.');
      setTimeout(() => setVaultFeedback(null), 3500);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await importBackup(text);
      setVaultFeedback(`Imported ${res.importedDocs} statutory documents and ${res.importedDrafts} field drafts into IndexedDB.`);
      setTimeout(() => setVaultFeedback(null), 4500);
    } catch (err: unknown) {
      setVaultFeedback('Failed to import backup. Please check file format.');
      setTimeout(() => setVaultFeedback(null), 4000);
    }
    if (e.target) e.target.value = '';
  };

  const handleReseed = async () => {
    const res = await reseedVault();
    setVaultFeedback(`Reseeded default statutory documents (${res.docsCount} docs, ${res.rulesCount} provisions).`);
    setTimeout(() => setVaultFeedback(null), 3500);
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this statutory document from local IndexedDB?')) {
      await deleteIdbDoc(id);
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
      setVaultFeedback('Document removed from local IndexedDB vault.');
      setTimeout(() => setVaultFeedback(null), 3000);
    }
  };

  const cachedRules = getCachedStatutoryRules();
  const cachedParcels = getCachedCadastralParcels();
  const drafts = idbDrafts.length > 0 ? idbDrafts : getOfflineFieldDrafts();
  const pendingSync = drafts.filter(d => !d.syncedToCentral).length;

  const filteredIdbDocs = idbDocuments.filter(d => {
    if (!docSearchQuery.trim()) return true;
    const q = docSearchQuery.toLowerCase();
    return (
      d.surveyKhasraNo?.toLowerCase().includes(q) ||
      d.village?.toLowerCase().includes(q) ||
      d.district?.toLowerCase().includes(q) ||
      d.documentTitle?.toLowerCase().includes(q) ||
      d.ulpin?.toLowerCase().includes(q) ||
      d.owners?.some(o => o.name.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Hidden file input for vault restore */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".json" 
        className="hidden" 
        onChange={handleImportBackup} 
      />

      {/* Floating / Sticky Offline & PWA Notification Strip */}
      <div 
        id="offline-statutory-bar"
        className={`w-full transition-all duration-200 border-b text-xs px-4 py-2 ${
          !isOnline 
            ? 'bg-amber-950/90 border-amber-800 text-amber-200' 
            : 'bg-slate-900/95 border-slate-800 text-slate-300'
        } backdrop-blur-md sticky top-0 z-40 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Connectivity Status & Statutory Protection Status */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 font-semibold">
              {!isOnline ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-100 font-bold">
                    {language === 'HI' ? 'ऑफ़लाइन फ़ील्ड मोड' : 'Offline Field Mode'}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200 font-medium">
                    {language === 'HI' ? 'ऑनलाइन नेटवर्क सक्रिय' : 'Online'}
                  </span>
                </>
              )}
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            {/* Statutory Protection Indicator */}
            <div className="flex items-center gap-1 text-[11px] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {language === 'HI' 
                  ? 'अधिनियम २०१३ व राष्ट्रीय राजमार्ग नियम ऑफ़लाइन उपलब्ध' 
                  : 'RFCTLARR 2013 & Cadastral Rules Cached'}
              </span>
            </div>

            {/* IndexedDB Vault Status Badge (Clickable) */}
            <button
              id="btn-open-idb-vault"
              onClick={() => {
                setActiveTab('IDB_VAULT');
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold hover:bg-indigo-500/30 cursor-pointer transition-all"
              title="IndexedDB Vault secures critical statutory documents independently of PWA cache expiry"
            >
              <Database className="w-3 h-3 text-indigo-400" />
              <span>Vault: {idbDocuments.length} Docs in IndexedDB</span>
              {idbQuota.isPersistent && (
                <span className="text-[9px] px-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded font-mono">
                  Persisted
                </span>
              )}
            </button>

            {/* Pending Sync Pill */}
            {pendingSync > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{pendingSync} field draft{pendingSync > 1 ? 's' : ''} to sync</span>
              </span>
            )}
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Manual Pre-cache Button */}
            <button
              id="btn-precache-statutory"
              onClick={handlePreCacheNow}
              disabled={isPreCaching}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Synchronize statutory legal provisions & cadastral rates to local IndexedDB and service worker"
            >
              <RefreshCw className={`w-3 h-3 text-indigo-400 ${isPreCaching ? 'animate-spin' : ''}`} />
              <span>
                {isPreCaching 
                  ? (language === 'HI' ? 'कैशिंग...' : 'Caching...') 
                  : preCacheSuccess 
                    ? (language === 'HI' ? 'कैश पूर्ण ✓' : 'Cached ✓') 
                    : (language === 'HI' ? 'डेटा रीफ्रेश' : 'Refresh Cache')}
              </span>
            </button>

            {/* Offline Manager Drawer Button */}
            <button
              id="btn-open-statutory-drawer"
              onClick={() => setIsDrawerOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Database className="w-3 h-3 text-indigo-200" />
              <span>{language === 'HI' ? 'ऑफ़लाइन प्रबंधक' : 'Offline Vault'}</span>
              <ChevronRight className="w-3 h-3 text-indigo-200" />
            </button>

            {/* In-App Install Prompt Button (PWA) */}
            {!isInstalled && isInstallable && (
              <button
                id="btn-install-pwa-app"
                onClick={install}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow flex items-center gap-1.5 transition-all cursor-pointer"
                title="Install LUME on home screen for full offline field usage"
              >
                <Smartphone className="w-3 h-3" />
                <span>{language === 'HI' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
              </button>
            )}

            {/* iOS Safari Guide Button */}
            {!isInstalled && isIOS && (
              <button
                id="btn-ios-install-guide"
                onClick={() => setShowIOSModal(true)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3 text-sky-400" />
                <span>iOS Install</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <span>Install LUME on iPhone / iPad</span>
              </div>
              <button 
                onClick={() => setShowIOSModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To use LUME offline during field land acquisition surveys:
            </p>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal pl-4">
              <li>Tap the <strong className="text-sky-400">Share</strong> icon in the Safari toolbar.</li>
              <li>Scroll down and select <strong className="text-white">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="text-white">Add</strong> in the top-right corner.</li>
            </ol>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All statutory countdown clocks and parcel verification tools will run offline in the field.</span>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Detailed Document Inspection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedDoc.documentTitle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      IndexedDB Stored
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Khasra {selectedDoc.surveyKhasraNo} • {selectedDoc.village}, {selectedDoc.district}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Details Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">ULPIN:</span>
                  <span className="text-white font-mono font-bold">{selectedDoc.ulpin || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Area:</span>
                  <span className="text-white font-mono font-bold">{selectedDoc.totalAreaAcre} Acres</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Classification:</span>
                  <span className="text-slate-200">{selectedDoc.landClassification}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">OCR Confidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">{Math.round((selectedDoc.ocrConfidence || 0.95) * 100)}%</span>
                </div>
              </div>

              {/* Ownership Shares */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block text-[11px]">Interested Landholders & Shares</span>
                <div className="space-y-1">
                  {selectedDoc.owners.map((owner, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-200 font-medium">{owner.name}</span>
                      <span className="text-indigo-300 font-mono font-bold">{owner.sharePct}% Share</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boundary Dimensions */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block text-[11px]">Boundary Dimensions (Field Ground Check)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">North:</span>
                    <span className="text-white font-bold">{selectedDoc.dimensions.northMeters}m</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">South:</span>
                    <span className="text-white font-bold">{selectedDoc.dimensions.southMeters}m</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">East:</span>
                    <span className="text-white font-bold">{selectedDoc.dimensions.eastMeters}m</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px]">West:</span>
                    <span className="text-white font-bold">{selectedDoc.dimensions.westMeters}m</span>
                  </div>
                </div>
              </div>

              {/* Issuing Authority & Verification Notes */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-400">
                  Issuing Authority: <span className="text-slate-200 font-medium">{selectedDoc.issuingOffice}</span>
                </div>
                <div className="text-slate-400">
                  Issue Date: <span className="text-slate-200 font-medium">{selectedDoc.issueDate}</span>
                </div>
                <div className="text-slate-400">
                  Encumbrance Record: <span className="text-slate-300">{selectedDoc.encumbranceNotes}</span>
                </div>
              </div>

              {/* Discrepancies Summary */}
              {selectedDoc.discrepancies && selectedDoc.discrepancies.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold block text-[11px]">Reconciliation Cross-Checks ({selectedDoc.discrepancies.length})</span>
                  <div className="space-y-1">
                    {selectedDoc.discrepancies.map((disc, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">{disc.label}: <strong className="text-white">{disc.scannedValue}</strong> vs DB <strong className="text-slate-400">{disc.databaseValue}</strong></span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          disc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          disc.severity === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {disc.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Local Annotations & Highlights for this document */}
              {(() => {
                const docAnnots = idbAnnotations.filter(a => a.documentId === selectedDoc.id);
                return (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
                        <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                        <span>Local Document Annotations ({docAnnots.length})</span>
                      </span>
                      {docAnnots.some(a => a.syncStatus === 'LOCAL_PENDING_SYNC') && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                          Local Only (Pending Online Sync)
                        </span>
                      )}
                    </div>
                    {docAnnots.length === 0 ? (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-500 text-center">
                        No local annotations recorded on this document yet. You can highlight or add notes directly in the Verification module.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {docAnnots.map((annot) => (
                          <div key={annot.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{
                                    backgroundColor: annot.color === 'YELLOW' ? '#f59e0b' :
                                      annot.color === 'RED' ? '#ef4444' :
                                      annot.color === 'GREEN' ? '#10b981' :
                                      annot.color === 'BLUE' ? '#3b82f6' : '#8b5cf6'
                                  }}
                                />
                                {annot.title}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                                annot.syncStatus === 'LOCAL_PENDING_SYNC' 
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              }`}>
                                {annot.syncStatus === 'LOCAL_PENDING_SYNC' ? '⚡ Local Only' : '✓ Synced'}
                              </span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{annot.notes}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                              <span>By: {annot.authorOfficer}</span>
                              {annot.statutoryCitation && (
                                <span className="text-indigo-300 font-mono">{annot.statutoryCitation}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Safely secured in IndexedDB. Fully accessible offline.</span>
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Offline Cache & Field Survey Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{language === 'HI' ? 'वैधानिक ऑफ़लाइन स्टोरेज एवं IndexedDB वॉल्ट' : 'Statutory IndexedDB Vault & Offline Cache'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      v2.0 Durable DB
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Client-side structured database storing critical statutory records, 7/12 extracts, and offline field surveys
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics & Storage Quota Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 p-3 bg-slate-950/60 border-b border-slate-800/80 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Statutory Documents</span>
                <span className="text-indigo-300 font-bold font-mono">{idbDocuments.length} Records</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Statutory Provisions</span>
                <span className="text-white font-bold font-mono">{cachedRules.length} Provisions</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cadastral Benchmarks</span>
                <span className="text-white font-bold font-mono">{cachedParcels.length} Benchmarks</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Offline Field Notes</span>
                <span className="text-amber-300 font-bold font-mono">{drafts.length} ({pendingSync} unsynced)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Document Highlights</span>
                <span className="text-amber-400 font-bold font-mono">
                  {idbAnnotations.length} {pendingAnnotationsCount > 0 ? `(⚡${pendingAnnotationsCount} Local)` : '✓'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">IndexedDB Storage</span>
                <span className="text-emerald-300 font-bold font-mono">
                  {idbQuota.usageKb > 0 ? `${idbQuota.usageKb} KB` : '~48 KB'} 
                  {idbQuota.isPersistent ? ' (Persisted)' : ''}
                </span>
              </div>
            </div>

            {/* Optional Notification Toast inside drawer */}
            {vaultFeedback && (
              <div className="px-4 py-2 bg-emerald-950/90 border-b border-emerald-800 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{vaultFeedback}</span>
                </div>
                <button onClick={() => setVaultFeedback(null)} className="text-emerald-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('IDB_VAULT')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'IDB_VAULT'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>IndexedDB Documents ({idbDocuments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('ANNOTATIONS')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'ANNOTATIONS'
                    ? 'border-amber-500 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                <span>Document Highlights ({idbAnnotations.length})</span>
                {pendingAnnotationsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                    ⚡{pendingAnnotationsCount} Local
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('RULES')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'RULES'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Statutory Provisions ({cachedRules.length})
              </button>
              <button
                onClick={() => setActiveTab('PARCELS')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'PARCELS'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Cadastral Benchmarks ({cachedParcels.length})
              </button>
              <button
                onClick={() => setActiveTab('DRAFTS')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'DRAFTS'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Field Drafts ({drafts.length})</span>
                {pendingSync > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                    {pendingSync}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('NEW_DRAFT')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'NEW_DRAFT'
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-transparent text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Field Note</span>
              </button>
              <button
                onClick={() => setActiveTab('AUDIT_LOGS')}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'AUDIT_LOGS'
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Audit Trail ({idbAuditLogs.length})</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* TAB 1: INDEXEDDB STATUTORY VAULT */}
              {activeTab === 'IDB_VAULT' && (
                <div className="space-y-3">
                  {/* Vault Persistence & Management Strip */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            IndexedDB Structured Document Storage
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Documents stored here remain accessible offline indefinitely even if browser service worker or HTTP cache expires.
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons for IndexedDB */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!idbQuota.isPersistent && (
                          <button
                            onClick={handleRequestPersistence}
                            className="px-2.5 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Prevent browser from evicting IndexedDB records under storage pressure"
                          >
                            <ShieldAlert className="w-3 h-3 text-indigo-200" />
                            <span>Guarantee Persistence</span>
                          </button>
                        )}
                        <button
                          onClick={handleExportBackup}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          title="Export all stored documents and drafts to JSON file"
                        >
                          <Download className="w-3 h-3 text-teal-400" />
                          <span>Export Backup</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          title="Import previously exported vault JSON file"
                        >
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Import Backup</span>
                        </button>
                        <button
                          onClick={handleReseed}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          title="Reseed standard statutory documents"
                        >
                          <RefreshCw className="w-3 h-3 text-indigo-400" />
                          <span>Reseed</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search Bar for Stored Documents */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Search stored documents by Khasra No, Village, ULPIN, or Owner..."
                      value={docSearchQuery}
                      onChange={(e) => setDocSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* List of Stored Documents */}
                  {filteredIdbDocs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No statutory documents matched your search query in the local IndexedDB vault.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {filteredIdbDocs.map((doc) => (
                        <div 
                          key={doc.id}
                          onClick={() => setSelectedDoc(doc)}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors block">
                                {doc.documentTitle}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Khasra {doc.surveyKhasraNo} • {doc.village}, {doc.district}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono shrink-0">
                              {doc.documentType}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-900/90 rounded-lg text-[10px] font-mono">
                            <div>
                              <span className="text-slate-500 block text-[9px]">Area:</span>
                              <span className="text-white font-bold">{doc.totalAreaAcre} Ac</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">Owners:</span>
                              <span className="text-slate-300">{doc.owners?.length || 1} Person(s)</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">OCR Conf:</span>
                              <span className="text-emerald-400 font-bold">{Math.round((doc.ocrConfidence || 0.95) * 100)}%</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-900">
                            <span className="text-slate-400 truncate max-w-[200px]">
                              ULPIN: <strong className="text-slate-300">{doc.ulpin || 'N/A'}</strong>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDoc(doc);
                                }}
                                className="p-1 text-slate-400 hover:text-white rounded"
                                title="Inspect document details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteDoc(doc.id, e)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded"
                                title="Remove from IndexedDB"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: LOCAL DOCUMENT ANNOTATIONS & HIGHLIGHTS */}
              {activeTab === 'ANNOTATIONS' && (
                <div className="space-y-3">
                  {/* Annotation Management & Sync Strip */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Highlighter className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              Offline Local Document Highlights & Markups
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                              IndexedDB Store
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Spatial annotations saved in local IndexedDB until an online sync is performed with the Central Land Portal.
                          </p>
                        </div>
                      </div>

                      {/* Sync Button */}
                      <button
                        onClick={handleSyncAnnotations}
                        disabled={isSyncingAnnots || pendingAnnotationsCount === 0}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          pendingAnnotationsCount > 0
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAnnots ? 'animate-spin' : ''}`} />
                        <span>
                          {isSyncingAnnots ? 'Syncing...' : `Sync Annotations (${pendingAnnotationsCount} Local)`}
                        </span>
                      </button>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-900">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          value={annotationSearchQuery}
                          onChange={(e) => setAnnotationSearchQuery(e.target.value)}
                          placeholder="Search highlights by title, note, citation, or officer..."
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                        <button
                          onClick={() => setAnnotationSyncFilter('ALL')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                            annotationSyncFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          All ({idbAnnotations.length})
                        </button>
                        <button
                          onClick={() => setAnnotationSyncFilter('LOCAL_PENDING_SYNC')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                            annotationSyncFilter === 'LOCAL_PENDING_SYNC' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>Local Only</span>
                          <span className="font-mono text-[9px] bg-amber-900/50 px-1 rounded text-amber-200">
                            {pendingAnnotationsCount}
                          </span>
                        </button>
                        <button
                          onClick={() => setAnnotationSyncFilter('SYNCED')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                            annotationSyncFilter === 'SYNCED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Synced ({idbAnnotations.filter(a => a.syncStatus === 'SYNCED').length})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Annotations List */}
                  {(() => {
                    const filtered = idbAnnotations.filter((a) => {
                      if (annotationSyncFilter !== 'ALL' && a.syncStatus !== annotationSyncFilter) return false;
                      if (!annotationSearchQuery.trim()) return true;
                      const q = annotationSearchQuery.toLowerCase();
                      return (
                        a.title.toLowerCase().includes(q) ||
                        a.notes.toLowerCase().includes(q) ||
                        (a.statutoryCitation && a.statutoryCitation.toLowerCase().includes(q)) ||
                        a.authorOfficer.toLowerCase().includes(q) ||
                        a.category.toLowerCase().includes(q)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-12 bg-slate-950/60 rounded-xl border border-slate-800 p-6 space-y-2">
                          <Highlighter className="w-8 h-8 text-amber-500/40 mx-auto" />
                          <p className="text-xs text-slate-400 font-medium">
                            {idbAnnotations.length === 0 
                              ? 'No document highlights or notes recorded in IndexedDB yet.' 
                              : 'No annotations match your search or sync filter.'}
                          </p>
                          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                            Switch to the Document Verification module and enable the <strong>Annotate</strong> tool to highlight critical clauses, boundaries, and survey discrepancies on cached documents.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2">
                        {filtered.map((annot) => {
                          const parentDoc = idbDocuments.find(d => d.id === annot.documentId);
                          const colorMap: Record<string, { bg: string; dot: string; text: string }> = {
                            YELLOW: { bg: 'bg-amber-950/30 border-amber-800/40', dot: '#f59e0b', text: 'text-amber-300' },
                            RED: { bg: 'bg-rose-950/30 border-rose-800/40', dot: '#ef4444', text: 'text-rose-300' },
                            GREEN: { bg: 'bg-emerald-950/30 border-emerald-800/40', dot: '#10b981', text: 'text-emerald-300' },
                            BLUE: { bg: 'bg-sky-950/30 border-sky-800/40', dot: '#38bdf8', text: 'text-sky-300' },
                            PURPLE: { bg: 'bg-purple-950/30 border-purple-800/40', dot: '#c084fc', text: 'text-purple-300' },
                          };
                          const style = colorMap[annot.color] || colorMap.YELLOW;

                          return (
                            <div 
                              key={annot.id}
                              className={`p-3 rounded-xl border ${style.bg} transition-all space-y-2`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
                                      style={{ backgroundColor: style.dot }}
                                    />
                                    <span className={`text-xs font-bold ${style.text}`}>
                                      {annot.title}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                                      {annot.category}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">
                                    Document: <strong className="text-slate-200">{parentDoc?.documentTitle || annot.documentId}</strong>
                                    {parentDoc && ` • Survey ${parentDoc.surveyKhasraNo}`}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {annot.syncStatus === 'LOCAL_PENDING_SYNC' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-mono font-bold flex items-center gap-1">
                                      <CloudOff className="w-3 h-3 text-amber-400" />
                                      <span>Local Only</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      <span>Synced</span>
                                    </span>
                                  )}
                                  <button
                                    onClick={async () => {
                                      await deleteIdbAnnotation(annot.id);
                                      setVaultFeedback('Local annotation deleted from IndexedDB.');
                                      setTimeout(() => setVaultFeedback(null), 3000);
                                    }}
                                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                                    title="Delete annotation"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs text-slate-200 bg-slate-950/70 p-2 rounded-lg border border-slate-900 leading-relaxed">
                                {annot.notes}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                                <span>Recorded By: <strong className="text-slate-400">{annot.authorOfficer}</strong></span>
                                {annot.statutoryCitation && (
                                  <span className="text-indigo-300 font-mono bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-900/60">
                                    {annot.statutoryCitation}
                                  </span>
                                )}
                                <span>{new Date(annot.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: STATUTORY RULES */}
              {activeTab === 'RULES' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      These critical provisions are saved in browser cache and IndexedDB, remaining completely available without internet access during field inspections.
                    </span>
                  </div>

                  {cachedRules.map((r) => (
                    <div 
                      key={r.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-amber-400" />
                          <span>{r.section}: {r.title}</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                          {r.statute}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{r.mandate}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-900">
                        {r.limitationPeriodDays > 0 && (
                          <div className="flex items-center gap-1 text-rose-300">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>Limitation: <strong>{r.limitationPeriodDays} days</strong></span>
                          </div>
                        )}
                        {r.applicableMultiplier && (
                          <div className="text-indigo-300 font-mono text-[10px]">
                            {r.applicableMultiplier}
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded-lg border border-amber-900/40">
                        <strong className="text-amber-400">Statutory Consequence: </strong>
                        {r.penaltyOnLapse}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: CADASTRAL BENCHMARKS */}
              {activeTab === 'PARCELS' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      Reference village circle rates and RoW corridors cached for instant on-site comparison.
                    </span>
                  </div>

                  {cachedParcels.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono">
                          Khasra {p.khasraSurvey} • {p.village}, Tehsil {p.tehsil}
                        </span>
                        <span className="text-emerald-400 font-bold font-mono">
                          ₹{(p.circleRatePerAcreInr / 100000).toFixed(1)} Lakh/Acre
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 font-mono">
                        <div>Area: <strong className="text-slate-200">{p.recordedAreaAcre} Acres</strong></div>
                        <div>RoW Overlap: <strong className="text-slate-200">{p.rowOverlapMeters}m</strong></div>
                        <div>Classification: <strong className="text-slate-200">{p.landType}</strong></div>
                      </div>
                      <div className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800">
                        Encumbrance: <span className="text-slate-300">{p.encumbranceStatus}</span> • Soil: <span className="text-slate-300">{p.soilClassification}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SAVED FIELD DRAFTS */}
              {activeTab === 'DRAFTS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">
                      Offline measurements taken by survey officers in remote areas:
                    </span>
                    {pendingSync > 0 && isOnline && (
                      <button
                        onClick={handleSyncAllDrafts}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sync All to DILRMP ({pendingSync})</span>
                      </button>
                    )}
                  </div>

                  {drafts.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No offline field drafts recorded yet. Tap "New Field Note" to record ground survey observations while offline.
                    </div>
                  ) : (
                    drafts.map((d) => (
                      <div key={d.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Survey #{d.surveyNumber} — {d.villageName}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {d.syncedToCentral ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                                Synced ✓
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                                Pending Sync
                              </span>
                            )}
                            <button
                              onClick={async () => {
                                deleteOfflineFieldDraft(d.id);
                                await deleteIdbDraft(d.id);
                                setCacheStats(getOfflineCacheStats());
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                              title="Delete local draft"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-slate-900 rounded-lg text-[11px] font-mono">
                          <div>
                            <span className="text-slate-500 block text-[9px]">Measured:</span>
                            <span className="text-white font-bold">{d.measuredAreaAcre} Acres</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">Recorded:</span>
                            <span className="text-slate-300">{d.recordedAreaAcre} Acres</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">Variance:</span>
                            <span className={d.variancePercentage !== 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                              {d.variancePercentage > 0 ? `+${d.variancePercentage}%` : `${d.variancePercentage}%`}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-300 text-xs bg-slate-900/60 p-2 rounded border border-slate-800/80">
                          {d.fieldNotes}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                          <span>Owner: <strong className="text-slate-200">{d.ownerName}</strong></span>
                          <span>{new Date(d.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: NEW FIELD DRAFT */}
              {activeTab === 'NEW_DRAFT' && (
                <form onSubmit={handleCreateDraft} className="space-y-3">
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      Record field survey observations locally. This record will persist in IndexedDB even when offline and can be synchronized when network is re-established.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Survey / Khasra No *
                      </label>
                      <input
                        type="text"
                        required
                        value={surveyNo}
                        onChange={(e) => setSurveyNo(e.target.value)}
                        placeholder="e.g. 42/1-B"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Village / Mauza *
                      </label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Rampur Kalan"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Interested Landholder Name
                      </label>
                      <input
                        type="text"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        placeholder="e.g. Rameshwar Patil"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Ground Measured Area (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={measuredArea}
                        onChange={(e) => setMeasuredArea(e.target.value)}
                        placeholder="e.g. 4.85"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Recorded Revenue Area (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={recordedArea}
                        onChange={(e) => setRecordedArea(e.target.value)}
                        placeholder="e.g. 5.10"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Field Boundary / Wet-Ink Inspection Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Physical boundary wall matches chainage 114+200. RoW peg markings verified with revenue surveyor."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('DRAFTS')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Save to IndexedDB & Cache</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 6: AUDIT LOGS */}
              {activeTab === 'AUDIT_LOGS' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      Cryptographically sequential audit logs recorded locally inside IndexedDB for every field inspection, document save, and DILRMP reconciliation.
                    </span>
                  </div>

                  {idbAuditLogs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No audit events recorded yet. Actions taken on documents or survey drafts are automatically audited here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {idbAuditLogs.map((log) => (
                        <div key={log.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-indigo-300 text-[11px]">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{log.details}</p>
                          <div className="text-[10px] text-slate-500">
                            Officer Role: <span className="text-slate-400">{log.officerRole}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Compliant with Section 12 Survey powers under RFCTLARR 2013 & NHAI Act 1956</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
