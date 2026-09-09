import React, { useState } from 'react';
import { 
  SmartFlagAnnotation, 
  SmartFlagCategory 
} from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  FileText, 
  Compass, 
  Eye, 
  ArrowRight, 
  X, 
  Check, 
  ShieldAlert, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SmartFlaggingOverlayProps {
  flags: SmartFlagAnnotation[];
  enabled: boolean;
  activeFilter: 'ALL' | SmartFlagCategory;
  selectedFlagId: string | null;
  onSelectFlag: (flagId: string | null) => void;
  onHighlightField: (field: string | null) => void;
  onLogDecision: (flag: SmartFlagAnnotation) => void;
  onResolveFlag: (flagId: string) => void;
  isAiScanning: boolean;
  language: 'EN' | 'HI';
}

export const SmartFlaggingOverlay: React.FC<SmartFlaggingOverlayProps> = ({
  flags,
  enabled,
  activeFilter,
  selectedFlagId,
  onSelectFlag,
  onHighlightField,
  onLogDecision,
  onResolveFlag,
  isAiScanning,
  language
}) => {
  const [hoveredFlagId, setHoveredFlagId] = useState<string | null>(null);

  if (!enabled && !isAiScanning) return null;

  // Filter flags based on selected category filter
  const visibleFlags = flags.filter(flag => {
    if (activeFilter === 'ALL') return true;
    return flag.category === activeFilter;
  });

  const getCategoryMeta = (cat: SmartFlagCategory) => {
    switch (cat) {
      case 'SUSPICIOUS_INK':
        return {
          label: language === 'HI' ? 'संदिग्ध स्याही / हेरफेर' : 'Suspicious Ink Mark',
          shortCode: 'INK',
          borderColor: 'border-rose-500',
          bgActive: 'bg-rose-500/15',
          glowClass: 'shadow-[0_0_16px_rgba(244,63,94,0.45)]',
          badgeClass: 'bg-rose-950 text-rose-300 border-rose-600',
          ringColor: 'ring-rose-500',
          textColor: 'text-rose-400',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        };
      case 'MISSING_SIGNATURE':
        return {
          label: language === 'HI' ? 'हस्ताक्षर अनुपस्थित' : 'Missing Signature',
          shortCode: 'SIG',
          borderColor: 'border-violet-500',
          bgActive: 'bg-violet-500/15',
          glowClass: 'shadow-[0_0_16px_rgba(139,92,246,0.45)]',
          badgeClass: 'bg-violet-950 text-violet-300 border-violet-600',
          ringColor: 'ring-violet-500',
          textColor: 'text-violet-400',
          icon: <FileText className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        };
      case 'DIMENSION_DEVIATION':
        return {
          label: language === 'HI' ? 'आयाम विचलन' : 'Dimension Deviation',
          shortCode: 'DIM',
          borderColor: 'border-amber-500',
          bgActive: 'bg-amber-500/15',
          glowClass: 'shadow-[0_0_16px_rgba(245,158,11,0.45)]',
          badgeClass: 'bg-amber-950 text-amber-300 border-amber-600',
          ringColor: 'ring-amber-500',
          textColor: 'text-amber-400',
          icon: <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        };
      case 'OWNERSHIP_MISMATCH':
        return {
          label: language === 'HI' ? 'स्वामित्व विसंगति' : 'Title / Owner Omission',
          shortCode: 'OWN',
          borderColor: 'border-cyan-500',
          bgActive: 'bg-cyan-500/15',
          glowClass: 'shadow-[0_0_16px_rgba(6,182,212,0.45)]',
          badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-600',
          ringColor: 'ring-cyan-500',
          textColor: 'text-cyan-400',
          icon: <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        };
      case 'STAMP_ANOMALY':
      default:
        return {
          label: language === 'HI' ? 'मुद्रा विसंगति' : 'Stamp Anomaly',
          shortCode: 'STAMP',
          borderColor: 'border-emerald-500',
          bgActive: 'bg-emerald-500/15',
          glowClass: 'shadow-[0_0_16px_rgba(16,185,129,0.45)]',
          badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-600',
          ringColor: 'ring-emerald-500',
          textColor: 'text-emerald-400',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        };
    }
  };

  const activeFlag = flags.find(f => f.id === selectedFlagId);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" id="smart-flagging-overlay-container">
      {/* Laser Scanning Beam Animation during AI analysis */}
      {isAiScanning && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_18px_#22d3ee]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-500/20 to-transparent animate-pulse pointer-events-none" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/90 text-cyan-300 border border-cyan-500/60 rounded-full px-3.5 py-1 text-[11px] font-mono font-bold flex items-center gap-2 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>AI Vision Neural Sweep: Auditing Ink, Dimensions & Signatures...</span>
          </div>
        </div>
      )}

      {/* Render Each Flag Annotation Box */}
      {enabled && visibleFlags.map((flag, index) => {
        const meta = getCategoryMeta(flag.category);
        const isSelected = flag.id === selectedFlagId;
        const isHovered = flag.id === hoveredFlagId;
        const isResolved = flag.status === 'RESOLVED';

        return (
          <div
            key={flag.id}
            id={`smart-flag-${flag.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectFlag(isSelected ? null : flag.id);
              if (flag.matchedDbField) {
                onHighlightField(flag.matchedDbField);
              }
            }}
            onMouseEnter={() => setHoveredFlagId(flag.id)}
            onMouseLeave={() => setHoveredFlagId(null)}
            className={`absolute pointer-events-auto cursor-pointer rounded transition-all duration-200 group ${
              isResolved ? 'opacity-40 border-dashed border-slate-500' : 'opacity-100'
            } ${
              isSelected 
                ? `border-2 ${meta.borderColor} ${meta.bgActive} ring-4 ${meta.ringColor}/40 ${meta.glowClass} z-20`
                : isHovered
                ? `border-2 ${meta.borderColor} ${meta.bgActive} z-15`
                : `border border-dashed ${meta.borderColor} bg-slate-900/10 hover:bg-slate-900/20 z-10`
            }`}
            style={{
              top: `${flag.boundingBox.top}%`,
              left: `${flag.boundingBox.left}%`,
              width: `${flag.boundingBox.width}%`,
              height: `${flag.boundingBox.height}%`
            }}
          >
            {/* Visual Micro-Pattern Indicator for Suspicious Ink */}
            {flag.category === 'SUSPICIOUS_INK' && !isResolved && (
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none rounded" />
            )}

            {/* Corner Marker Pill */}
            <div 
              className={`absolute -top-3 -left-2 px-1.5 py-0.5 rounded shadow-lg border text-[10px] font-mono font-bold flex items-center gap-1 transition-transform ${
                meta.badgeClass
              } ${isSelected || isHovered ? 'scale-110' : 'scale-95'}`}
            >
              {meta.icon}
              <span>{meta.shortCode} #{index + 1}</span>
              <span className="opacity-80 text-[9px]">({Math.round(flag.confidenceScore * 100)}%)</span>
            </div>

            {/* Dimension Deviation Offset Arrow Tag */}
            {flag.category === 'DIMENSION_DEVIATION' && flag.varianceSummary && (
              <div className="absolute -bottom-3 right-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 text-[9px] font-mono font-bold shadow-md">
                ⚠️ {flag.varianceSummary}
              </div>
            )}

            {/* Missing Signature Crossout Tag */}
            {flag.category === 'MISSING_SIGNATURE' && (
              <div className="absolute -bottom-3 right-1 px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-600 text-[9px] font-mono font-bold shadow-md">
                ✍️ {language === 'HI' ? 'हस्ताक्षर अनुपस्थित' : 'Unsigned'}
              </div>
            )}
          </div>
        );
      })}

      {/* Interactive Detail Popover / Inspection Modal */}
      {activeFlag && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-950/95 border border-slate-700 rounded-2xl shadow-2xl p-4 z-40 backdrop-blur-md space-y-3 text-xs animate-in fade-in zoom-in-95 duration-150"
          style={{ maxHeight: 'calc(100% - 2rem)', overflowY: 'auto' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${getCategoryMeta(activeFlag.category).badgeClass}`}>
                {getCategoryMeta(activeFlag.category).icon}
                <span>{getCategoryMeta(activeFlag.category).label}</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                AI Confidence: <strong className="text-white">{(activeFlag.confidenceScore * 100).toFixed(1)}%</strong>
              </span>
            </div>
            <button 
              onClick={() => onSelectFlag(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close annotation details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm leading-snug">
              {language === 'HI' && activeFlag.titleHindi ? activeFlag.titleHindi : activeFlag.title}
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {activeFlag.description}
            </p>
          </div>

          {/* Scanned vs Database Values Comparison (if matched) */}
          {(activeFlag.scannedValue || activeFlag.databaseValue) && (
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Cross-Reference Discrepancy
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-rose-900/50">
                  <span className="text-[10px] text-rose-400 font-medium block">Scanned Document:</span>
                  <span className="font-bold text-white">{activeFlag.scannedValue || 'N/A'}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-emerald-900/50">
                  <span className="text-[10px] text-emerald-400 font-medium block">Database Registry:</span>
                  <span className="font-bold text-white">{activeFlag.databaseValue || 'N/A'}</span>
                </div>
              </div>
              {activeFlag.varianceSummary && (
                <div className="text-[10px] text-amber-300 font-mono pt-0.5 flex items-center gap-1">
                  <span>Delta:</span>
                  <strong className="text-amber-200">{activeFlag.varianceSummary}</strong>
                </div>
              )}
            </div>
          )}

          {/* AI Vision Model Diagnostic Reasoning */}
          <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800 text-[11px] space-y-1">
            <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Vision AI Spectral & Geometric Diagnostic:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {activeFlag.aiModelAnalysis}
            </p>
            {activeFlag.statutoryRule && (
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                Statutory Ground: <span className="text-slate-200">{activeFlag.statutoryRule}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeFlag.matchedDbField && (
              <button
                onClick={() => onHighlightField(activeFlag.matchedDbField || null)}
                className="flex-1 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Focus in Database</span>
              </button>
            )}

            <button
              onClick={() => onLogDecision(activeFlag)}
              className="flex-1 py-1.5 px-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 border border-rose-500/40 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Requisition</span>
            </button>

            <button
              onClick={() => onResolveFlag(activeFlag.id)}
              className={`py-1.5 px-2.5 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1 border transition-colors ${
                activeFlag.status === 'RESOLVED'
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-600/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeFlag.status === 'RESOLVED' ? 'Reopen Flag' : 'Mark Reviewed'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
