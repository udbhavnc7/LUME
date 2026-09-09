import { LandAcquisitionProject, CitizenParcelRecord, DecisionLogEntry } from '../types';

export const MOCK_PROJECTS: LandAcquisitionProject[] = [
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
    statutoryClockMaxDays: 336, // NHAI April 2025 self-imposed clock
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
        matchingFactors: ['NH Act Sec 3 Route', 'Hilly Western Ghats terrain', 'Deed vs circle rate gap >30%'],
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
        matchingFactors: ['High farmer collectivization', 'Writ petitions on irrigated sugarcane land'],
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
    statutoryClockMaxDays: 365, // Mandatory 12-month clock from SIA report
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
        matchingFactors: ['Rail corridor acquisition', 'Joint-Khata ownership density', 'RFCTLARR 12-month Sec 11 race'],
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
        matchingFactors: ['Transit depot parceling', 'Utility high-tension shifting', 'KIADB framework'],
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
        matchingFactors: ['Desert solar footprint', 'Supreme Court GIB hearing precedent', 'Revenue land lease'],
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
        matchingFactors: ['Telangana Dharani land portal records', 'PFMS direct credit integration'],
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

export const MOCK_CITIZEN_PARCELS: CitizenParcelRecord[] = [
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

export const MOCK_DECISION_LOGS: DecisionLogEntry[] = [
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
