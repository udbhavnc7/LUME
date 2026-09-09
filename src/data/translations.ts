export interface TranslationDictionary {
  // Navigation & General
  ministryName: string;
  subTitle: string;
  officerNav: string;
  citizenNav: string;
  gisNav: string;
  analyticsNav: string;
  trustNav: string;
  tourBtn: string;
  helpDeskBtn: string;
  backToPortfolio: string;
  allAgesBadge: string;
  searchPlaceholder: string;
  
  // Roles & Personas
  activeRoleLabel: string;
  switchRolePrompt: string;
  roleOfficer: string;
  roleSeniorOfficer: string;
  rolePMU: string;
  roleLegal: string;
  roleDataAdmin: string;
  rolePolicyAnalyst: string;
  roleCitizen: string;

  // Macro Metrics
  activePortfolios: string;
  criticalStageRisk: string;
  sec10Flag: string;
  affectedLandowners: string;
  monitoredValue: string;
  trackedNationwide: string;
  delayProbOver70: string;
  mandatoryLastResort: string;
  directDBT: string;
  moSPIAligned: string;

  // Filters
  filterAgency: string;
  filterRoute: string;
  filterRisk: string;
  allAgencies: string;
  allRoutes: string;
  allRisks: string;
  criticalRisk: string;
  moderateRisk: string;
  onTrackRisk: string;

  // Statutory Clocks
  statutoryClockTitle: string;
  statutoryContextDescription: string;
  sec11ClockLabel: string;
  nhaiClockLabel: string;
  daysRemaining: string;
  daysOverdue: string;
  elapsedOfMax: string;

  // Project Room Tabs
  tabOverview: string;
  tabEvidence: string;
  tabPrecedents: string;
  tabScenario: string;
  tabDecisions: string;
  tabReviewPacket: string;
  tabComparative: string;

  // Scenario Lab
  scenarioHeading: string;
  scenarioSubhead: string;
  correlationCaveat: string;
  compMultiplierLabel: string;
  compMultiplierHelp: string;
  nocResourceLabel: string;
  nocResourceHelp: string;
  grievanceCampLabel: string;
  grievanceCampHelp: string;
  harvestBufferLabel: string;
  harvestBufferHelp: string;
  applyToActionBtn: string;
  predictedRiskLabel: string;
  riskReductionLabel: string;
  savedDaysLabel: string;

  // Citizen Portal
  citizenTitle: string;
  citizenSubhead: string;
  audioNarrationBtn: string;
  stopAudioBtn: string;
  searchParcelPlaceholder: string;
  fairCompHeading: string;
  solatiumIncludedBadge: string;
  officialGazetteNotices: string;
  submitGrievanceTab: string;
  grievanceSuccessReceipt: string;

  // Alerts & Feed
  alertsTitle: string;
  unreadAlerts: string;
  allSeverities: string;
  acknowledgeBtn: string;
  investigateBtn: string;

  // Common UI
  status: string;
  date: string;
  action: string;
  save: string;
  close: string;
  viewDetails: string;
  downloadBrief: string;
}

export const TRANSLATIONS: Record<'EN' | 'HI', TranslationDictionary> = {
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
