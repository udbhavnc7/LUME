import React, { useState, useRef, useEffect } from 'react';
import { 
  LandAcquisitionProject, 
  DecisionLogEntry, 
  ScannedDocumentRecord, 
  DiscrepancyItem,
  DocumentVerificationStatus,
  SmartFlagAnnotation,
  SmartFlagCategory,
  StampSignatureItem,
  OcrFieldItem,
  OcrCorrectionLog,
  LocalDocumentAnnotation
} from '../types';
import { 
  DatabaseLandRecord, 
  MOCK_DATABASE_RECORDS, 
  PRESET_SCANNED_DOCUMENTS,
  getDefaultOcrFields
} from '../data/documentVerificationData';
import { SmartFlaggingOverlay } from './SmartFlaggingOverlay';
import { 
  StampSignatureAlertBanner, 
  StampSignatureOverlay, 
  StampSignatureSummaryBar, 
  StampSignatureModal 
} from './StampSignatureDetector';
import { 
  CorrectionModeOverlay, 
  CorrectionModeBanner, 
  CorrectionEditModal, 
  CorrectionAuditDrawer 
} from './CorrectionModeOverlay';
import { DocumentAnnotationOverlay } from './DocumentAnnotationOverlay';
import { 
  Camera, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Printer, 
  Layers, 
  ShieldAlert, 
  Scale, 
  Compass, 
  Eye, 
  Upload, 
  Check, 
  ArrowRight, 
  RotateCw, 
  HelpCircle,
  Sliders,
  ExternalLink,
  ChevronDown,
  Info,
  X,
  FileCheck,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  FileDown,
  Download,
  Loader2,
  Clock,
  Filter,
  Search,
  CheckSquare,
  BarChart3,
  Stamp,
  Edit3,
  Database,
  Highlighter,
  CloudOff,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateStatutoryVerificationPdf } from '../utils/statutoryPdfGenerator';
import { useIndexedDB } from '../hooks/useIndexedDB';

interface DocumentVerificationModuleProps {
  project: LandAcquisitionProject;
  language: 'EN' | 'HI';
  onAddDecisionLog: (entry: DecisionLogEntry) => void;
  onOpenCitizenView?: (ulpin?: string) => void;
}

type ScanMode = 'CAMERA' | 'SIDE_BY_SIDE' | 'CERTIFICATE_PREVIEW';
type ImageFilterMode = 'NORMAL' | 'BW_CONTRAST' | 'INVERT' | 'ENHANCE';

export const DocumentVerificationModule: React.FC<DocumentVerificationModuleProps> = ({
  project,
  language,
  onAddDecisionLog,
  onOpenCitizenView
}) => {
  // Find matching preset record for current project or default to the first
  const projectPreset = PRESET_SCANNED_DOCUMENTS.find(d => d.projectId === project.id) || PRESET_SCANNED_DOCUMENTS[0];
  const projectDbRecord = MOCK_DATABASE_RECORDS[project.id] || MOCK_DATABASE_RECORDS['proj-nh48-pune-satara'];

  // Main UI State
  const [currentMode, setCurrentMode] = useState<ScanMode>('SIDE_BY_SIDE');
  const [documentsList, setDocumentsList] = useState<ScannedDocumentRecord[]>(PRESET_SCANNED_DOCUMENTS);
  const [activeDocument, setActiveDocument] = useState<ScannedDocumentRecord>(projectPreset);
  const [databaseRecord, setDatabaseRecord] = useState<DatabaseLandRecord>(projectDbRecord);
  const [activeDiscrepancyFilter, setActiveDiscrepancyFilter] = useState<'ALL' | 'DIMENSION' | 'OWNERSHIP' | 'CRITICAL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DocumentVerificationStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusMenuOpenDocId, setStatusMenuOpenDocId] = useState<string | null>(null);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  // Visual Inspection Layer Management (Prevents overlapping overlay chaos & tool confusion)
  const [activeLayer, setActiveLayer] = useState<'CROSS_REF' | 'SMART_FLAGS' | 'STAMP_SIGNATURE' | 'OCR_CORRECTION' | 'ANNOTATION'>('CROSS_REF');
  const [showAllOverlays, setShowAllOverlays] = useState<boolean>(false);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState<boolean>(false);
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(false);

  // Smart Flagging (AI) State
  const [smartFlaggingEnabled, setSmartFlaggingEnabled] = useState<boolean>(false);
  const [activeSmartFlagCategory, setActiveSmartFlagCategory] = useState<'ALL' | SmartFlagCategory>('ALL');
  const [selectedSmartFlagId, setSelectedSmartFlagId] = useState<string | null>(null);
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [isSmartFlagDrawerOpen, setIsSmartFlagDrawerOpen] = useState<boolean>(true);

  // Automated Stamp & Signature Detector State
  const [stampDetectorEnabled, setStampDetectorEnabled] = useState<boolean>(false);
  const [selectedStampItemId, setSelectedStampItemId] = useState<string | null>(null);
  const [isStampScanning, setIsStampScanning] = useState<boolean>(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState<boolean>(false);

  // Manual OCR Correction Mode State
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.95);
  const [correctionMode, setCorrectionMode] = useState<boolean>(false);
  const [selectedOcrFieldId, setSelectedOcrFieldId] = useState<string | null>(null);
  const [editingOcrField, setEditingOcrField] = useState<OcrFieldItem | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [scanProgressMsg, setScanProgressMsg] = useState<string>('');
  const [flashAnimation, setFlashAnimation] = useState<boolean>(false);

  // Inspector State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageFilter, setImageFilter] = useState<ImageFilterMode>('NORMAL');
  const [showOcrBoxes, setShowOcrBoxes] = useState<boolean>(true);
  const [showJmrModal, setShowJmrModal] = useState<boolean>(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // IndexedDB Storage & Local Annotations
  const { 
    saveDocument: saveDocToIdb, 
    documents: idbDocs,
    annotations: idbAnnotations,
    saveAnnotation: saveAnnotToIdb,
    deleteAnnotation: deleteAnnotFromIdb,
    syncAllAnnotations: syncIdbAnnotations,
    pendingAnnotationsCount
  } = useIndexedDB();
  const isStoredInIdb = idbDocs.some(d => d.id === activeDocument.id);

  // Local Document Annotations State
  const [isAnnotationMode, setIsAnnotationMode] = useState<boolean>(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [isSyncingAnnotations, setIsSyncingAnnotations] = useState<boolean>(false);
  const [isAnnotationDrawerOpen, setIsAnnotationDrawerOpen] = useState<boolean>(true);

  // Active document filtered annotations
  const activeDocumentAnnotations = idbAnnotations.filter(a => a.documentId === activeDocument.id);
  const activeDocPendingCount = activeDocumentAnnotations.filter(a => a.syncStatus === 'LOCAL_PENDING_SYNC').length;

  const handleSaveToIdb = async () => {
    await saveDocToIdb(activeDocument, 'CALA Verification Officer');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setActionSuccessToast(
      language === 'HI'
        ? `दस्तावेज़ स्थानीय IndexedDB वॉल्ट में सुरक्षित: '${activeDocument.documentTitle}' PWA कैश समाप्त होने पर भी ऑफ़लाइन उपलब्ध रहेगा।`
        : `Secured in IndexedDB Vault: "${activeDocument.documentTitle}" is saved locally and remains accessible even after PWA cache expiry.`
    );
    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  const handleSyncAnnotations = async () => {
    setIsSyncingAnnotations(true);
    try {
      const result = await syncIdbAnnotations();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.65 } });
      setActionSuccessToast(
        language === 'HI'
          ? `${result.syncedCount} स्थानीय टिप्पणियाँ केंद्रीय पोर्टल से सफलतापूर्वक सिंक की गईं!`
          : `Synchronized ${result.syncedCount} local document annotations to Central Land Acquisition Portal!`
      );
      setTimeout(() => setActionSuccessToast(null), 4500);
    } catch (err) {
      console.error('Annotation sync failed:', err);
    } finally {
      setIsSyncingAnnotations(false);
    }
  };

  // Switch active inspection layer with mutual clarity (no visual collision)
  const handleSelectLayer = (layer: 'CROSS_REF' | 'SMART_FLAGS' | 'STAMP_SIGNATURE' | 'OCR_CORRECTION' | 'ANNOTATION') => {
    setActiveLayer(layer);
    if (layer === 'SMART_FLAGS') {
      setSmartFlaggingEnabled(true);
      setStampDetectorEnabled(false);
      setCorrectionMode(false);
      setIsAnnotationMode(false);
      setShowOcrBoxes(false);
    } else if (layer === 'STAMP_SIGNATURE') {
      setStampDetectorEnabled(true);
      setSmartFlaggingEnabled(false);
      setCorrectionMode(false);
      setIsAnnotationMode(false);
      setShowOcrBoxes(false);
    } else if (layer === 'OCR_CORRECTION') {
      setCorrectionMode(true);
      setSmartFlaggingEnabled(false);
      setStampDetectorEnabled(false);
      setIsAnnotationMode(false);
      setShowOcrBoxes(false);
    } else if (layer === 'ANNOTATION') {
      setIsAnnotationMode(true);
      setSmartFlaggingEnabled(false);
      setStampDetectorEnabled(false);
      setCorrectionMode(false);
      setShowOcrBoxes(false);
    } else {
      // CROSS_REF
      setSmartFlaggingEnabled(false);
      setStampDetectorEnabled(false);
      setCorrectionMode(false);
      setIsAnnotationMode(false);
      setShowOcrBoxes(true);
    }
  };

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update records when project changes
  useEffect(() => {
    const matchedDoc = documentsList.find(d => d.projectId === project.id) || documentsList[0];
    const matchedDb = MOCK_DATABASE_RECORDS[project.id] || MOCK_DATABASE_RECORDS['proj-nh48-pune-satara'];
    setActiveDocument(matchedDoc);
    setDatabaseRecord(matchedDb);
  }, [project.id]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Web Audio Shutter Sound
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext failure is non-blocking
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser environment.');
      }

      // Stop any existing stream
      stopCameraStream();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      setCurrentMode('CAMERA');
    } catch (err: any) {
      console.warn('Camera initiation notice:', err);
      let errMsg = err?.message || 'Unable to access camera. Please check browser permissions.';
      if (err?.name === 'NotAllowedError') {
        errMsg = 'Camera permission was denied. Please allow camera access in your browser settings to scan paper documents.';
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        errMsg = 'No physical camera hardware detected on this device. You can upload an image or use our preset land record scans below.';
      }
      setCameraError(errMsg);
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Flip Camera between back and front
  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      stopCameraStream();
      setTimeout(() => {
        startCamera();
      }, 200);
    }
  };

  // Capture Snapshot from Camera
  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    playShutterSound();
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 300);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPhotoUrl(dataUrl);
      stopCameraStream();

      // Begin simulated OCR and database cross-referencing process
      setIsScanning(true);
      setScanProgressMsg('Detecting document borders and perspective rectifying...');

      setTimeout(() => {
        setScanProgressMsg('Extracting bilingual Marathi/Hindi/English Devanagari text...');
      }, 800);

      setTimeout(() => {
        setScanProgressMsg(`Cross-referencing against ${databaseRecord.digitalRegistrySystem} Database Record (${databaseRecord.surveyKhasraNo})...`);
      }, 1600);

      setTimeout(() => {
        setIsScanning(false);
        const hasCritical = activeDocument.discrepancies.some(d => d.severity === 'CRITICAL');
        const initialStatus: DocumentVerificationStatus = hasCritical ? 'NEEDS_MANUAL_REVIEW' : 'PENDING';
        const newRecord: ScannedDocumentRecord = {
          ...activeDocument,
          id: `scan-cam-${Date.now()}`,
          documentTitle: `Live Scanned ${activeDocument.documentType.replace(/_/g, ' ')} - ${activeDocument.surveyKhasraNo}`,
          verificationStatus: initialStatus,
          imageThumbnailUrl: dataUrl
        };
        setDocumentsList(prev => [newRecord, ...prev.filter(d => d.id !== newRecord.id)]);
        setActiveDocument(newRecord);
        setCurrentMode('SIDE_BY_SIDE');
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        setActionSuccessToast(`Document scanned and logged with status "${initialStatus === 'NEEDS_MANUAL_REVIEW' ? 'Needs Manual Review' : 'Pending'}"`);
        setTimeout(() => setActionSuccessToast(null), 4000);
      }, 2400);
    }
  };

  // Handle File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhotoUrl(dataUrl);
      setIsScanning(true);
      setScanProgressMsg('Processing uploaded document and running OCR entity matching...');

      setTimeout(() => {
        setIsScanning(false);
        const hasCritical = activeDocument.discrepancies.some(d => d.severity === 'CRITICAL');
        const initialStatus: DocumentVerificationStatus = hasCritical ? 'NEEDS_MANUAL_REVIEW' : 'PENDING';
        const newRecord: ScannedDocumentRecord = {
          ...activeDocument,
          id: `upload-${Date.now()}`,
          documentTitle: file.name.replace(/\.[^/.]+$/, "") || `Uploaded ${activeDocument.surveyKhasraNo}`,
          verificationStatus: initialStatus,
          imageThumbnailUrl: dataUrl
        };
        setDocumentsList(prev => [newRecord, ...prev.filter(d => d.id !== newRecord.id)]);
        setActiveDocument(newRecord);
        setCurrentMode('SIDE_BY_SIDE');
        confetti({ particleCount: 30, spread: 60 });
        setActionSuccessToast(`Uploaded record processed with status "${initialStatus === 'NEEDS_MANUAL_REVIEW' ? 'Needs Manual Review' : 'Pending'}"`);
        setTimeout(() => setActionSuccessToast(null), 4000);
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  // Select a preset land record
  const handleSelectPreset = (doc: ScannedDocumentRecord) => {
    setActiveDocument(doc);
    const matchedDb = MOCK_DATABASE_RECORDS[doc.projectId] || databaseRecord;
    setDatabaseRecord(matchedDb);
    setCapturedPhotoUrl(doc.imageThumbnailUrl || null);
    setCurrentMode('SIDE_BY_SIDE');
  };

  // Status badge details helper
  const getStatusBadgeDetails = (status?: DocumentVerificationStatus) => {
    const s = status || 'PENDING';
    switch (s) {
      case 'VERIFIED':
        return {
          label: language === 'HI' ? 'सत्यापित' : 'Verified',
          subtext: language === 'HI' ? 'डिजिटल डेटाबेस से पूर्णतः संरेखित' : 'Fully Reconciled & Approved',
          badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40',
          pillBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          dotClass: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />,
          status: 'VERIFIED' as DocumentVerificationStatus
        };
      case 'NEEDS_MANUAL_REVIEW':
        return {
          label: language === 'HI' ? 'पुनरावलोकन आवश्यक' : 'Needs Manual Review',
          subtext: language === 'HI' ? 'क्षेत्रफल या स्वामित्व में विसंगति' : 'Critical Discrepancy Flagged',
          badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-950/40',
          pillBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
          dotClass: 'bg-rose-500',
          icon: <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />,
          status: 'NEEDS_MANUAL_REVIEW' as DocumentVerificationStatus
        };
      case 'PENDING':
      default:
        return {
          label: language === 'HI' ? 'सत्यापन लंबित' : 'Pending Verification',
          subtext: language === 'HI' ? 'फील्ड सत्यापन व जेएमआर प्रतीक्षित' : 'Awaiting Field JMR / Scrutiny',
          badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-950/40',
          pillBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          dotClass: 'bg-amber-400',
          icon: <Clock className="w-3 h-3 text-amber-400 shrink-0" />,
          status: 'PENDING' as DocumentVerificationStatus
        };
    }
  };

  // Update Status of any Scanned Document
  const handleUpdateStatus = (docId: string, newStatus: DocumentVerificationStatus, customReason?: string) => {
    setDocumentsList(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, verificationStatus: newStatus };
      }
      return doc;
    }));

    if (activeDocument.id === docId) {
      setActiveDocument(prev => ({ ...prev, verificationStatus: newStatus }));
    }

    setStatusMenuOpenDocId(null);

    const statusLabels: Record<DocumentVerificationStatus, string> = {
      VERIFIED: language === 'HI' ? 'सत्यापित (Verified)' : 'Verified',
      NEEDS_MANUAL_REVIEW: language === 'HI' ? 'पुनरावलोकन आवश्यक (Needs Manual Review)' : 'Needs Manual Review',
      PENDING: language === 'HI' ? 'सत्यापन लंबित (Pending)' : 'Pending'
    };

    if (newStatus === 'VERIFIED') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    setActionSuccessToast(
      language === 'HI'
        ? `दस्तावेज़ ${activeDocument.surveyKhasraNo} की स्थिति बदलकर "${statusLabels[newStatus]}" कर दी गई है।`
        : `Verification status for ${activeDocument.surveyKhasraNo} updated to "${statusLabels[newStatus]}".`
    );

    // Audit trail decision log
    onAddDecisionLog({
      id: `dec-status-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: 'SLAO / Competent Authority',
      officerRole: 'Special Land Acquisition Officer (CALA)',
      timestamp: new Date().toISOString(),
      actionTaken: customReason || `Updated verification status to ${newStatus} for ${activeDocument.surveyKhasraNo} (${activeDocument.village}) following statutory record review.`,
      category: 'STATUS_REVIEW',
      targetDueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      scenarioAssumptionsTested: `Status changed to ${newStatus}. Statutory compliance tracking under RFCTLARR Section 11(5).`
    });

    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  // Log Requisition to Project Decision Queue
  const handleLogIntervention = (discrepancy?: DiscrepancyItem) => {
    const desc = discrepancy
      ? `Ordered Joint Cadastral Measurement (JMR) with DGPS for ${activeDocument.surveyKhasraNo} following detected ${discrepancy.fieldLabel} variance: Scanned (${discrepancy.scannedValue}) vs Database (${discrepancy.databaseValue}).`
      : `Issued formal verification requisition for ${activeDocument.surveyKhasraNo}: Discrepancies verified in physical ${activeDocument.documentTitle} against portal record. DGPS team dispatched.`;

    const newDecision: DecisionLogEntry = {
      id: `dec-doc-verif-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: 'District Land Acquisition Officer (DLAO / CALA)',
      officerRole: 'Competent Authority / Field Verification Squad',
      timestamp: new Date().toISOString(),
      actionTaken: desc,
      category: 'SPECIAL_CAMP',
      targetDueDate: '2026-09-26',
      scenarioAssumptionsTested: `Physical Verification: ${activeDocument.discrepancies.length} discrepancies flagged. Preventing Section 64 reference dispute.`,
      status: 'ASSIGNED',
      notes: `Scanned Document: ${activeDocument.documentTitle} (${activeDocument.issueDate}). Verified via LUME Document Verification Module.`
    };

    onAddDecisionLog(newDecision);
    setActionSuccessToast(`Intervention Logged: Requisition assigned to Decision Queue for ${activeDocument.surveyKhasraNo}`);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  // Run Vision AI Smart Scan
  const handleRunAiScan = () => {
    setIsAiScanning(true);
    setSelectedSmartFlagId(null);
    setScanProgressMsg(
      language === 'HI'
        ? 'एआई विज़न न्यूरल ऑडिट: संदिग्ध स्याही, लापता हस्ताक्षर और ज्यामितीय विचलन का विश्लेषण...'
        : 'AI Vision Neural Audit: Analyzing ink micro-contrast, missing signatures & GIS vector geometry...'
    );

    setTimeout(() => {
      setIsAiScanning(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      const flagCount = activeDocument.smartFlags?.length || 0;
      setActionSuccessToast(
        language === 'HI'
          ? `एआई स्मार्ट फ़्लैगिंग पूर्ण: ${flagCount} विसंगतियां पाई गईं (संदिग्ध स्याही, आयाम विचलन, हस्ताक्षर)`
          : `AI Smart Flagging complete: ${flagCount} visual anomalies mapped with bounding box coordinates.`
      );
      setTimeout(() => setActionSuccessToast(null), 4500);
    }, 1600);
  };

  // Log Statutory Intervention for a specific Smart Flag
  const handleLogSmartFlagDecision = (flag: SmartFlagAnnotation) => {
    const newDecision: DecisionLogEntry = {
      id: `dec-sf-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: 'CALA / Special Land Acquisition Officer',
      officerRole: 'Statutory Record Verification Authority',
      timestamp: new Date().toISOString(),
      actionTaken: `Ordered Forensic & Cadastral Verification for ${activeDocument.surveyKhasraNo} following AI Smart Flag [${flag.category}]: ${flag.title}. Diagnostic: ${flag.aiModelAnalysis}`,
      category: 'STATUS_REVIEW',
      targetDueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      scenarioAssumptionsTested: `AI Smart Flag: ${flag.category} (${Math.round(flag.confidenceScore * 100)}% AI confidence). Rule: ${flag.statutoryRule || 'RFCTLARR Sec 26/38'}.`,
      status: 'ASSIGNED',
      notes: `Smart Flag ID: ${flag.id}. Document: ${activeDocument.documentTitle}. Discrepancy: ${flag.scannedValue || 'N/A'} vs ${flag.databaseValue || 'N/A'}.`
    };

    onAddDecisionLog(newDecision);
    setActionSuccessToast(`Statutory Action Logged: Requisition queued for "${flag.title}"`);
    confetti({ particleCount: 50, spread: 65, origin: { y: 0.8 } });
    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  // Mark Smart Flag as Resolved or Reopen
  const handleResolveSmartFlag = (flagId: string) => {
    const updatedFlags = (activeDocument.smartFlags || []).map(f => {
      if (f.id === flagId) {
        const nextStatus: 'FLAGGED' | 'RESOLVED' = f.status === 'RESOLVED' ? 'FLAGGED' : 'RESOLVED';
        return { ...f, status: nextStatus };
      }
      return f;
    });

    const updatedDoc = { ...activeDocument, smartFlags: updatedFlags };
    setActiveDocument(updatedDoc);
    setDocumentsList(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));

    const targetFlag = updatedFlags.find(f => f.id === flagId);
    const isNowResolved = targetFlag?.status === 'RESOLVED';

    setActionSuccessToast(
      isNowResolved 
        ? `Smart Flag marked as Reviewed / Resolved for ${activeDocument.surveyKhasraNo}`
        : `Smart Flag reopened for active inspection`
    );
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Requisition missing authorized signatory / stamp via formal CALA notice
  const handleLogStampRequisition = (item: StampSignatureItem) => {
    const newDecision: DecisionLogEntry = {
      id: `dec-stamp-req-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: 'CALA / Competent Authority Land Acquisition',
      officerRole: 'Statutory Record Verification Authority',
      timestamp: new Date().toISOString(),
      actionTaken: `Dispatched Statutory Requisition to ${item.signatoryDesignation || 'Revenue Officer'} for missing ${item.label} on ${activeDocument.surveyKhasraNo}. Mandated under ${item.statutoryRuleCitation}. Inadmissible for Section 23 Award without seal/signatory.`,
      category: 'STATUS_REVIEW',
      targetDueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      scenarioAssumptionsTested: `Statutory attestation requirement: ${item.statutoryRuleCitation}. Action: Requisition signed copy from revenue office.`,
      status: 'ASSIGNED',
      notes: `Seal/Signature Defect ID: ${item.id}. Type: ${item.type}. Status: ${item.status}. Document: ${activeDocument.documentTitle}.`
    };

    onAddDecisionLog(newDecision);

    // Update document status to NEEDS_MANUAL_REVIEW
    handleUpdateStatus(activeDocument.id, 'NEEDS_MANUAL_REVIEW');

    confetti({ particleCount: 55, spread: 70, origin: { y: 0.75 } });
    setActionSuccessToast(
      language === 'HI'
        ? `वैधानिक मांग पत्र प्रेषित: ${item.label} हेतु तहसीलदार कार्यालय को आधिकारिक नोटिस भेजा गया।`
        : `Statutory Requisition Dispatched: Official requisition sent to Tehsildar for ${item.label}.`
    );
    setTimeout(() => setActionSuccessToast(null), 5000);
  };

  // Re-run automated Stamp & Signature scan
  const handleRunStampScan = () => {
    setIsStampScanning(true);
    setTimeout(() => {
      setIsStampScanning(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setActionSuccessToast(
        language === 'HI'
          ? 'मुद्रा व हस्ताक्षर विश्लेषक पूर्ण: बहु-वर्णक्रमीय सरकारी मुहर व हस्ताक्षर परीक्षण संपन्न'
          : 'Stamp & Signature Detector complete: Multi-spectral seal contours & biometric vectors verified.'
      );
      setTimeout(() => setActionSuccessToast(null), 4500);
    }, 1200);
  };

  // Generate & Download PDF Verification Report
  const handleDownloadPdfReport = async () => {
    try {
      setIsGeneratingPdf(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
      await generateStatutoryVerificationPdf({
        document: activeDocument,
        database: databaseRecord,
        project,
        capturedPhotoUrl,
        language
      });
      confetti({ particleCount: 50, spread: 75, origin: { y: 0.7 } });
      setActionSuccessToast(
        language === 'HI'
          ? `सांविधिक सत्यापन PDF रिपोर्ट सफलतापूर्वक तैयार और डाउनलोड की गई: ${activeDocument.surveyKhasraNo} (ULPIN: ${databaseRecord.ulpin})`
          : `Statutory Verification PDF Report generated & downloaded: ${activeDocument.surveyKhasraNo} (ULPIN: ${databaseRecord.ulpin})`
      );
    } catch (err) {
      console.error('Error generating PDF report:', err);
      setActionSuccessToast('Failed to generate statutory PDF report. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setActionSuccessToast(null), 6000);
    }
  };

  // Filtered discrepancies
  const filteredDiscrepancies = activeDocument.discrepancies.filter(d => {
    if (activeDiscrepancyFilter === 'DIMENSION') return d.category === 'DIMENSION';
    if (activeDiscrepancyFilter === 'OWNERSHIP') return d.category === 'OWNERSHIP';
    if (activeDiscrepancyFilter === 'CRITICAL') return d.severity === 'CRITICAL';
    return true;
  });

  const criticalCount = activeDocument.discrepancies.filter(d => d.severity === 'CRITICAL').length;
  const warningCount = activeDocument.discrepancies.filter(d => d.severity === 'WARNING').length;

  // Active document OCR fields & threshold checking for Correction Mode
  const currentOcrFields: OcrFieldItem[] = activeDocument.ocrFields || getDefaultOcrFields(activeDocument, databaseRecord);
  const correctedFieldsCount = currentOcrFields.filter(f => f.isCorrected).length;
  const isBelowThreshold = activeDocument.ocrConfidence < confidenceThreshold;

  // Save manual OCR field correction & update document status/discrepancies
  const handleSaveFieldCorrection = (fieldId: string, newValue: string, reason: string) => {
    const fields = activeDocument.ocrFields || getDefaultOcrFields(activeDocument, databaseRecord);
    const targetField = fields.find(f => f.id === fieldId);
    if (!targetField) return;

    const prevValue = targetField.currentValue;
    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          currentValue: newValue,
          isCorrected: true,
          correctedBy: 'CALA Verification Officer',
          correctedAt: new Date().toISOString(),
          correctionReason: reason,
          confidence: 0.99
        };
      }
      return f;
    });

    const newLog: OcrCorrectionLog = {
      id: `corr-${Date.now()}`,
      documentId: activeDocument.id,
      fieldId,
      fieldKey: targetField.fieldKey,
      fieldLabel: targetField.label,
      previousValue: prevValue,
      newValue,
      reason,
      officerName: 'CALA Verification Officer',
      officerRole: 'Competent Authority Land Acquisition',
      timestamp: new Date().toISOString()
    };

    let updatedDoc: ScannedDocumentRecord = {
      ...activeDocument,
      ocrFields: updatedFields,
      correctionsHistory: [newLog, ...(activeDocument.correctionsHistory || [])]
    };

    // Calculate boosted confidence with manual officer attestation
    const newlyCorrected = updatedFields.filter(f => f.isCorrected).length;
    const baseConf = activeDocument.ocrConfidence;
    updatedDoc.ocrConfidence = Math.min(0.99, +(baseConf + 0.02 * newlyCorrected).toFixed(2));

    // Synchronize core document attributes
    if (targetField.fieldKey === 'totalAreaAcre') {
      const num = parseFloat(newValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) {
        updatedDoc.totalAreaAcre = num;
        updatedDoc.totalAreaHectare = +(num * 0.404686).toFixed(3);
        updatedDoc.totalAreaGuntha = +(num * 40).toFixed(1);

        // Check if discrepancy with authoritative database record is resolved
        if (Math.abs(num - databaseRecord.totalAreaAcre) < 0.02) {
          updatedDoc.discrepancies = updatedDoc.discrepancies.map(d => {
            if (d.field === 'totalAreaAcre') {
              return {
                ...d,
                severity: 'MATCH',
                scannedValue: `${num} Acres (Officer Corrected)`,
                varianceDescription: '✓ Resolved: Manually corrected to match authoritative DILRMP digital registry'
              };
            }
            return d;
          });
        }
      }
    } else if (targetField.fieldKey === 'surveyKhasraNo') {
      updatedDoc.surveyKhasraNo = newValue;
    } else if (targetField.fieldKey === 'eastBoundaryDimension') {
      const num = parseFloat(newValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        updatedDoc.dimensions = {
          ...updatedDoc.dimensions,
          eastMeters: num
        };
        if (Math.abs(num - databaseRecord.dimensions.eastMeters) < 0.2) {
          updatedDoc.discrepancies = updatedDoc.discrepancies.map(d => {
            if (d.field === 'eastBoundaryDimension') {
              return {
                ...d,
                severity: 'MATCH',
                scannedValue: `${num}m (Officer Corrected)`,
                varianceDescription: '✓ Resolved: Cadastral RoW boundary reconciled with GIS layer'
              };
            }
            return d;
          });
        }
      }
    } else if (targetField.fieldKey === 'westBoundaryDimension') {
      const num = parseFloat(newValue.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) {
        updatedDoc.dimensions = {
          ...updatedDoc.dimensions,
          westMeters: num
        };
      }
    } else if (targetField.fieldKey === 'landClassification') {
      updatedDoc.landClassification = newValue;
    }

    setActiveDocument(updatedDoc);
    setDocumentsList(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));

    // Audit trail decision log
    onAddDecisionLog({
      id: `dec-ocr-corr-${Date.now()}`,
      projectId: project.id,
      projectCode: project.projectCode,
      officerName: 'CALA / Verification Officer',
      officerRole: 'Land Acquisition & Revenue Officer',
      timestamp: new Date().toISOString(),
      actionTaken: `Manual OCR Correction: Field '${targetField.label}' updated from '${prevValue}' to '${newValue}'. Reason: ${reason}. Record confidence recalculated to ${(updatedDoc.ocrConfidence * 100).toFixed(0)}%.`,
      category: 'STATUS_REVIEW',
      targetDueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      scenarioAssumptionsTested: `Human-in-the-loop OCR correction under statutory verification guidelines. Field: ${targetField.fieldKey}.`
    });

    setActionSuccessToast(
      language === 'HI'
        ? `फ़ील्ड सुधार सहेजा गया: '${targetField.label}' को '${newValue}' के रूप में अद्यतित किया गया`
        : `OCR Field Corrected: '${targetField.label}' updated to '${newValue}'. Record confidence recalculated to ${(updatedDoc.ocrConfidence * 100).toFixed(0)}%.`
    );
    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  // Revert manual field correction back to raw OCR
  const handleRevertFieldCorrection = (fieldId: string) => {
    const fields = activeDocument.ocrFields || getDefaultOcrFields(activeDocument, databaseRecord);
    const targetField = fields.find(f => f.id === fieldId);
    if (!targetField) return;

    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          currentValue: f.originalOcrValue,
          isCorrected: false,
          correctedBy: undefined,
          correctedAt: undefined,
          correctionReason: undefined,
          confidence: f.confidence < 0.95 ? f.confidence : 0.90
        };
      }
      return f;
    });

    const updatedLogs = (activeDocument.correctionsHistory || []).filter(l => l.fieldId !== fieldId);
    const presetDoc = PRESET_SCANNED_DOCUMENTS.find(d => d.id === activeDocument.id);

    const restoredDoc: ScannedDocumentRecord = {
      ...activeDocument,
      ocrFields: updatedFields,
      correctionsHistory: updatedLogs,
      ocrConfidence: presetDoc?.ocrConfidence || activeDocument.ocrConfidence,
      totalAreaAcre: presetDoc?.totalAreaAcre || activeDocument.totalAreaAcre,
      dimensions: presetDoc?.dimensions || activeDocument.dimensions,
      discrepancies: presetDoc?.discrepancies || activeDocument.discrepancies
    };

    setActiveDocument(restoredDoc);
    setDocumentsList(prev => prev.map(d => d.id === restoredDoc.id ? restoredDoc : d));

    setActionSuccessToast(
      language === 'HI'
        ? `सुधार पूर्ववत: '${targetField.label}' मूल ओसीआर मान पर पुनर्स्थापित`
        : `Correction Reverted: '${targetField.label}' restored to original raw OCR extraction.`
    );
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Reset all manual corrections for this record
  const handleResetAllCorrections = () => {
    const presetDoc = PRESET_SCANNED_DOCUMENTS.find(d => d.id === activeDocument.id);
    const resetDoc: ScannedDocumentRecord = {
      ...activeDocument,
      ocrFields: getDefaultOcrFields(activeDocument, databaseRecord),
      correctionsHistory: [],
      ocrConfidence: presetDoc?.ocrConfidence || activeDocument.ocrConfidence,
      totalAreaAcre: presetDoc?.totalAreaAcre || activeDocument.totalAreaAcre,
      dimensions: presetDoc?.dimensions || activeDocument.dimensions,
      discrepancies: presetDoc?.discrepancies || activeDocument.discrepancies
    };

    setActiveDocument(resetDoc);
    setDocumentsList(prev => prev.map(d => d.id === resetDoc.id ? resetDoc : d));

    setActionSuccessToast('All manual field corrections reset to raw OCR extraction.');
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Document Verification Pipeline Metrics & Progress
  const totalScanned = documentsList.length;
  const verifiedCount = documentsList.filter(d => (d.verificationStatus || 'PENDING') === 'VERIFIED').length;
  const needsReviewCount = documentsList.filter(d => (d.verificationStatus || 'PENDING') === 'NEEDS_MANUAL_REVIEW').length;
  const pendingCount = documentsList.filter(d => (d.verificationStatus || 'PENDING') === 'PENDING').length;
  
  const verifiedPct = totalScanned > 0 ? Math.round((verifiedCount / totalScanned) * 100) : 0;
  const needsReviewPct = totalScanned > 0 ? Math.round((needsReviewCount / totalScanned) * 100) : 0;
  const pendingPct = Math.max(0, 100 - verifiedPct - needsReviewPct);

  // Filtered documents list for Project Managers
  const filteredDocuments = documentsList.filter(doc => {
    const docStatus = doc.verificationStatus || 'PENDING';
    const matchesStatus = statusFilter === 'ALL' || docStatus === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      doc.surveyKhasraNo.toLowerCase().includes(query) ||
      doc.village.toLowerCase().includes(query) ||
      doc.district.toLowerCase().includes(query) ||
      doc.documentTitle.toLowerCase().includes(query) ||
      doc.owners.some(o => o.name.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6" id="document-verification-module">
      {/* Hidden Canvas for Camera Snapshots */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />

      {/* Module Header */}
      <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Camera className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'HI' 
                  ? 'दस्तावेज़ सत्यापन एवं भूमि अभिलेख क्रॉस-रेफरेंस (Document Verification)' 
                  : 'Document Verification: Paper Record Digitization & Cross-Referencing'}
              </h2>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                Camera API + Cross-Ref Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {language === 'HI'
                ? 'कैमरा द्वारा भौतिक सातबारा (७/१२), खतौनी, धारा ११ अधिसूचना व कडस्ट्रल नक्शों को स्कैन करें। डिजिटल पोर्टल डेटाबेस के साथ तुरंत मिलान कर क्षेत्रफल व स्वामित्व की विसंगतियों को समय रहते हल करें।'
                : 'Scan physical 7/12 extracts, Khasra Khatauni, Section 11 gazettes & cadastral FMB maps using the live camera. Instantly cross-reference against the DILRMP database to detect area, dimension, and ownership discrepancies before statutory award.'}
            </p>
          </div>

          {/* Mode Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={startCamera}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'CAMERA'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-slate-900/90 text-teal-300 border border-teal-500/40 hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'कैमरा स्कैनर' : 'Live Camera'}</span>
            </button>

            <button
              onClick={() => {
                stopCameraStream();
                setCurrentMode('SIDE_BY_SIDE');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentMode === 'SIDE_BY_SIDE'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'तुलनात्मक समीक्षा (Side-by-Side)' : 'Side-by-Side Comparison'}</span>
            </button>

            <button
              onClick={() => {
                stopCameraStream();
                setCurrentMode('CERTIFICATE_PREVIEW');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentMode === 'CERTIFICATE_PREVIEW'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'HI' ? 'सत्यापन प्रमाणपत्र' : 'Audit Certificate'}</span>
            </button>

            {/* Quick Guide Toggle */}
            <button
              onClick={() => setShowQuickGuide(!showQuickGuide)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                showQuickGuide
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle 3-Step Verification Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'HI' ? 'सहायता गाइड' : 'Quick Guide'}</span>
            </button>

            {/* Statutory PDF Report Download Button */}
            <button
              onClick={handleDownloadPdfReport}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-900/40 active:scale-95 disabled:opacity-50 cursor-pointer border border-teal-400/40"
              title="Generate and download court-grade PDF verification and reconciliation report for statutory audit trails"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>{language === 'HI' ? 'पीडीएफ...' : 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'HI' ? 'PDF रिपोर्ट' : 'Export PDF Dossier'}</span>
                </>
              )}
            </button>

            {/* Save / Status in IndexedDB Vault Button */}
            <button
              id="btn-save-to-indexeddb"
              onClick={handleSaveToIdb}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                isStoredInIdb
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60 hover:bg-indigo-900/60 shadow-sm'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-indigo-950/50 hover:text-indigo-200 hover:border-indigo-500/50'
              }`}
              title="Store this critical statutory document in IndexedDB to ensure durable offline access for field work even after PWA cache expiry"
            >
              <Database className={`w-3.5 h-3.5 ${isStoredInIdb ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>
                {isStoredInIdb 
                  ? (language === 'HI' ? 'IndexedDB वॉल्ट सुरक्षित ✓' : 'IndexedDB Saved ✓') 
                  : (language === 'HI' ? 'IndexedDB वॉल्ट' : 'Save to Vault')}
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible 3-Step Quick Verification Guide */}
        {showQuickGuide && (
          <div className="p-4 bg-slate-900/95 border border-amber-500/30 rounded-xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How to Verify Land Records (3 Step Workflow)
                </h4>
              </div>
              <button
                onClick={() => setShowQuickGuide(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-[10px] font-mono">1</span>
                  <span>Select Corridor Parcel</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Use the quick parcel switcher strip below to select the target land parcel (e.g. Gut No. 42/1) across corridor projects.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[10px] font-mono">2</span>
                  <span>Inspect Layer-by-Layer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Switch cleanly between Cross-Reference, AI Flags, Stamps & Seals, OCR Fixes, and Local Markup without screen clutter.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-[10px] font-mono">3</span>
                  <span>Reconcile or Requisition</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mark as Verified when reconciled, or dispatch a DGPS Joint Measurement Requisition (JMR) to resolve discrepancies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Parcel & Corridor Quick-Switcher Bar */}
        <div className="pt-2 border-t border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Active Parcel Spotlight Card */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700/80">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">
                  {activeDocument.surveyKhasraNo}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ({activeDocument.village})
                </span>

                {/* Status Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setStatusMenuOpenDocId(statusMenuOpenDocId === 'spotlight-status' ? null : 'spotlight-status')}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${getStatusBadgeDetails(activeDocument.verificationStatus).badgeClass}`}
                    title="Click to update verification status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeDetails(activeDocument.verificationStatus).dotClass}`} />
                    <span>{getStatusBadgeDetails(activeDocument.verificationStatus).label}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {statusMenuOpenDocId === 'spotlight-status' && (
                    <div className="absolute left-0 mt-1 w-48 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-0.5 text-xs">
                      <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800">
                        Update Status ({activeDocument.surveyKhasraNo}):
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(activeDocument.id, 'VERIFIED')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-[11px]">Mark as Verified</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeDocument.id, 'NEEDS_MANUAL_REVIEW')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 flex items-center gap-1.5 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-bold text-[11px]">Flag for Review</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeDocument.id, 'PENDING')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-950/60 text-amber-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-[11px]">Mark as Pending</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-xs">
                {activeDocument.documentTitle} • OCR Confidence: {(activeDocument.ocrConfidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Quick Parcel Switcher Pills for this Corridor */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 flex-1 justify-start md:justify-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
              Parcels:
            </span>
            {documentsList.map((doc) => {
              const isSelected = doc.id === activeDocument.id;
              const hasCritical = doc.discrepancies.some(d => d.severity === 'CRITICAL');
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDocument(doc);
                    const matchingDb = MOCK_DATABASE_RECORDS[doc.projectId] || projectDbRecord;
                    setDatabaseRecord(matchingDb);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm ring-2 ring-teal-400/50'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'
                  }`}
                  title={`${doc.surveyKhasraNo} (${doc.village}) - Click to inspect`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    doc.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-400'
                      : hasCritical
                      ? 'bg-rose-400'
                      : 'bg-amber-400'
                  }`} />
                  <span>{doc.surveyKhasraNo}</span>
                  {doc.discrepancies.length > 0 && (
                    <span className={`text-[9px] px-1 rounded font-mono ${
                      isSelected ? 'bg-slate-950/40 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {doc.discrepancies.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Toggle Corridor Pipeline Overview Drawer */}
          <button
            onClick={() => setIsPipelineExpanded(!isPipelineExpanded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
              isPipelineExpanded
                ? 'bg-slate-700 text-white border-slate-600'
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white hover:border-slate-600'
            }`}
            title="Expand / Collapse full project verification metrics and parcel search"
          >
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span>Corridor Pipeline ({verifiedPct}% Verified)</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isPipelineExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Full Project Verification Pipeline Dashboard */}
        {isPipelineExpanded && (
        <div className="pt-3 border-t border-slate-700/60 space-y-3.5">
          {/* Progress Metrics & Stacked Completion Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {language === 'HI' ? 'दस्तावेज़ सत्यापन पाइपलाइन व प्रगति' : 'Document Verification Pipeline & Audit Progress'}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                    {verifiedPct}% {language === 'HI' ? 'सत्यापित' : 'Reconciled'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'HI'
                    ? 'भौतिक राजस्व अभिलेखों की डीआईएलआरएमपी डिजिटल डेटाबेस के साथ स्थिति ट्रैकिंग एवं विसंगति फिल्टर'
                    : 'Track statutory verification status, filter scanned land records, and resolve discrepancies across corridor parcels'}
                </p>
              </div>
            </div>

            {/* Quick Metrics Chips */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Total: <strong>{totalScanned}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified: <strong>{verifiedCount}</strong> ({verifiedPct}%)</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 font-mono text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Needs Review: <strong>{needsReviewCount}</strong> ({needsReviewPct}%)</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Pending: <strong>{pendingCount}</strong> ({pendingPct}%)</span>
              </span>
            </div>
          </div>

          {/* Tri-color Stacked Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden flex shadow-inner border border-slate-800">
              <div 
                style={{ width: `${verifiedPct}%` }} 
                className="bg-emerald-500 transition-all duration-500 h-full"
                title={`Verified: ${verifiedCount} (${verifiedPct}%)`}
              />
              <div 
                style={{ width: `${needsReviewPct}%` }} 
                className="bg-rose-500 transition-all duration-500 h-full"
                title={`Needs Manual Review: ${needsReviewCount} (${needsReviewPct}%)`}
              />
              <div 
                style={{ width: `${pendingPct}%` }} 
                className="bg-amber-500 transition-all duration-500 h-full"
                title={`Pending: ${pendingCount} (${pendingPct}%)`}
              />
            </div>
          </div>

          {/* Filter Tabs & Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-slate-500" />
                <span>{language === 'HI' ? 'स्थिति फ़िल्टर:' : 'Status Filter:'}</span>
              </span>

              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{language === 'HI' ? 'सभी दस्तावेज़' : 'All Documents'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === 'ALL' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {totalScanned}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('NEEDS_MANUAL_REVIEW')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === 'NEEDS_MANUAL_REVIEW'
                    ? 'bg-rose-600 text-white font-bold shadow-sm shadow-rose-900/40'
                    : 'bg-slate-900/90 text-rose-300 hover:text-white border border-rose-900/40 hover:border-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{language === 'HI' ? 'पुनरावलोकन आवश्यक' : 'Needs Manual Review'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === 'NEEDS_MANUAL_REVIEW' ? 'bg-rose-950 text-white' : 'bg-rose-950/80 text-rose-300'}`}>
                  {needsReviewCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-sm shadow-amber-900/40'
                    : 'bg-slate-900/90 text-amber-300 hover:text-white border border-amber-900/40 hover:border-amber-700'
                }`}
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{language === 'HI' ? 'सत्यापन लंबित' : 'Pending'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === 'PENDING' ? 'bg-amber-950 text-amber-200' : 'bg-amber-950/80 text-amber-300'}`}>
                  {pendingCount}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter('VERIFIED')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  statusFilter === 'VERIFIED'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-900/40'
                    : 'bg-slate-900/90 text-emerald-300 hover:text-white border border-emerald-900/40 hover:border-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{language === 'HI' ? 'सत्यापित' : 'Verified'}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${statusFilter === 'VERIFIED' ? 'bg-emerald-950 text-white' : 'bg-emerald-950/80 text-emerald-300'}`}>
                  {verifiedCount}
                </span>
              </button>
            </div>

            {/* Search and Upload Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'HI' ? 'खसरा / गांव / खातेदार खोजें...' : 'Search Khasra, village, owner...'}
                  className="pl-8 pr-7 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-44 sm:w-56"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-[11px] transition-colors whitespace-nowrap"
                title="Upload scanned document image"
              >
                <Upload className="w-3 h-3 text-teal-400" />
                <span>{language === 'HI' ? 'अपलोड' : 'Upload'}</span>
              </button>
            </div>
          </div>

          {/* Filtered Scanned Record Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {filteredDocuments.length === 0 ? (
              <div className="col-span-full p-6 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                <p className="text-xs">No land records match the selected status filter or search query.</p>
                <button
                  onClick={() => { setStatusFilter('ALL'); setSearchQuery(''); }}
                  className="mt-2 text-xs text-teal-400 hover:underline font-semibold"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const badge = getStatusBadgeDetails(doc.verificationStatus);
                const isSelected = activeDocument.id === doc.id;
                const criticalCountOnDoc = doc.discrepancies.filter(d => d.severity === 'CRITICAL').length;
                const isMenuOpen = statusMenuOpenDocId === `card-${doc.id}`;

                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectPreset(doc)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-850 border-teal-500/70 shadow-lg shadow-teal-950/30 ring-1 ring-teal-500/40'
                        : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Row: Type & Status Indicator Badge */}
                      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate max-w-[120px]">
                          {doc.documentType.replace(/_/g, ' ')}
                        </span>

                        {/* Interactive Status Indicator Badge */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setStatusMenuOpenDocId(isMenuOpen ? null : `card-${doc.id}`)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${badge.badgeClass} hover:opacity-90`}
                            title="Click to change verification status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                            <span>{badge.label}</span>
                            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                          </button>

                          {/* Quick Status Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-0.5 text-xs">
                              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800">
                                Set Verification Status:
                              </div>
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'VERIFIED')}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 flex items-center gap-1.5 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <div>
                                  <span className="font-bold block text-[11px]">Verified</span>
                                  <span className="text-[9px] text-emerald-400/80">Reconciled with registry</span>
                                </div>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'NEEDS_MANUAL_REVIEW')}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 flex items-center gap-1.5 transition-colors"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                <div>
                                  <span className="font-bold block text-[11px]">Needs Manual Review</span>
                                  <span className="text-[9px] text-rose-400/80">Discrepancy / JMR flagged</span>
                                </div>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'PENDING')}
                                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-950/60 text-amber-300 flex items-center gap-1.5 transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <div>
                                  <span className="font-bold block text-[11px]">Pending</span>
                                  <span className="text-[9px] text-amber-400/80">Awaiting surveyor check</span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Survey / Khasra Identification */}
                      <div className="pt-2">
                        <div className="flex items-baseline justify-between gap-1">
                          <h5 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                            {doc.surveyKhasraNo}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {(doc.ocrConfidence * 100).toFixed(0)}% OCR
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {doc.village}, {doc.district}
                        </p>
                      </div>
                    </div>

                    {/* Footer Info: Discrepancy count & Quick Action */}
                    <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      {criticalCountOnDoc > 0 ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{criticalCountOnDoc} Discrepancies</span>
                        </span>
                      ) : doc.discrepancies.length > 0 ? (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          <span>{doc.discrepancies.length} minor variance</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>Clean Record</span>
                        </span>
                      )}

                      <span className={`font-semibold flex items-center gap-0.5 ${isSelected ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        <span>{isSelected ? 'Active' : 'Inspect'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        )}
      </div>

      {/* Success Notification Banner */}
      {actionSuccessToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessToast}</span>
          </div>
          <button 
            onClick={() => setActionSuccessToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* VIEW MODE 1: LIVE CAMERA SCANNER */}
      {currentMode === 'CAMERA' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Shutter Flash Animation */}
          {flashAnimation && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
          )}

          {/* Scanner Header Controls */}
          <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'HI' ? 'लाइव कैमरा स्कैनर (सक्रिय)' : 'Live Camera Viewfinder (Active)'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Target: {databaseRecord.surveyKhasraNo} ({databaseRecord.village})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleCameraFacing}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                title="Switch Camera (Front/Back)"
              >
                <RotateCw className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">{facingMode === 'environment' ? 'Rear Cam' : 'Front Cam'}</span>
              </button>

              <button
                onClick={() => {
                  stopCameraStream();
                  setCurrentMode('SIDE_BY_SIDE');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
              >
                {language === 'HI' ? 'रद्द करें' : 'Close Camera'}
              </button>
            </div>
          </div>

          {/* Camera Viewfinder Viewport */}
          <div className="relative aspect-video sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
            {cameraError ? (
              <div className="p-6 max-w-md text-center space-y-4 bg-slate-900/90 rounded-2xl border border-rose-800/50 m-4">
                <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white">Camera Access Notice</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{cameraError}</p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Retry Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                  >
                    Upload Document File
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Real Live Video Feed */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Document Alignment Frame / Targeting Reticle */}
                <div className="absolute inset-8 sm:inset-14 border-2 border-dashed border-teal-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  {/* Corner Guides */}
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl" />
                    <div className="w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr" />
                  </div>

                  {/* Center Guidance Tag */}
                  <div className="self-center bg-slate-950/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-teal-500/40 text-[11px] text-teal-300 font-medium flex items-center gap-1.5 shadow-lg">
                    <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                    <span>Align paper record (7/12, Khasra, or Map) within frame</span>
                  </div>

                  {/* Bottom Corners */}
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl" />
                    <div className="w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br" />
                  </div>
                </div>

                {/* Animated Horizontal Laser Scan Bar */}
                <div className="absolute left-8 right-8 sm:left-14 sm:right-14 h-0.5 bg-teal-400/80 shadow-[0_0_12px_#2dd4bf] animate-pulse pointer-events-none top-1/2" />
              </>
            )}

            {/* OCR Progress Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Digitizing Land Record</h3>
                  <p className="text-xs text-teal-300 font-mono">{scanProgressMsg}</p>
                </div>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 animate-pulse rounded-full w-3/4" />
                </div>
              </div>
            )}
          </div>

          {/* Camera Shutter Trigger Bar */}
          {!cameraError && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
              <button
                onClick={captureSnapshot}
                disabled={isScanning}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/40 text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                <span>{language === 'HI' ? 'दस्तावेज़ स्कैन करें (Capture)' : 'Capture & Verify Document'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: SIDE-BY-SIDE COMPARISON VIEW */}
      {currentMode === 'SIDE_BY_SIDE' && (
        <div className="space-y-6">
          {/* Consolidated Unified Statutory Alert & Reconciliation Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm ${
            criticalCount > 0
              ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
              : warningCount > 0
              ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
              : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                criticalCount > 0
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">
                    {criticalCount > 0
                      ? `${criticalCount} Critical Discrepancies Detected in ${activeDocument.surveyKhasraNo}`
                      : 'Land Record Reconciled with Minor Variances'}
                  </h3>

                  {/* Active Document Status Indicator & Quick Switcher */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setStatusMenuOpenDocId(statusMenuOpenDocId === 'banner-status' ? null : 'banner-status')}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-all shadow-sm ${getStatusBadgeDetails(activeDocument.verificationStatus).badgeClass} hover:opacity-90`}
                      title="Click to update verification status"
                    >
                      {getStatusBadgeDetails(activeDocument.verificationStatus).icon}
                      <span>Status: {getStatusBadgeDetails(activeDocument.verificationStatus).label}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {statusMenuOpenDocId === 'banner-status' && (
                      <div className="absolute left-0 mt-1 w-52 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-0.5 text-xs">
                        <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800">
                          Update Status ({activeDocument.surveyKhasraNo}):
                        </div>
                        <button
                          onClick={() => handleUpdateStatus(activeDocument.id, 'VERIFIED')}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <div>
                            <span className="font-bold block text-[11px]">Mark as Verified</span>
                            <span className="text-[9px] text-emerald-400/80">Reconciled with registry</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(activeDocument.id, 'NEEDS_MANUAL_REVIEW')}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 flex items-center gap-1.5 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <div>
                            <span className="font-bold block text-[11px]">Flag for Manual Review</span>
                            <span className="text-[9px] text-rose-400/80">Discrepancy / JMR flagged</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(activeDocument.id, 'PENDING')}
                          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-950/60 text-amber-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <div>
                            <span className="font-bold block text-[11px]">Mark as Pending</span>
                            <span className="text-[9px] text-amber-400/80">Awaiting field survey</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                    OCR Confidence: {(activeDocument.ocrConfidence * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {language === 'HI'
                    ? 'भौतिक राजस्व प्रति एवं डिजिटल डेटाबेस में भूमि माप (Dimensions) तथा सह-खातेदारों के नामों में अंतर पाया गया है। अधिग्रहण पंचाट (Sec 23) से पूर्व संयुक्त माप (JMR) आवश्यक है।'
                    : 'Physical revenue document diverges from portal records in total acreage (+0.17 Acres / +11.7%) and identifies unrecorded co-parceners. Under RFCTLARR 2013, unverified records will trigger Reference Court stays (Sec 64).'}
                </p>

                {/* Quick Inspection Layer Tabs inside the banner */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mr-1">
                    Inspection Layer:
                  </span>
                  
                  <button
                    onClick={() => handleSelectLayer('CROSS_REF')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      activeLayer === 'CROSS_REF'
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-teal-400" />
                    <span>1. Cross-Ref (Area & Owners)</span>
                  </button>

                  <button
                    onClick={() => handleSelectLayer('SMART_FLAGS')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      activeLayer === 'SMART_FLAGS'
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 text-cyan-300 hover:text-white border border-cyan-800/60'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>2. AI Flags ({activeDocument.smartFlags?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => handleSelectLayer('STAMP_SIGNATURE')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      activeLayer === 'STAMP_SIGNATURE'
                        ? 'bg-rose-500 text-white font-bold shadow-sm'
                        : 'bg-slate-900/80 text-rose-300 hover:text-white border border-rose-800/60'
                    }`}
                  >
                    <Stamp className="w-3 h-3 text-rose-400" />
                    <span>3. Stamps & Seals ({activeDocument.stampSignatureAudit?.overallStatus === 'CRITICAL_MISSING' ? 'Defect' : 'OK'})</span>
                  </button>

                  <button
                    onClick={() => handleSelectLayer('OCR_CORRECTION')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      activeLayer === 'OCR_CORRECTION'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 text-amber-300 hover:text-white border border-amber-800/60'
                    }`}
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>4. OCR Fixes</span>
                  </button>

                  <button
                    onClick={() => handleSelectLayer('ANNOTATION')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      activeLayer === 'ANNOTATION'
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Highlighter className="w-3 h-3 text-amber-400" />
                    <span>5. Markup ({activeDocumentAnnotations.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action to Log Requisition */}
            <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
              <button
                onClick={() => setShowJmrModal(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Requisition Order (JMR)</span>
              </button>

              <button
                onClick={() => handleLogIntervention(activeDocument.discrepancies[0])}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Log to Decision Queue</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Dual Viewport (Scanned Record vs Database Record) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: SCANNED DOCUMENT INSPECTOR */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col">
              {/* Left Column Header */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      {language === 'HI' ? 'स्कैन किया गया भौतिक दस्तावेज़' : 'Scanned Paper Land Record'}
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                      Physical Stamp Verified
                    </span>

                    {/* Status Badge & Dropdown in Inspector Header */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setStatusMenuOpenDocId(statusMenuOpenDocId === 'left-col-status' ? null : 'left-col-status')}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${getStatusBadgeDetails(activeDocument.verificationStatus).badgeClass}`}
                        title="Click to update document status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeDetails(activeDocument.verificationStatus).dotClass}`} />
                        <span>{getStatusBadgeDetails(activeDocument.verificationStatus).label}</span>
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                      </button>

                      {statusMenuOpenDocId === 'left-col-status' && (
                        <div className="absolute left-0 mt-1 w-48 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 space-y-0.5 text-xs">
                          <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800">
                            Change Status:
                          </div>
                          <button
                            onClick={() => handleUpdateStatus(activeDocument.id, 'VERIFIED')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-emerald-950/60 text-emerald-300 flex items-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-bold text-[11px]">Mark as Verified</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(activeDocument.id, 'NEEDS_MANUAL_REVIEW')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 flex items-center gap-1.5 transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="font-bold text-[11px]">Needs Manual Review</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(activeDocument.id, 'PENDING')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-950/60 text-amber-300 flex items-center gap-1.5 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-bold text-[11px]">Pending Verification</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-sm">
                    {activeDocument.documentTitle} • {activeDocument.issueDate}
                  </p>
                </div>

                {/* Clean Segmented Inspection Layer Bar */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {/* The 5 Layer Tabs */}
                  <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 gap-1">
                    <button
                      onClick={() => handleSelectLayer('CROSS_REF')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        activeLayer === 'CROSS_REF'
                          ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Cross-reference acreage, survey boundaries and recorded co-parceners against digital registry"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Cross-Ref</span>
                    </button>

                    <button
                      onClick={() => handleSelectLayer('SMART_FLAGS')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        activeLayer === 'SMART_FLAGS'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'text-cyan-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Inspect AI Vision flags for suspicious ink alteration, missing nodes, and dimension deviations"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Flags</span>
                      <span className={`text-[9px] px-1 rounded-full font-mono font-bold ${
                        activeLayer === 'SMART_FLAGS' ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-950 text-cyan-300'
                      }`}>
                        {activeDocument.smartFlags?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSelectLayer('STAMP_SIGNATURE')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        activeLayer === 'STAMP_SIGNATURE'
                          ? 'bg-rose-500 text-white font-bold shadow-sm'
                          : 'text-rose-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Inspect official Talathi seals, Revenue Court stamps, and gazetted officer signatures"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Stamps</span>
                      {activeDocument.stampSignatureAudit?.overallStatus === 'CRITICAL_MISSING' ? (
                        <span className="text-[9px] px-1 rounded-full bg-rose-950 text-rose-200 border border-rose-600 font-mono font-bold">
                          Defect
                        </span>
                      ) : (
                        <span className="text-[9px] px-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                          OK
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSelectLayer('OCR_CORRECTION')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        activeLayer === 'OCR_CORRECTION'
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-amber-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Manually correct low-confidence OCR text fields to establish statutory audit trail"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>OCR Fixes</span>
                      {isBelowThreshold && (
                        <span className="text-[9px] px-1 rounded-full bg-amber-950 text-amber-200 border border-amber-600 font-mono font-bold animate-pulse">
                          Req
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleSelectLayer('ANNOTATION')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                        activeLayer === 'ANNOTATION'
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'text-amber-200 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Add offline-persisted field highlights and sticky notes"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                      <span>Markup</span>
                      {activeDocumentAnnotations.length > 0 && (
                        <span className={`text-[9px] px-1 rounded-full font-mono font-bold ${
                          activeLayer === 'ANNOTATION' ? 'bg-slate-950 text-amber-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {activeDocumentAnnotations.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Show All Overlays Toggle */}
                  <button
                    onClick={() => {
                      const next = !showAllOverlays;
                      setShowAllOverlays(next);
                      if (next) {
                        setSmartFlaggingEnabled(true);
                        setStampDetectorEnabled(true);
                        setShowOcrBoxes(true);
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                      showAllOverlays
                        ? 'bg-slate-700 text-white border-slate-500'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                    title="Toggle simultaneous visibility of all layers"
                  >
                    All Overlays
                  </button>

                  {/* Filter selector */}
                  <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setImageFilter('NORMAL')}
                      className={`px-2 py-0.5 rounded text-[10px] ${imageFilter === 'NORMAL' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                    >
                      Std
                    </button>
                    <button
                      onClick={() => setImageFilter('BW_CONTRAST')}
                      className={`px-2 py-0.5 rounded text-[10px] ${imageFilter === 'BW_CONTRAST' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
                      title="High Contrast B&W for faint handwriting"
                    >
                      B&W
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-slate-950/80 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono px-1.5 text-slate-300">
                      {zoomLevel.toFixed(1)}x
                    </span>
                    <button
                      onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CONTEXTUAL SUB-BAR FOR ACTIVE LAYER */}
              {activeLayer === 'SMART_FLAGS' && (
                <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-800/40 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>AI Category:</span>
                    </span>

                    <button
                      onClick={() => setActiveSmartFlagCategory('ALL')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all ${
                        activeSmartFlagCategory === 'ALL'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      All ({activeDocument.smartFlags?.length || 0})
                    </button>

                    <button
                      onClick={() => setActiveSmartFlagCategory('SUSPICIOUS_INK')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1 transition-all ${
                        activeSmartFlagCategory === 'SUSPICIOUS_INK'
                          ? 'bg-rose-600 text-white font-bold shadow'
                          : 'bg-rose-950/50 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      <span>Suspicious Ink ({activeDocument.smartFlags?.filter(f => f.category === 'SUSPICIOUS_INK').length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveSmartFlagCategory('MISSING_SIGNATURE')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1 transition-all ${
                        activeSmartFlagCategory === 'MISSING_SIGNATURE'
                          ? 'bg-violet-600 text-white font-bold shadow'
                          : 'bg-violet-950/50 text-violet-300 hover:bg-violet-900/60 border border-violet-800/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span>Missing Signatures ({activeDocument.smartFlags?.filter(f => f.category === 'MISSING_SIGNATURE').length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveSmartFlagCategory('DIMENSION_DEVIATION')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1 transition-all ${
                        activeSmartFlagCategory === 'DIMENSION_DEVIATION'
                          ? 'bg-amber-600 text-slate-950 font-bold shadow'
                          : 'bg-amber-950/50 text-amber-300 hover:bg-amber-900/60 border border-amber-800/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Dimension Deviations ({activeDocument.smartFlags?.filter(f => f.category === 'DIMENSION_DEVIATION').length || 0})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunAiScan}
                      disabled={isAiScanning}
                      className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Sparkles className={`w-3 h-3 ${isAiScanning ? 'animate-spin' : ''}`} />
                      <span>{isAiScanning ? 'Neural Scan in Progress...' : 'Re-run AI Spectral Scan'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeLayer === 'STAMP_SIGNATURE' && (
                <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-800/40 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-rose-200 text-[11px]">
                    <Stamp className="w-3.5 h-3.5 text-rose-400" />
                    <span>
                      Audit Status: <strong>{activeDocument.stampSignatureAudit?.overallStatus === 'CRITICAL_MISSING' ? 'Critical Defect Detected' : 'All Required Stamps Present'}</strong>
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">
                      Found {activeDocument.stampSignatureAudit?.items.length || 0} statutory stamps & signatures
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunStampScan}
                      disabled={isStampScanning}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Stamp className={`w-3 h-3 ${isStampScanning ? 'animate-spin' : ''}`} />
                      <span>{isStampScanning ? 'Detecting...' : 'Scan Seals'}</span>
                    </button>
                    <button
                      onClick={() => setIsStampModalOpen(true)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700"
                    >
                      Full Stamp Report
                    </button>
                  </div>
                </div>
              )}

              {activeLayer === 'OCR_CORRECTION' && (
                <div className="px-4 py-2 bg-amber-950/40 border-b border-amber-800/40 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-3 text-amber-200 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Confidence Threshold:</span>
                      <input
                        type="range"
                        min="0.5"
                        max="0.95"
                        step="0.05"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                        className="w-20 accent-amber-500 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-white">
                        {(confidenceThreshold * 100).toFixed(0)}%
                      </span>
                    </div>

                    <span className="text-slate-400">|</span>
                    <span className="text-slate-300">
                      Corrected: <strong>{correctedFieldsCount}</strong> / {currentOcrFields.length} fields
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAuditDrawerOpen(true)}
                      className="px-2 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-600/50 text-[11px] font-medium transition-colors"
                    >
                      Audit Trail History
                    </button>
                    {correctedFieldsCount > 0 && (
                      <button
                        onClick={handleResetAllCorrections}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                      >
                        Reset Fixes
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeLayer === 'ANNOTATION' && (
                <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-700/40 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-amber-300 text-[11px]">
                    <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Local Officer Notes: <strong>{activeDocumentAnnotations.length}</strong> saved
                    </span>
                    {activeDocPendingCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono">
                        {activeDocPendingCount} pending cloud sync
                      </span>
                    )}
                    <span className="text-slate-400 hidden sm:inline">• Click document to highlight or add sticky notes</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSyncAnnotations}
                      disabled={isSyncingAnnotations}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Database className={`w-3 h-3 ${isSyncingAnnotations ? 'animate-spin' : ''}`} />
                      <span>{isSyncingAnnotations ? 'Syncing...' : 'Sync to Cloud Registry'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeLayer === 'CROSS_REF' && (
                <div className="px-4 py-2 bg-teal-950/40 border-b border-teal-800/40 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-teal-300 text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    <span>Click any field on the paper record to cross-examine against digital RoR entries on the right.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOcrBoxes(!showOcrBoxes)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                        showOcrBoxes ? 'bg-teal-600 text-white border-teal-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {showOcrBoxes ? 'Hide OCR Boxes' : 'Show OCR Boxes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Scanned Document Canvas / Visual Presentation */}
              <div className="p-4 flex-1 bg-slate-950 flex items-center justify-center min-h-[380px] overflow-auto relative select-none">
                {capturedPhotoUrl ? (
                  <div 
                    className="relative transition-all duration-200"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      filter: imageFilter === 'BW_CONTRAST' ? 'grayscale(100%) contrast(175%)' : imageFilter === 'INVERT' ? 'invert(100%)' : 'none'
                    }}
                  >
                    <img
                      src={capturedPhotoUrl}
                      alt="Scanned Document"
                      className="max-h-[360px] rounded-lg shadow-2xl border border-slate-700 object-contain"
                    />
                    <SmartFlaggingOverlay
                      flags={activeDocument.smartFlags || []}
                      enabled={smartFlaggingEnabled}
                      activeFilter={activeSmartFlagCategory}
                      selectedFlagId={selectedSmartFlagId}
                      onSelectFlag={setSelectedSmartFlagId}
                      onHighlightField={setHighlightedField}
                      onLogDecision={handleLogSmartFlagDecision}
                      onResolveFlag={handleResolveSmartFlag}
                      isAiScanning={isAiScanning}
                      language={language}
                    />
                    {activeDocument.stampSignatureAudit && (
                      <StampSignatureOverlay
                        audit={activeDocument.stampSignatureAudit}
                        enabled={stampDetectorEnabled}
                        selectedItemId={selectedStampItemId}
                        onSelectItem={setSelectedStampItemId}
                        onLogRequisition={handleLogStampRequisition}
                        isScanning={isStampScanning}
                        language={language}
                      />
                    )}
                    {/* Interactive Manual OCR Field Correction Overlay */}
                    <CorrectionModeOverlay
                      fields={currentOcrFields}
                      enabled={correctionMode}
                      confidenceThreshold={confidenceThreshold}
                      selectedFieldId={selectedOcrFieldId}
                      onSelectField={setSelectedOcrFieldId}
                      onOpenEditModal={(field) => setEditingOcrField(field)}
                      language={language}
                    />

                    {/* Offline Local Document Annotations & Highlighting Overlay */}
                    <DocumentAnnotationOverlay
                      document={activeDocument}
                      annotations={activeDocumentAnnotations}
                      isAnnotating={isAnnotationMode}
                      onToggleAnnotating={setIsAnnotationMode}
                      onSaveAnnotation={async (annot) => {
                        await saveAnnotToIdb(annot, 'CALA Verification Officer');
                      }}
                      onDeleteAnnotation={async (id) => {
                        await deleteAnnotFromIdb(id, 'CALA Verification Officer');
                      }}
                      onSyncAllAnnotations={syncIdbAnnotations}
                      officerRole="CALA Verification Officer"
                      officerName="Shri R. K. Sharma (SLAO)"
                    />
                  </div>
                ) : (
                  /* High-Fidelity Simulated Physical Revenue Document */
                  <div 
                    className={`w-full max-w-md p-5 rounded-lg border border-amber-800/40 shadow-2xl relative transition-all duration-200 ${
                      imageFilter === 'BW_CONTRAST'
                        ? 'bg-slate-200 text-slate-950 contrast-150'
                        : 'bg-[#fffbf0] text-[#1c1917]'
                    }`}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top center',
                      boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {/* Watermark / Seal */}
                    <div className="absolute right-4 top-4 border-2 border-emerald-800/60 rounded-full w-16 h-16 flex items-center justify-center text-[9px] font-serif uppercase text-emerald-800/70 rotate-12 pointer-events-none text-center font-bold">
                      REVENUE<br/>SEAL<br/>2026
                    </div>

                    {/* Official Document Header */}
                    <div className="text-center pb-3 border-b-2 border-stone-400/80 space-y-0.5">
                      <div className="text-[10px] font-serif font-bold uppercase tracking-wider text-stone-600">
                        Government of {activeDocument.state} • Revenue Department
                      </div>
                      <h4 className="text-sm font-serif font-black text-stone-900">
                        {activeDocument.documentTitleHindi}
                      </h4>
                      <div className="text-[10px] text-stone-600 font-mono">
                        {activeDocument.issuingOffice}
                      </div>
                    </div>

                    {/* Document Meta Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] py-2 border-b border-stone-300 font-serif">
                      <div><strong>Village:</strong> {activeDocument.village}</div>
                      <div><strong>Tehsil:</strong> {activeDocument.tehsil}</div>
                      <div><strong>District:</strong> {activeDocument.district}</div>
                      <div><strong>Date:</strong> {activeDocument.issueDate}</div>
                    </div>

                    {/* Core Scanned Attributes with OCR Bounding Boxes */}
                    <div className="py-3 space-y-3 font-serif text-xs">
                      {/* Survey / Gut Bounding Box */}
                      <div 
                        onClick={() => setHighlightedField('surveyNo')}
                        className={`p-1.5 rounded transition-all cursor-pointer ${
                          showOcrBoxes 
                            ? 'ring-2 ring-teal-600 bg-teal-500/10' 
                            : ''
                        } ${highlightedField === 'surveyNo' ? 'bg-amber-200 ring-4 ring-amber-500' : ''}`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-500 font-medium">Survey / Khasra / Gut No:</span>
                          <strong className="text-stone-950 font-bold text-sm">{activeDocument.surveyKhasraNo}</strong>
                        </div>
                        {showOcrBoxes && (
                          <div className="text-[9px] font-mono text-teal-800 font-semibold mt-0.5">
                            OCR Box [X:140, Y:82] • Match 98%
                          </div>
                        )}
                      </div>

                      {/* Land Extent / Dimension Bounding Box (Highlighted with red/amber for discrepancy) */}
                      <div 
                        onClick={() => setHighlightedField('totalAreaAcre')}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          showOcrBoxes 
                            ? 'border-rose-500 ring-2 ring-rose-400 bg-rose-500/10' 
                            : 'border-stone-300'
                        } ${highlightedField === 'totalAreaAcre' ? 'bg-rose-200 ring-4 ring-rose-500' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-stone-700 font-bold">Total Area / Extent:</span>
                          <div className="text-right">
                            <span className="text-sm font-black text-rose-800">
                              {activeDocument.totalAreaAcre} Acres
                            </span>
                            <span className="text-[10px] text-stone-600 block">
                              ({activeDocument.totalAreaHectare} Ha / {activeDocument.totalAreaGuntha || '-'} Gunthas)
                            </span>
                          </div>
                        </div>
                        {showOcrBoxes && (
                          <div className="text-[9px] font-mono text-rose-800 font-bold mt-1 flex items-center justify-between">
                            <span>OCR Box [Acreage Entry]</span>
                            <span className="bg-rose-200 text-rose-900 px-1 rounded">⚠️ +0.17 Acre Delta</span>
                          </div>
                        )}
                        {smartFlaggingEnabled && (
                          <div className="text-[9px] font-mono text-rose-700 font-bold mt-1 flex items-center justify-between bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              AI Flag: Suspicious Ink (Micro-Alteration)
                            </span>
                            <span className="text-rose-900 font-bold">96% Conf</span>
                          </div>
                        )}
                      </div>

                      {/* Boundary Dimensions Box */}
                      <div 
                        onClick={() => setHighlightedField('boundary')}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          showOcrBoxes 
                            ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-500/10' 
                            : 'border-stone-300'
                        } ${highlightedField === 'boundary' ? 'bg-amber-200 ring-4 ring-amber-500' : ''}`}
                      >
                        <div className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Cadastral Boundary Dimensions (Field Survey)
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
                          <div>North: <strong>{activeDocument.dimensions.northMeters}m</strong></div>
                          <div>South: <strong>{activeDocument.dimensions.southMeters}m</strong></div>
                          <div className="text-rose-700 font-bold">
                            East (RoW): <strong>{activeDocument.dimensions.eastMeters}m</strong>
                          </div>
                          <div>West: <strong>{activeDocument.dimensions.westMeters}m</strong></div>
                        </div>
                        <div className="text-[10px] text-stone-600 italic mt-1">
                          {activeDocument.dimensions.boundaryNotes}
                        </div>
                        {smartFlaggingEnabled && (
                          <div className="text-[9px] font-mono text-amber-800 font-bold mt-1 flex items-center justify-between bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              AI Flag: Dimension Deviation (+14.5m vs GIS Layer)
                            </span>
                            <span className="text-amber-900 font-bold">94% Conf</span>
                          </div>
                        )}
                      </div>

                      {/* Recorded Owners / Co-Parceners Box */}
                      <div 
                        onClick={() => setHighlightedField('owners')}
                        className={`p-2 rounded border transition-all cursor-pointer ${
                          showOcrBoxes 
                            ? 'border-rose-500 ring-2 ring-rose-400 bg-rose-500/10' 
                            : 'border-stone-300'
                        } ${highlightedField === 'owners' ? 'bg-rose-200 ring-4 ring-rose-500' : ''}`}
                      >
                        <div className="text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Khatedar / Recorded Owners (Paper)</span>
                          <span className="text-[9px] bg-rose-200 text-rose-900 px-1 rounded font-bold">2 Co-parceners</span>
                        </div>
                        <ul className="space-y-1 text-[11px]">
                          {activeDocument.owners.map((owner, i) => (
                            <li key={i} className="flex items-center justify-between">
                              <span className="font-semibold text-stone-900">• {owner.name}</span>
                              <span className="font-mono text-[10px] text-stone-600">({owner.sharePct}% share)</span>
                            </li>
                          ))}
                        </ul>
                        {smartFlaggingEnabled && (
                          <div className="text-[9px] font-mono text-cyan-800 font-bold mt-1 flex items-center justify-between bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                              AI Flag: Co-Parcener Omitted from DILRMP
                            </span>
                            <span className="text-cyan-900 font-bold">92% Conf</span>
                          </div>
                        )}
                      </div>

                      {/* Land Classification & Crop Box */}
                      <div className="p-2 rounded border border-stone-300 text-[11px]">
                        <div className="text-stone-500">Classification:</div>
                        <div className="font-bold text-stone-900">{activeDocument.landClassification}</div>
                        <div className="text-[10px] text-stone-600 mt-0.5">
                          Encumbrance: {activeDocument.encumbranceNotes}
                        </div>
                      </div>
                    </div>

                    {/* Official Signoff Footer */}
                    <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[9px] text-stone-500 font-serif">
                      <span>Digitized: LUME Cam OCR</span>
                      <span>Talathi Stamp: Verified</span>
                    </div>
                    {smartFlaggingEnabled && (
                      <div className="text-[9px] font-mono text-violet-800 font-bold mt-1 flex items-center justify-between bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/30">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          AI Flag: Missing Revenue Officer Signature Node
                        </span>
                        <span className="text-violet-900 font-bold">98% Conf</span>
                      </div>
                    )}

                    {/* AI Smart Flagging Visual Overlay */}
                    <SmartFlaggingOverlay
                      flags={activeDocument.smartFlags || []}
                      enabled={smartFlaggingEnabled}
                      activeFilter={activeSmartFlagCategory}
                      selectedFlagId={selectedSmartFlagId}
                      onSelectFlag={setSelectedSmartFlagId}
                      onHighlightField={setHighlightedField}
                      onLogDecision={handleLogSmartFlagDecision}
                      onResolveFlag={handleResolveSmartFlag}
                      isAiScanning={isAiScanning}
                      language={language}
                    />

                    {/* Automated Stamp & Signature Detector Overlay */}
                    {activeDocument.stampSignatureAudit && (
                      <StampSignatureOverlay
                        audit={activeDocument.stampSignatureAudit}
                        enabled={stampDetectorEnabled}
                        selectedItemId={selectedStampItemId}
                        onSelectItem={setSelectedStampItemId}
                        onLogRequisition={handleLogStampRequisition}
                        isScanning={isStampScanning}
                        language={language}
                      />
                    )}

                    {/* Interactive Manual OCR Field Correction Overlay */}
                    <CorrectionModeOverlay
                      fields={currentOcrFields}
                      enabled={correctionMode}
                      confidenceThreshold={confidenceThreshold}
                      selectedFieldId={selectedOcrFieldId}
                      onSelectField={setSelectedOcrFieldId}
                      onOpenEditModal={(field) => setEditingOcrField(field)}
                      language={language}
                    />

                    {/* Offline Local Document Annotations & Highlighting Overlay */}
                    <DocumentAnnotationOverlay
                      document={activeDocument}
                      annotations={activeDocumentAnnotations}
                      isAnnotating={isAnnotationMode}
                      onToggleAnnotating={setIsAnnotationMode}
                      onSaveAnnotation={async (annot) => {
                        await saveAnnotToIdb(annot, 'CALA Verification Officer');
                      }}
                      onDeleteAnnotation={async (id) => {
                        await deleteAnnotFromIdb(id, 'CALA Verification Officer');
                      }}
                      onSyncAllAnnotations={syncIdbAnnotations}
                      officerRole="CALA Verification Officer"
                      officerName="Shri R. K. Sharma (SLAO)"
                    />
                  </div>
                )}
              </div>

              {/* Automated Stamp & Signature Detector Summary Strip (Shown when STAMP_SIGNATURE layer or showAllOverlays) */}
              {(activeLayer === 'STAMP_SIGNATURE' || showAllOverlays) && activeDocument.stampSignatureAudit && (
                <StampSignatureSummaryBar
                  audit={activeDocument.stampSignatureAudit}
                  isScanning={isStampScanning}
                  onRunAuditScan={handleRunStampScan}
                  onOpenAuditModal={() => setIsStampModalOpen(true)}
                  language={language}
                />
              )}

              {/* AI Smart Flags Anomaly Summary Bar / Drawer (Shown when SMART_FLAGS layer or showAllOverlays) */}
              {(activeLayer === 'SMART_FLAGS' || showAllOverlays) && (activeDocument.smartFlags?.length || 0) > 0 && (
                <div className="bg-slate-900 border-t border-slate-800">
                  <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-bold text-white">
                        AI Smart Flagging Findings ({activeDocument.smartFlags?.length} Detected)
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
                        Click any anomaly card to inspect on document & cross-reference database
                      </span>
                    </div>
                    <button
                      onClick={() => setIsSmartFlagDrawerOpen(!isSmartFlagDrawerOpen)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <span>{isSmartFlagDrawerOpen ? 'Collapse Details' : 'Expand Details'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSmartFlagDrawerOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isSmartFlagDrawerOpen && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                      {(activeDocument.smartFlags || [])
                        .filter(f => activeSmartFlagCategory === 'ALL' || f.category === activeSmartFlagCategory)
                        .map((flag) => {
                          const isSelected = flag.id === selectedSmartFlagId;
                          const isResolved = flag.status === 'RESOLVED';
                          const categoryBadge = flag.category === 'SUSPICIOUS_INK'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-600'
                            : flag.category === 'MISSING_SIGNATURE'
                            ? 'bg-violet-950/80 text-violet-300 border-violet-600'
                            : flag.category === 'DIMENSION_DEVIATION'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                            : 'bg-cyan-950/80 text-cyan-300 border-cyan-600';

                          return (
                            <div
                              key={flag.id}
                              onClick={() => {
                                setSelectedSmartFlagId(isSelected ? null : flag.id);
                                if (flag.matchedDbField) setHighlightedField(flag.matchedDbField);
                              }}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-slate-800/95 border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg'
                                  : isResolved
                                  ? 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-100'
                                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold ${categoryBadge}`}>
                                  {flag.category.replace(/_/g, ' ')}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {Math.round(flag.confidenceScore * 100)}% Conf
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-[11px] truncate mb-0.5">
                                {flag.title}
                              </h5>
                              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                {flag.description}
                              </p>
                              {flag.varianceSummary && (
                                <div className="text-[10px] font-mono text-amber-300 mt-1">
                                  Delta: <strong>{flag.varianceSummary}</strong>
                                </div>
                              )}
                              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                                <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                                  {isSelected ? 'Viewing on Document' : 'Click to inspect'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLogSmartFlagDecision(flag);
                                  }}
                                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-0.5"
                                  title="Log formal requisition for this flag"
                                >
                                  <span>Requisition</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Local Document Annotations & Highlights Drawer / Bar (Shown when ANNOTATION layer or showAllOverlays) */}
              {(activeLayer === 'ANNOTATION' || showAllOverlays) && activeDocumentAnnotations.length > 0 && (
                <div className="bg-slate-900 border-t border-slate-800">
                  <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Highlighter className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        Local Highlights & Annotations ({activeDocumentAnnotations.length})
                      </span>
                      {activeDocPendingCount > 0 ? (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold flex items-center gap-1">
                          <CloudOff className="w-2.5 h-2.5 text-amber-400" />
                          <span>{activeDocPendingCount} Local Only</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>All Synced</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activeDocPendingCount > 0 && (
                        <button
                          onClick={handleSyncAnnotations}
                          disabled={isSyncingAnnotations}
                          className="text-[10px] px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm disabled:opacity-60"
                        >
                          <RefreshCw className={`w-2.5 h-2.5 ${isSyncingAnnotations ? 'animate-spin' : ''}`} />
                          <span>{isSyncingAnnotations ? 'Syncing...' : 'Sync to Portal'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsAnnotationDrawerOpen(!isAnnotationDrawerOpen)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isAnnotationDrawerOpen ? 'Collapse' : 'Expand'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAnnotationDrawerOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {isAnnotationDrawerOpen && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                      {activeDocumentAnnotations.map((annot) => {
                        const colorMap: Record<string, { border: string; badge: string; text: string }> = {
                          amber: { border: 'border-amber-500/50', badge: 'bg-amber-500/20 text-amber-300', text: 'text-amber-200' },
                          rose: { border: 'border-rose-500/50', badge: 'bg-rose-500/20 text-rose-300', text: 'text-rose-200' },
                          emerald: { border: 'border-emerald-500/50', badge: 'bg-emerald-500/20 text-emerald-300', text: 'text-emerald-200' },
                          cyan: { border: 'border-cyan-500/50', badge: 'bg-cyan-500/20 text-cyan-300', text: 'text-cyan-200' },
                          purple: { border: 'border-purple-500/50', badge: 'bg-purple-500/20 text-purple-300', text: 'text-purple-200' },
                        };
                        const colorStyle = colorMap[annot.color] || colorMap.amber;

                        return (
                          <div
                            key={annot.id}
                            className={`p-2.5 rounded-xl border text-xs bg-slate-950/80 ${colorStyle.border} space-y-1.5 transition-all`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold font-mono ${colorStyle.badge}`}>
                                  {annot.category}
                                </span>
                                <span className="font-semibold text-white truncate text-[11px]">
                                  {annot.title}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 shrink-0">
                                {annot.syncStatus === 'LOCAL_PENDING_SYNC' ? '⚡ Local' : '✓ Synced'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                              {annot.notes}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                              <span className="truncate max-w-[130px]">{annot.statutoryCitation || annot.authorOfficer}</span>
                              <button
                                onClick={async () => {
                                  await deleteAnnotFromIdb(annot.id, 'CALA Verification Officer');
                                }}
                                className="text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                                title="Delete annotation"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Inspector Footer Actions */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Click highlighted OCR boxes to inspect matched field
                </span>
                <button
                  onClick={startCamera}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg font-semibold flex items-center gap-1 border border-slate-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Rescan / Change Document</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: AUTHORITATIVE DATABASE RECORD (LUME LAND REGISTRY) */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col">
              {/* Right Column Header */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      {language === 'HI' ? 'अधिकृत डिजिटल डेटाबेस रिकॉर्ड (DILRMP)' : 'Authoritative Database Record'}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                      {databaseRecord.digitalRegistrySystem}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-sm">
                    ULPIN: <strong className="text-slate-200 font-mono">{databaseRecord.ulpin}</strong> • Synced: {new Date(databaseRecord.lastSynchronized).toLocaleDateString()}
                  </p>
                </div>

                {onOpenCitizenView && (
                  <button
                    onClick={() => onOpenCitizenView(databaseRecord.ulpin)}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>Jan-Seva Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Database Attributes Card */}
              <div className="p-5 flex-1 bg-slate-900/60 space-y-4 text-xs">
                {/* Status & Sync Provenance Banner */}
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Portal Sync Status</div>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Synchronized via National Land Records Modernisation</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Statutory Route</div>
                    <div className="font-mono text-xs text-white font-bold">{project.processRoute}</div>
                  </div>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <div className="text-slate-400 text-[11px]">Survey / Khasra Identifier</div>
                    <div className="text-base font-black text-white mt-1">
                      {databaseRecord.surveyKhasraNo}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      ULPIN: {databaseRecord.ulpin}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border transition-all ${
                    highlightedField === 'totalAreaAcre'
                      ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/50'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}>
                    <div className="text-slate-400 text-[11px] flex items-center justify-between">
                      <span>Digitized Land Area</span>
                      <span className="text-rose-400 text-[10px] font-bold">⚠️ Area Mismatch</span>
                    </div>
                    <div className="text-base font-black text-white mt-1">
                      {databaseRecord.totalAreaAcre} Acres
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {databaseRecord.totalAreaHectare} Ha ({databaseRecord.totalAreaGuntha} Gunthas)
                    </div>
                  </div>
                </div>

                {/* Database Boundary Dimension Grid */}
                <div className={`p-3 rounded-xl border transition-all ${
                  highlightedField === 'boundary'
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/50'
                    : 'bg-slate-800/60 border-slate-700'
                }`}>
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>GIS Cadastral Vector Polygon Extents</span>
                    <span className="text-[10px] text-amber-400 font-mono">DGPS Demarcated</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">North</div>
                      <div className="font-bold text-white mt-0.5">{databaseRecord.dimensions.northMeters}m</div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">South</div>
                      <div className="font-bold text-white mt-0.5">{databaseRecord.dimensions.southMeters}m</div>
                    </div>
                    <div className="p-2 bg-rose-950/40 rounded-lg border border-rose-700/60">
                      <div className="text-[10px] text-rose-300 font-bold">East (RoW)</div>
                      <div className="font-bold text-rose-200 mt-0.5">{databaseRecord.dimensions.eastMeters}m</div>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">West</div>
                      <div className="font-bold text-white mt-0.5">{databaseRecord.dimensions.westMeters}m</div>
                    </div>
                  </div>
                </div>

                {/* Database Ownership List */}
                <div className={`p-3 rounded-xl border transition-all ${
                  highlightedField === 'owners'
                    ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/50'
                    : 'bg-slate-800/60 border-slate-700'
                }`}>
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Recorded Title Holders in Portal</span>
                    <span className="text-[10px] text-rose-400 font-bold">Single Entry Only</span>
                  </div>
                  <div className="space-y-1 mt-2">
                    {databaseRecord.ownerNames.map((owner, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{owner}</span>
                        <span className="text-emerald-400 text-[10px] font-mono font-semibold">100% Sole Title</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Portal omits unpartitioned co-parcener Dattatray K. Jadhav.</span>
                  </div>
                </div>

                {/* Land Classification in Database */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-1">
                  <div className="text-slate-400 text-[11px]">Database Classification & Circle Rate</div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white">{databaseRecord.landClassification}</div>
                    <div className="font-mono text-emerald-400 font-bold">₹{databaseRecord.circleRatePerAcreLakh}L / Acre</div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Encumbrance: {databaseRecord.encumbranceNotes}
                  </div>
                </div>
              </div>

              {/* Right Column Footer */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Authorized by Tehsildar & Land Records Inspector
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  DILRMP-STATE-REG-9912
                </span>
              </div>
            </div>
          </div>

          {/* DETAILED SIDE-BY-SIDE DISCREPANCY MATRIX TABLE */}
          <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  {language === 'HI' ? 'विसंगति तुलना तालिका (Discrepancy Matrix)' : 'Side-by-Side Discrepancy Matrix & Statutory Legal Impact'}
                </h3>
                <p className="text-xs text-slate-400">
                  Field-by-field cross-referencing between scanned physical land record and digital database.
                </p>
              </div>

              {/* Discrepancy Filter Buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                {(['ALL', 'DIMENSION', 'OWNERSHIP', 'CRITICAL'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveDiscrepancyFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeDiscrepancyFilter === cat
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'All (5)' : cat === 'DIMENSION' ? 'Dimensions' : cat === 'OWNERSHIP' ? 'Ownership' : 'Critical Only'}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Field / Attribute</th>
                    <th className="py-2.5 px-3">Scanned Physical Record</th>
                    <th className="py-2.5 px-3">Database Record</th>
                    <th className="py-2.5 px-3">Detected Variance</th>
                    <th className="py-2.5 px-3">Statutory Risk Impact</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredDiscrepancies.map((item) => {
                    const isCritical = item.severity === 'CRITICAL';
                    const isWarning = item.severity === 'WARNING';
                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-slate-900/60 transition-colors ${
                          highlightedField === item.field ? 'bg-amber-500/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-white">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-teal-400'
                            }`} />
                            <span>{item.fieldLabel}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block ml-3.5">
                            Category: {item.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-amber-200">
                          {item.scannedValue}
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-300">
                          {item.databaseValue}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCritical 
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-700/60' 
                              : isWarning 
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-700/60'
                              : 'bg-teal-950/70 text-teal-300 border border-teal-700/60'
                          }`}>
                            {item.varianceDescription}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-300 max-w-xs text-[11px] leading-relaxed">
                          {item.statutoryRisk}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleLogIntervention(item)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors"
                          >
                            Order Rectification
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-400" />
                <span>Section 11(5) compliance: Resolving land record variances avoids average 180-day litigation delays.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Direct Status Action Button */}
                {activeDocument.verificationStatus !== 'VERIFIED' ? (
                  <button
                    onClick={() => handleUpdateStatus(activeDocument.id, 'VERIFIED')}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title="Mark document as verified and reconciled"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Mark as Verified</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(activeDocument.id, 'NEEDS_MANUAL_REVIEW')}
                    className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Re-open and flag for manual surveyor review"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Flag for Review</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadPdfReport}
                  disabled={isGeneratingPdf}
                  className="px-3.5 py-2 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer border border-teal-400/40"
                  title="Generate and download court-grade PDF verification and reconciliation report"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{language === 'HI' ? 'सांविधिक PDF रिपोर्ट डाउनलोड करें' : 'Download Statutory PDF Report'}</span>
                </button>

                <button
                  onClick={() => setShowJmrModal(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Draft Joint Measurement Order</span>
                </button>

                <button
                  onClick={() => setCurrentMode('CERTIFICATE_PREVIEW')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Audit Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FORMAL AUDIT & RECTIFICATION CERTIFICATE */}
      {currentMode === 'CERTIFICATE_PREVIEW' && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Government of India • Ministry of Rural Development
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Physical Land Record Verification & Discrepancy Audit Certificate
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdfReport}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer border border-teal-400/40"
                title="Download court-grade PDF audit memorandum with both records and discrepancy matrix"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <FileDown className="w-3.5 h-3.5 text-white" />
                )}
                <span>Download PDF Audit Report</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setCurrentMode('SIDE_BY_SIDE')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
              >
                Back to Comparison
              </button>
            </div>
          </div>

          {/* Certificate Printable Body */}
          <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-xl space-y-5 font-serif shadow-lg border border-slate-300 text-xs">
            {/* National Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Land Acquisition, Rehabilitation & Resettlement Authority (RFCTLARR Act 2013)
              </div>
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-950">
                OFFICIAL RECORD VERIFICATION & DISCREPANCY AUDIT MEMORANDUM
              </h2>
              <div className="text-[11px] text-slate-600 font-mono flex items-center justify-center gap-3">
                <span>Certificate ID: LUME/DOC-AUDIT/{activeDocument.surveyKhasraNo.replace(/\s+/g, '-')}/2026</span>
                <span>•</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider border ${
                  activeDocument.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : activeDocument.verificationStatus === 'NEEDS_MANUAL_REVIEW'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  Status: {activeDocument.verificationStatus === 'VERIFIED' ? 'VERIFIED' : activeDocument.verificationStatus === 'NEEDS_MANUAL_REVIEW' ? 'NEEDS MANUAL REVIEW' : 'PENDING'}
                </span>
              </div>
            </div>

            {/* Corridor & Parcel Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100 rounded border border-slate-300 text-[11px]">
              <div>
                <span className="text-slate-500 block">Project Code:</span>
                <strong className="text-slate-900 font-mono">{project.projectCode}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Survey / Gut No:</span>
                <strong className="text-slate-900 font-bold">{activeDocument.surveyKhasraNo}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Bhu-Aadhaar (ULPIN):</span>
                <strong className="text-slate-900 font-mono">{databaseRecord.ulpin}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Village & District:</span>
                <strong className="text-slate-900">{activeDocument.village}, {activeDocument.district}</strong>
              </div>
            </div>

            {/* Audit Findings Text */}
            <div className="space-y-2 leading-relaxed text-xs">
              <h4 className="font-sans font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                1. Executive Verification Summary
              </h4>
              <p>
                In compliance with Section 11(5) and Section 26 of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the physical land acquisition document ({activeDocument.documentTitle}, dated {activeDocument.issueDate}) was optically scanned and cross-referenced against the synchronized DILRMP digital database record.
              </p>
              <p className="font-medium text-rose-900 bg-rose-50 p-2.5 rounded border border-rose-200">
                Finding: A total of {activeDocument.discrepancies.length} discrepancies were identified, including an acreage variance of +0.17 Acres (+11.7%) and 1 unrecorded legal heir / co-parcener (Dattatray K. Jadhav).
              </p>
            </div>

            {/* Discrepancy Table */}
            <div className="space-y-2">
              <h4 className="font-sans font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                2. Side-by-Side Comparison Log
              </h4>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-300 p-1.5 text-left">Parameter</th>
                    <th className="border border-slate-300 p-1.5 text-left">Scanned Paper Record</th>
                    <th className="border border-slate-300 p-1.5 text-left">Database Portal Record</th>
                    <th className="border border-slate-300 p-1.5 text-left">Variance & Statutory Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDocument.discrepancies.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-1.5 font-bold">{d.fieldLabel}</td>
                      <td className="border border-slate-300 p-1.5 text-amber-900 font-medium">{d.scannedValue}</td>
                      <td className="border border-slate-300 p-1.5">{d.databaseValue}</td>
                      <td className="border border-slate-300 p-1.5 text-rose-900 font-medium">{d.varianceDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Directive / Order */}
            <div className="space-y-1.5">
              <h4 className="font-sans font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                3. Mandatory Statutory Directive
              </h4>
              <p className="text-[11px] text-slate-700">
                It is hereby ordered that a Joint Cadastral Measurement (JMR) squad comprising the District Land Acquisition Officer, Talathi, and DGPS Surveyors convene at {activeDocument.village} within 7 working days to resolve the boundary extent and issue an updated Section 11/19 corrigendum.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-8 flex items-end justify-between border-t border-slate-300 text-[11px]">
              <div>
                <div className="font-mono text-[9px] text-slate-500">SHA-256 CHECK: E3B0C44298FC1C149AFBF4C8996FB924</div>
                <div className="text-slate-600">Verified via LUME Decision Intelligence System</div>
              </div>
              <div className="text-right">
                <div className="h-10 border-b border-slate-400 w-48 mb-1"></div>
                <div className="font-bold text-slate-900">Competent Authority / CALA</div>
                <div className="text-[10px] text-slate-600">District Collectorate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOINT MEASUREMENT ORDER (JMR) MODAL */}
      {showJmrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Issue Joint Measurement Requisition (JMR)</span>
              </div>
              <button 
                onClick={() => setShowJmrModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Issue an official administrative requisition to the District Inspector of Land Records (DILR) and local Talathi to conduct an on-the-spot DGPS cadastral measurement.
              </p>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5 font-mono text-[11px]">
                <div>Target Parcel: <strong className="text-white">{activeDocument.surveyKhasraNo} ({activeDocument.village})</strong></div>
                <div>Acreage Discrepancy: <strong className="text-rose-400">+0.17 Acres</strong> (Paper: {activeDocument.totalAreaAcre} vs DB: {databaseRecord.totalAreaAcre})</div>
                <div>Unrecorded Heir: <strong className="text-amber-400">Dattatray Kisanrao Jadhav (50% share)</strong></div>
                <div>Target Resolution Date: <strong className="text-emerald-400">2026-09-26</strong></div>
              </div>

              <div className="p-2.5 bg-teal-950/40 rounded-lg border border-teal-700/50 text-teal-300 text-[11px]">
                This will automatically create an entry in the <strong>Priority Queue & Action Log</strong> and assign the DLAO field squad.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowJmrModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogIntervention();
                  setShowJmrModal(false);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Confirm & Dispatch Requisition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Stamp & Authorized Signatory Audit Sheet Modal */}
      {activeDocument.stampSignatureAudit && (
        <StampSignatureModal
          audit={activeDocument.stampSignatureAudit}
          isOpen={isStampModalOpen}
          onClose={() => setIsStampModalOpen(false)}
          documentTitle={activeDocument.documentTitle}
          language={language}
          onLogRequisition={handleLogStampRequisition}
        />
      )}

      {/* Manual OCR Field Correction Dialog Modal */}
      <CorrectionEditModal
        field={editingOcrField}
        isOpen={!!editingOcrField}
        onClose={() => setEditingOcrField(null)}
        onSaveCorrection={handleSaveFieldCorrection}
        onRevertCorrection={handleRevertFieldCorrection}
        language={language}
      />

      {/* Manual OCR Correction Audit History Drawer */}
      <CorrectionAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        corrections={activeDocument.correctionsHistory || []}
        documentTitle={activeDocument.documentTitle}
        onRevertCorrection={handleRevertFieldCorrection}
        language={language}
      />
    </div>
  );
};
