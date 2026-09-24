export type ProcessRoute = 'RFCTLARR_2013' | 'NH_ACT_SEC3' | 'STATE_SPECIFIC';

export type FactClassification = 'SOURCED' | 'COMPUTED';

export type FactReviewStatus = 'confirmed' | 'pending' | 'rejected';

export interface SourcedFactProvenance {
  classification: 'SOURCED';
  sourceName: string;
  sourceUrl: string;
  asOf: string;
  extractionMethod: string;
  confidence: number;
  reviewStatus: FactReviewStatus;
}

export interface ComputedFactProvenance {
  classification: 'COMPUTED';
  sourceName: string;
  asOf: string;
  inputFactIds: string[];
  formulaVersion: string;
  sampleSize?: number;
  reviewStatus: FactReviewStatus;
}

export type FactProvenance = SourcedFactProvenance | ComputedFactProvenance;

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
export type AppView = 'OFFICER' | 'CITIZEN' | 'GIS' | 'ANALYTICS' | 'TRUST_REGISTRY' | 'MODEL_EVALUATION' | 'MANAGEMENT_ATTENTION' | 'DATA';
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

// ============================================
// V7 UPGRADE TYPES - Real-Data & Production Evolution
// ============================================

export type DataSourceTier = 'A' | 'B' | 'C';
export type RefreshMode = 'DAILY' | 'EVENT_DRIVEN' | 'MANUAL' | 'SCHEDULED';
export type ReliabilityClass = 'VERIFIED_OPERATIONAL' | 'PUBLIC' | 'DEMO_SEED';
export type ConflictPolicy = 'SOURCE_OF_TRUTH_HIERARCHY' | 'LATEST_WINS' | 'MANUAL_REVIEW';
export type PrivacyClass = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';
export type PipelineStage = 
  | 'CONNECT' 
  | 'VALIDATE' 
  | 'NORMALIZE' 
  | 'RECONCILE' 
  | 'SNAPSHOT' 
  | 'ENRICH' 
  | 'SCORE' 
  | 'PUBLISH' 
  | 'ACTIVATE' 
  | 'LEARN';
export type PipelineStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface DataPassport {
  sourceIdentity: string;
  authority: string;
  schemaVersion: string;
  refreshMode: RefreshMode;
  coverage: string;
  freshness: string;
  reliabilityClass: ReliabilityClass;
  conflictPolicy: ConflictPolicy;
  privacyClass: PrivacyClass;
  effectiveTimeSupport: boolean;
  tier: DataSourceTier;
  lastIngestedAt: string;
  recordsProcessed: number;
  validationErrors: number;
}

export interface PipelineStep {
  stage: PipelineStage;
  status: PipelineStatus;
  startedAt?: string;
  completedAt?: string;
  recordsIn: number;
  recordsOut: number;
  errors: string[];
  warnings: string[];
}

export interface PipelineRun {
  id: string;
  projectId: string;
  sourceIdentity: string;
  steps: PipelineStep[];
  overallStatus: PipelineStatus;
  startedAt: string;
  completedAt?: string;
  trigger: 'SCHEDULED' | 'EVENT_DRIVEN' | 'MANUAL';
}

export interface TemporalSnapshot {
  id: string;
  projectId: string;
  effectiveAt: string;
  ingestedAt: string;
  projectState: LandAcquisitionProject;
  modelOutput: ProjectModelOutput;
  dataPassports: DataPassport[];
  triggerEvent?: string;
  actualOutcome?: {
    finalDelayMonths: number;
    finalOutcome: string;
    resolutionDate: string;
  };
}

export interface WhatChangedDiff {
  field: string;
  fieldLabel: string;
  previousValue: string | number | boolean;
  currentValue: string | number | boolean;
  changeType: 'INCREASE' | 'DECREASE' | 'STATE_CHANGE' | 'NEW_EVIDENCE' | 'EVIDENCE_IMPROVED' | 'EVIDENCE_DEGRADED';
  significance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  daysSinceLastReview: number;
  attributableFeatures?: string[];
}

export interface CasePulse {
  projectId: string;
  lastReviewedAt: string;
  lastReviewedBy: string;
  whatChanged: WhatChangedDiff[];
  riskTrajectory: Array<{ date: string; probability: number }>;
  evidenceHealthTrend: Array<{ date: string; health: EvidenceHealthState }>;
  materialEvents: Array<{
    id: string;
    timestamp: string;
    type: 'EVIDENCE_UPDATE' | 'DEPENDENCY_CHANGE' | 'STAGE_TRANSITION' | 'MILESTONE_UPDATE' | 'NEW_PRECEDENT' | 'EXTERNAL_SIGNAL';
    description: string;
    source: string;
    impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
}

export interface ActionQueueItem {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  authority: string;
  district: string;
  state: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'STANDARD';
  urgencyScore: number;
  criticalityScore: number;
  actionabilityScore: number;
  ipiScore: number;
  riskLevel: EvidenceHealthState;
  nextMilestone: string;
  daysToMilestone: number;
  topDriver: string;
  recommendedAction: string;
  actionCategory: DecisionLogEntry['category'];
  owner: string;
  ownerRole: string;
  dueDate: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  createdAt: string;
  lastUpdatedAt: string;
  escalationLevel: number;
}

export interface RiskTrajectoryPoint {
  date: string;
  delayProbability: number;
  predictedMissDays: number;
  evidenceHealth: EvidenceHealthState;
  modelCoverage: ProjectModelOutput['modelCoverage'];
}

export interface PortfolioHealthMetrics {
  totalProjects: number;
  criticalRiskCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  avgEvidenceHealth: EvidenceHealthState;
  dataFreshnessScore: number;
  modelCoverageScore: number;
  actionQueueBacklog: number;
  overdueActions: number;
  completedActionsThisWeek: number;
  medianWarningLeadTimeDays: number;
  precisionAtK: number;
  recallAtK: number;
}

export interface DataHealthScreen {
  sourceIdentity: string;
  tier: DataSourceTier;
  rowCount: number;
  missingFieldsPct: number;
  freshnessHours: number;
  routeCoverage: Record<string, number>;
  labelCoverage: number;
  lastSync: string;
  validationErrors: number;
  schemaVersion: string;
}

export interface ReplayState {
  projectId: string;
  snapshotId: string;
  effectiveAt: string;
  projectState: LandAcquisitionProject;
  modelOutput: ProjectModelOutput;
  dataPassports: DataPassport[];
  actualOutcome?: {
    finalDelayMonths: number;
    finalOutcome: string;
    resolutionDate: string;
  };
}

export type ActionPriorityType = 
  | 'DOCUMENTATION_GAP'
  | 'STALLED_DEPENDENCY'
  | 'UPCOMING_WINDOW'
  | 'DISPUTE_SIGNAL'
  | 'DATA_CONFLICT'
  | 'CRITICAL_PROJECT';

export interface InterventionPlaybook {
  priorityType: ActionPriorityType;
  trigger: string;
  suggestedFollowUp: string;
  expectedInfoValue: 'HIGH' | 'MEDIUM' | 'LOW';
  investigationSteps: string[];
  ownerRole: string;
  typicalResolutionDays: number;
  successCriteria: string;
}

// ============================================
// V8 UPGRADE TYPES - Real Data + Validation + Production Intelligence
// ============================================

export type DataMode = 'DEMO' | 'REAL_DATA';

export type SourceClassification = 'CONNECTED' | 'IMPORTED' | 'PUBLIC_REFERENCE' | 'DEMO';

export type AbstentionReason =
  | 'FEATURE_COVERAGE_LOW'
  | 'STAGE_UNSUPPORTED'
  | 'TRAINING_COVERAGE_POOR'
  | 'MISSING_CRITICAL_EVIDENCE'
  | 'OUT_OF_RANGE_SCENARIO'
  | 'EXCESSIVE_UNCERTAINTY'
  | 'INSUFFICIENT_DATA';

export interface ImportedDataset {
  id: string;
  name: string;
  filename: string;
  fileSize: number;
  fileType: 'CSV' | 'XLSX' | 'JSON';
  encoding: string;
  rowCount: number;
  columns: string[];
  importedAt: string;
  sourceClassification: SourceClassification;
  schemaVersion: string;
  validationStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'PARTIAL';
  columnMappings: DatasetColumnMapping[];
}

export interface DatasetColumnMapping {
  sourceColumn: string;
  lumeField: string;
  confidence: number;
  autoDetected: boolean;
  sampleValues: string[];
}

export interface DatasetValidationReport {
  datasetId: string;
  totalRecords: number;
  validRecords: number;
  incompleteRecords: number;
  rejectedRecords: number;
  duplicateGroups: number;
  dateInconsistencies: number;
  unknownStageLabels: number;
  missingCoordinates: number;
  invalidCoordinates: number;
  contradictoryStatuses: number;
  validationErrors: ValidationError[];
  validationTimestamp: string;
  coveragePct: number;
}

export interface ValidationError {
  recordIndex: number;
  field: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  currentValue: string;
}

export interface DataConflict {
  id: string;
  projectId: string;
  field: string;
  fieldLabel: string;
  sourceA: { value: string | number; source: string; timestamp: string };
  sourceB: { value: string | number; source: string; timestamp: string };
  resolution: 'SOURCE_PRIORITY' | 'LATEST_WINS' | 'MANUAL_REVIEW' | 'PENDING';
  selectedValue: string | number;
  reason: string;
  detectedAt: string;
  resolvedAt?: string;
  conflictType: 'STATUS' | 'DATE' | 'LOCATION' | 'DUPLICATE_ENTITY' | 'MISSING_SOURCE' | 'STALE_SOURCE' | 'CONTRADICTORY_STAGE' | 'IDENTITY_MISMATCH';
}

export interface MaterialChange {
  id: string;
  projectId: string;
  field: string;
  previousValue: string | number;
  currentValue: string | number;
  changeType: 'STAGE_TRANSITION' | 'NEW_DEPENDENCY' | 'DEPENDENCY_RESOLVED' | 'INACTIVITY' | 'COMPENSATION_CHANGE' | 'DISPUTE_CHANGE' | 'MILESTONE_APPROACHING' | 'MILESTONE_MISSED' | 'CRITICALITY_CHANGE' | 'EVIDENCE_STALE' | 'CONFLICT_RESOLVED';
  materialityScore: number;
  materialityLevel: 'INFORMATIONAL' | 'MATERIAL' | 'CRITICAL';
  detectedAt: string;
  affectedFeatures: string[];
  triggersRescore: boolean;
}

export interface PredictionEvaluation {
  predictionId: string;
  projectId: string;
  predictionTimestamp: string;
  snapshotId: string;
  modelVersion: string;
  predictedProbability: number;
  actualOutcome: boolean;
  predictedMissDays: number;
  actualMissDays: number;
  isCorrect: boolean;
  calibrationBin: number;
  featureSnapshot: Record<string, number>;
  sourceTimestamps: Record<string, string>;
}

export interface ModelEvaluationRun {
  id: string;
  runTimestamp: string;
  trainingPeriod: string;
  validationPeriod: string;
  holdoutPeriod: string;
  datasetSize: number;
  baselineAuc: number;
  baselineBrier: number;
  championAuc: number;
  championBrier: number;
  championPrAuc: number;
  calibrationError: number;
  precisionAtK: number;
  recallAtK: number;
  medianWarningLeadTimeDays: number;
  coveragePct: number;
  insufficientDataMetrics: string[];
}

export interface AttentionBudget {
  totalCases: number;
  selectedCases: number;
  budgetLimit: number;
  selectionMethod: 'IPI_TOP_N' | 'URGENCY_FIRST' | 'EVIDENCE_FIRST';
  excludedByConfidence: number;
  excludedByAbstention: number;
  includedAbstained: number;
}

export interface QueueExplanation {
  projectId: string;
  rank: number;
  ipiScore: number;
  contributions: {
    urgency: number;
    criticality: number;
    actionability: number;
    riskMovement: number;
  };
  primaryReason: string;
  secondaryReason: string;
  downstreamImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceQuality: EvidenceHealthState;
  confidenceNote?: string;
}

export interface OutcomeRecord {
  id: string;
  projectId: string;
  actionId: string;
  actionTaken: string;
  owner: string;
  startDate: string;
  expectedResult: string;
  actualResult: string;
  resolutionDate: string;
  outcomeStatus: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'PENDING';
  resolutionTimeDays: number;
  recordCreatedAt: string;
}

export interface InstitutionalMemory {
  id: string;
  signalType: string;
  predictionSnapshot: string;
  recommendation: string;
  humanAction: string;
  outcome: string;
  outcomeRecordId: string;
  projectId: string;
  interventionType: string;
  resolutionTimeDays: number;
  createdAt: string;
  reusableInsight: string;
}

export interface ManagementInsight {
  id: string;
  type: 'TOP_THREAT' | 'EMERGING_CLUSTER' | 'RISK_INCREASE' | 'MILESTONE_APPROACHING' | 'REPEATED_BOTTLENECK' | 'UNRESOLVED_HIGH_CRIT';
  title: string;
  description: string;
  affectedProjectIds: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  detectedAt: string;
  recommendedDiscussion: string;
}

export interface PortfolioHealthV8 extends PortfolioHealthMetrics {
  whyPortfolioAtRisk: Array<{ category: string; pct: number; projectCount: number }>;
  dataFreshnessPct: number;
  modelCoveragePct: number;
  evidenceHealthPct: number;
}

export interface DistrictIntelligence {
  district: string;
  state: string;
  projectCount: number;
  medianStageDuration: number;
  delayRate: number;
  highRiskPct: number;
  medianWarningLeadTime: number;
  recurringDependencies: string[];
  actionConversionRate: number;
  outcomeResolutionTime: number;
  bottleneckHotspot: string;
}

export interface CalibrationPoint {
  predictedBucket: string;
  predictedRange: number;
  observedRate: number;
  sampleSize: number;
  coveragePct: number;
}

export interface TemporalIntegrityCheck {
  snapshotId: string;
  projectId: string;
  featureEffectiveAt: string;
  predictionTimestamp: string;
  isCompliant: boolean;
  violatedFeatures?: string[];
}

export interface PerformanceMetrics {
  initialDashboardRender: number;
  projectRoomLoad: number;
  predictionCalculation: number;
  datasetImport: number;
  validationDuration: number;
  reconciliationDuration: number;
  precedentRetrieval: number;
  gisFiltering: number;
  actionQueueCalculation: number;
}
