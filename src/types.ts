export type ProcessRoute = 'RFCTLARR_2013' | 'NH_ACT_SEC3' | 'STATE_SPECIFIC';

export type EvidenceHealthState = 'GREEN' | 'AMBER' | 'RED';

export type ProjectCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';

export type StageType = 
  | 'SIA_APPRAISAL'          // Sec 4
  | 'SEC11_PRELIM_NOTICE'    // Sec 11 (12 month clock)
  | 'OBJECTIONS_HEARING'     // Sec 15
  | 'SEC19_DECLARATION'      // Sec 19
  | 'VALUATION_SEC26'        // Sec 26 fair compensation
  | 'AWARD_SEC23'            // Sec 23 award
  | 'PAYMENT_SEC38'          // Sec 38 compensation
  | 'POSSESSION_TAKEOVER';   // Final takeover

export interface ProjectDependency {
  id: string;
  type: 'FOREST_CLEARANCE' | 'GRAM_SABHA_CONSENT' | 'COMPENSATION_DISPUTE' | 'HIGH_COURT_STAY' | 'UTILITY_SHIFTING' | 'REVENUE_MUTATION';
  sourceSystem: 'PARIVESH' | 'LACRRIS' | 'NJDG' | 'BhoomiRashi' | 'DILRMP' | 'NGDRS';
  description: string;
  status: 'PENDING' | 'CRITICAL' | 'RESOLVED';
  daysPending: number;
  statutoryLimitDays?: number;
  ownerDepartment: string;
  downstreamImpact: string;
  actionable: boolean;
}

export interface ShapDriver {
  featureName: string;
  contribution: number; // positive = pushes risk higher, negative = reduces risk
  humanDescription: string;
  evidenceSource: 'LACRRIS' | 'NGDRS' | 'PARIVESH' | 'NJDG_eCourts' | 'BhoomiRashi' | 'Sentinel2_NDVI';
  evidenceField: string;
  freshness: string;
  reliability: 'HIGH' | 'MEDIUM' | 'CAUTION';
  observation: string;
}

export interface PrecedentCase {
  id: string;
  projectName: string;
  authority: string;
  stateDistrict: string;
  similarityScore: number;
  matchingFactors: string[];
  initialDelayMonths: number;
  finalOutcome: string;
  successfulIntervention: string;
  costImpactCr: number;
  resolvedYear: number;
  distanceKm: number;
}

export interface ScenarioInput {
  compensationMultiplier: number; // 1.0 = base circle rate, 1.4 = +40% towards Sec 26 fair market value
  additionalNOCResources: boolean; // Expedited forest/wildlife clearances
  specialGrievanceCamp: boolean;   // Village level lok adalat / mediation
  cropHarvestBufferDays: number;   // 0 to 60 days buffer
}

export interface ProjectModelOutput {
  delayProbability: number; // 0.00 to 1.00
  predictedMissDays: number;
  horizonDays: number;
  nextMilestoneName: string;
  targetDeadlineDate: string;
  evidenceHealth: EvidenceHealthState;
  evidenceHealthReason: string;
  modelCoverage: 'IN_DISTRIBUTION' | 'MARGINAL_SUPPORT' | 'OUT_OF_DISTRIBUTION';
  modelVersion: string;
  lastUpdated: string;
  shapDrivers: ShapDriver[];
}

export interface LandAcquisitionProject {
  id: string;
  projectCode: string;
  title: string;
  titleHindi?: string;
  authority: string; // e.g. NHAI, Dedicated Freight Corridor, Ministry of Railways, Solar Energy Corp
  state: string;
  district: string;
  tehsil: string;
  totalAreaHectares: number;
  affectedLandownersCount: number;
  processRoute: ProcessRoute;
  currentStage: StageType;
  currentStageLabel: string;
  currentStageElapsedDays: number;
  statutoryClockMaxDays: number; // e.g. 365 days for Sec 11, 336 days for NHAI Sec 3
  criticality: ProjectCriticality;
  estimatedBudgetCr: number;
  compensationDisbursedCr: number;
  multiCropIrrigatedExposure: boolean; // RFCTLARR Section 10 restriction
  multiCropConfidencePct: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  dependencies: ProjectDependency[];
  modelOutput: ProjectModelOutput;
  precedents: PrecedentCase[];
  recentAlerts: string[];
  compensationBasePerAcreLakh: number;
  compensationMarketPerAcreLakh: number;
}

export interface DecisionLogEntry {
  id: string;
  projectId: string;
  projectCode: string;
  officerName: string;
  officerRole: string;
  timestamp: string;
  actionTaken: string;
  category: 'COMPENSATION_REVISION' | 'SPECIAL_CAMP' | 'NOC_ESCALATION' | 'GRAM_SABHA_HEARING' | 'STATUS_REVIEW';
  targetDueDate: string;
  scenarioAssumptionsTested?: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  notes: string;
}

export interface CitizenParcelRecord {
  ulpin: string; // 14-digit Bhu-Aadhaar
  surveyKhasraNo: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  projectId: string;
  projectTitle: string;
  ownerNameMasked: string; // e.g. "R***** K****"
  landAreaAcre: number;
  landType: 'Single-crop Dryland' | 'Multi-crop Irrigated (Sec 10)' | 'Residential / Homestead' | 'Barren / Fallow';
  currentStageStatus: string;
  currentStageStatusHindi: string;
  statutoryNextStep: string;
  statutoryNextStepHindi: string;
  nextHearingOrDate: string;
  fairCompensationRangePerAcre: {
    minLakh: number;
    maxLakh: number;
    includesSolatium100Pct: boolean;
  };
  officialNotices: Array<{
    title: string;
    date: string;
    pdfUrl?: string;
    gazetteRef: string;
  }>;
}

export interface CitizenGrievance {
  id: string;
  ulpin: string;
  applicantName: string;
  contactNumber: string;
  village: string;
  issueCategory: 'COMPENSATION_DISPUTE' | 'BOUNDARY_ERROR' | 'UNRECORDED_TREE_WELL' | 'TENANT_RIGHTS' | 'HARVEST_DELAY';
  description: string;
  submittedAt: string;
  status: 'REGISTERED' | 'OFFICER_REVIEW' | 'HEARING_SCHEDULED';
  receiptNo: string;
}

export type DocumentType = 
  | 'SATBARA_7_12'          // Maharashtra 7/12 Land Record
  | 'KHASRA_KHATAUNI'       // UP / North India RoR
  | 'FORM_11_GAZETTE'       // RFCTLARR Sec 11 Notice
  | 'CADASTRAL_FMB'         // Field Measurement Book (South India)
  | 'JAMABANDI_PARCHA'      // Rajasthan / Punjab / Haryana
  | 'SALE_MUTATION_DEED';   // Registered conveyance deed

export interface DiscrepancyItem {
  id: string;
  field: string;
  fieldLabel: string;
  scannedValue: string | number;
  databaseValue: string | number;
  varianceDescription: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'MATCH';
  statutoryRisk: string;
  category: 'DIMENSION' | 'OWNERSHIP' | 'CLASSIFICATION' | 'ENCUMBRANCE' | 'AUTHORITY';
}

export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'NEEDS_MANUAL_REVIEW';

export type SmartFlagCategory = 
  | 'SUSPICIOUS_INK' 
  | 'MISSING_SIGNATURE' 
  | 'DIMENSION_DEVIATION' 
  | 'OWNERSHIP_MISMATCH' 
  | 'STAMP_ANOMALY';

export type SealSignatureType = 
  | 'GOVERNMENT_SEAL'
  | 'OFFICER_SIGNATURE'
  | 'CALA_ENDORSEMENT'
  | 'REVENUE_STAMP'
  | 'KHATEDAR_SIGNATURE';

export type SealSignatureStatus = 
  | 'DETECTED'
  | 'MISSING'
  | 'SMUDGED_DEFECTIVE'
  | 'SUSPICIOUS_UNAUTHORIZED';

export interface StampSignatureItem {
  id: string;
  type: SealSignatureType;
  label: string;
  labelHindi?: string;
  required: boolean;
  status: SealSignatureStatus;
  confidence: number; // 0.0 - 1.0 (e.g. 0.98)
  expectedZone: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  detectedLocation?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  details: string;
  signatoryDesignation?: string;
  statutoryRuleCitation: string;
  remedyAction: string;
}

export interface StampSignatureAudit {
  overallStatus: 'VALID' | 'CRITICAL_MISSING' | 'WARNING_DEFECTIVE';
  sealsExpected: number;
  sealsDetected: number;
  signaturesExpected: number;
  signaturesDetected: number;
  items: StampSignatureItem[];
  alertSummary?: string;
  lastAuditedTimestamp: string;
}

export interface SmartFlagAnnotation {
  id: string;
  category: SmartFlagCategory;
  title: string;
  titleHindi?: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  confidenceScore: number; // 0.0 to 1.0 (e.g. 0.94)
  boundingBox: {
    top: number;    // % from top (0-100)
    left: number;   // % from left (0-100)
    width: number;  // % width (0-100)
    height: number; // % height (0-100)
  };
  matchedDbField?: string;
  scannedValue?: string;
  databaseValue?: string;
  varianceSummary?: string;
  statutoryRule?: string;
  aiModelAnalysis: string;
  status?: 'FLAGGED' | 'RESOLVED' | 'DISMISSED';
}

export interface ScannedDocumentRecord {
  id: string;
  documentType: DocumentType;
  documentTitle: string;
  documentTitleHindi: string;
  issuingOffice: string;
  issueDate: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  surveyKhasraNo: string;
  ulpin?: string;
  projectId: string;
  verificationStatus?: DocumentVerificationStatus;
  owners: Array<{
    name: string;
    sharePct: number;
    relation?: string;
    isCoParcener?: boolean;
  }>;
  totalAreaAcre: number;
  totalAreaHectare: number;
  totalAreaGuntha?: number;
  dimensions: {
    northMeters: number;
    southMeters: number;
    eastMeters: number;
    westMeters: number;
    boundaryNotes?: string;
  };
  landClassification: string;
  encumbranceNotes: string;
  revenueStampVerified: boolean;
  ocrConfidence: number;
  imageThumbnailUrl?: string;
  discrepancies: DiscrepancyItem[];
  smartFlags?: SmartFlagAnnotation[];
  stampSignatureAudit?: StampSignatureAudit;
  ocrFields?: OcrFieldItem[];
  correctionsHistory?: OcrCorrectionLog[];
  localAnnotations?: LocalDocumentAnnotation[];
}

export type AnnotationColor = 'amber' | 'rose' | 'emerald' | 'cyan' | 'violet' | 'blue';

export type AnnotationCategory = 
  | 'BOUNDARY_VARIANCE' 
  | 'CO_PARCENER_DISPUTE' 
  | 'CIRCLE_RATE_MISMATCH' 
  | 'MISSING_SEAL_SIGNATURE' 
  | 'CORRIDOR_ENCROACHMENT' 
  | 'STATUTORY_DEFECT' 
  | 'FIELD_NOTE';

export interface LocalDocumentAnnotation {
  id: string;
  documentId: string;
  documentTitle?: string;
  surveyKhasraNo?: string;
  color: AnnotationColor;
  category: AnnotationCategory;
  title: string;
  notes: string;
  boundingBox: {
    top: number;    // % from top (0-100)
    left: number;   // % from left (0-100)
    width: number;  // % width (0-100)
    height: number; // % height (0-100)
  };
  authorOfficer: string;
  authorRole: string;
  statutoryCitation?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'LOCAL_PENDING_SYNC' | 'SYNCED';
  syncedAt?: string;
  isDeleted?: boolean;
}

export interface OcrFieldItem {
  id: string;
  fieldKey: string;
  label: string;
  labelHindi?: string;
  originalOcrValue: string;
  currentValue: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.88)
  boundingBox: {
    top: number;    // percentage from top (0-100)
    left: number;   // percentage from left (0-100)
    width: number;  // percentage width (0-100)
    height: number; // percentage height (0-100)
  };
  matchedDbField?: string;
  databaseValue?: string;
  isCorrected?: boolean;
  correctedBy?: string;
  correctedAt?: string;
  correctionReason?: string;
  valueType?: 'text' | 'number';
}

export interface OcrCorrectionLog {
  id: string;
  documentId: string;
  fieldId: string;
  fieldKey: string;
  fieldLabel: string;
  previousValue: string;
  newValue: string;
  reason: string;
  officerName: string;
  officerRole: string;
  timestamp: string;
}

export type AppTheme = 'dark' | 'light' | 'high-contrast';
export type AppFontSize = 'normal' | 'large' | 'extra-large';
export type AppView = 'OFFICER' | 'CITIZEN' | 'GIS' | 'ANALYTICS' | 'TRUST_REGISTRY';
export type UserRole = 'OFFICER' | 'CITIZEN' | 'GIS';

export type RBACRole = 
  | 'DISTRICT_OFFICER'       // What deserves attention today?
  | 'SENIOR_DEPARTMENTAL'    // Which projects threaten portfolio execution?
  | 'PMU_EXECUTION'          // Where can acquisition block the wider project?
  | 'LEGAL_GRIEVANCE'        // Where is dispute-related process risk emerging?
  | 'DATA_ADMIN'             // Can the intelligence be trusted and governed?
  | 'POLICY_ANALYST'         // Where are systemic bottlenecks repeating?
  | 'CITIZEN';               // What is the official status of the acquisition?

export interface IPIWeights {
  w1RiskMovement: number;   // default: 0.35
  w2Urgency: number;        // default: 0.30
  w3Criticality: number;    // default: 0.20
  w4Actionability: number;  // default: 0.15
  version: string;
}

export interface UserPreferences {
  theme: AppTheme;
  fontSize: AppFontSize;
  highContrast: boolean;
  language: 'EN' | 'HI';
  hasCompletedOnboarding: boolean;
  preferredRole: UserRole;
}

export interface SupportTicket {
  ticketId: string;
  category: 'CITIZEN_GRIEVANCE' | 'SYSTEM_BUG' | 'STATUTORY_QUERY' | 'VALUATION_DISPUTE' | 'TRAINING_REQUEST';
  subject: string;
  description: string;
  requesterName: string;
  requesterContact: string;
  requesterRole: 'Citizen' | 'Officer' | 'Planner' | 'Other';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  assignedOfficer?: string;
}
