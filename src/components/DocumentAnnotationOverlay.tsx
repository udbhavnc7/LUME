import React, { useState, useRef, useCallback } from 'react';
import { 
  Highlighter, 
  MessageSquare, 
  CloudOff, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  X, 
  AlertCircle, 
  ShieldAlert, 
  Tag, 
  User, 
  Calendar, 
  BookOpen, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { 
  LocalDocumentAnnotation, 
  AnnotationColor, 
  AnnotationCategory, 
  ScannedDocumentRecord 
} from '../types';

interface DocumentAnnotationOverlayProps {
  document: ScannedDocumentRecord;
  annotations: LocalDocumentAnnotation[];
  isAnnotating: boolean;
  onToggleAnnotating: (active: boolean) => void;
  onSaveAnnotation: (annotation: LocalDocumentAnnotation) => Promise<void>;
  onDeleteAnnotation: (id: string) => Promise<void>;
  onSyncAllAnnotations: () => Promise<{ syncedCount: number; syncedIds: string[] }>;
  officerRole?: string;
  officerName?: string;
}

const COLOR_MAP: Record<AnnotationColor, {
  bg: string;
  border: string;
  text: string;
  badge: string;
  hex: string;
}> = {
  amber: {
    bg: 'bg-amber-400/20 hover:bg-amber-400/30',
    border: 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
    text: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    hex: '#fbbf24'
  },
  rose: {
    bg: 'bg-rose-500/20 hover:bg-rose-500/30',
    border: 'border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    text: 'text-rose-300',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    hex: '#f43f5e'
  },
  emerald: {
    bg: 'bg-emerald-500/20 hover:bg-emerald-500/30',
    border: 'border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    hex: '#10b981'
  },
  cyan: {
    bg: 'bg-cyan-500/20 hover:bg-cyan-500/30',
    border: 'border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    hex: '#06b6d4'
  },
  violet: {
    bg: 'bg-purple-500/20 hover:bg-purple-500/30',
    border: 'border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    hex: '#a855f7'
  },
  blue: {
    bg: 'bg-blue-500/20 hover:bg-blue-500/30',
    border: 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    hex: '#3b82f6'
  }
};

const CATEGORY_LABELS: Record<AnnotationCategory, { label: string; iconDesc: string }> = {
  BOUNDARY_VARIANCE: { label: 'Boundary Variance', iconDesc: 'Discrepancy between paper record and field chainage' },
  CO_PARCENER_DISPUTE: { label: 'Co-Parcener Claim', iconDesc: 'Omitted legal heir or undivided share dispute' },
  CIRCLE_RATE_MISMATCH: { label: 'Circle Rate Mismatch', iconDesc: 'Valuation discrepancy against ASR gazette' },
  MISSING_SEAL_SIGNATURE: { label: 'Seal / Attestation Defect', iconDesc: 'Missing Talathi/Tahsildar official stamp' },
  CORRIDOR_ENCROACHMENT: { label: 'RoW Encroachment', iconDesc: 'Structure or farm bund within planned corridor' },
  STATUTORY_DEFECT: { label: 'Statutory Defect', iconDesc: 'Violation under RFCTLARR 2013 or MLR Code' },
  FIELD_NOTE: { label: 'Field Surveyor Note', iconDesc: 'General observation during ground verification' }
};

export const DocumentAnnotationOverlay: React.FC<DocumentAnnotationOverlayProps> = ({
  document,
  annotations,
  isAnnotating,
  onToggleAnnotating,
  onSaveAnnotation,
  onDeleteAnnotation,
  onSyncAllAnnotations,
  officerRole = 'CALA Officer',
  officerName = 'Field Officer'
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<LocalDocumentAnnotation | null>(null);
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);
  
  // Drawing state
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // New annotation creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftCategory, setDraftCategory] = useState<AnnotationCategory>('FIELD_NOTE');
  const [draftColor, setDraftColor] = useState<AnnotationColor>('amber');
  const [draftCitation, setDraftCitation] = useState('RFCTLARR 2013 Sec 23');
  const [isSaving, setIsSaving] = useState(false);

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const pendingCount = annotations.filter(a => a.syncStatus === 'LOCAL_PENDING_SYNC').length;

  // Convert mouse event to percentage relative to overlay
  const getRelativeCoords = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotating) return;
    // Don't start drawing if clicking an existing box or button
    if ((e.target as HTMLElement).closest('.annotation-interactive-box')) return;

    e.preventDefault();
    const coords = getRelativeCoords(e);
    setIsDrawing(true);
    setDrawStart(coords);
    setCurrentBox({ top: coords.y, left: coords.x, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return;
    const coords = getRelativeCoords(e);
    const left = Math.min(drawStart.x, coords.x);
    const top = Math.min(drawStart.y, coords.y);
    const width = Math.abs(coords.x - drawStart.x);
    const height = Math.abs(coords.y - drawStart.y);

    setCurrentBox({ top, left, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox) return;
    setIsDrawing(false);
    setDrawStart(null);

    // If the box is too small (e.g. an accidental click), open with default reasonable size
    let finalBox = currentBox;
    if (currentBox.width < 5 || currentBox.height < 3) {
      finalBox = {
        top: Math.max(0, currentBox.top - 5),
        left: Math.max(0, currentBox.left - 20),
        width: 40,
        height: 12
      };
    }

    setCurrentBox(finalBox);
    setDraftTitle('');
    setDraftNotes('');
    setIsModalOpen(true);
  };

  const handleSaveDraft = async () => {
    if (!draftTitle.trim() || !currentBox) return;

    try {
      setIsSaving(true);
      const newAnnotation: LocalDocumentAnnotation = {
        id: `annot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        documentId: document.id,
        documentTitle: document.documentTitle,
        surveyKhasraNo: document.surveyKhasraNo,
        color: draftColor,
        category: draftCategory,
        title: draftTitle.trim(),
        notes: draftNotes.trim(),
        boundingBox: currentBox,
        authorOfficer: officerName,
        authorRole: officerRole,
        statutoryCitation: draftCitation.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: 'LOCAL_PENDING_SYNC' // strictly saved as local-only metadata until online sync
      };

      await onSaveAnnotation(newAnnotation);
      setIsModalOpen(false);
      setCurrentBox(null);
      setSelectedAnnotation(newAnnotation);
    } catch (err) {
      console.error('Failed to save annotation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerSync = async () => {
    try {
      setIsSyncing(true);
      const res = await onSyncAllAnnotations();
      setSyncFeedback(`Successfully synchronized ${res.syncedCount} annotations to central land portal!`);
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to sync annotations:', err);
      setSyncFeedback('Online sync failed. Records remain safely stored locally.');
      setTimeout(() => setSyncFeedback(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {/* Interactive Overlay Layer */}
      <div 
        ref={overlayRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`absolute inset-0 z-30 transition-all ${
          isAnnotating ? 'cursor-crosshair select-none' : 'pointer-events-none'
        }`}
      >
        {/* Render Existing Highlights */}
        {annotations.map((annot) => {
          const styleConfig = COLOR_MAP[annot.color] || COLOR_MAP.amber;
          const isSelected = selectedAnnotation?.id === annot.id;
          const isHovered = hoveredAnnotationId === annot.id;

          return (
            <div
              key={annot.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnotation(annot);
              }}
              onMouseEnter={() => setHoveredAnnotationId(annot.id)}
              onMouseLeave={() => setHoveredAnnotationId(null)}
              style={{
                top: `${annot.boundingBox.top}%`,
                left: `${annot.boundingBox.left}%`,
                width: `${annot.boundingBox.width}%`,
                height: `${annot.boundingBox.height}%`
              }}
              className={`annotation-interactive-box absolute border-2 rounded transition-all duration-200 pointer-events-auto cursor-pointer flex flex-col justify-between p-1 group ${
                styleConfig.bg
              } ${styleConfig.border} ${
                isSelected ? 'ring-2 ring-white scale-[1.01] z-40' : 'z-20'
              }`}
            >
              {/* Highlight Tag & Category Chip */}
              <div className="flex items-center justify-between gap-1 overflow-hidden pointer-events-none">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase border backdrop-blur-md ${styleConfig.badge}`}>
                  <Highlighter className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[120px]">{CATEGORY_LABELS[annot.category]?.label || annot.category}</span>
                </span>

                {annot.syncStatus === 'LOCAL_PENDING_SYNC' ? (
                  <span 
                    title="Stored locally in device IndexedDB vault. Awaiting online sync."
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/40 backdrop-blur-md"
                  >
                    <CloudOff className="w-2.5 h-2.5 text-amber-400" />
                    <span>Local Only</span>
                  </span>
                ) : (
                  <span 
                    title="Synchronized with Central DILRMP Portal"
                    className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 backdrop-blur-md"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  </span>
                )}
              </div>

              {/* Title preview in box */}
              <div className="text-[11px] font-semibold text-white drop-shadow truncate pointer-events-none mt-auto">
                {annot.title}
              </div>

              {/* Hover Tooltip Card */}
              {isHovered && !isSelected && (
                <div 
                  style={{
                    top: annot.boundingBox.top > 60 ? 'auto' : '100%',
                    bottom: annot.boundingBox.top > 60 ? '100%' : 'auto',
                  }}
                  className="absolute left-0 z-50 w-72 p-2.5 rounded-lg bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-left text-xs pointer-events-none space-y-1.5 mt-1"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${styleConfig.text} truncate`}>{annot.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {annot.syncStatus === 'LOCAL_PENDING_SYNC' ? '⚡ Local' : '✓ Synced'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                    {annot.notes}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                    <span>{annot.authorOfficer} ({annot.authorRole})</span>
                    {annot.statutoryCitation && (
                      <span className="text-indigo-300 font-mono">{annot.statutoryCitation}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Live Drawing Preview Box */}
        {isDrawing && currentBox && (
          <div
            style={{
              top: `${currentBox.top}%`,
              left: `${currentBox.left}%`,
              width: `${currentBox.width}%`,
              height: `${currentBox.height}%`
            }}
            className="absolute border-2 border-dashed border-amber-400 bg-amber-400/20 rounded pointer-events-none z-40 flex items-center justify-center animate-pulse"
          >
            <span className="px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              Release to Annotate
            </span>
          </div>
        )}
      </div>

      {/* Persistent Quick Action Bar at Top of Document Canvas */}
      <div className="absolute top-3 right-3 z-40 flex items-center gap-2">
        {pendingCount > 0 && (
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-900/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            title="Upload local-only annotations and metadata to central DILRMP server"
          >
            <CloudOff className={`w-3.5 h-3.5 text-amber-100 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync {pendingCount} Local Notes</span>
          </button>
        )}

        <button
          onClick={() => onToggleAnnotating(!isAnnotating)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
            isAnnotating
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
              : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 backdrop-blur-md'
          }`}
          title={isAnnotating ? 'Click or drag anywhere on the document to create a highlight' : 'Turn on highlighter mode'}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>{isAnnotating ? 'Highlighting Active' : 'Annotate & Highlight'}</span>
          {annotations.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-950/40 text-[10px] font-mono">
              {annotations.length}
            </span>
          )}
        </button>
      </div>

      {/* Sync Status Banner notification */}
      {syncFeedback && (
        <div className="absolute top-12 right-3 z-50 max-w-sm p-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl text-xs text-emerald-300 flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{syncFeedback}</span>
        </div>
      )}

      {/* Selected Annotation Detail Inspector Card */}
      {selectedAnnotation && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-40 p-4 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-white text-xs space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full shrink-0`} style={{ backgroundColor: COLOR_MAP[selectedAnnotation.color]?.hex || '#fbbf24' }} />
              <div>
                <span className="text-sm font-bold text-white block">
                  {selectedAnnotation.title}
                </span>
                <span className="text-[10px] text-slate-400">
                  {CATEGORY_LABELS[selectedAnnotation.category]?.label}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedAnnotation(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-200 text-xs leading-relaxed max-h-36 overflow-y-auto">
            {selectedAnnotation.notes || 'No detailed remarks added.'}
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-500" />
              <span className="truncate">{selectedAnnotation.authorOfficer}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{new Date(selectedAnnotation.createdAt).toLocaleDateString()}</span>
            </div>
            {selectedAnnotation.statutoryCitation && (
              <div className="col-span-2 flex items-center gap-1.5 text-indigo-300 font-mono text-[10px]">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                <span className="truncate">{selectedAnnotation.statutoryCitation}</span>
              </div>
            )}
          </div>

          {/* Local vs Synced Status Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
            {selectedAnnotation.syncStatus === 'LOCAL_PENDING_SYNC' ? (
              <div className="flex items-center gap-1 text-amber-400">
                <CloudOff className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">Local-Only (Pending Sync)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">Synced to Central DILRMP</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await onDeleteAnnotation(selectedAnnotation.id);
                  setSelectedAnnotation(null);
                }}
                className="px-2 py-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-1 cursor-pointer transition-colors"
                title="Delete local annotation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Annotation Modal */}
      {isModalOpen && currentBox && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Highlighter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create Local Document Annotation</h3>
                  <p className="text-[11px] text-slate-400">
                    Saved as local-only metadata in IndexedDB until online sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentBox(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Annotation Category
                </label>
                <select
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as AnnotationCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([cat, info]) => (
                    <option key={cat} value={cat}>
                      {info.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {CATEGORY_LABELS[draftCategory]?.iconDesc}
                </span>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Highlight Color
                </label>
                <div className="flex items-center gap-2">
                  {(Object.keys(COLOR_MAP) as AnnotationColor[]).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setDraftColor(col)}
                      style={{ backgroundColor: COLOR_MAP[col].hex }}
                      className={`w-7 h-7 rounded-full cursor-pointer transition-transform flex items-center justify-center ${
                        draftColor === col ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {draftColor === col && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Highlight Summary Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unregistered 50% Co-Parcener Possession"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500"
                />
              </div>

              {/* Detailed Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field Remarks & Ground Verification Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe specific spot observations, boundary measurements, or stakeholder testimonies..."
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none placeholder-slate-500 resize-none"
                />
              </div>

              {/* Statutory Citation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Statutory Rule Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RFCTLARR 2013 Sec 23 or MLR Code Sec 136"
                  value={draftCitation}
                  onChange={(e) => setDraftCitation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono placeholder-slate-500"
                />
              </div>

              {/* Local Storage Informational Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-200/90 leading-relaxed">
                  <span className="font-bold text-amber-300">Local-Only Metadata: </span>
                  This highlight is stored in your device's offline IndexedDB storage. It will not be visible to other portal users until you click <strong>Sync Local Notes</strong> while connected.
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentBox(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={!draftTitle.trim() || isSaving}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 transition-all"
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Local...' : 'Save as Local Metadata'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
