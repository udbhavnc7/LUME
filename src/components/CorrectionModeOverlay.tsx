import React, { useState } from 'react';
import { 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  X, 
  ArrowRight, 
  History, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Save,
  Check,
  HelpCircle,
  FileEdit,
  Eye,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OcrFieldItem, OcrCorrectionLog } from '../types';
import { DatabaseLandRecord } from '../data/documentVerificationData';

interface CorrectionModeOverlayProps {
  fields: OcrFieldItem[];
  enabled: boolean;
  confidenceThreshold: number;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string | null) => void;
  onOpenEditModal: (field: OcrFieldItem) => void;
  language?: 'EN' | 'HI';
}

/**
 * Overlay rendered directly on top of the scanned or simulated document.
 * Highlights extracted OCR fields with interactive bounding boxes, confidence tags,
 * and allows users to click to edit.
 */
export const CorrectionModeOverlay: React.FC<CorrectionModeOverlayProps> = ({
  fields,
  enabled,
  confidenceThreshold,
  selectedFieldId,
  onSelectField,
  onOpenEditModal,
  language = 'EN'
}) => {
  if (!enabled) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-auto z-20 overflow-hidden"
      aria-label="OCR Field Correction Mode Overlay"
    >
      {/* Semi-transparent grid backdrop indicating active edit mode */}
      <div className="absolute inset-0 bg-indigo-950/15 pointer-events-none transition-opacity" />

      {fields.map((field) => {
        const isBelowThresh = field.confidence < confidenceThreshold;
        const isSelected = field.id === selectedFieldId;
        const isCorrected = field.isCorrected;

        // Visual styling based on field confidence and correction state
        let borderColor = 'border-amber-400/80';
        let bgFill = 'bg-amber-500/10 hover:bg-amber-500/25';
        let badgeColor = 'bg-amber-900/90 text-amber-200 border-amber-500/50';

        if (isCorrected) {
          borderColor = 'border-emerald-400';
          bgFill = 'bg-emerald-500/15 hover:bg-emerald-500/30';
          badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-500';
        } else if (field.confidence < 0.88) {
          borderColor = 'border-rose-500';
          bgFill = 'bg-rose-500/15 hover:bg-rose-500/30';
          badgeColor = 'bg-rose-950 text-rose-200 border-rose-500';
        } else if (field.confidence >= 0.95) {
          borderColor = 'border-teal-400/70';
          bgFill = 'bg-teal-500/10 hover:bg-teal-500/20';
          badgeColor = 'bg-teal-950 text-teal-300 border-teal-500/40';
        }

        return (
          <div
            key={field.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField(field.id);
              onOpenEditModal(field);
            }}
            className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-150 group ${borderColor} ${bgFill} ${
              isSelected 
                ? 'ring-4 ring-indigo-400/60 shadow-xl z-30 scale-[1.01]' 
                : isBelowThresh && !isCorrected
                ? 'border-dashed animate-pulse'
                : 'shadow-sm'
            }`}
            style={{
              top: `${field.boundingBox.top}%`,
              left: `${field.boundingBox.left}%`,
              width: `${field.boundingBox.width}%`,
              height: `${field.boundingBox.height}%`,
              minHeight: '26px'
            }}
            title={`Click to edit: ${field.label} (OCR Confidence: ${(field.confidence * 100).toFixed(0)}%)`}
          >
            {/* Corner Edit Button Pin */}
            <div className="absolute -top-3 -right-2 z-40 flex items-center gap-1 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEditModal(field);
                }}
                className={`p-1 rounded-full border text-[10px] font-bold flex items-center gap-0.5 transition-transform hover:scale-110 ${
                  isCorrected 
                    ? 'bg-emerald-600 text-white border-emerald-400' 
                    : isBelowThresh 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-300'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400'
                }`}
              >
                {isCorrected ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <Edit3 className="w-2.5 h-2.5" />
                )}
              </button>
            </div>

            {/* Field Label & Confidence Floating Badge */}
            <div className="absolute -top-3 left-1 z-30 flex items-center gap-1 max-w-[85%]">
              <span className={`px-1.5 py-0.2 rounded border text-[9px] font-mono font-bold truncate shadow-sm flex items-center gap-1 ${badgeColor}`}>
                {isCorrected ? (
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                ) : isBelowThresh ? (
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                ) : null}
                <span className="truncate">{field.label}</span>
                <span className="opacity-90 font-mono text-[8px] bg-black/40 px-1 rounded">
                  {(field.confidence * 100).toFixed(0)}%
                </span>
              </span>
            </div>

            {/* In-box indicator for corrected vs raw */}
            <div className="absolute bottom-0.5 right-1 pointer-events-none text-[8px] font-mono px-1 rounded bg-black/60 text-slate-200">
              {isCorrected ? (
                <span className="text-emerald-300 font-bold">✓ Edited</span>
              ) : (
                <span className="text-slate-300">Click to edit</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface CorrectionModeBannerProps {
  recordConfidence: number;
  confidenceThreshold: number;
  isBelowThreshold: boolean;
  correctionMode: boolean;
  onToggleCorrectionMode: () => void;
  onSetThreshold: (threshold: number) => void;
  totalFieldsCount: number;
  correctedFieldsCount: number;
  onOpenAuditHistory?: () => void;
  onResetAllCorrections?: () => void;
  language?: 'EN' | 'HI';
}

/**
 * Top-level alert and control banner that dynamically flags when a document record's
 * confidence score is below the statutory threshold and provides controls to toggle Correction Mode.
 */
export const CorrectionModeBanner: React.FC<CorrectionModeBannerProps> = ({
  recordConfidence,
  confidenceThreshold,
  isBelowThreshold,
  correctionMode,
  onToggleCorrectionMode,
  onSetThreshold,
  totalFieldsCount,
  correctedFieldsCount,
  onOpenAuditHistory,
  onResetAllCorrections,
  language = 'EN'
}) => {
  const [showThresholdPicker, setShowThresholdPicker] = useState<boolean>(false);
  const percentConfidence = Math.round(recordConfidence * 100);
  const percentThreshold = Math.round(confidenceThreshold * 100);

  return (
    <div 
      className={`rounded-2xl border transition-all duration-200 p-3.5 shadow-md ${
        isBelowThreshold
          ? 'bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-amber-950/50 border-amber-500/50'
          : 'bg-slate-900/80 border-slate-700/80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Confidence Status & Threshold Notice */}
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
            isBelowThreshold 
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse' 
              : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
          }`}>
            {isBelowThreshold ? (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{language === 'HI' ? 'ओसीआर पाठ सुधार मोड' : 'OCR Field Correction & Verification Engine'}</span>
              </h4>

              {/* Confidence Score Pill */}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isBelowThreshold 
                  ? 'bg-rose-950 text-rose-300 border-rose-600' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-600'
              }`}>
                Score: {percentConfidence}% {isBelowThreshold ? `(< ${percentThreshold}% Threshold)` : `(≥ ${percentThreshold}%)`}
              </span>

              {/* Threshold Status Tag */}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                isBelowThreshold
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isBelowThreshold
                  ? (language === 'HI' ? '⚠️ न्यूनतम विश्वास सीमा से नीचे - सुधार अपेक्षित' : '⚠️ Below Statutory Threshold — Manual Review Mandated')
                  : (language === 'HI' ? '✓ विश्वास सीमा मान्य' : '✓ Above Statutory Threshold')}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              {isBelowThreshold ? (
                language === 'HI' 
                  ? `इस दस्तावेज़ का ओसीआर विश्वास स्कोर (${percentConfidence}%) वैधानिक सीमा (${percentThreshold}%) से कम है। अपूर्ण या संदिग्ध हस्ताक्षरित अंकों को ठीक करने हेतु 'Correction Mode' सक्रिय करें।`
                  : `This document's OCR confidence (${percentConfidence}%) is below statutory threshold (${percentThreshold}%). Physical ink alterations or low-contrast numbers require officer verification and manual field correction before Section 23 award generation.`
              ) : (
                language === 'HI'
                  ? `दस्तावेज़ ओसीआर विश्वास स्कोर स्वीकार्य है। किसी भी त्रुटि के सुधार हेतु 'Correction Mode' का उपयोग किया जा सकता है।`
                  : `Document OCR confidence satisfies standard statutory thresholds. You can still engage Correction Mode to manually inspect and modify any individual extracted text field.`
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Mode Toggle & Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 justify-end">
          {/* Threshold Adjuster Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThresholdPicker(!showThresholdPicker)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Configure OCR Confidence Trigger Threshold"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Threshold: <strong className="text-white font-mono">{percentThreshold}%</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThresholdPicker && (
              <div className="absolute right-0 mt-1.5 w-56 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 flex justify-between items-center">
                  <span>Confidence Threshold</span>
                  <button onClick={() => setShowThresholdPicker(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {[
                  { value: 0.90, label: '90% (Lenient / Rural Parcha)' },
                  { value: 0.92, label: '92% (Standard RoR Inspection)' },
                  { value: 0.95, label: '95% (Statutory RFCTLARR Default)' },
                  { value: 0.98, label: '98% (High-Precision Metro / Urban)' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      onSetThreshold(item.value);
                      setShowThresholdPicker(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      Math.abs(confidenceThreshold - item.value) < 0.001
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    {Math.abs(confidenceThreshold - item.value) < 0.001 && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audit History Counter / Button */}
          {correctedFieldsCount > 0 && onOpenAuditHistory && (
            <button
              onClick={onOpenAuditHistory}
              className="px-2.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View manual corrections audit log"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>{correctedFieldsCount} Corrected</span>
            </button>
          )}

          {/* Primary Action: Toggle Correction Mode */}
          <button
            onClick={onToggleCorrectionMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              correctionMode
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black ring-2 ring-amber-400/80 shadow-amber-950/50'
                : isBelowThreshold
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-900/50 animate-bounce'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
            }`}
          >
            <Edit3 className={`w-4 h-4 ${correctionMode ? 'text-slate-950 animate-spin' : ''}`} />
            <span>
              {correctionMode 
                ? (language === 'HI' ? 'सुधार मोड सक्रिय (बंद करें)' : 'Correction Mode: Active') 
                : (language === 'HI' ? 'सुधार मोड चालू करें' : 'Enable Correction Mode')}
            </span>
            {correctionMode && (
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Footer when Correction Mode is active */}
      {correctionMode && (
        <div className="mt-2.5 pt-2 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-amber-200">
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Correction Overlay Active:</span>
            </span>
            <span className="text-slate-300">Click on any highlighted text field on the document to edit.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[10px]">
              Fields Verified: <strong className="text-emerald-400">{correctedFieldsCount}</strong> / {totalFieldsCount}
            </span>
            {correctedFieldsCount > 0 && onResetAllCorrections && (
              <button
                onClick={onResetAllCorrections}
                className="text-[10px] text-slate-400 hover:text-rose-300 underline flex items-center gap-1"
                title="Reset all manual corrections to raw OCR"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset to Raw OCR</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface CorrectionEditModalProps {
  field: OcrFieldItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCorrection: (fieldId: string, newValue: string, reason: string) => void;
  onRevertCorrection?: (fieldId: string) => void;
  databaseRecord?: DatabaseLandRecord;
  language?: 'EN' | 'HI';
}

/**
 * Interactive Modal Dialog for inspecting and editing an extracted OCR field.
 * Shows original OCR text, confidence score, matching authoritative database record value,
 * an editable text field, and reasons for correction.
 */
export const CorrectionEditModal: React.FC<CorrectionEditModalProps> = ({
  field,
  isOpen,
  onClose,
  onSaveCorrection,
  onRevertCorrection,
  databaseRecord,
  language = 'EN'
}) => {
  if (!isOpen || !field) return null;

  const [editValue, setEditValue] = useState<string>(field.currentValue || field.originalOcrValue);
  const [correctionReason, setCorrectionReason] = useState<string>(
    field.correctionReason || 'Physical 7/12 extract certified wet-ink value verified by CALA Officer'
  );

  // Common statutory justification quick presets
  const reasonPresets = [
    'Physical 7/12 certified wet-ink value verified by CALA Officer',
    'Digit overwritten / ink correction clarified on original ledger',
    'Reconciled with DILRMP digital registry database',
    'Cadastral surveyor demarcation measurement confirmed',
    'Legal heir succession mutation order verification'
  ];

  const hasChanged = editValue.trim() !== field.currentValue.trim();
  const isDifferentFromOriginal = editValue.trim() !== field.originalOcrValue.trim();

  const handleCopyFromDb = () => {
    if (field.databaseValue) {
      setEditValue(field.databaseValue);
    }
  };

  const handleSave = () => {
    if (!editValue.trim()) return;
    onSaveCorrection(field.id, editValue.trim(), correctionReason.trim());
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileEdit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{language === 'HI' ? 'ओसीआर पाठ फ़ील्ड सुधार' : 'Manual OCR Field Correction'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {field.fieldKey}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {field.label} {field.labelHindi ? `• ${field.labelHindi}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Comparison Cards: Raw OCR vs Authoritative Database */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Raw Extracted OCR Card */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Raw OCR Value:</span>
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                  field.confidence < 0.90 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700'
                }`}>
                  {(field.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-200 font-mono text-sm break-all font-semibold">
                {field.originalOcrValue}
              </div>
              <span className="text-[10px] text-slate-500 block">
                Detected at coordinate zone [{field.boundingBox.top}%, {field.boundingBox.left}%]
              </span>
            </div>

            {/* Authoritative Database Record Card */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Database Reference:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                  DILRMP
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-sm break-all font-semibold">
                {field.databaseValue || 'No direct DB mapping'}
              </div>
              {field.databaseValue && (
                <button
                  type="button"
                  onClick={handleCopyFromDb}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy database value into correction input</span>
                </button>
              )}
            </div>
          </div>

          {/* Editable Value Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>{language === 'HI' ? 'संशोधित / सत्यापित मान' : 'Corrected / Attested Value:'}</span>
              {field.isCorrected && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Previously edited on {field.correctedAt ? new Date(field.correctedAt).toLocaleDateString() : 'today'}</span>
                </span>
              )}
            </label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-indigo-500/60 focus:border-indigo-400 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
              placeholder={`Enter verified ${field.label}...`}
              autoFocus
            />
            {isDifferentFromOriginal && (
              <div className="text-[11px] text-amber-300 font-mono flex items-center gap-1.5 mt-1 bg-amber-950/40 p-1.5 rounded border border-amber-800/40">
                <span className="text-slate-400 line-through">{field.originalOcrValue}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
                <span className="font-bold text-amber-200">{editValue}</span>
              </div>
            )}
          </div>

          {/* Justification / Reason Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              {language === 'HI' ? 'वैधानिक कारण / सत्यापन आधार' : 'Statutory Reason & Verification Audit Basis:'}
            </label>
            <input
              type="text"
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-slate-500 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-600"
              placeholder="Enter statutory justification for this manual change..."
            />

            {/* Quick Reason Presets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {reasonPresets.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCorrectionReason(r)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    correctionReason === r
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-600'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
          {field.isCorrected && onRevertCorrection ? (
            <button
              type="button"
              onClick={() => {
                onRevertCorrection(field.id);
                onClose();
              }}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-800/50 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert to Raw OCR</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 font-mono">
              Attested by CALA Verification Authority
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!editValue.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply Correction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CorrectionAuditDrawerProps {
  logs?: OcrCorrectionLog[];
  corrections?: OcrCorrectionLog[];
  isOpen: boolean;
  onClose: () => void;
  onRevertItem?: (log: OcrCorrectionLog) => void;
  onRevertCorrection?: (fieldId: string) => void;
  documentTitle?: string;
  language?: 'EN' | 'HI';
}

/**
 * Slide-out drawer or modal showing the statutory audit trail of all manual corrections
 * made by the verification officer on this record.
 */
export const CorrectionAuditDrawer: React.FC<CorrectionAuditDrawerProps> = ({
  logs,
  corrections,
  isOpen,
  onClose,
  onRevertItem,
  onRevertCorrection,
  documentTitle,
  language = 'EN'
}) => {
  if (!isOpen) return null;

  const displayLogs = logs || corrections || [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'HI' ? 'वैधानिक सुधार लेखापरीक्षा लॉग' : 'Statutory Manual Correction Audit Trail'}
              </h3>
              <p className="text-xs text-slate-400">
                Logged under RFCTLARR 2013 Land Record Attestation Procedures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {displayLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No manual field corrections have been logged for this document yet.
            </div>
          ) : (
            displayLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{log.fieldLabel}</span>
                    <span className="font-mono text-[10px] text-slate-500">({log.fieldKey})</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-slate-900 rounded-lg border border-slate-800/80 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Original OCR:</span>
                    <span className="text-rose-300 line-through">{log.previousValue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Officer Verified:</span>
                    <span className="text-emerald-300 font-bold">{log.newValue}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-500 font-semibold">Justification: </span>
                  {log.reason}
                </div>

                <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Officer: <strong className="text-slate-200">{log.officerName}</strong> ({log.officerRole})</span>
                  {(onRevertItem || onRevertCorrection) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onRevertCorrection) onRevertCorrection(log.fieldId);
                        else if (onRevertItem) onRevertItem(log);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Revert</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
