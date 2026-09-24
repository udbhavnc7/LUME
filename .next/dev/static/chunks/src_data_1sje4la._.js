(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/data/documentVerificationData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_DATABASE_RECORDS",
    ()=>MOCK_DATABASE_RECORDS,
    "PRESET_SCANNED_DOCUMENTS",
    ()=>PRESET_SCANNED_DOCUMENTS,
    "getDefaultOcrFields",
    ()=>getDefaultOcrFields
]);
const MOCK_DATABASE_RECORDS = {
    'proj-nh48-pune-satara': {
        ulpin: 'MH270412889201',
        surveyKhasraNo: 'Gut No. 418/2',
        village: 'Shirwal',
        tehsil: 'Khandala',
        district: 'Satara',
        state: 'Maharashtra',
        projectId: 'proj-nh48-pune-satara',
        ownerNames: [
            'Rameshwar Kisanrao Jadhav'
        ],
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
        ownerNames: [
            'Shivnath P. Singh'
        ],
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
        ownerNames: [
            'Anand M. Rao'
        ],
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
        ownerNames: [
            'Mohan Ram Godara'
        ],
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
const PRESET_SCANNED_DOCUMENTS = [
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
            {
                name: 'Rameshwar Kisanrao Jadhav',
                sharePct: 50,
                relation: 'Elder Brother / Co-parcener',
                isCoParcener: true
            },
            {
                name: 'Dattatray Kisanrao Jadhav',
                sharePct: 50,
                relation: 'Younger Brother / Co-parcener',
                isCoParcener: true
            }
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
                boundingBox: {
                    top: 38,
                    left: 52,
                    width: 44,
                    height: 10
                },
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
                boundingBox: {
                    top: 56,
                    left: 48,
                    width: 48,
                    height: 9
                },
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
                boundingBox: {
                    top: 91,
                    left: 45,
                    width: 50,
                    height: 7
                },
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
                boundingBox: {
                    top: 72,
                    left: 6,
                    width: 88,
                    height: 11
                },
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
                    expectedZone: {
                        top: 4,
                        left: 74,
                        width: 22,
                        height: 14
                    },
                    detectedLocation: {
                        top: 4.2,
                        left: 74.5,
                        width: 21.5,
                        height: 13.8
                    },
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
                    expectedZone: {
                        top: 4,
                        left: 4,
                        width: 18,
                        height: 10
                    },
                    detectedLocation: {
                        top: 4.5,
                        left: 4.1,
                        width: 17.6,
                        height: 9.8
                    },
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
                    expectedZone: {
                        top: 88,
                        left: 4,
                        width: 26,
                        height: 9
                    },
                    detectedLocation: {
                        top: 88.1,
                        left: 4.0,
                        width: 25.8,
                        height: 8.9
                    },
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
                    expectedZone: {
                        top: 88,
                        left: 32,
                        width: 30,
                        height: 9
                    },
                    detectedLocation: {
                        top: 88.4,
                        left: 32.2,
                        width: 29.5,
                        height: 8.5
                    },
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
                    expectedZone: {
                        top: 88,
                        left: 66,
                        width: 32,
                        height: 10
                    },
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
            {
                name: 'Shivnath P. Singh',
                sharePct: 33.33,
                relation: 'Brother 1',
                isCoParcener: true
            },
            {
                name: 'Ramnath P. Singh',
                sharePct: 33.33,
                relation: 'Brother 2',
                isCoParcener: true
            },
            {
                name: 'Brijnath P. Singh',
                sharePct: 33.34,
                relation: 'Brother 3',
                isCoParcener: true
            }
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
                boundingBox: {
                    top: 29,
                    left: 45,
                    width: 45,
                    height: 9
                },
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
                boundingBox: {
                    top: 91,
                    left: 55,
                    width: 40,
                    height: 8
                },
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
                boundingBox: {
                    top: 58,
                    left: 48,
                    width: 46,
                    height: 9
                },
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
                    expectedZone: {
                        top: 4,
                        left: 74,
                        width: 22,
                        height: 12
                    },
                    detectedLocation: {
                        top: 4.1,
                        left: 74.2,
                        width: 21.8,
                        height: 11.9
                    },
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
                    expectedZone: {
                        top: 4,
                        left: 4,
                        width: 20,
                        height: 10
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 24,
                        width: 28,
                        height: 9
                    },
                    detectedLocation: {
                        top: 89.2,
                        left: 24.3,
                        width: 27.5,
                        height: 8.8
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 58,
                        width: 38,
                        height: 10
                    },
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
            {
                name: 'Anand M. Rao',
                sharePct: 50,
                relation: 'Husband',
                isCoParcener: false
            },
            {
                name: 'Smt. Shanta M. Rao',
                sharePct: 50,
                relation: 'Wife',
                isCoParcener: false
            }
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
                boundingBox: {
                    top: 91,
                    left: 42,
                    width: 52,
                    height: 8
                },
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
                boundingBox: {
                    top: 38,
                    left: 52,
                    width: 44,
                    height: 10
                },
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
                boundingBox: {
                    top: 82,
                    left: 5,
                    width: 90,
                    height: 8
                },
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
                    expectedZone: {
                        top: 5,
                        left: 72,
                        width: 24,
                        height: 12
                    },
                    detectedLocation: {
                        top: 5.2,
                        left: 72.1,
                        width: 23.8,
                        height: 11.8
                    },
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
                    expectedZone: {
                        top: 5,
                        left: 4,
                        width: 22,
                        height: 13
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 52,
                        width: 44,
                        height: 10
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 6,
                        width: 42,
                        height: 10
                    },
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
            {
                name: 'Mohan Ram Godara',
                sharePct: 100,
                relation: 'Self / Khatedar'
            }
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
                boundingBox: {
                    top: 38,
                    left: 52,
                    width: 44,
                    height: 10
                },
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
                boundingBox: {
                    top: 91,
                    left: 45,
                    width: 50,
                    height: 8
                },
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
                    expectedZone: {
                        top: 5,
                        left: 74,
                        width: 22,
                        height: 12
                    },
                    detectedLocation: {
                        top: 5.1,
                        left: 74.3,
                        width: 21.6,
                        height: 11.9
                    },
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
                    expectedZone: {
                        top: 5,
                        left: 4,
                        width: 18,
                        height: 11
                    },
                    detectedLocation: {
                        top: 5.3,
                        left: 4.2,
                        width: 17.5,
                        height: 10.8
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 55,
                        width: 40,
                        height: 10
                    },
                    detectedLocation: {
                        top: 89.2,
                        left: 55.4,
                        width: 39.2,
                        height: 9.8
                    },
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
                    expectedZone: {
                        top: 89,
                        left: 8,
                        width: 38,
                        height: 10
                    },
                    detectedLocation: {
                        top: 89.1,
                        left: 8.3,
                        width: 37.5,
                        height: 9.6
                    },
                    details: 'Annual Fasli inspection signature is faint/smudged but matches Patwari ledger entry.',
                    signatoryDesignation: 'Patwari, Patwar Mandal Bap',
                    statutoryRuleCitation: 'Rajasthan Land Records Rules 1957 Rule 14',
                    remedyAction: 'Non-critical; primary title endorsement is complete.'
                }
            ]
        }
    }
];
function getDefaultOcrFields(doc, db) {
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
            boundingBox: {
                top: 22,
                left: 45,
                width: 50,
                height: 7
            },
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
            boundingBox: {
                top: 35,
                left: 45,
                width: 50,
                height: 9
            },
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
            boundingBox: {
                top: 51,
                left: 52,
                width: 44,
                height: 7
            },
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
            boundingBox: {
                top: 51,
                left: 6,
                width: 42,
                height: 7
            },
            matchedDbField: 'westBoundaryDimension',
            databaseValue: db ? `${db.dimensions.westMeters}m` : `${doc.dimensions.westMeters}m`
        },
        {
            id: `${doc.id}-ocr-owners`,
            fieldKey: 'owners',
            label: 'Recorded Khatedars / Owners',
            labelHindi: 'खातेदार / सह-हिस्सेदार',
            originalOcrValue: doc.owners.map((o)=>`${o.name} (${o.sharePct}%)`).join(', '),
            currentValue: doc.owners.map((o)=>`${o.name} (${o.sharePct}%)`).join(', '),
            confidence: isDoc1 ? 0.88 : isDoc2 ? 0.89 : 0.95,
            boundingBox: {
                top: 67,
                left: 6,
                width: 88,
                height: 11
            },
            matchedDbField: 'ownershipTitle',
            databaseValue: db ? db.ownerNames.join(', ') : doc.owners.map((o)=>o.name).join(', ')
        },
        {
            id: `${doc.id}-ocr-classification`,
            fieldKey: 'landClassification',
            label: 'Land Classification & Irrigation',
            labelHindi: 'भूमि वर्गीकरण व सिंचाई',
            originalOcrValue: doc.landClassification,
            currentValue: doc.landClassification,
            confidence: isDoc3 ? 0.89 : 0.93,
            boundingBox: {
                top: 79,
                left: 6,
                width: 88,
                height: 8
            },
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
            boundingBox: {
                top: 15,
                left: 6,
                width: 44,
                height: 6
            },
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
            boundingBox: {
                top: 8,
                left: 6,
                width: 88,
                height: 6
            },
            matchedDbField: 'issuingOffice',
            databaseValue: doc.issuingOffice
        }
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/mockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_CITIZEN_PARCELS",
    ()=>MOCK_CITIZEN_PARCELS,
    "MOCK_DECISION_LOGS",
    ()=>MOCK_DECISION_LOGS,
    "MOCK_PROJECTS",
    ()=>MOCK_PROJECTS
]);
const MOCK_PROJECTS = [
    {
        id: 'proj-nh48-pune-satara',
        projectCode: 'NHAI/MH/2025/NH48-EXP-04',
        title: 'NH-48 Pune-Satara 8-Laning Corridor Extension',
        titleHindi: 'राष्ट्रीय राजमार्ग 48 पुणे-सतारा 8-लेन विस्तार गलियारा',
        authority: 'NHAI (National Highways Authority of India)',
        state: 'Maharashtra',
        district: 'Satara',
        tehsil: 'Khandala & Wai',
        totalAreaHectares: 184.6,
        affectedLandownersCount: 612,
        processRoute: 'NH_ACT_SEC3',
        currentStage: 'VALUATION_SEC26',
        currentStageLabel: 'Sec 3G Award & Fair Valuation (Sec 26)',
        currentStageElapsedDays: 284,
        statutoryClockMaxDays: 336,
        criticality: 'CRITICAL',
        estimatedBudgetCr: 1420.0,
        compensationDisbursedCr: 380.5,
        multiCropIrrigatedExposure: true,
        multiCropConfidencePct: 91,
        coordinates: {
            lat: 18.045,
            lng: 74.021
        },
        recentAlerts: [
            'Statutory 336-day NHAI clock expires in 52 days.',
            '38% compensation gap between initial registrar rate and top-50% deed average (Sec 26 formula).'
        ],
        compensationBasePerAcreLakh: 22.0,
        compensationMarketPerAcreLakh: 34.5,
        dependencies: [
            {
                id: 'dep-101',
                type: 'COMPENSATION_DISPUTE',
                sourceSystem: 'NGDRS',
                description: 'Large gap between stamp valuation and recent market sale deeds across 4 villages',
                status: 'CRITICAL',
                daysPending: 140,
                statutoryLimitDays: 180,
                ownerDepartment: 'District Land Acquisition Officer (DLAO), Satara',
                downstreamImpact: 'Blocks Section 3D declaration and physical possession takeover for 18.2 km',
                actionable: true
            },
            {
                id: 'dep-102',
                type: 'FOREST_CLEARANCE',
                sourceSystem: 'PARIVESH',
                description: 'Stage-1 Forest Clearance pending for 14.2 ha diversion in Western Ghats buffer',
                status: 'PENDING',
                daysPending: 82,
                statutoryLimitDays: 90,
                ownerDepartment: 'MoEFCC Regional Office, Nagpur',
                downstreamImpact: 'Right-of-Way tree felling clearance delayed',
                actionable: true
            },
            {
                id: 'dep-103',
                type: 'HIGH_COURT_STAY',
                sourceSystem: 'NJDG',
                description: 'Bombay High Court Writ Petition 4812/2025 filed by Khandala Farmers Samiti on valuation parity',
                status: 'CRITICAL',
                daysPending: 48,
                ownerDepartment: 'Government Pleader / Competent Authority (CALA)',
                downstreamImpact: 'Interim stay on land mutation in Gut No. 412–430',
                actionable: true
            }
        ],
        modelOutput: {
            delayProbability: 0.84,
            predictedMissDays: 94,
            horizonDays: 120,
            nextMilestoneName: 'Section 3G Award Finalization',
            targetDeadlineDate: '2026-10-28',
            evidenceHealth: 'GREEN',
            evidenceHealthReason: 'All 4 registry feeds synced within 3 days; NGDRS deeds tagged; high satellite NDVI coverage.',
            modelCoverage: 'IN_DISTRIBUTION',
            modelVersion: 'LUME-LightGBM-v2.6 (Bhatnagar Benchmark)',
            lastUpdated: '2026-09-07T06:30:00Z',
            shapDrivers: [
                {
                    featureName: 'compensation_gap_ratio',
                    contribution: +0.34,
                    humanDescription: 'Offered rate is 36% below NGDRS 3-year median sale price in same circle',
                    evidenceSource: 'NGDRS',
                    evidenceField: 'circle_rate_vs_recent_deed_p50',
                    freshness: '1 day ago',
                    reliability: 'HIGH',
                    observation: 'Circle rate ₹22L/acre vs Top-half deed average ₹34.5L/acre'
                },
                {
                    featureName: 'pending_court_writs_active',
                    contribution: +0.22,
                    humanDescription: 'Active High Court stay petition with 2 adjournments without rejoinder',
                    evidenceSource: 'NJDG_eCourts',
                    evidenceField: 'high_court_stay_flag',
                    freshness: '2 days ago',
                    reliability: 'HIGH',
                    observation: 'WP No. 4812/2025 listed before Division Bench'
                },
                {
                    featureName: 'rfctlarr_sec10_multicrop_satellite',
                    contribution: +0.18,
                    humanDescription: 'High multi-crop vegetative index indicates mandatory "last resort" certification required',
                    evidenceSource: 'Sentinel2_NDVI',
                    evidenceField: 'sentinel2_ndvi_multicrop_score',
                    freshness: '6 days ago',
                    reliability: 'HIGH',
                    observation: 'NDVI sustained >0.62 across Kharif and Rabi cycles on 74 parcels'
                },
                {
                    featureName: 'parivesh_ec_pending_days',
                    contribution: +0.10,
                    humanDescription: 'Forest clearance age exceeds PARIVESH national median (64 days)',
                    evidenceSource: 'PARIVESH',
                    evidenceField: 'forest_stage1_elapsed_days',
                    freshness: 'Today',
                    reliability: 'HIGH',
                    observation: 'Elapsed 82 days vs national median benchmark 64 days'
                }
            ]
        },
        precedents: [
            {
                id: 'prec-01',
                projectName: 'NH-66 Khed-Chiplun 4-Laning (Konkan Package 2)',
                authority: 'NHAI',
                stateDistrict: 'Maharashtra, Ratnagiri',
                similarityScore: 0.92,
                matchingFactors: [
                    'NH Act Sec 3 Route',
                    'Hilly Western Ghats terrain',
                    'Deed vs circle rate gap >30%'
                ],
                initialDelayMonths: 14,
                finalOutcome: 'Completed with 7-month mitigation after District Collector revised multiplier under Sec 26',
                successfulIntervention: 'Convened joint Lok Adalat camp with 100% Solatium upfront assurance; settled 89% parcels in 30 days',
                costImpactCr: -34.2,
                resolvedYear: 2024,
                distanceKm: 95
            },
            {
                id: 'prec-02',
                projectName: 'Samruddhi Mahamarg Corridor Package 11',
                authority: 'MSRDC',
                stateDistrict: 'Maharashtra, Ahmednagar',
                similarityScore: 0.85,
                matchingFactors: [
                    'High farmer collectivization',
                    'Writ petitions on irrigated sugarcane land'
                ],
                initialDelayMonths: 11,
                finalOutcome: 'Settled via direct negotiated consent formula (25% incentive over Sec 26)',
                successfulIntervention: 'Appointed retired judicial officer for expedited hearing camps; disbursed compensation within 14 days',
                costImpactCr: -62.0,
                resolvedYear: 2023,
                distanceKm: 140
            }
        ]
    },
    {
        id: 'proj-dfc-eastern-hub',
        projectCode: 'DFCCIL/UP/2024/EDFC-SECT-8',
        title: 'Eastern Dedicated Freight Corridor - Chandauli Rail Logistics Hub',
        titleHindi: 'पूर्वी समर्पित माल गलियारा - चंदौली रेल लॉजिस्टिक्स हब',
        authority: 'DFCCIL / Ministry of Railways',
        state: 'Uttar Pradesh',
        district: 'Chandauli',
        tehsil: 'Mughalsarai & Sakaldiha',
        totalAreaHectares: 310.2,
        affectedLandownersCount: 1240,
        processRoute: 'RFCTLARR_2013',
        currentStage: 'SEC11_PRELIM_NOTICE',
        currentStageLabel: 'Section 11 Preliminary Notification',
        currentStageElapsedDays: 310,
        statutoryClockMaxDays: 365,
        criticality: 'CRITICAL',
        estimatedBudgetCr: 2180.0,
        compensationDisbursedCr: 120.0,
        multiCropIrrigatedExposure: true,
        multiCropConfidencePct: 88,
        coordinates: {
            lat: 25.263,
            lng: 83.267
        },
        recentAlerts: [
            'CRITICAL: Only 55 days left on the 12-Month Section 11 Statutory Clock.',
            'SIA Expert Appraisal completed 310 days ago; notification lapse imminent under Sec 11(1).'
        ],
        compensationBasePerAcreLakh: 16.5,
        compensationMarketPerAcreLakh: 26.0,
        dependencies: [
            {
                id: 'dep-201',
                type: 'GRAM_SABHA_CONSENT',
                sourceSystem: 'LACRRIS',
                description: 'Gram Sabha quorum failed twice in Sakaldiha block due to unclarified rehabilitation site',
                status: 'CRITICAL',
                daysPending: 190,
                statutoryLimitDays: 240,
                ownerDepartment: 'Chief Development Officer (CDO), Chandauli',
                downstreamImpact: 'SIA final gazette notification cannot be authenticated',
                actionable: true
            },
            {
                id: 'dep-202',
                type: 'REVENUE_MUTATION',
                sourceSystem: 'DILRMP',
                description: 'Legacy shared joint-khata holdings (142 Khatas with 6+ co-parceners unregistered)',
                status: 'CRITICAL',
                daysPending: 220,
                ownerDepartment: 'Tehsildar & Lekhpal Revenue Squad',
                downstreamImpact: 'Individual compensation apportionment impossible without family tree affidavit',
                actionable: true
            }
        ],
        modelOutput: {
            delayProbability: 0.91,
            predictedMissDays: 140,
            horizonDays: 90,
            nextMilestoneName: 'Section 11 Gazette Publication',
            targetDeadlineDate: '2026-10-31',
            evidenceHealth: 'GREEN',
            evidenceHealthReason: 'LACRRIS and DILRMP records matched with high confidence; SIA appraisal report date verified.',
            modelCoverage: 'IN_DISTRIBUTION',
            modelVersion: 'LUME-LightGBM-v2.6 (Bhatnagar Benchmark)',
            lastUpdated: '2026-09-07T05:15:00Z',
            shapDrivers: [
                {
                    featureName: 'sec11_elapsed_vs_12m_limit',
                    contribution: +0.41,
                    humanDescription: 'Elapsed 310 days out of statutory 365-day lapse window (RFCTLARR Section 11(1))',
                    evidenceSource: 'LACRRIS',
                    evidenceField: 'sia_appraisal_date_to_now',
                    freshness: '1 day ago',
                    reliability: 'HIGH',
                    observation: 'Lapse will nullify entire ₹8.4 Cr Social Impact Assessment study'
                },
                {
                    featureName: 'joint_khata_fraction',
                    contribution: +0.28,
                    humanDescription: 'Over 42% of land parcels have disputed heirship or un-partitioned joint Khatas',
                    evidenceSource: 'LACRRIS',
                    evidenceField: 'unpartitioned_khata_count',
                    freshness: '3 days ago',
                    reliability: 'HIGH',
                    observation: '142 undivided ancestral titles awaiting succession verification'
                },
                {
                    featureName: 'gram_sabha_failure_count',
                    contribution: +0.16,
                    humanDescription: 'Two consecutive quorum failures for Section 4 R&R scheme approval',
                    evidenceSource: 'LACRRIS',
                    evidenceField: 'gram_sabha_resolutions_pending',
                    freshness: '4 days ago',
                    reliability: 'HIGH',
                    observation: 'Standing Committee finding: Gram Sabha consent is primary social friction node'
                }
            ]
        },
        precedents: [
            {
                id: 'prec-03',
                projectName: 'EDFC New Bhaupur - Khurja Rail Section',
                authority: 'DFCCIL',
                stateDistrict: 'Uttar Pradesh, Kanpur Dehat',
                similarityScore: 0.94,
                matchingFactors: [
                    'Rail corridor acquisition',
                    'Joint-Khata ownership density',
                    'RFCTLARR 12-month Sec 11 race'
                ],
                initialDelayMonths: 18,
                finalOutcome: 'Averted Section 11 lapse with 18 days to spare by deploying mobile Lekhpal camp teams',
                successfulIntervention: 'District Collector notified 3-day special succession fast-track drive with spot affidavits',
                costImpactCr: -48.0,
                resolvedYear: 2022,
                distanceKm: 180
            }
        ]
    },
    {
        id: 'proj-bengaluru-metro-ph4',
        projectCode: 'BMRCL/KA/2024/METRO-PH4-AIRPORT',
        title: 'Namma Metro Phase 4 - Airport Extension Depot & Alignment',
        titleHindi: 'नम्मा मेट्रो चरण 4 - एयरपोर्ट एक्सटेंशन डिपो और संरेखण',
        authority: 'BMRCL (Bengaluru Metro Rail Corp Ltd)',
        state: 'Karnataka',
        district: 'Bengaluru Rural',
        tehsil: 'Devanahalli',
        totalAreaHectares: 62.4,
        affectedLandownersCount: 284,
        processRoute: 'STATE_SPECIFIC',
        currentStage: 'AWARD_SEC23',
        currentStageLabel: 'KIADB Section 28(4) Final Award & Disbursement',
        currentStageElapsedDays: 145,
        statutoryClockMaxDays: 240,
        criticality: 'HIGH',
        estimatedBudgetCr: 940.0,
        compensationDisbursedCr: 410.0,
        multiCropIrrigatedExposure: false,
        multiCropConfidencePct: 94,
        coordinates: {
            lat: 13.245,
            lng: 77.712
        },
        recentAlerts: [
            'Commercial valuation dispute raised by KIADB industrial allottees.',
            'Utility shifting NOC pending for 66kV KPTCL high-tension line.'
        ],
        compensationBasePerAcreLakh: 75.0,
        compensationMarketPerAcreLakh: 110.0,
        dependencies: [
            {
                id: 'dep-301',
                type: 'UTILITY_SHIFTING',
                sourceSystem: 'BhoomiRashi',
                description: 'KPTCL 66kV transmission towers cross depot main lead track',
                status: 'PENDING',
                daysPending: 65,
                statutoryLimitDays: 90,
                ownerDepartment: 'Karnataka Power Transmission Corp Ltd (KPTCL)',
                downstreamImpact: 'Civil foundation works cannot commence in Sector C',
                actionable: true
            },
            {
                id: 'dep-302',
                type: 'COMPENSATION_DISPUTE',
                sourceSystem: 'NGDRS',
                description: 'Tenanted agricultural land vs converted industrial land compensation parity claim',
                status: 'PENDING',
                daysPending: 42,
                ownerDepartment: 'Special Land Acquisition Officer (SLAO), KIADB',
                downstreamImpact: 'Consensual handover of 14 hectares delayed',
                actionable: true
            }
        ],
        modelOutput: {
            delayProbability: 0.42,
            predictedMissDays: 24,
            horizonDays: 95,
            nextMilestoneName: 'Possession Handover to Track Contractors',
            targetDeadlineDate: '2026-12-10',
            evidenceHealth: 'GREEN',
            evidenceHealthReason: 'Complete digital cadastral maps and Kaveri 2.0 registration deed access verified.',
            modelCoverage: 'IN_DISTRIBUTION',
            modelVersion: 'LUME-LightGBM-v2.6 (Bhatnagar Benchmark)',
            lastUpdated: '2026-09-07T07:00:00Z',
            shapDrivers: [
                {
                    featureName: 'utility_shifting_age',
                    contribution: +0.21,
                    humanDescription: 'Power corridor clearance pending with state electricity board for >60 days',
                    evidenceSource: 'BhoomiRashi',
                    evidenceField: 'utility_shifting_timeline_elapsed',
                    freshness: '1 day ago',
                    reliability: 'HIGH',
                    observation: 'KPTCL joint estimation completed, pending treasury sign-off'
                },
                {
                    featureName: 'urban_periurban_compensation_ratio',
                    contribution: +0.14,
                    humanDescription: 'Peri-urban fast-appreciating zone; land value escalation expectations',
                    evidenceSource: 'NGDRS',
                    evidenceField: 'periurban_appreciation_index',
                    freshness: '2 days ago',
                    reliability: 'HIGH',
                    observation: 'NH-44 corridor proximity creating market rate volatility'
                }
            ]
        },
        precedents: [
            {
                id: 'prec-04',
                projectName: 'Metro Phase 2 Depot at Challaghatta',
                authority: 'BMRCL',
                stateDistrict: 'Karnataka, Bengaluru Urban',
                similarityScore: 0.88,
                matchingFactors: [
                    'Transit depot parceling',
                    'Utility high-tension shifting',
                    'KIADB framework'
                ],
                initialDelayMonths: 8,
                finalOutcome: 'Resolved via multi-agency taskforce weekly review under Chief Secretary',
                successfulIntervention: 'Deposit of advance utility shifting funds into escrow account within 10 days',
                costImpactCr: -18.5,
                resolvedYear: 2023,
                distanceKm: 35
            }
        ]
    },
    {
        id: 'proj-rajasthan-solar-park',
        projectCode: 'SECI/RJ/2025/BHADLA-ULTRA-SOLAR',
        title: 'Bhadla-Phalodi 2000MW Ultra Mega Solar Power Park',
        titleHindi: 'भादला-फलोदी 2000 मेगावाट अल्ट्रा मेगा सोलर पावर पार्क',
        authority: 'SECI (Solar Energy Corporation of India)',
        state: 'Rajasthan',
        district: 'Phalodi',
        tehsil: 'Bap & Phalodi',
        totalAreaHectares: 1200.0,
        affectedLandownersCount: 340,
        processRoute: 'RFCTLARR_2013',
        currentStage: 'SIA_APPRAISAL',
        currentStageLabel: 'Social & Environmental Impact Assessment (Sec 4)',
        currentStageElapsedDays: 95,
        statutoryClockMaxDays: 180,
        criticality: 'STANDARD',
        estimatedBudgetCr: 850.0,
        compensationDisbursedCr: 80.0,
        multiCropIrrigatedExposure: false,
        multiCropConfidencePct: 98,
        coordinates: {
            lat: 27.53,
            lng: 72.36
        },
        recentAlerts: [
            'AMBER Evidence Health: Great Indian Bustard (GIB) transmission undergrounding scrutiny.',
            'Partial NJDG case tagging due to pending Supreme Court compliance bench.'
        ],
        compensationBasePerAcreLakh: 5.5,
        compensationMarketPerAcreLakh: 7.2,
        dependencies: [
            {
                id: 'dep-401',
                type: 'FOREST_CLEARANCE',
                sourceSystem: 'PARIVESH',
                description: 'GIB conservation priority habitat clearance for overhead lines',
                status: 'PENDING',
                daysPending: 95,
                statutoryLimitDays: 120,
                ownerDepartment: 'Wildlife Institute of India & SC Empowered Committee',
                downstreamImpact: 'Power evacuation corridor design finalized only after clearance',
                actionable: true
            }
        ],
        modelOutput: {
            delayProbability: 0.28,
            predictedMissDays: 12,
            horizonDays: 180,
            nextMilestoneName: 'Expert Group SIA Approval',
            targetDeadlineDate: '2026-11-30',
            evidenceHealth: 'AMBER',
            evidenceHealthReason: 'eCourts case metadata not natively tagged with ecological PIL numbers; GIB compliance uncertain.',
            modelCoverage: 'MARGINAL_SUPPORT',
            modelVersion: 'LUME-LightGBM-v2.6 (Bhatnagar Benchmark)',
            lastUpdated: '2026-09-07T04:45:00Z',
            shapDrivers: [
                {
                    featureName: 'wildlife_boundary_proximity',
                    contribution: +0.19,
                    humanDescription: 'Proximity to Supreme Court monitored Great Indian Bustard priority grid zone',
                    evidenceSource: 'PARIVESH',
                    evidenceField: 'wildlife_buffer_km',
                    freshness: '5 days ago',
                    reliability: 'CAUTION',
                    observation: 'Overhead line undergrounding mandate creates potential re-survey need'
                },
                {
                    featureName: 'fallow_land_fraction',
                    contribution: -0.22,
                    humanDescription: 'Arid single-crop / fallow land classification minimizes Section 10 multi-crop restrictions',
                    evidenceSource: 'Sentinel2_NDVI',
                    evidenceField: 'sentinel2_ndvi_fallow_pct',
                    freshness: '3 days ago',
                    reliability: 'HIGH',
                    observation: '94% land classified as non-irrigated arid scrubland'
                }
            ]
        },
        precedents: [
            {
                id: 'prec-05',
                projectName: 'Fatehgarh Solar Grid Corridors Phase 2',
                authority: 'Power Grid Corp',
                stateDistrict: 'Rajasthan, Jaisalmer',
                similarityScore: 0.89,
                matchingFactors: [
                    'Desert solar footprint',
                    'Supreme Court GIB hearing precedent',
                    'Revenue land lease'
                ],
                initialDelayMonths: 9,
                finalOutcome: 'Route realigned around priority core habitat; zero delay in non-disputed sectors',
                successfulIntervention: 'Installation of bird diverters on transmission lines sanctioned upfront',
                costImpactCr: -12.0,
                resolvedYear: 2024,
                distanceKm: 110
            }
        ]
    },
    {
        id: 'proj-nh65-solapur-vijayawada',
        projectCode: 'NHAI/TS/2024/NH65-FOUR-LANING',
        title: 'NH-65 Hyderabad-Suryapet-Vijayawada Bypass & Interchange',
        titleHindi: 'राष्ट्रीय राजमार्ग 65 हैदराबाद-सूर्यापेट-विजयवाड़ा बाईपास',
        authority: 'NHAI',
        state: 'Telangana',
        district: 'Suryapet',
        tehsil: 'Chivemla & Suryapet Rural',
        totalAreaHectares: 94.2,
        affectedLandownersCount: 420,
        processRoute: 'NH_ACT_SEC3',
        currentStage: 'POSSESSION_TAKEOVER',
        currentStageLabel: 'Sec 3E Physical Possession & Boundary Demarcation',
        currentStageElapsedDays: 78,
        statutoryClockMaxDays: 120,
        criticality: 'MEDIUM',
        estimatedBudgetCr: 680.0,
        compensationDisbursedCr: 590.0,
        multiCropIrrigatedExposure: false,
        multiCropConfidencePct: 92,
        coordinates: {
            lat: 17.142,
            lng: 79.625
        },
        recentAlerts: [
            '87% compensation successfully disbursed via PFMS-Bhoomirashee integration.',
            'Minor boundary dispute in 3 farm parcels awaiting joint DGPS survey.'
        ],
        compensationBasePerAcreLakh: 28.0,
        compensationMarketPerAcreLakh: 32.0,
        dependencies: [
            {
                id: 'dep-501',
                type: 'REVENUE_MUTATION',
                sourceSystem: 'BhoomiRashi',
                description: 'DGPS survey boundary pegging in Survey Nos 88, 92, 94',
                status: 'PENDING',
                daysPending: 18,
                statutoryLimitDays: 30,
                ownerDepartment: 'Assistant Director of Survey & Land Records (ADSLR)',
                downstreamImpact: 'Right-of-Way handover of remaining 1.8 km stretch',
                actionable: true
            }
        ],
        modelOutput: {
            delayProbability: 0.15,
            predictedMissDays: 0,
            horizonDays: 60,
            nextMilestoneName: '100% Right-of-Way Free of Encumbrance Handover',
            targetDeadlineDate: '2026-10-15',
            evidenceHealth: 'GREEN',
            evidenceHealthReason: 'PFMS payment acknowledgements complete for 374 out of 420 landowners.',
            modelCoverage: 'IN_DISTRIBUTION',
            modelVersion: 'LUME-LightGBM-v2.6 (Bhatnagar Benchmark)',
            lastUpdated: '2026-09-07T06:45:00Z',
            shapDrivers: [
                {
                    featureName: 'compensation_disbursed_pct',
                    contribution: -0.32,
                    humanDescription: 'High disbursement rate (87%) removes primary incentive for physical resistance',
                    evidenceSource: 'BhoomiRashi',
                    evidenceField: 'pfms_disbursed_percentage',
                    freshness: 'Today',
                    reliability: 'HIGH',
                    observation: 'Direct DB transfer into Aadhaar-linked farmer bank accounts confirmed'
                }
            ]
        },
        precedents: [
            {
                id: 'prec-06',
                projectName: 'NH-163 Warangal Outer Ring Road',
                authority: 'NHAI',
                stateDistrict: 'Telangana, Warangal',
                similarityScore: 0.91,
                matchingFactors: [
                    'Telangana Dharani land portal records',
                    'PFMS direct credit integration'
                ],
                initialDelayMonths: 3,
                finalOutcome: 'Completed on schedule after deployment of drone-based cadastral demarcation',
                successfulIntervention: 'Spot DGPS survey with landowners present; instant digital signature',
                costImpactCr: -6.5,
                resolvedYear: 2023,
                distanceKm: 90
            }
        ]
    }
];
const MOCK_CITIZEN_PARCELS = [
    {
        ulpin: 'MH270412889201',
        surveyKhasraNo: 'Gut No. 418/2',
        village: 'Shirwal',
        tehsil: 'Khandala',
        district: 'Satara',
        state: 'Maharashtra',
        projectId: 'proj-nh48-pune-satara',
        projectTitle: 'NH-48 Pune-Satara 8-Laning Corridor Extension',
        ownerNameMasked: 'Rameshwar K. J****',
        landAreaAcre: 1.45,
        landType: 'Multi-crop Irrigated (Sec 10)',
        currentStageStatus: 'Valuation & Compensation Calculation under Sec 26 in progress',
        currentStageStatusHindi: 'धारा 26 के तहत मूल्यांकन एवं मुआवज़ा गणना प्रक्रिया जारी है',
        statutoryNextStep: 'Publication of Section 3G Award & Opportunity to submit market sale deeds',
        statutoryNextStepHindi: 'धारा 3जी पंचाट का प्रकाशन और बाज़ार बिक्री विलेख प्रस्तुत करने का अवसर',
        nextHearingOrDate: '18 September 2026 at Tehsil Office Khandala',
        fairCompensationRangePerAcre: {
            minLakh: 28.5,
            maxLakh: 36.0,
            includesSolatium100Pct: true
        },
        officialNotices: [
            {
                title: 'Section 3A Preliminary Land Identification Gazette',
                date: '14 January 2025',
                gazetteRef: 'S.O. 182(E) / Gazette of India'
            },
            {
                title: 'Section 3C Hearing of Objections Notice',
                date: '28 March 2025',
                gazetteRef: 'DLAO/STR/NH48/NO-142'
            }
        ]
    },
    {
        ulpin: 'UP640822194301',
        surveyKhasraNo: 'Khasra No. 712/क',
        village: 'Taraura',
        tehsil: 'Sakaldiha',
        district: 'Chandauli',
        state: 'Uttar Pradesh',
        projectId: 'proj-dfc-eastern-hub',
        projectTitle: 'Eastern Dedicated Freight Corridor - Chandauli Rail Logistics Hub',
        ownerNameMasked: 'Shivnath P. S*****',
        landAreaAcre: 0.85,
        landType: 'Single-crop Dryland',
        currentStageStatus: 'Section 11 Preliminary Notification drafting pending Gram Sabha resolution',
        currentStageStatusHindi: 'ग्राम सभा प्रस्ताव के अभाव में धारा 11 प्रारंभिक अधिसूचना लंबित है',
        statutoryNextStep: 'Gram Sabha Consultation and Verification of Joint Khata heirship',
        statutoryNextStepHindi: 'ग्राम सभा परामर्श एवं संयुक्त खाता उत्तराधिकार सत्यापन',
        nextHearingOrDate: '24 September 2026 at Panchayat Bhavan Taraura',
        fairCompensationRangePerAcre: {
            minLakh: 22.0,
            maxLakh: 28.5,
            includesSolatium100Pct: true
        },
        officialNotices: [
            {
                title: 'Section 4 Social Impact Assessment (SIA) Summary Notice',
                date: '12 November 2024',
                gazetteRef: 'DoLR/LACRRIS/SIA-UP-088'
            }
        ]
    },
    {
        ulpin: 'KA140192847102',
        surveyKhasraNo: 'Sy No. 104/P2',
        village: 'Boodihal',
        tehsil: 'Devanahalli',
        district: 'Bengaluru Rural',
        state: 'Karnataka',
        projectId: 'proj-bengaluru-metro-ph4',
        projectTitle: 'Namma Metro Phase 4 - Airport Extension Depot & Alignment',
        ownerNameMasked: 'Anand M. R**',
        landAreaAcre: 0.65,
        landType: 'Residential / Homestead',
        currentStageStatus: 'KIADB Section 28(4) Award finalized; compensation ready for account transfer',
        currentStageStatusHindi: 'केआईएडीबी धारा 28(4) पंचाट अंतिम रूप से तैयार; खाते में मुआवज़ा भेजने हेतु तैयार',
        statutoryNextStep: 'Bank Account & Aadhaar E-KYC submission for direct PFMS disbursement',
        statutoryNextStepHindi: 'सीधे बैंक खाते में राशि पाने हेतु आधार एवं बैंक पासबुक सत्यापन',
        nextHearingOrDate: 'Immediate at KIADB Special LAO Office, Gandhinagar',
        fairCompensationRangePerAcre: {
            minLakh: 85.0,
            maxLakh: 115.0,
            includesSolatium100Pct: true
        },
        officialNotices: [
            {
                title: 'KIADB Final Acquisition Notification',
                date: '05 May 2025',
                gazetteRef: 'KSL-BMRCL-PH4-2025'
            }
        ]
    },
    {
        ulpin: 'RJ190342918840',
        surveyKhasraNo: 'Khasra 44/1',
        village: 'Bap',
        tehsil: 'Phalodi',
        district: 'Phalodi',
        state: 'Rajasthan',
        projectId: 'proj-rajasthan-solar-park',
        projectTitle: 'Bhadla-Phalodi 2000MW Ultra Mega Solar Power Park',
        ownerNameMasked: 'Mohan Ram G******',
        landAreaAcre: 4.20,
        landType: 'Barren / Fallow',
        currentStageStatus: 'Section 4 SIA Public Consultation completed',
        currentStageStatusHindi: 'धारा 4 सामाजिक प्रभाव आकलन (SIA) जन-परामर्श संपन्न',
        statutoryNextStep: 'Review by State Multi-Disciplinary Expert Group',
        statutoryNextStepHindi: 'राज्य बहु-विषयक विशेषज्ञ समूह द्वारा अंतिम समीक्षा',
        nextHearingOrDate: '30 October 2026',
        fairCompensationRangePerAcre: {
            minLakh: 6.0,
            maxLakh: 8.5,
            includesSolatium100Pct: true
        },
        officialNotices: [
            {
                title: 'Notice for Public Hearing under SIA Rules',
                date: '10 July 2025',
                gazetteRef: 'RAJ-GAZ-SOLAR-2025-09'
            }
        ]
    }
];
const MOCK_DECISION_LOGS = [
    {
        id: 'dec-01',
        projectId: 'proj-nh48-pune-satara',
        projectCode: 'NHAI/MH/2025/NH48-EXP-04',
        officerName: 'Smt. Ananya Deshmukh, IAS',
        officerRole: 'District Collector & Competent Authority (CALA)',
        timestamp: '2026-09-05T11:30:00Z',
        actionTaken: 'Ordered joint Lok Adalat review on Khandala circle rates using Section 26 highest-50% deed formula',
        category: 'COMPENSATION_REVISION',
        targetDueDate: '2026-09-22',
        scenarioAssumptionsTested: 'Tested +35% compensation multiplier: drops next-milestone delay probability from 84% to 41%',
        status: 'IN_PROGRESS',
        notes: 'Directed DLAO to notify village sarpanches and present top-registered deeds of last 3 years.'
    },
    {
        id: 'dec-02',
        projectId: 'proj-dfc-eastern-hub',
        projectCode: 'DFCCIL/UP/2024/EDFC-SECT-8',
        officerName: 'Shri Rajeshwar Verma, PCS',
        officerRole: 'Special Land Acquisition Officer (Railways)',
        timestamp: '2026-09-04T15:10:00Z',
        actionTaken: 'Deployed 4 mobile Lekhpal squads for on-the-spot joint khata family tree affidavits in Sakaldiha',
        category: 'SPECIAL_CAMP',
        targetDueDate: '2026-09-18',
        scenarioAssumptionsTested: 'Resolution of 142 pending heirships prevents statutory 12-month Section 11 lapse',
        status: 'ASSIGNED',
        notes: 'Camp scheduled for 12, 13, and 14 September at Panchayat Bhavan with video-recording.'
    },
    {
        id: 'dec-03',
        projectId: 'proj-bengaluru-metro-ph4',
        projectCode: 'BMRCL/KA/2024/METRO-PH4-AIRPORT',
        officerName: 'K. Venkatesh, KAS',
        officerRole: 'General Manager (Land & R&R), BMRCL',
        timestamp: '2026-09-02T10:00:00Z',
        actionTaken: 'Sanctioned advance deposit of ₹4.8 Cr into KPTCL escrow account for 66kV transmission shifting',
        category: 'NOC_ESCALATION',
        targetDueDate: '2026-09-15',
        scenarioAssumptionsTested: 'Unblocking KPTCL tower foundation mitigates depot civil access critical path',
        status: 'COMPLETED',
        notes: 'Demand draft handed over to Superintending Engineer KPTCL.'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/mockDataV7.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PIPELINE_RUNS",
    ()=>PIPELINE_RUNS,
    "PROJECT_CASE_PULSES",
    ()=>PROJECT_CASE_PULSES,
    "PROJECT_SNAPSHOTS",
    ()=>PROJECT_SNAPSHOTS,
    "REPLAY_STATES",
    ()=>REPLAY_STATES,
    "V7_DATA_PASSPORTS",
    ()=>V7_DATA_PASSPORTS,
    "getProjectCasePulse",
    ()=>getProjectCasePulse,
    "getProjectPipelineRuns",
    ()=>getProjectPipelineRuns,
    "getProjectSnapshots",
    ()=>getProjectSnapshots,
    "getReplayState",
    ()=>getReplayState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/mockData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/dataPipeline.ts [app-client] (ecmascript)");
;
;
function generateHistoricalSnapshots(project) {
    const snapshots = [];
    const baseDate = new Date('2026-08-01');
    let currentProbability = project.modelOutput.delayProbability;
    let currentMissDays = project.modelOutput.predictedMissDays;
    let currentStageElapsed = project.currentStageElapsedDays;
    let currentEvidenceHealth = project.modelOutput.evidenceHealth;
    for(let i = 0; i < 6; i++){
        const snapshotDate = new Date(baseDate);
        snapshotDate.setDate(snapshotDate.getDate() + i * 7);
        if (i > 0) {
            const probChange = (Math.random() - 0.4) * 0.08;
            currentProbability = Math.max(0.05, Math.min(0.98, currentProbability + probChange));
            currentMissDays = Math.max(0, Math.round(currentMissDays + (Math.random() - 0.3) * 10));
            currentStageElapsed += 7;
            if (currentProbability > 0.7 && currentEvidenceHealth === 'GREEN') {
                currentEvidenceHealth = 'AMBER';
            } else if (currentProbability < 0.3 && currentEvidenceHealth !== 'GREEN') {
                currentEvidenceHealth = 'GREEN';
            }
        }
        const historicalModel = {
            ...project.modelOutput,
            delayProbability: Number(currentProbability.toFixed(2)),
            predictedMissDays: currentMissDays,
            horizonDays: Math.max(30, project.modelOutput.horizonDays - i * 7),
            evidenceHealth: currentEvidenceHealth,
            lastUpdated: snapshotDate.toISOString()
        };
        const historicalProject = {
            ...project,
            currentStageElapsedDays: currentStageElapsed,
            modelOutput: historicalModel
        };
        const triggerEvents = [
            'Initial SIH dataset load',
            'NGDRS deed update received',
            'PARIVESH clearance status change',
            'NJDG case metadata sync',
            'Sentinel-2 NDVI refresh',
            'Manual officer review'
        ];
        snapshots.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTemporalSnapshot"])(historicalProject, historicalModel, triggerEvents[i]));
    }
    snapshots.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTemporalSnapshot"])(project, project.modelOutput, 'Current live state'));
    return snapshots;
}
const PROJECT_SNAPSHOTS = {};
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PROJECTS"].forEach((project)=>{
    PROJECT_SNAPSHOTS[project.id] = generateHistoricalSnapshots(project);
});
const PROJECT_CASE_PULSES = {};
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PROJECTS"].forEach((project)=>{
    PROJECT_CASE_PULSES[project.id] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateCasePulse"])(project, PROJECT_SNAPSHOTS[project.id], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_DECISION_LOGS"]);
});
const PIPELINE_RUNS = {};
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PROJECTS"].forEach((project)=>{
    const runs = [];
    for(let i = 0; i < 3; i++){
        const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPipelineRun"])(project.id, 'SIH_PROVIDED_DATASET', i === 0 ? 'MANUAL' : 'SCHEDULED');
        runs.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["simulatePipelineRun"])(run, project));
    }
    PIPELINE_RUNS[project.id] = runs;
});
const REPLAY_STATES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PROJECTS"].map(_c = (project)=>{
    const snapshots = PROJECT_SNAPSHOTS[project.id];
    const midSnapshot = snapshots[Math.floor(snapshots.length / 2)];
    let actualOutcome;
    if (project.id === 'proj-nh65-solapur-vijayawada') {
        actualOutcome = {
            finalDelayMonths: 3,
            finalOutcome: 'Completed on schedule after deployment of drone-based cadastral demarcation',
            resolutionDate: '2026-10-15'
        };
    } else if (project.id === 'proj-bengaluru-metro-ph4') {
        actualOutcome = {
            finalDelayMonths: 2,
            finalOutcome: 'Resolved via multi-agency taskforce weekly review under Chief Secretary',
            resolutionDate: '2026-11-28'
        };
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createReplayState"])(midSnapshot, actualOutcome);
});
_c1 = REPLAY_STATES;
const V7_DATA_PASSPORTS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$dataPipeline$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DATA_PASSPORTS"];
function getProjectSnapshots(projectId) {
    return PROJECT_SNAPSHOTS[projectId] || [];
}
function getProjectCasePulse(projectId) {
    return PROJECT_CASE_PULSES[projectId];
}
function getProjectPipelineRuns(projectId) {
    return PIPELINE_RUNS[projectId] || [];
}
function getReplayState(projectId) {
    return REPLAY_STATES.find((r)=>r.projectId === projectId);
}
;
var _c, _c1;
__turbopack_context__.k.register(_c, "REPLAY_STATES$MOCK_PROJECTS.map");
__turbopack_context__.k.register(_c1, "REPLAY_STATES");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/translations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TRANSLATIONS",
    ()=>TRANSLATIONS
]);
const TRANSLATIONS = {
    EN: {
        ministryName: 'Ministry of Rural Development | Government of India',
        subTitle: 'Land-Acquisition Uncertainty Intervention-Management Engine (LUME)',
        officerNav: 'Officer Intelligence',
        citizenNav: 'Citizen Jan-Seva',
        gisNav: 'GIS Satellite',
        analyticsNav: 'Comparative Analytics',
        trustNav: 'Trust & Architecture',
        tourBtn: '7-Min Tour',
        helpDeskBtn: 'Help Desk',
        backToPortfolio: 'Back to Portfolio Command Center',
        allAgesBadge: 'All Ages',
        searchPlaceholder: 'Search corridor by name, authority, district, or code...',
        activeRoleLabel: 'Active Persona',
        switchRolePrompt: 'Switch role view',
        roleOfficer: 'District Acquisition Officer (CALA)',
        roleSeniorOfficer: 'Senior Departmental Officer (MoRTH/DoLR)',
        rolePMU: 'Project / PMU Execution Team',
        roleLegal: 'Legal & Grievance Team (NJDG)',
        roleDataAdmin: 'Data & IT Governance Admin',
        rolePolicyAnalyst: 'Program & Policy Analyst',
        roleCitizen: 'Landowner Citizen / Farmer',
        activePortfolios: 'Active Portfolios',
        criticalStageRisk: 'Critical Stage Risk',
        sec10Flag: 'Sec 10 Multi-Crop Flag',
        affectedLandowners: 'Affected Families',
        monitoredValue: 'Monitored Value',
        trackedNationwide: 'central infrastructure projects tracked',
        delayProbOver70: 'Delay probability > 70%',
        mandatoryLastResort: 'Demonstrable last resort check',
        directDBT: 'Direct PFMS entitlement tracking',
        moSPIAligned: 'MoSPI Flash report aligned',
        filterAgency: 'Agency:',
        filterRoute: 'Legal Route:',
        filterRisk: 'Risk Tier:',
        allAgencies: 'All Agencies',
        allRoutes: 'All Legal Routes',
        allRisks: 'All Risk Tiers',
        criticalRisk: 'Critical (>70%)',
        moderateRisk: 'Moderate (30-70%)',
        onTrackRisk: 'On Track (<30%)',
        statutoryClockTitle: 'Parliamentary Standing Committee & Statutory Oversight',
        statutoryContextDescription: '74.8% of completed NHAI road projects were historically delayed, with land acquisition as lead bottleneck (MoSPI Flash Report & Parliament replies). LUME monitors breaches of RFCTLARR Section 11 (12-month SIA clock) & NHAI 336-day Section 3 clock before deadlines lapse.',
        sec11ClockLabel: 'RFCTLARR Sec 11 12-Month Clock',
        nhaiClockLabel: 'NHAI 336-Day Statutory Clock',
        daysRemaining: 'Days Remaining',
        daysOverdue: 'Days Overdue',
        elapsedOfMax: 'days elapsed of statutory ceiling',
        tabOverview: '1. Critical Path & Delay Causes',
        tabEvidence: '2. SHAP Evidence Trace',
        tabPrecedents: '3. Precedent Intelligence',
        tabScenario: '4. Scenario Lab (What-If)',
        tabDecisions: '5. Priority Queue & Action Log',
        tabReviewPacket: '6. One-Page Review Brief',
        tabComparative: 'Comparative Analytics',
        scenarioHeading: 'Intervention Scenario Lab (F08 / Section 14)',
        scenarioSubhead: 'Simulate supported administrative interventions with guaranteed monotonic constraints',
        correlationCaveat: 'SCIENTIFIC BOUNDARY (Section 14): A scenario is a modelled sensitivity under stated assumptions. It reflects historically learned correlations between administrative inputs and milestone durations — it becomes a causal claim only after a separate formal evaluation design. Monotonic constraints guarantee that higher compensation or faster NOC clearance will never artificially increase predicted risk.',
        compMultiplierLabel: 'Compensation Offer Adjustment (vs Circle Rate)',
        compMultiplierHelp: 'Raise offer toward Section 26 fair-market value (top-50% deed average)',
        nocResourceLabel: 'Expedited Forest / Wildlife NOC Resources',
        nocResourceHelp: 'Deploy dedicated liaison officers to clear PARIVESH clearances',
        grievanceCampLabel: 'Special Village Lok Adalat / Hearing Camp',
        grievanceCampHelp: 'Conduct on-site grievance settlement for disputed title mutations',
        harvestBufferLabel: 'Crop Harvest Standing Buffer',
        harvestBufferHelp: 'Grant 30-60 days window for farmers to harvest standing crops',
        applyToActionBtn: 'Transfer Scenario to Action Queue',
        predictedRiskLabel: 'Simulated Risk',
        riskReductionLabel: 'Risk Reduction',
        savedDaysLabel: 'Projected Days Saved',
        citizenTitle: 'Citizen Jan-Seva Land Transparency Portal',
        citizenSubhead: 'Public status and fair compensation transparency for all affected families (Dec 2025 Parliamentary Committee Aligned)',
        audioNarrationBtn: 'Listen in Hindi/English (Voice Narration)',
        stopAudioBtn: 'Stop Narration',
        searchParcelPlaceholder: 'Search by 14-digit Bhu-Aadhaar (ULPIN), Survey / Khasra No, or Village...',
        fairCompHeading: 'Statutory Fair Compensation Calculation (Sec 26)',
        solatiumIncludedBadge: 'Includes Mandatory 100% Solatium doubling under First Schedule',
        officialGazetteNotices: 'Official Gazette Notifications & Orders',
        submitGrievanceTab: 'Submit Observation or Hearing Request',
        grievanceSuccessReceipt: 'Grievance Acknowledged! Tracking Receipt Generated:',
        alertsTitle: 'Live Statutory & Evidence Alerts',
        unreadAlerts: 'Active Alerts',
        allSeverities: 'All Severities',
        acknowledgeBtn: 'Acknowledge',
        investigateBtn: 'Investigate Corridor',
        status: 'Status',
        date: 'Date',
        action: 'Action',
        save: 'Save Changes',
        close: 'Close',
        viewDetails: 'View Details',
        downloadBrief: 'Download / Print Collector Brief'
    },
    HI: {
        ministryName: 'ग्रामीण विकास मंत्रालय | भारत सरकार',
        subTitle: 'भूमि अधिग्रहण अनिश्चितता एवं हस्तक्षेप प्रबंधन इंजन (LUME)',
        officerNav: 'अधिकारी कमान केंद्र',
        citizenNav: 'जन-सेवा नागरिक पोर्टल',
        gisNav: 'जीआईएस उपग्रह',
        analyticsNav: 'तुलनात्मक विश्लेषण',
        trustNav: 'विश्वसनीयता एवं वास्तुकला',
        tourBtn: '7-मिनट प्रस्तुति टूर',
        helpDeskBtn: 'सहायता केंद्र',
        backToPortfolio: 'पोर्टफोलियो कमान केंद्र पर वापस जाएं',
        allAgesBadge: 'सभी उम्र के लिए',
        searchPlaceholder: 'परियोजना नाम, एजेंसी, जिला या परियोजना कोड से खोजें...',
        activeRoleLabel: 'सक्रिय पद / भूमिका',
        switchRolePrompt: 'भूमिका बदलें',
        roleOfficer: 'जिला अधिग्रहण अधिकारी (सक्षम प्राधिकारी)',
        roleSeniorOfficer: 'वरिष्ठ विभागीय अधिकारी (सड़क परिवहन / ग्रामीण विकास)',
        rolePMU: 'परियोजना निष्पादन दल (PMU)',
        roleLegal: 'विधिक एवं शिकायत निवारण दल (NJDG)',
        roleDataAdmin: 'डेटा एवं आईटी प्रशासन',
        rolePolicyAnalyst: 'कार्यक्रम एवं नीति विश्लेषक',
        roleCitizen: 'प्रभावित भू-स्वामी / किसान नागरिक',
        activePortfolios: 'सक्रिय अधिग्रहण गलियारे',
        criticalStageRisk: 'अति-जोखिम गलियारे',
        sec10Flag: 'धारा 10 बहु-फसली भूमि',
        affectedLandowners: 'प्रभावित परिवार',
        monitoredValue: 'कुल निगरानी पूंजी',
        trackedNationwide: 'केंद्रीय अवसंरचना परियोजनाएं ट्रैक पर',
        delayProbOver70: 'विलंब संभावना > 70%',
        mandatoryLastResort: 'अनिवार्य अंतिम उपाय (Last Resort) जांच',
        directDBT: 'प्रत्यक्ष डीबीटी एवं पीएफएमएस भुगतान',
        moSPIAligned: 'सांख्यिकी मंत्रालय (MoSPI) रिपोर्ट से प्रमाणित',
        filterAgency: 'एजेंसी:',
        filterRoute: 'विधिक प्रक्रिया:',
        filterRisk: 'जोखिम स्तर:',
        allAgencies: 'सभी एजेंसियां',
        allRoutes: 'सभी कानूनी मार्ग',
        allRisks: 'सभी जोखिम श्रेणियां',
        criticalRisk: 'अति-गंभीर (>70%)',
        moderateRisk: 'मध्यम (30-70%)',
        onTrackRisk: 'सामान्य गति (<30%)',
        statutoryClockTitle: 'संसदीय स्थायी समिति एवं सांविधिक निगरानी 2025-26',
        statutoryContextDescription: '74.8% एनएचएआई सड़क परियोजनाएं भूमि अधिग्रहण में देरी के कारण विलंबित रहीं (राज्यसभा एवं MoSPI रिपोर्ट)। ल्यूमे आरएफसीटीएलएआरआर धारा 11 (12 माह की सीमा) और एनएचएआई 336-दिवसीय समयसीमा के उल्लंघन से पहले ही चेतावनी देता है।',
        sec11ClockLabel: 'धारा 11 (12 माह की वैधानिक सीमा)',
        nhaiClockLabel: 'एनएचएआई 336-दिवसीय सांविधिक समयसीमा',
        daysRemaining: 'दिन शेष',
        daysOverdue: 'दिन अतिदेय (विलंब)',
        elapsedOfMax: 'दिन वैधानिक सीमा में से व्यतीत',
        tabOverview: '1. महत्वपूर्ण पथ एवं विलंब कारण',
        tabEvidence: '2. SHAP साक्ष्य सत्यापन',
        tabPrecedents: '3. ऐतिहासिक नज़ीर एवं समाधान',
        tabScenario: '4. परिदृश्य प्रयोगशाला (What-If)',
        tabDecisions: '5. प्राथमिकता कार्य एवं निर्णय पंजी',
        tabReviewPacket: '6. 1-पृष्ठ कलेक्टर समीक्षा संक्षिप्त',
        tabComparative: 'तुलनात्मक विश्लेषण',
        scenarioHeading: 'प्रशासनिक हस्तक्षेप परिदृश्य प्रयोगशाला (F08 / अनुभाग 14)',
        scenarioSubhead: 'गारंटीशुदा दिशात्मक वास्तविकताओं के साथ प्रशासनिक विकल्पों का परीक्षण करें',
        correlationCaveat: 'वैज्ञानिक सीमा (अनुभाग 14): यह परिदृश्य ऐतिहासिक सहसंबंधों पर आधारित गणितीय संवेदनशीलता है। यह केवल तभी कार्य-कारण सिद्ध होता है जब अलग औपचारिक मूल्यांकन किया जाए। मॉडल यह सुनिश्चित करता है कि अधिक मुआवजा या त्वरित अनापत्ति से कभी भी जोखिम कृत्रिम रूप से नहीं बढ़ेगा।',
        compMultiplierLabel: 'मुआवजा दर संशोधन (सर्कल रेट की तुलना में)',
        compMultiplierHelp: 'धारा 26 निष्पक्ष बाजार मूल्य (शीर्ष 50% रजिस्ट्री औसत) के करीब लाएं',
        nocResourceLabel: 'त्वरित वन एवं पर्यावरण अनापत्ति (NOC)',
        nocResourceHelp: 'परिवेश पोर्टल पर लंबित अनापत्तियों के लिए विशेष अधिकारी तैनात करें',
        grievanceCampLabel: 'ग्राम स्तर पर विशेष लोक अदालत / जन-सुनवाई',
        grievanceCampHelp: 'नामांतरण और संयुक्त खातेदारों के विवादों का मौके पर निपटारा',
        harvestBufferLabel: 'खड़ी फसल कटाई के लिए अतिरिक्त समय',
        harvestBufferHelp: 'किसानों को खड़ी फसल सुरक्षित काटने के लिए 30-60 दिन का समय दें',
        applyToActionBtn: 'परिदृश्य को कार्य सूची में दर्ज करें',
        predictedRiskLabel: 'अनुमानित जोखिम',
        riskReductionLabel: 'जोखिम में कमी',
        savedDaysLabel: 'संभावित बचाए गए दिन',
        citizenTitle: 'जन-सेवा नागरिक भूमि पारदर्शिता पोर्टल',
        citizenSubhead: 'सभी प्रभावित परिवारों के लिए निष्पक्ष मुआवजा और वैधानिक स्थिति की जानकारी (दिसंबर 2025 संसदीय समिति की सिफारिश के अनुरूप)',
        audioNarrationBtn: 'आवाज़ में सुनें (हिंदी ऑडियो)',
        stopAudioBtn: 'ऑडियो रोकें',
        searchParcelPlaceholder: '14-अंकीय भू-आधार (ULPIN), खसरा / गट संख्या, या गाँव के नाम से खोजें...',
        fairCompHeading: 'धारा 26 के तहत वैधानिक निष्पक्ष मुआवजा गणना',
        solatiumIncludedBadge: 'प्रथम अनुसूची के तहत अनिवार्य 100% सोलेशियम (दोगुनी राशि) सम्मिलित',
        officialGazetteNotices: 'आधिकारिक राजपत्र अधिसूचनाएं एवं आदेश',
        submitGrievanceTab: 'आपत्ति या सुनवाई हेतु अनुरोध दर्ज करें',
        grievanceSuccessReceipt: 'आपकी शिकायत पंजीकृत हो चुकी है! रसीद संख्या:',
        alertsTitle: 'सक्रिय सांविधिक एवं साक्ष्य अलर्ट',
        unreadAlerts: 'सक्रिय अलर्ट',
        allSeverities: 'सभी श्रेणियां',
        acknowledgeBtn: 'स्वीकार करें',
        investigateBtn: 'गलियारे की जांच करें',
        status: 'स्थिति',
        date: 'दिनांक',
        action: 'कार्रवाई',
        save: 'सहेजें',
        close: 'बंद करें',
        viewDetails: 'विवरण देखें',
        downloadBrief: 'कलेक्टर संक्षिप्त रिपोर्ट प्रिंट करें'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_data_1sje4la._.js.map