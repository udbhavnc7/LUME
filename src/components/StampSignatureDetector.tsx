import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PenTool, 
  RefreshCw, 
  Stamp, 
  FileSignature, 
  ChevronRight, 
  Download, 
  AlertCircle
} from 'lucide-react';
import { StampSignatureAudit, StampSignatureItem } from '../types';

/* -------------------------------------------------------------------------- */
/* 1. TOP-LEVEL HIGH-VISIBILITY CRITICAL STATUTORY ALERT BANNER              */
/* -------------------------------------------------------------------------- */
export interface StampSignatureAlertBannerProps {
  audit: StampSignatureAudit;
  language: 'EN' | 'HI';
  onSelectItem: (id: string | null) => void;
  onLogRequisition: (item: StampSignatureItem) => void;
  onMarkManualReview: () => void;
  onOpenAuditModal: () => void;
}

export const StampSignatureAlertBanner: React.FC<StampSignatureAlertBannerProps> = ({
  audit,
  language,
  onSelectItem,
  onLogRequisition,
  onMarkManualReview,
  onOpenAuditModal
}) => {
  const missingItems = audit.items.filter(item => item.status === 'MISSING' && item.required);
  const defectiveItems = audit.items.filter(item => item.status === 'SMUDGED_DEFECTIVE');
  const hasCriticalMissing = missingItems.length > 0;

  if (!hasCriticalMissing && defectiveItems.length === 0) return null;

  return (
    <div 
      id="stamp-signature-critical-alert"
      className="bg-gradient-to-r from-rose-950 via-red-950 to-slate-900 border-2 border-rose-600/90 rounded-2xl p-4 mb-4 shadow-xl shadow-rose-950/40 relative overflow-hidden"
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-600/20 text-rose-400 border border-rose-500/40 rounded-xl animate-pulse shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-rose-600 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded">
                {language === 'HI' ? 'गंभीर अनुपालन विफलता' : 'CRITICAL STATUTORY DEFECT'}
              </span>
              <span className="text-xs font-bold text-rose-100">
                {language === 'HI' 
                  ? 'अनिवार्य सरकारी मुहर अथवा अधिकृत हस्ताक्षर अनुपस्थित' 
                  : 'Missing Mandatory Government Seal or Authorized Signatory Box'}
              </span>
              <span className="text-[11px] font-mono text-rose-300 bg-rose-950/90 px-2 py-0.5 rounded border border-rose-700/80">
                {missingItems.length} {language === 'HI' ? 'अधूरी अनिवार्यता' : 'Defect(s)'}
              </span>
            </div>
            
            <p className="text-xs text-rose-100/95 mt-1 leading-relaxed max-w-3xl">
              <strong>{language === 'HI' ? 'वैधानिक जोखिम:' : 'Statutory Risk:'}</strong>{' '}
              {audit.alertSummary || (
                language === 'HI'
                  ? 'इस दस्तावेज पर अनिवार्य शासकीय मुहर या तहसीलदार/प्राधिकृत अधिकारी के हस्ताक्षर नहीं हैं। यह RFCTLARR अधिनियम २०१३ की धारा २३ के तहत पंचाट पारित करने हेतु कानूनन अमान्य है।'
                  : 'Scanned record lacks mandatory government seal / authorized officer signatory block. Inadmissible for Section 23 Award under RFCTLARR 2013 and State Land Revenue Code.'
              )}
            </p>

            {/* List missing elements explicitly */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {missingItems.map(item => (
                <span 
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-600/80 cursor-pointer transition-colors"
                  title="Click to view expected zone on document"
                >
                  <XCircle className="w-3 h-3 text-rose-400" />
                  <span>{item.label}</span>
                  <span className="text-[9px] text-rose-300 font-bold underline ml-0.5">Inspect</span>
                </span>
              ))}
              {defectiveItems.map(item => (
                <span 
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/60 cursor-pointer transition-colors"
                  title="Smudged / Faint Seal"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>{item.label} (Smudged)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          {missingItems.length > 0 && (
            <button
              onClick={() => onLogRequisition(missingItems[0])}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 transition-all"
              title="Dispatch official notice to Tehsildar / SDO to provide attested copy"
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'अधिकारी को मांग पत्र भेजें' : 'Requisition Signatory'}</span>
            </button>
          )}

          <button
            onClick={onMarkManualReview}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'HI' ? 'समीक्षा हेतु रोकें' : 'Hold for Review'}</span>
          </button>

          <button
            onClick={onOpenAuditModal}
            className="px-3 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold border border-rose-800/80 flex items-center gap-1 transition-all"
          >
            <span>{language === 'HI' ? 'ऑडिट शीट' : 'Audit Sheet'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. OVERLAY BOUNDING BOXES FOR CANVAS                                      */
/* -------------------------------------------------------------------------- */
export interface StampSignatureOverlayProps {
  audit: StampSignatureAudit;
  enabled: boolean;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onLogRequisition: (item: StampSignatureItem) => void;
  isScanning: boolean;
  language: 'EN' | 'HI';
}

export const StampSignatureOverlay: React.FC<StampSignatureOverlayProps> = ({
  audit,
  enabled,
  selectedItemId,
  onSelectItem,
  onLogRequisition,
  isScanning
}) => {
  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Laser Sweep animation when scanning */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          <div 
            className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce"
            style={{ animationDuration: '1.2s' }}
          />
          <div className="absolute inset-0 bg-cyan-500/5 flex items-center justify-center">
            <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Scanning Government Seals & Authorizing Signatory Vectors...</span>
            </div>
          </div>
        </div>
      )}

      {audit.items.map((item) => {
        const isSelected = item.id === selectedItemId;
        const isMissing = item.status === 'MISSING';
        const isDetected = item.status === 'DETECTED';
        const isSmudged = item.status === 'SMUDGED_DEFECTIVE';

        const zone = isDetected && item.detectedLocation ? item.detectedLocation : item.expectedZone;

        let borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
        if (isMissing) {
          borderStyle = 'border-rose-500 bg-rose-500/20 text-rose-200 border-dashed animate-pulse ring-2 ring-rose-500/50';
        } else if (isSmudged) {
          borderStyle = 'border-amber-500 bg-amber-500/15 text-amber-200 border-dashed';
        }

        return (
          <div
            key={item.id}
            id={`stamp-sig-box-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(isSelected ? null : item.id);
            }}
            className={`absolute pointer-events-auto rounded-lg border-2 transition-all cursor-pointer group ${borderStyle} ${
              isSelected ? 'ring-4 ring-cyan-400 scale-[1.02] shadow-2xl z-30' : 'hover:scale-[1.01]'
            }`}
            style={{
              top: `${zone.top}%`,
              left: `${zone.left}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
          >
            {/* Badge Tag on corner */}
            <div className={`absolute -top-3 left-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow whitespace-nowrap z-10 ${
              isMissing 
                ? 'bg-rose-600 text-white animate-bounce' 
                : isSmudged 
                ? 'bg-amber-600 text-slate-950 font-bold' 
                : 'bg-emerald-600 text-white'
            }`}>
              {isMissing ? (
                <>
                  <XCircle className="w-2.5 h-2.5" />
                  <span>MISSING {item.type === 'GOVERNMENT_SEAL' ? 'SEAL' : 'SIGNATORY'}</span>
                </>
              ) : isSmudged ? (
                <>
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>SMUDGED SEAL</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>VERIFIED {item.type === 'GOVERNMENT_SEAL' ? 'SEAL' : 'SIGNATURE'}</span>
                </>
              )}
            </div>

            {/* Internal Label & Confidence */}
            <div className="w-full h-full flex flex-col justify-end p-1.5 overflow-hidden">
              <div className="text-[10px] font-bold truncate drop-shadow text-white">
                {item.label}
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono opacity-90">
                <span className="truncate max-w-[120px]">{item.signatoryDesignation?.split(',')[0]}</span>
                <span>{Math.round(item.confidence * 100)}% Match</span>
              </div>
            </div>

            {/* Floating Interactive Detail Tooltip/Popover when Selected */}
            {isSelected && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-80 bg-slate-900/95 border-2 border-cyan-500 rounded-xl p-3 shadow-2xl backdrop-blur-md text-left z-40 text-slate-200 cursor-default"
              >
                <div className="flex items-start justify-between gap-1 mb-1.5 pb-1.5 border-b border-slate-700">
                  <div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      isMissing ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}>
                      {item.type.replace(/_/g, ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1">{item.label}</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Statutory Designation:</span>
                    <strong className="text-white">{item.signatoryDesignation || 'Designated Revenue Authority'}</strong>
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Detector Finding:</span>
                    <p className={`mt-0.5 text-xs font-medium leading-relaxed ${isMissing ? 'text-rose-300' : 'text-slate-300'}`}>
                      {item.details}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    <span>Legal Citation: </span>
                    <strong className="text-cyan-300 font-mono">{item.statutoryRuleCitation}</strong>
                  </div>

                  <div className="p-1.5 rounded bg-slate-800/80 text-[10px] text-amber-200">
                    <span>Prescribed Action: </span>
                    <strong>{item.remedyAction}</strong>
                  </div>
                </div>

                {/* Popover Actions */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  {isMissing ? (
                    <button
                      onClick={() => onLogRequisition(item)}
                      className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow"
                    >
                      <FileSignature className="w-3 h-3" />
                      <span>Dispatch Statutory Requisition</span>
                    </button>
                  ) : (
                    <div className="w-full py-1 bg-emerald-950 text-emerald-300 border border-emerald-700/80 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attestation Validated</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. SUMMARY STRIP BELOW DOCUMENT CANVAS                                    */
/* -------------------------------------------------------------------------- */
export interface StampSignatureSummaryBarProps {
  audit: StampSignatureAudit;
  isScanning: boolean;
  onRunAuditScan: () => void;
  onOpenAuditModal: () => void;
  language: 'EN' | 'HI';
}

export const StampSignatureSummaryBar: React.FC<StampSignatureSummaryBarProps> = ({
  audit,
  isScanning,
  onRunAuditScan,
  onOpenAuditModal,
  language
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Stamp className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-xs">
            {language === 'HI' ? 'मुद्रा व हस्ताक्षर विश्लेषक' : 'Stamp & Signature Detector'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
            audit.sealsDetected >= audit.sealsExpected 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
          }`}>
            <Stamp className="w-3 h-3" />
            <span>Seals: {audit.sealsDetected}/{audit.sealsExpected}</span>
          </span>

          <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
            audit.signaturesDetected >= audit.signaturesExpected 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
          }`}>
            <PenTool className="w-3 h-3" />
            <span>Signatures: {audit.signaturesDetected}/{audit.signaturesExpected}</span>
          </span>
        </div>
      </div>

      {/* Scan Actions & Certificate Viewer */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunAuditScan}
          disabled={isScanning}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all"
          title="Re-run Computer Vision detector on stamps & signatures"
        >
          <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Re-Detect'}</span>
        </button>

        <button
          onClick={onOpenAuditModal}
          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-cyan-800 transition-all"
        >
          <FileSignature className="w-3 h-3 text-cyan-400" />
          <span>{language === 'HI' ? 'पूर्ण रिपोर्ट देखें' : 'Compliance Report'}</span>
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. FULL AUDIT SHEET MODAL                                                 */
/* -------------------------------------------------------------------------- */
export interface StampSignatureModalProps {
  audit: StampSignatureAudit;
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  language: 'EN' | 'HI';
  onLogRequisition: (item: StampSignatureItem) => void;
}

export const StampSignatureModal: React.FC<StampSignatureModalProps> = ({
  audit,
  isOpen,
  onClose,
  documentTitle,
  language,
  onLogRequisition
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SEALS' | 'SIGNATURES'>('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredItems = audit.items.filter(item => {
    if (filterType === 'SEALS') return item.type === 'GOVERNMENT_SEAL' || item.type === 'REVENUE_STAMP';
    if (filterType === 'SIGNATURES') return item.type === 'OFFICER_SIGNATURE' || item.type === 'CALA_ENDORSEMENT' || item.type === 'KHATEDAR_SIGNATURE';
    return true;
  });

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Statutory Stamp & Authorized Signatory Audit</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  audit.overallStatus === 'VALID' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                    : 'bg-rose-950 text-rose-300 border border-rose-700'
                }`}>
                  {audit.overallStatus === 'VALID' ? 'FULLY AUTHENTICATED' : 'CRITICAL DEFECT DETECTED'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {documentTitle} • Audited: {new Date(audit.lastAuditedTimestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Filter Tabs */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({audit.items.length})
            </button>
            <button
              onClick={() => setFilterType('SEALS')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'SEALS' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Government Seals ({audit.items.filter(i => i.type.includes('SEAL') || i.type.includes('STAMP')).length})
            </button>
            <button
              onClick={() => setFilterType('SIGNATURES')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterType === 'SIGNATURES' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Signatory Boxes ({audit.items.filter(i => i.type.includes('SIGNATURE') || i.type.includes('ENDORSEMENT')).length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Detector: Vision AI Multi-Spectral v4.2
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredItems.map((item) => {
            const isMissing = item.status === 'MISSING';
            const isSmudged = item.status === 'SMUDGED_DEFECTIVE';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all text-xs ${
                  isMissing 
                    ? 'bg-rose-950/30 border-rose-600/70' 
                    : isSmudged 
                    ? 'bg-amber-950/30 border-amber-600/70' 
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isMissing 
                          ? 'bg-rose-600 text-white' 
                          : isSmudged 
                          ? 'bg-amber-600 text-slate-950' 
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-bold text-white text-sm">{item.label}</h4>
                      {item.required && (
                        <span className="text-[10px] text-rose-400 font-mono">(Mandatory)</span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400">Authorized Designation: </span>
                      <strong>{item.signatoryDesignation}</strong>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      {item.details}
                    </p>

                    <div className="pt-1.5 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>Statute: <strong className="text-cyan-300">{item.statutoryRuleCitation}</strong></span>
                      <span>Confidence: <strong>{Math.round(item.confidence * 100)}%</strong></span>
                    </div>
                  </div>

                  {/* Item Action */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isMissing ? (
                      <button
                        onClick={() => {
                          onLogRequisition(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center gap-1 shadow"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        <span>Issue Requisition</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Passed Validation</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handleDownload}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export Audit Certificate (.PDF)'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
