import { ScannedDocumentRecord, OcrFieldItem } from '../types';

export interface DatabaseLandRecord {
  ulpin: string;
  surveyKhasraNo: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  projectId: string;
  ownerNames: string[];
  totalAreaAcre: number;
  totalAreaHectare: number;
  totalAreaGuntha?: number;
  dimensions: {
    northMeters: number;
    southMeters: number;
    eastMeters: number;
    westMeters: number;
  };
  landClassification: string;
  encumbranceNotes: string;
  digitalRegistrySystem: 'DILRMP-Bhoomi' | 'Mahabhulekh-EPC' | 'UP-Bhulekh' | 'ApnaKhata-Raj';
  lastSynchronized: string;
  status: 'VERIFIED' | 'UNDER_EVALUATION' | 'FLAGGED_FOR_RE_SURVEY' | 'LITIGATION_HOLD';
  circleRatePerAcreLakh: number;
}

export const MOCK_DATABASE_RECORDS: Record<string, DatabaseLandRecord> = {
  'proj-nh48-pune-satara': {
    ulpin: 'MH270412889201',
    surveyKhasraNo: 'Gut No. 418/2',
    village: 'Shirwal',
    tehsil: 'Khandala',
    district: 'Satara',
    state: 'Maharashtra',
    projectId: 'proj-nh48-pune-satara',
    ownerNames: ['Rameshwar Kisanrao Jadhav'],
    totalAreaAcre: 1.45,
    totalAreaHectare: 0.587,
    totalAreaGuntha: 58.7,
    dimensions: {
      northMeters: 109.5,
      southMeters: 108.0,
      eastMeters: 128.0,
      westMeters: 134.5
    },
    landClassification: 'Jirayat (Dry Crop / Unirrigated)',
    encumbranceNotes: 'Clean title; no active encumbrance in electronic DILRMP sync',
    digitalRegistrySystem: 'Mahabhulekh-EPC',
    lastSynchronized: '2026-09-04T08:30:00Z',
    status: 'UNDER_EVALUATION',
    circleRatePerAcreLakh: 22.0
  },
  'proj-dfc-eastern-hub': {
    ulpin: 'UP640822194301',
    surveyKhasraNo: 'Khasra No. 712/क',
    village: 'Taraura',
    tehsil: 'Sakaldiha',
    district: 'Chandauli',
    state: 'Uttar Pradesh',
    projectId: 'proj-dfc-eastern-hub',
    ownerNames: ['Shivnath P. Singh'],
    totalAreaAcre: 0.85,
    totalAreaHectare: 0.344,
    totalAreaGuntha: 34.4,
    dimensions: {
      northMeters: 74.0,
      southMeters: 73.5,
      eastMeters: 46.5,
      westMeters: 47.0
    },
    landClassification: 'Single-crop Dryland',
    encumbranceNotes: 'Single khata entry recorded in 2019 consolidation ledger',
    digitalRegistrySystem: 'UP-Bhulekh',
    lastSynchronized: '2026-09-02T14:15:00Z',
    status: 'UNDER_EVALUATION',
    circleRatePerAcreLakh: 16.5
  },
  'proj-bengaluru-metro-ph4': {
    ulpin: 'KA140192847102',
    surveyKhasraNo: 'Sy No. 104/P2',
    village: 'Boodihal',
    tehsil: 'Devanahalli',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    projectId: 'proj-bengaluru-metro-ph4',
    ownerNames: ['Anand M. Rao'],
    totalAreaAcre: 0.65,
    totalAreaHectare: 0.263,
    totalAreaGuntha: 26.0,
    dimensions: {
      northMeters: 62.0,
      southMeters: 61.5,
      eastMeters: 42.0,
      westMeters: 43.0
    },
    landClassification: 'Agricultural Dry (Kushki)',
    encumbranceNotes: 'No conversion recorded in 2023 survey database',
    digitalRegistrySystem: 'DILRMP-Bhoomi',
    lastSynchronized: '2026-09-01T11:00:00Z',
    status: 'VERIFIED',
    circleRatePerAcreLakh: 85.0
  },
  'proj-rajasthan-solar-park': {
    ulpin: 'RJ190342918840',
    surveyKhasraNo: 'Khasra 44/1',
    village: 'Bap',
    tehsil: 'Phalodi',
    district: 'Phalodi',
    state: 'Rajasthan',
    projectId: 'proj-rajasthan-solar-park',
    ownerNames: ['Mohan Ram Godara'],
    totalAreaAcre: 4.20,
    totalAreaHectare: 1.70,
    dimensions: {
      northMeters: 195.0,
      southMeters: 194.0,
      eastMeters: 88.0,
      westMeters: 87.5
    },
    landClassification: 'Barren / Fallow (Banjad)',
    encumbranceNotes: 'Gram Panchayat pasture buffer adjacent',
    digitalRegistrySystem: 'ApnaKhata-Raj',
    lastSynchronized: '2026-08-28T09:40:00Z',
    status: 'VERIFIED',
    circleRatePerAcreLakh: 6.0
  }
};

export const PRESET_SCANNED_DOCUMENTS: ScannedDocumentRecord[] = [
  {
    id: 'doc-scan-01',
    projectId: 'proj-nh48-pune-satara',
    documentType: 'SATBARA_7_12',
    documentTitle: 'Village Form VII-XII (7/12 Satbara Extract) - Revenue Record',
    documentTitleHindi: 'गांव नमुना ७/१२ (सातबारा उतारा) - अधिकार अभिलेख पत्रक',
    issuingOffice: 'Office of the Tehsildar & Talathi, Khandala, Dist. Satara',
    issueDate: '12 August 2026',
    village: 'Shirwal',
    tehsil: 'Khandala',
    district: 'Satara',
    state: 'Maharashtra',
    surveyKhasraNo: 'Gut No. 418/2',
    ulpin: 'MH270412889201',
    verificationStatus: 'NEEDS_MANUAL_REVIEW',
    owners: [
      { name: 'Rameshwar Kisanrao Jadhav', sharePct: 50, relation: 'Elder Brother / Co-parcener', isCoParcener: true },
      { name: 'Dattatray Kisanrao Jadhav', sharePct: 50, relation: 'Younger Brother / Co-parcener', isCoParcener: true }
    ],
    totalAreaAcre: 1.62,
    totalAreaHectare: 0.655,
    totalAreaGuntha: 65.5,
    dimensions: {
      northMeters: 110.0,
      southMeters: 108.5,
      eastMeters: 142.5,
      westMeters: 135.0,
      boundaryNotes: 'East boundary touches NH-48 existing median corridor; South boundary abuts canal distributor'
    },
    landClassification: 'Bagayat (Perennially Irrigated via Private Borewell & Well)',
    encumbranceNotes: 'Bojha Entry 1842: Bank of Maharashtra Shirwal Branch Agricultural Hypothecation ₹4.2 Lakhs',
    revenueStampVerified: true,
    ocrConfidence: 0.94,
    discrepancies: [
      {
        id: 'disc-01',
        field: 'totalAreaAcre',
        fieldLabel: 'Land Extent / Total Acreage',
        scannedValue: '1.62 Acres (65.5 Gunthas)',
        databaseValue: '1.45 Acres (58.7 Gunthas)',
        varianceDescription: '+0.17 Acres discrepancy (+11.7% variance between physical 7/12 extract and DILRMP digitized record)',
        severity: 'CRITICAL',
        statutoryRisk: 'Under-compensation payout risk under Section 23/26; high probability of Reference Court litigation (Sec 64 RFCTLARR) causing 180+ days delay.',
        category: 'DIMENSION'
      },
      {
        id: 'disc-02',
        field: 'eastBoundaryDimension',
        fieldLabel: 'East Boundary Dimension (Length)',
        scannedValue: '142.5 meters along NH corridor',
        databaseValue: '128.0 meters in GIS vector layer',
        varianceDescription: '14.5 meters dimensional discrepancy (+11.3%) along the direct Right-of-Way (RoW) acquisition alignment.',
        severity: 'CRITICAL',
        statutoryRisk: 'Encroachment claim or dispute during physical possession takeover (Sec 38). Demarcation pillar misalignment risk.',
        category: 'DIMENSION'
      },
      {
        id: 'disc-03',
        field: 'ownershipTitle',
        fieldLabel: 'Recorded Title Holders & Co-Parceners',
        scannedValue: 'Rameshwar K. Jadhav (50%) & Dattatray K. Jadhav (50% Co-parcener)',
        databaseValue: 'Rameshwar Kisanrao Jadhav (100% Sole Recorded)',
        varianceDescription: 'Dattatray Kisanrao Jadhav is missing from the digitized database record as legal heir/co-parcener.',
        severity: 'CRITICAL',
        statutoryRisk: 'Exclusion of co-owner violates statutory notice rules; will trigger High Court stay petition under Art. 226 or interim injunction.',
        category: 'OWNERSHIP'
      },
      {
        id: 'disc-04',
        field: 'landClassification',
        fieldLabel: 'Land Classification & Irrigation Status',
        scannedValue: 'Bagayat (Perennial Irrigated with Borewell)',
        databaseValue: 'Jirayat (Dry Crop / Unirrigated)',
        varianceDescription: 'Physical revenue record certifies active Bagayat irrigated status with perennial crop, but database is tagged Jirayat dry.',
        severity: 'WARNING',
        statutoryRisk: 'Significant compensation rate disparity: ₹34.5 Lakh/acre (Bagayat) vs ₹22.0 Lakh/acre (Jirayat base circle rate). Objections under Sec 15.',
        category: 'CLASSIFICATION'
      },
      {
        id: 'disc-05',
        field: 'encumbranceBojha',
        fieldLabel: 'Bank Hypothecation & Encumbrance',
        scannedValue: 'Bank of Maharashtra Bojha Entry #1842 (₹4.2 Lakh)',
        databaseValue: 'Clean Title (No active lien recorded)',
        varianceDescription: 'Active crop loan mortgage not reflected in portal ledger; bank lien must be settled from compensation escrow.',
        severity: 'INFO',
        statutoryRisk: 'Bank recovery notice may freeze direct benefit transfer (PFMS) account disbursement under Sec 38.',
        category: 'ENCUMBRANCE'
      }
    ],
    smartFlags: [
      {
        id: 'sf-01-ink',
        category: 'SUSPICIOUS_INK',
        title: 'Suspicious Ink Alteration on Area Numeral',
        titleHindi: 'क्षेत्रफल अंक पर संदिग्ध स्याही हेरफेर',
        description: 'Spectral micro-contrast detects secondary darker blue ballpoint ink overwritten atop original black ink numeral "1.45" altered to "1.62" Acres.',
        severity: 'CRITICAL',
        confidenceScore: 0.96,
        boundingBox: { top: 38, left: 52, width: 44, height: 10 },
        matchedDbField: 'totalAreaAcre',
        scannedValue: '1.62 Acres (65.5 Gunthas)',
        databaseValue: '1.45 Acres (58.7 Gunthas)',
        varianceSummary: '+0.17 Acre inflation via manual ink alteration',
        statutoryRule: 'Section 26 & Section 84 IPC / RFCTLARR 2013',
        aiModelAnalysis: 'Multi-spectral chromatic analysis detects two distinct ink formulations. Underlying stroke geometry conforms to "1.45" Guntha entry; superimposed stroke adds tail loop altering value to "1.62". Lacks mandated Revenue Officer cancellation initial.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-01-dim',
        category: 'DIMENSION_DEVIATION',
        title: 'East Boundary Dimension Deviation (+14.5m)',
        titleHindi: 'पूर्वी सीमा आयाम विचलन (+१४.५ मीटर)',
        description: 'Physical revenue sketch states 142.5m along highway corridor; GIS DILRMP vector layer measures 128.0m (+11.3% offset).',
        severity: 'CRITICAL',
        confidenceScore: 0.94,
        boundingBox: { top: 56, left: 48, width: 48, height: 9 },
        matchedDbField: 'eastBoundaryDimension',
        scannedValue: '142.5m (Highway RoW)',
        databaseValue: '128.0m (Cadastral GIS)',
        varianceSummary: '+14.5m boundary shift into proposed highway median',
        statutoryRule: 'Section 38 RFCTLARR 2013 (Cadastral Demarcation)',
        aiModelAnalysis: 'Geometric raster-vector registration confirms 14.5m lateral protrusion beyond Gazette Section 11 boundary line. High encroachment claim risk during physical corridor takeover.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-01-sig',
        category: 'MISSING_SIGNATURE',
        title: 'Missing Circle Officer Statutory Signature',
        titleHindi: 'मंडल अधिकारी के वैधानिक हस्ताक्षर अनुपस्थित',
        description: 'Statutory verification signature missing from official revenue signoff block; seal imprint present without countersigning officer token.',
        severity: 'WARNING',
        confidenceScore: 0.98,
        boundingBox: { top: 91, left: 45, width: 50, height: 7 },
        matchedDbField: 'issuingOffice',
        scannedValue: 'Unsigned Seal Block',
        databaseValue: 'Mandatory Signoff',
        varianceSummary: 'Unsigned statutory certification',
        statutoryRule: 'Maharashtra Land Revenue Code 1966 Sec 148 / Rule 29',
        aiModelAnalysis: 'Vision AI signature detector scanned 200dpi endorsement zone. Identified rubber stamp matrix but detected zero pen-stroke vector components. Document legally incomplete until signed by Talathi/Tehsildar.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-01-own',
        category: 'OWNERSHIP_MISMATCH',
        title: 'Co-Parcener Title Omission in Database',
        titleHindi: 'डिजिटल डेटाबेस में सह-हिस्सेदार का नाम छूटा',
        description: 'Dattatray Kisanrao Jadhav recorded as 50% co-parcener on physical extract but omitted entirely from digitized registry.',
        severity: 'CRITICAL',
        confidenceScore: 0.92,
        boundingBox: { top: 72, left: 6, width: 88, height: 11 },
        matchedDbField: 'ownershipTitle',
        scannedValue: '2 Co-parceners (Rameshwar & Dattatray)',
        databaseValue: 'Rameshwar K. Jadhav (100% Sole Recorded)',
        varianceSummary: 'Dattatray Jadhav omitted from electronic ledger',
        statutoryRule: 'RFCTLARR Section 15 & Section 23 Award Distribution',
        aiModelAnalysis: 'Cross-entity reconciliation flagged unmatched co-tenure name in column 4. Discrepancy threatens Section 64 reference litigation if co-owner is excluded from PFMS compensation.',
        status: 'FLAGGED'
      }
    ],
    stampSignatureAudit: {
      overallStatus: 'CRITICAL_MISSING',
      sealsExpected: 3,
      sealsDetected: 2,
      signaturesExpected: 2,
      signaturesDetected: 1,
      alertSummary: 'Critical statutory compliance failure: 1 Authorized Signatory Box (Circle Officer / Tehsildar) is completely missing from this 7/12 extract.',
      lastAuditedTimestamp: '2026-09-08T07:15:00Z',
      items: [
        {
          id: 'ssa-01-seal-talathi',
          type: 'GOVERNMENT_SEAL',
          label: 'Maharashtra State Revenue Round Emblem & Talathi Seal',
          labelHindi: 'महाराष्ट्र शासन महसूल गोल शिक्का व तलाठी मोहर',
          required: true,
          status: 'DETECTED',
          confidence: 0.98,
          expectedZone: { top: 4, left: 74, width: 22, height: 14 },
          detectedLocation: { top: 4.2, left: 74.5, width: 21.5, height: 13.8 },
          details: 'Official Maharashtra Revenue Department Ashoka Pillar Emblem Seal detected in upper right header with verified Talathi Khandala serial stamp.',
          signatoryDesignation: 'Office of the Talathi, Saza Shirwal',
          statutoryRuleCitation: 'Maharashtra Land Revenue Code 1966 Section 148',
          remedyAction: 'Seal authenticated; no action required.'
        },
        {
          id: 'ssa-01-seal-courtfee',
          type: 'REVENUE_STAMP',
          label: 'Statutory ₹10 Revenue Adhesive / Franking Stamp',
          labelHindi: 'वैधानिक ₹१० महसूल मुद्रांक',
          required: true,
          status: 'DETECTED',
          confidence: 0.96,
          expectedZone: { top: 4, left: 4, width: 18, height: 10 },
          detectedLocation: { top: 4.5, left: 4.1, width: 17.6, height: 9.8 },
          details: 'Non-judicial adhesive revenue stamp present with cancellation cross-mark.',
          signatoryDesignation: 'Treasury Officer / Sub-Treasury Khandala',
          statutoryRuleCitation: 'Bombay Stamp Act 1958 Section 17',
          remedyAction: 'Revenue stamp valid.'
        },
        {
          id: 'ssa-01-seal-dispatch',
          type: 'GOVERNMENT_SEAL',
          label: 'Tehsil Inward/Outward Dispatch Stamp',
          labelHindi: 'तहसील आवक/जावक नोंदणी शिक्का',
          required: false,
          status: 'SMUDGED_DEFECTIVE',
          confidence: 0.76,
          expectedZone: { top: 88, left: 4, width: 26, height: 9 },
          detectedLocation: { top: 88.1, left: 4.0, width: 25.8, height: 8.9 },
          details: 'Dispatch stamp date is smudged; dispatch ledger serial is partly illegible.',
          signatoryDesignation: 'Tehsil Dispatch Clerk',
          statutoryRuleCitation: 'Revenue Manual Volume II, Paras 45-48',
          remedyAction: 'Verify dispatch register serial 1842/2026 in physical Tehsil outward register.'
        },
        {
          id: 'ssa-01-sig-talathi',
          type: 'OFFICER_SIGNATURE',
          label: 'Talathi / Village Accountant Wet Signature',
          labelHindi: 'तलाठी / ग्राम लेखापाल स्वाक्षरी',
          required: true,
          status: 'DETECTED',
          confidence: 0.95,
          expectedZone: { top: 88, left: 32, width: 30, height: 9 },
          detectedLocation: { top: 88.4, left: 32.2, width: 29.5, height: 8.5 },
          details: 'Valid wet ink signature matching registered biometric exemplar of Talathi Shirwal Saza.',
          signatoryDesignation: 'Talathi (Grade-III Revenue Officer)',
          statutoryRuleCitation: 'MLR Record of Rights and Registers (Preparation and Maintenance) Rules 1971',
          remedyAction: 'Primary officer signature verified.'
        },
        {
          id: 'ssa-01-sig-circleofficer',
          type: 'OFFICER_SIGNATURE',
          label: 'Circle Officer / Tehsildar Authorized Signatory Box',
          labelHindi: 'मंडळ अधिकारी / तहसीलदार अधिकृत स्वाक्षरी कक्ष',
          required: true,
          status: 'MISSING',
          confidence: 0.99,
          expectedZone: { top: 88, left: 66, width: 32, height: 10 },
          details: 'CRITICAL DEFECT: Mandated Circle Officer / Tehsildar countersigning signatory box is completely blank. Document lacks statutory attestation required for compensation determination under RFCTLARR Section 23.',
          signatoryDesignation: 'Circle Officer / Naib Tehsildar, Shirwal Circle',
          statutoryRuleCitation: 'Maharashtra Land Revenue Code 1966 Section 150(4) & RFCTLARR 2013 Sec 23',
          remedyAction: 'Immediately issue statutory requisition to Tehsildar Khandala to summon Circle Officer for wet countersignature or requisition electronically signed digital 7/12 extract.'
        }
      ]
    }
  },
  {
    id: 'doc-scan-02',
    projectId: 'proj-dfc-eastern-hub',
    documentType: 'KHASRA_KHATAUNI',
    documentTitle: 'Khatauni Extract (UP Land Revenue Code Sec 31) - Jamabandi Parcha',
    documentTitleHindi: 'खतौनी नकल (उ.प्र. राजस्व संहिता २०१२) - अधिकार अभिलेख',
    issuingOffice: 'Office of Sub-Divisional Magistrate & Tehsildar Sakaldiha, Chandauli',
    issueDate: '24 July 2026',
    village: 'Taraura',
    tehsil: 'Sakaldiha',
    district: 'Chandauli',
    state: 'Uttar Pradesh',
    surveyKhasraNo: 'Khasra No. 712/क',
    ulpin: 'UP640822194301',
    verificationStatus: 'NEEDS_MANUAL_REVIEW',
    owners: [
      { name: 'Shivnath P. Singh', sharePct: 33.33, relation: 'Brother 1', isCoParcener: true },
      { name: 'Ramnath P. Singh', sharePct: 33.33, relation: 'Brother 2', isCoParcener: true },
      { name: 'Brijnath P. Singh', sharePct: 33.34, relation: 'Brother 3', isCoParcener: true }
    ],
    totalAreaAcre: 1.05,
    totalAreaHectare: 0.425,
    totalAreaGuntha: 42.5,
    dimensions: {
      northMeters: 78.5,
      southMeters: 77.0,
      eastMeters: 54.0,
      westMeters: 55.2,
      boundaryNotes: 'West side adjoins village irrigation minor canal; North abuts EDFC track boundary'
    },
    landClassification: 'Do-Fasli Irrigated (Tubewell Command)',
    encumbranceNotes: 'Joint ancestral holding; mutation order 104/2021 by Naib Tehsildar',
    revenueStampVerified: true,
    ocrConfidence: 0.91,
    discrepancies: [
      {
        id: 'disc-21',
        field: 'totalAreaAcre',
        fieldLabel: 'Land Extent / Total Acreage',
        scannedValue: '1.05 Acres (42.5 Bigha-fraction)',
        databaseValue: '0.85 Acres in UP-Bhulekh',
        varianceDescription: '+0.20 Acres discrepancy (+23.5% area delta between certified Khatauni and portal record)',
        severity: 'CRITICAL',
        statutoryRisk: 'Lapse of 12-Month Section 11 clock if joint measurement requisition is not issued prior to notification publication.',
        category: 'DIMENSION'
      },
      {
        id: 'disc-22',
        field: 'ownershipTitle',
        fieldLabel: 'Co-Tenure Holders in Joint Khata',
        scannedValue: 'Shivnath, Ramnath & Brijnath P. Singh (Equal 1/3rd)',
        databaseValue: 'Shivnath P. Singh (Sole Name Recorded)',
        varianceDescription: 'Ancestral joint khata has 3 surviving brothers entitled to individual apportionment and R&R rehabilitation benefits.',
        severity: 'CRITICAL',
        statutoryRisk: 'Mandatory Section 15 objection hearing dispute. Brothers can file writ challenging notification legality.',
        category: 'OWNERSHIP'
      },
      {
        id: 'disc-23',
        field: 'westBoundaryDimension',
        fieldLabel: 'Western Boundary Offset',
        scannedValue: '55.2 meters canal setback',
        databaseValue: '47.0 meters digitized boundary',
        varianceDescription: '8.2 meters dimensional offset overlapping irrigation department canal right-of-way.',
        severity: 'WARNING',
        statutoryRisk: 'Inter-departmental dispute between Irrigation Division and Railways on compensation title.',
        category: 'DIMENSION'
      }
    ],
    smartFlags: [
      {
        id: 'sf-02-ink',
        category: 'SUSPICIOUS_INK',
        title: 'Suspicious Chemical Ink Erasure / Smudge on Sub-Index',
        titleHindi: 'उप-खसरा सूचकांक पर संदिग्ध रासायनिक स्याही विलोपन',
        description: 'Spectral reflectance detects chemical washing/smudging around the Khasra subdivision sub-index "क", indicating overwritten parcel identifier.',
        severity: 'CRITICAL',
        confidenceScore: 0.95,
        boundingBox: { top: 29, left: 45, width: 45, height: 9 },
        matchedDbField: 'surveyKhasraNo',
        scannedValue: 'Khasra No. 712/क',
        databaseValue: 'Khasra No. 712',
        varianceSummary: 'Subdivision alphabet modified after consolidation',
        statutoryRule: 'UP Revenue Code 2006 Sec 31 (Falsification of RoR)',
        aiModelAnalysis: 'UV-fluorescence simulation shows dissolved ink solvent halos surrounding the suffix alphabet. Original revenue entry lacked sub-division letter "क". High probability of unpartitioned dispute.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-02-sig',
        category: 'MISSING_SIGNATURE',
        title: 'Missing Tehsildar Statutory Attestation Signature',
        titleHindi: 'तहसीलदार का अनिवार्य सत्यापन हस्ताक्षर गायब',
        description: 'Bottom right endorsement zone lacks mandatory Tehsildar signature; only computerized seal is stamped without personal initial.',
        severity: 'CRITICAL',
        confidenceScore: 0.97,
        boundingBox: { top: 91, left: 55, width: 40, height: 8 },
        matchedDbField: 'issuingOffice',
        scannedValue: 'Stamp Only (No Signature)',
        databaseValue: 'Mandatory Signoff',
        varianceSummary: 'Invalid certification under statutory revenue rules',
        statutoryRule: 'UP Revenue Code Rules 2016 Rule 28',
        aiModelAnalysis: 'Endorsement validator confirms absence of signing officer glyph. An un-countersigned Khatauni extract is inadmissible as sole proof of title in Section 23 award proceedings.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-02-dim',
        category: 'DIMENSION_DEVIATION',
        title: 'Western Boundary Dimension Offset (+8.2m)',
        titleHindi: 'पश्चिमी सीमा आयाम विचलन (+८.२ मीटर नहर बफर)',
        description: 'Scanned Jamabandi records 55.2m western canal setback; GIS vector boundary confirms 47.0m (+8.2m encroachment buffer).',
        severity: 'WARNING',
        confidenceScore: 0.91,
        boundingBox: { top: 58, left: 48, width: 46, height: 9 },
        matchedDbField: 'westBoundaryDimension',
        scannedValue: '55.2m (Physical Record)',
        databaseValue: '47.0m (GIS Layer)',
        varianceSummary: '8.2m overlap with Irrigation Department RoW',
        statutoryRule: 'Northern India Canal & Drainage Act 1873 / RFCTLARR Sec 11',
        aiModelAnalysis: 'Boundary dimension exceeds actual village abadi peg by 8.2 meters, intruding onto state irrigation feeder canal buffer.',
        status: 'FLAGGED'
      }
    ],
    stampSignatureAudit: {
      overallStatus: 'CRITICAL_MISSING',
      sealsExpected: 2,
      sealsDetected: 1,
      signaturesExpected: 2,
      signaturesDetected: 1,
      alertSummary: 'Critical statutory compliance failure: 1 Judicial Revenue Stamp & 1 Authorized Tehsildar Signatory Box missing.',
      lastAuditedTimestamp: '2026-09-08T07:18:00Z',
      items: [
        {
          id: 'ssa-02-seal-magisterial',
          type: 'GOVERNMENT_SEAL',
          label: 'Tehsil Sakaldiha Sub-Divisional Magisterial Wet Seal',
          labelHindi: 'तहसील सकलडीहा उप-विभागीय मजिस्ट्रेट मुहर',
          required: true,
          status: 'DETECTED',
          confidence: 0.97,
          expectedZone: { top: 4, left: 74, width: 22, height: 12 },
          detectedLocation: { top: 4.1, left: 74.2, width: 21.8, height: 11.9 },
          details: 'Official circular seal of Sakaldiha Tehsil detected with visible district coat of arms.',
          signatoryDesignation: 'Office of Sub-Divisional Officer / Tehsildar Sakaldiha',
          statutoryRuleCitation: 'UP Revenue Code 2006 Section 31',
          remedyAction: 'Seal detected and verified.'
        },
        {
          id: 'ssa-02-seal-courtfee',
          type: 'REVENUE_STAMP',
          label: 'Mandatory Court Fee / Judicial Revenue Stamp ₹10',
          labelHindi: 'अनिवार्य न्यायालय शुल्क / न्यायिक राजस्व टिकट ₹१०',
          required: true,
          status: 'MISSING',
          confidence: 0.99,
          expectedZone: { top: 4, left: 4, width: 20, height: 10 },
          details: 'CRITICAL: Mandatory Court Fee Stamp missing from upper left corner. Under UP Court Fees Act, an un-stamped certified extract is void ab initio in judicial and land acquisition proceedings.',
          signatoryDesignation: 'Treasury & Stamp Superintendent, Chandauli',
          statutoryRuleCitation: 'Court Fees Act 1870 Section 6 / UP Stamp Rules',
          remedyAction: 'Requisition certified copy from Tehsildar with Treasury e-Court fee receipt.'
        },
        {
          id: 'ssa-02-sig-lekhpal',
          type: 'OFFICER_SIGNATURE',
          label: 'Lekhpal / Revenue Inspector Verification Initial',
          labelHindi: 'लेखपाल / राजस्व निरीक्षक सत्यापन हस्ताक्षर',
          required: true,
          status: 'DETECTED',
          confidence: 0.94,
          expectedZone: { top: 89, left: 24, width: 28, height: 9 },
          detectedLocation: { top: 89.2, left: 24.3, width: 27.5, height: 8.8 },
          details: 'Lekhpal initial detected in field verification box.',
          signatoryDesignation: 'Lekhpal, Halka Taraura',
          statutoryRuleCitation: 'UP Land Records Manual Para 21',
          remedyAction: 'Lekhpal signature verified.'
        },
        {
          id: 'ssa-02-sig-tehsildar',
          type: 'OFFICER_SIGNATURE',
          label: 'Authorized Tehsildar Attestation Signatory Box',
          labelHindi: 'अधिकृत तहसीलदार सत्यापन स्वाक्षरी कक्ष',
          required: true,
          status: 'MISSING',
          confidence: 0.98,
          expectedZone: { top: 89, left: 58, width: 38, height: 10 },
          details: 'CRITICAL: The designated Tehsildar signatory box is completely blank without personal signature or digital cryptographic token. Inadmissible for Section 19 notification publication.',
          signatoryDesignation: 'Tehsildar / Sub-Divisional Magistrate, Sakaldiha',
          statutoryRuleCitation: 'UP Revenue Code Rules 2016 Rule 28 & RFCTLARR Sec 11',
          remedyAction: 'Do not publish Section 19 declaration until formal attestation by Tehsildar is uploaded.'
        }
      ]
    }
  },
  {
    id: 'doc-scan-03',
    projectId: 'proj-bengaluru-metro-ph4',
    documentType: 'CADASTRAL_FMB',
    documentTitle: 'Cadastral Field Measurement Book (FMB) - Tippani Extract',
    documentTitleHindi: 'कडस्ट्रल फील्ड मापन पुस्तिका (FMB) - भूमि रेखाचित्र',
    issuingOffice: 'Office of Assistant Director of Land Records (ADLR), Devanahalli',
    issueDate: '18 June 2026',
    village: 'Boodihal',
    tehsil: 'Devanahalli',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    surveyKhasraNo: 'Sy No. 104/P2',
    ulpin: 'KA140192847102',
    verificationStatus: 'PENDING',
    owners: [
      { name: 'Anand M. Rao', sharePct: 50, relation: 'Husband', isCoParcener: false },
      { name: 'Smt. Shanta M. Rao', sharePct: 50, relation: 'Wife', isCoParcener: false }
    ],
    totalAreaAcre: 0.78,
    totalAreaHectare: 0.315,
    totalAreaGuntha: 31.2,
    dimensions: {
      northMeters: 67.5,
      southMeters: 66.0,
      eastMeters: 47.0,
      westMeters: 46.5,
      boundaryNotes: 'East side abutting 80-ft proposed metro viaduct alignment road'
    },
    landClassification: 'Residential Homestead with Built RCC Structure',
    encumbranceNotes: 'KIADB Preliminary notification Section 28(1) published in Karnataka Gazette',
    revenueStampVerified: true,
    ocrConfidence: 0.96,
    discrepancies: [
      {
        id: 'disc-31',
        field: 'totalAreaAcre',
        fieldLabel: 'Land Area Extent',
        scannedValue: '0.78 Acres (31.2 Guntas)',
        databaseValue: '0.65 Acres (26 Guntas)',
        varianceDescription: '+0.13 Acres (+20.0% variance) in surveyed acquisition pocket.',
        severity: 'CRITICAL',
        statutoryRisk: 'Discrepancy in urban high-value land (₹85L/acre) equals ₹11.05 Lakh unassessed asset gap.',
        category: 'DIMENSION'
      },
      {
        id: 'disc-32',
        field: 'landClassification',
        fieldLabel: 'Land Use & Structure Valuation',
        scannedValue: 'Homestead with 1,200 sq.ft RCC Structure',
        databaseValue: 'Agricultural Dry (Vacant Land)',
        varianceDescription: 'Physical inspection verifies 2-storey residential home omitted from satellite cadastral layer.',
        severity: 'CRITICAL',
        statutoryRisk: 'Mandatory structural valuation under Section 29 RFCTLARR required; without structural award, demolition stay will be granted.',
        category: 'CLASSIFICATION'
      }
    ],
    smartFlags: [
      {
        id: 'sf-03-sig',
        category: 'MISSING_SIGNATURE',
        title: 'Missing ADLR Surveyor Field Signature',
        titleHindi: 'सहायक निदेशक भू-अभिलेख (ADLR) का सत्यापन हस्ताक्षर गायब',
        description: 'Tippani sketch requires surveyor physical counter-signature for corridor acquisition; only office dispatch seal is affixed.',
        severity: 'CRITICAL',
        confidenceScore: 0.99,
        boundingBox: { top: 91, left: 42, width: 52, height: 8 },
        matchedDbField: 'issuingOffice',
        scannedValue: 'Dispatch Seal Only',
        databaseValue: 'ADLR Officer Signoff',
        varianceSummary: 'Unsigned cadastral field sketch',
        statutoryRule: 'Karnataka Land Revenue Act 1964 Sec 108 / KIADB Act Sec 28',
        aiModelAnalysis: 'Official signature coordinates in right footer are completely blank. A field measurement sketch without surveyor certification cannot sustain Section 28(4) declaration.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-03-dim',
        category: 'DIMENSION_DEVIATION',
        title: 'High-Value Urban Acreage Deviation (+0.13 Acre)',
        titleHindi: 'शहरी उच्च मूल्य भूमि क्षेत्रफल विचलन (+०.१३ एकड़)',
        description: 'Cadastral FMB extract shows 0.78 Acres (31.2 Guntas); Bhoomi database registers 0.65 Acres (26 Guntas) creating ₹11.05 Lakh payout gap.',
        severity: 'CRITICAL',
        confidenceScore: 0.96,
        boundingBox: { top: 38, left: 52, width: 44, height: 10 },
        matchedDbField: 'totalAreaAcre',
        scannedValue: '0.78 Acres (31.2 Guntas)',
        databaseValue: '0.65 Acres (26 Guntas)',
        varianceSummary: '+20.0% area expansion in metro viaduct path',
        statutoryRule: 'Section 26 Fair Market Compensation Determination',
        aiModelAnalysis: 'Calculated polygon perimeter deviates from Bhoomi vector geometry by 13.5 sq. meters. High probability of reference litigation if un-reconciled.',
        status: 'FLAGGED'
      },
      {
        id: 'sf-03-ink',
        category: 'SUSPICIOUS_INK',
        title: 'Suspicious Margin Ink Note "RCC Structure Added"',
        titleHindi: 'संदिग्ध हाशिए की स्याही टिप्पणी "आरसीसी संरचना जोड़ी गई"',
        description: 'Handwritten notation in non-standard purple ink added along the margin without official date-stamp or initial.',
        severity: 'WARNING',
        confidenceScore: 0.89,
        boundingBox: { top: 82, left: 5, width: 90, height: 8 },
        matchedDbField: 'landClassification',
        scannedValue: 'Handwritten "RCC 1200 sq.ft"',
        databaseValue: 'Agricultural Dry',
        varianceSummary: 'Unverified structural endorsement on margin',
        statutoryRule: 'Section 29 RFCTLARR (Authorized Structural Evaluation)',
        aiModelAnalysis: 'Micro-pigment scan reveals dye-based fountain pen ink inconsistent with standard revenue ledger ballpoint inks. Requires physical verification by PWD valuer.',
        status: 'FLAGGED'
      }
    ],
    stampSignatureAudit: {
      overallStatus: 'CRITICAL_MISSING',
      sealsExpected: 2,
      sealsDetected: 1,
      signaturesExpected: 2,
      signaturesDetected: 0,
      alertSummary: 'Critical statutory compliance failure: 1 Government Seal & 2 Authorized Signatory Boxes (ADLR & Surveyor) are missing from the Cadastral FMB sketch.',
      lastAuditedTimestamp: '2026-09-08T07:20:00Z',
      items: [
        {
          id: 'ssa-03-seal-dispatch',
          type: 'GOVERNMENT_SEAL',
          label: 'ADLR Office Outward Dispatch Stamp',
          labelHindi: 'सहायक निदेशक भू-अभिलेख प्रेषण मोहर',
          required: true,
          status: 'DETECTED',
          confidence: 0.96,
          expectedZone: { top: 5, left: 72, width: 24, height: 12 },
          detectedLocation: { top: 5.2, left: 72.1, width: 23.8, height: 11.8 },
          details: 'ADLR Devanahalli outward dispatch seal present with dispatch number.',
          signatoryDesignation: 'ADLR Devanahalli Sub-Division',
          statutoryRuleCitation: 'Karnataka Land Revenue Rules 1966',
          remedyAction: 'Dispatch stamp confirmed.'
        },
        {
          id: 'ssa-03-seal-round',
          type: 'GOVERNMENT_SEAL',
          label: 'Taluk Revenue Office Round Magisterial Seal',
          labelHindi: 'तालुक महसूल कार्यालय गोल मुहर',
          required: true,
          status: 'MISSING',
          confidence: 0.98,
          expectedZone: { top: 5, left: 4, width: 22, height: 13 },
          details: 'CRITICAL: Devanahalli Taluk Revenue Office round wet seal is missing from the survey sketch margin.',
          signatoryDesignation: 'Office of Tahsildar, Devanahalli Taluk',
          statutoryRuleCitation: 'Karnataka Land Revenue Act 1964 Section 108',
          remedyAction: 'Requisition official stamped FMB from Taluk survey office.'
        },
        {
          id: 'ssa-03-sig-surveyor',
          type: 'OFFICER_SIGNATURE',
          label: 'Authorized Cadastral Surveyor Signatory Box',
          labelHindi: 'अधिकृत कडस्ट्रल सर्वेक्षक स्वाक्षरी कक्ष',
          required: true,
          status: 'MISSING',
          confidence: 0.99,
          expectedZone: { top: 89, left: 52, width: 44, height: 10 },
          details: 'CRITICAL: Cadastral surveyor signature block is blank. An uncertified survey sketch cannot be used for metro viaduct corridor acquisition under KIADB Section 28(4).',
          signatoryDesignation: 'Cadastral Surveyor (Dept of Survey, Settlement & Land Records)',
          statutoryRuleCitation: 'Karnataka Land Revenue Act 1964 Section 108 & KIADB Act Sec 28',
          remedyAction: 'Summon ADLR Surveyor to physically inspect and sign demarcation lines.'
        },
        {
          id: 'ssa-03-sig-adlr',
          type: 'CALA_ENDORSEMENT',
          label: 'Assistant Director of Land Records (ADLR) Counter-signatory Box',
          labelHindi: 'सहायक निदेशक भू-अभिलेख प्रति-स्वाक्षरी कक्ष',
          required: true,
          status: 'MISSING',
          confidence: 0.97,
          expectedZone: { top: 89, left: 6, width: 42, height: 10 },
          details: 'CRITICAL: Supervisory ADLR endorsement signature block is absent. Map lacks legal sanction.',
          signatoryDesignation: 'Assistant Director of Land Records (ADLR)',
          statutoryRuleCitation: 'Karnataka Land Revenue Rules Rule 43',
          remedyAction: 'Forward file to ADLR Devanahalli for formal counter-signature.'
        }
      ]
    }
  },
  {
    id: 'doc-scan-04',
    projectId: 'proj-rajasthan-solar-park',
    documentType: 'JAMABANDI_PARCHA',
    documentTitle: 'Jamabandi Nakal (Rajasthan Land Revenue Act 1956)',
    documentTitleHindi: 'जमाबंदी नकल (राजस्थान भू-राजस्व अधिनियम १९५६)',
    issuingOffice: 'Tehsil Office Phalodi, Jodhpur-Phalodi Division',
    issueDate: '02 May 2026',
    village: 'Bap',
    tehsil: 'Phalodi',
    district: 'Phalodi',
    state: 'Rajasthan',
    surveyKhasraNo: 'Khasra 44/1',
    ulpin: 'RJ190342918840',
    verificationStatus: 'VERIFIED',
    owners: [
      { name: 'Mohan Ram Godara', sharePct: 100, relation: 'Self / Khatedar' }
    ],
    totalAreaAcre: 4.65,
    totalAreaHectare: 1.88,
    dimensions: {
      northMeters: 204.0,
      southMeters: 202.0,
      eastMeters: 92.5,
      westMeters: 91.0,
      boundaryNotes: 'Bordered by transmission line right-of-way on Eastern corner'
    },
    landClassification: 'Barren Fallow with Solar Borewell Installation',
    encumbranceNotes: 'State Renewable Energy park corridor earmarking',
    revenueStampVerified: true,
    ocrConfidence: 0.93,
    discrepancies: [
      {
        id: 'disc-41',
        field: 'totalAreaAcre',
        fieldLabel: 'Land Area Extent',
        scannedValue: '4.65 Acres',
        databaseValue: '4.20 Acres',
        varianceDescription: '+0.45 Acres (+10.7% variance in desert boundary demarcation)',
        severity: 'WARNING',
        statutoryRisk: 'Sand dune shifting altered physical boundary stone markers. DGPS re-fixing needed.',
        category: 'DIMENSION'
      }
    ],
    smartFlags: [
      {
        id: 'sf-04-dim',
        category: 'DIMENSION_DEVIATION',
        title: 'Desert Boundary Shift Deviation (+0.45 Acre)',
        titleHindi: 'रेगिस्तानी सीमा स्थानांतरण विचलन (+०.४५ एकड़)',
        description: 'Physical stone boundary demarcates 4.65 Acres; ApnaKhata portal registers 4.20 Acres due to shifting sand dune perimeter.',
        severity: 'WARNING',
        confidenceScore: 0.92,
        boundingBox: { top: 38, left: 52, width: 44, height: 10 },
        matchedDbField: 'totalAreaAcre',
        scannedValue: '4.65 Acres',
        databaseValue: '4.20 Acres',
        varianceSummary: '+10.7% desert perimeter variance',
        statutoryRule: 'Rajasthan Land Revenue Act 1956 Sec 111',
        aiModelAnalysis: 'DGPS satellite baseline overlay confirms boundary stones moved 11.2m outward following 2024 desert windstorms. DGPS pillar recalibration recommended.',
        status: 'RESOLVED'
      },
      {
        id: 'sf-04-sig',
        category: 'MISSING_SIGNATURE',
        title: 'Missing Patwari Annual Fasli Verification Signature',
        titleHindi: 'पटवारी का वार्षिक फसली सत्यापन हस्ताक्षर अनुपस्थित',
        description: 'Annual verification signoff block for Fasli Year 1433 is blank without Patwari verification initial.',
        severity: 'INFO',
        confidenceScore: 0.88,
        boundingBox: { top: 91, left: 45, width: 50, height: 8 },
        matchedDbField: 'issuingOffice',
        scannedValue: 'Unsigned for Fasli 1433',
        databaseValue: 'Annual Signoff Required',
        varianceSummary: 'Fasli 1433 verification pending',
        statutoryRule: 'Rajasthan Land Records Rules 1957 Rule 14',
        aiModelAnalysis: 'Periodic annual inspection signature is pending. Non-critical as title is undisputed, but formal certification should be updated before disbursement.',
        status: 'FLAGGED'
      }
    ],
    stampSignatureAudit: {
      overallStatus: 'VALID',
      sealsExpected: 2,
      sealsDetected: 2,
      signaturesExpected: 2,
      signaturesDetected: 2,
      alertSummary: 'All critical government seals and authorized signatory boxes are verified and authenticated.',
      lastAuditedTimestamp: '2026-09-08T07:22:00Z',
      items: [
        {
          id: 'ssa-04-seal-tehsil',
          type: 'GOVERNMENT_SEAL',
          label: 'Tehsil Office Phalodi Round Wet Seal',
          labelHindi: 'तहसील कार्यालय फलौदी गोल मुहर',
          required: true,
          status: 'DETECTED',
          confidence: 0.97,
          expectedZone: { top: 5, left: 74, width: 22, height: 12 },
          detectedLocation: { top: 5.1, left: 74.3, width: 21.6, height: 11.9 },
          details: 'Authentic round seal of Phalodi Tehsil detected with clear Ashoka emblem.',
          signatoryDesignation: 'Office of Tehsildar, Phalodi',
          statutoryRuleCitation: 'Rajasthan Land Revenue Act 1956 Section 111',
          remedyAction: 'Seal valid.'
        },
        {
          id: 'ssa-04-seal-qr',
          type: 'GOVERNMENT_SEAL',
          label: 'e-Dharti Rajasthan DILRMP Verification QR Stamp',
          labelHindi: 'ई-धरती राजस्थान डिजिटल सत्यापन क्यूआर मुहर',
          required: true,
          status: 'DETECTED',
          confidence: 0.99,
          expectedZone: { top: 5, left: 4, width: 18, height: 11 },
          detectedLocation: { top: 5.3, left: 4.2, width: 17.5, height: 10.8 },
          details: 'Cryptographically signed QR code resolves to ApnaKhata government server.',
          signatoryDesignation: 'State Land Records Directorate, Rajasthan',
          statutoryRuleCitation: 'Rajasthan Land Records Rules 1957',
          remedyAction: 'Digital certificate authentic.'
        },
        {
          id: 'ssa-04-sig-girdawar',
          type: 'OFFICER_SIGNATURE',
          label: 'Authorized Land Records Inspector (Girdawar) Signature',
          labelHindi: 'अधिकृत गिरदावर / राजस्व निरीक्षक स्वाक्षरी',
          required: true,
          status: 'DETECTED',
          confidence: 0.96,
          expectedZone: { top: 89, left: 55, width: 40, height: 10 },
          detectedLocation: { top: 89.2, left: 55.4, width: 39.2, height: 9.8 },
          details: 'Girdawar pen stroke vectors authenticated with official stamp.',
          signatoryDesignation: 'Girdawar, Bap Revenue Circle',
          statutoryRuleCitation: 'Rajasthan Land Revenue Act 1956',
          remedyAction: 'Signature authenticated.'
        },
        {
          id: 'ssa-04-sig-patwari',
          type: 'OFFICER_SIGNATURE',
          label: 'Patwari Annual Fasli Verification Box',
          labelHindi: 'पटवारी वार्षिक फसली सत्यापन कक्ष',
          required: false,
          status: 'SMUDGED_DEFECTIVE',
          confidence: 0.88,
          expectedZone: { top: 89, left: 8, width: 38, height: 10 },
          detectedLocation: { top: 89.1, left: 8.3, width: 37.5, height: 9.6 },
          details: 'Annual Fasli inspection signature is faint/smudged but matches Patwari ledger entry.',
          signatoryDesignation: 'Patwari, Patwar Mandal Bap',
          statutoryRuleCitation: 'Rajasthan Land Records Rules 1957 Rule 14',
          remedyAction: 'Non-critical; primary title endorsement is complete.'
        }
      ]
    }
  }
];

export function getDefaultOcrFields(doc: ScannedDocumentRecord, db?: DatabaseLandRecord): OcrFieldItem[] {
  const isDoc1 = doc.id === 'doc-scan-01';
  const isDoc2 = doc.id === 'doc-scan-02';
  const isDoc3 = doc.id === 'doc-scan-03';

  return [
    {
      id: `${doc.id}-ocr-survey`,
      fieldKey: 'surveyKhasraNo',
      label: 'Survey / Khasra / Gut No.',
      labelHindi: 'खसरा / गट क्रमांक',
      originalOcrValue: doc.surveyKhasraNo,
      currentValue: doc.surveyKhasraNo,
      confidence: isDoc2 ? 0.88 : 0.98,
      boundingBox: { top: 22, left: 45, width: 50, height: 7 },
      matchedDbField: 'surveyKhasraNo',
      databaseValue: db?.surveyKhasraNo || doc.surveyKhasraNo
    },
    {
      id: `${doc.id}-ocr-area`,
      fieldKey: 'totalAreaAcre',
      label: 'Total Land Area (Acres)',
      labelHindi: 'कुल क्षेत्रफल (एकड़)',
      originalOcrValue: `${doc.totalAreaAcre} Acres`,
      currentValue: `${doc.totalAreaAcre} Acres`,
      confidence: isDoc1 ? 0.84 : isDoc3 ? 0.89 : 0.92,
      boundingBox: { top: 35, left: 45, width: 50, height: 9 },
      matchedDbField: 'totalAreaAcre',
      databaseValue: db ? `${db.totalAreaAcre} Acres` : `${doc.totalAreaAcre} Acres`
    },
    {
      id: `${doc.id}-ocr-east`,
      fieldKey: 'eastBoundaryDimension',
      label: 'East Boundary Dimension (RoW)',
      labelHindi: 'पूर्वी सीमा (RoW संरेखण)',
      originalOcrValue: `${doc.dimensions.eastMeters}m`,
      currentValue: `${doc.dimensions.eastMeters}m`,
      confidence: isDoc1 ? 0.86 : 0.94,
      boundingBox: { top: 51, left: 52, width: 44, height: 7 },
      matchedDbField: 'eastBoundaryDimension',
      databaseValue: db ? `${db.dimensions.eastMeters}m` : `${doc.dimensions.eastMeters}m`
    },
    {
      id: `${doc.id}-ocr-west`,
      fieldKey: 'westBoundaryDimension',
      label: 'West Boundary Dimension (m)',
      labelHindi: 'पश्चिमी सीमा (मीटर)',
      originalOcrValue: `${doc.dimensions.westMeters}m`,
      currentValue: `${doc.dimensions.westMeters}m`,
      confidence: isDoc2 ? 0.87 : 0.96,
      boundingBox: { top: 51, left: 6, width: 42, height: 7 },
      matchedDbField: 'westBoundaryDimension',
      databaseValue: db ? `${db.dimensions.westMeters}m` : `${doc.dimensions.westMeters}m`
    },
    {
      id: `${doc.id}-ocr-owners`,
      fieldKey: 'owners',
      label: 'Recorded Khatedars / Owners',
      labelHindi: 'खातेदार / सह-हिस्सेदार',
      originalOcrValue: doc.owners.map(o => `${o.name} (${o.sharePct}%)`).join(', '),
      currentValue: doc.owners.map(o => `${o.name} (${o.sharePct}%)`).join(', '),
      confidence: isDoc1 ? 0.88 : isDoc2 ? 0.89 : 0.95,
      boundingBox: { top: 67, left: 6, width: 88, height: 11 },
      matchedDbField: 'ownershipTitle',
      databaseValue: db ? db.ownerNames.join(', ') : doc.owners.map(o => o.name).join(', ')
    },
    {
      id: `${doc.id}-ocr-classification`,
      fieldKey: 'landClassification',
      label: 'Land Classification & Irrigation',
      labelHindi: 'भूमि वर्गीकरण व सिंचाई',
      originalOcrValue: doc.landClassification,
      currentValue: doc.landClassification,
      confidence: isDoc3 ? 0.89 : 0.93,
      boundingBox: { top: 79, left: 6, width: 88, height: 8 },
      matchedDbField: 'landClassification',
      databaseValue: db?.landClassification || doc.landClassification
    },
    {
      id: `${doc.id}-ocr-village`,
      fieldKey: 'village',
      label: 'Village (Mouje)',
      labelHindi: 'ग्राम',
      originalOcrValue: doc.village,
      currentValue: doc.village,
      confidence: 0.97,
      boundingBox: { top: 15, left: 6, width: 44, height: 6 },
      matchedDbField: 'village',
      databaseValue: db?.village || doc.village
    },
    {
      id: `${doc.id}-ocr-office`,
      fieldKey: 'issuingOffice',
      label: 'Issuing Revenue Office',
      labelHindi: 'जारीकर्ता राजस्व कार्यालय',
      originalOcrValue: doc.issuingOffice,
      currentValue: doc.issuingOffice,
      confidence: 0.94,
      boundingBox: { top: 8, left: 6, width: 88, height: 6 },
      matchedDbField: 'issuingOffice',
      databaseValue: doc.issuingOffice
    }
  ];
}

