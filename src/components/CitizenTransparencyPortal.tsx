import React, { useState } from 'react';
import { CitizenParcelRecord, CitizenGrievance } from '../types';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  FileText, 
  HelpCircle, 
  Send, 
  PhoneCall, 
  Shield, 
  AlertCircle, 
  Coins, 
  Wheat, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CitizenTransparencyPortalProps {
  parcels: CitizenParcelRecord[];
  initialUlpin?: string;
  language: 'EN' | 'HI';
  onSwitchToOfficer: () => void;
}

export const CitizenTransparencyPortal: React.FC<CitizenTransparencyPortalProps> = ({
  parcels,
  initialUlpin,
  language,
  onSwitchToOfficer
}) => {
  const [searchTerm, setSearchTerm] = useState(initialUlpin || '');
  const [selectedParcel, setSelectedParcel] = useState<CitizenParcelRecord>(
    parcels.find(p => p.ulpin === initialUlpin) || parcels[0]
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  // Grievance Form State
  const [applicantName, setApplicantName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [issueCategory, setIssueCategory] = useState<'COMPENSATION_DISPUTE' | 'BOUNDARY_ERROR' | 'UNRECORDED_TREE_WELL' | 'TENANT_RIGHTS' | 'HARVEST_DELAY'>('COMPENSATION_DISPUTE');
  const [grievanceText, setGrievanceText] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  // Search logic
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const clean = query.trim().toLowerCase();
    if (!clean) return;
    const match = parcels.find(
      p => p.ulpin.toLowerCase().includes(clean) ||
           p.surveyKhasraNo.toLowerCase().includes(clean) ||
           p.village.toLowerCase().includes(clean)
    );
    if (match) {
      setSelectedParcel(match);
    }
  };

  // Text-To-Speech Audio Narration for all ages & accessibility
  const handleSpeakStatus = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = language === 'HI'
      ? `नमस्ते। आपकी भूमि ${selectedParcel.village} गाँव में, खसरा या गट संख्या ${selectedParcel.surveyKhasraNo} का विवरण। वर्तमान स्थिति: ${selectedParcel.currentStageStatusHindi}। उचित मुआवज़ा अनुमान प्रति एकड़ ${selectedParcel.fairCompensationRangePerAcre.minLakh} लाख से ${selectedParcel.fairCompensationRangePerAcre.maxLakh} लाख रुपये है, जिसमें 100 प्रतिशत सोलेशियम शामिल है। अगली सुनवाई ${selectedParcel.nextHearingOrDate} को निर्धारित है।`
      : `Hello. Here is the official status for land parcel ${selectedParcel.surveyKhasraNo} in village ${selectedParcel.village}. Current status: ${selectedParcel.currentStageStatus}. Fair compensation estimate is between ${selectedParcel.fairCompensationRangePerAcre.minLakh} and ${selectedParcel.fairCompensationRangePerAcre.maxLakh} Lakh rupees per acre, including mandatory 100% Solatium. Next hearing is scheduled for ${selectedParcel.nextHearingOrDate}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9; // clear and steady for all ages

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !contactNumber) {
      alert('Please provide name and phone number.');
      return;
    }
    const receipt = `LUME-JAN-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReceipt(receipt);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Banner: Welcoming, friendly, trustworthy for ANY age */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100 border border-white/30">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'HI' ? 'ल्युमे जन-सेवा नागरिक पारदर्शिता मंच' : 'LUME Jan-Seva Citizen Transparency Portal'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {language === 'HI'
              ? 'अपनी ज़मीन की सही जानकारी, अधिकार और उचित मुआवज़ा जानिए'
              : 'Know Your Land Status, Fair Compensation Rights & Next Steps'}
          </h2>

          <p className="text-sm sm:text-base text-amber-100 max-w-3xl leading-relaxed">
            {language === 'HI'
              ? 'दिसंबर 2025 संसदीय स्थायी समिति की सिफ़ारिशों के अनुसार पारदर्शी सूचना। किसी बिचौलिए की ज़रूरत नहीं — अपनी ज़मीन का नंबर दर्ज करें और पूरी जानकारी सरलता से देखें या सुनें।'
              : 'Built directly in response to the Dec 2025 Parliamentary Standing Committee mandate for transparent public land acquisition records. No middlemen, no confusion — view or listen to your verified rights.'}
          </p>

          {/* Quick Search Bar */}
          <div className="pt-3">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'HI' ? '14-अंक भू-आधार (ULPIN) या गट / खसरा नंबर या गाँव लिखें...' : 'Enter 14-digit Bhu-Aadhaar (ULPIN), Survey / Khasra No., or Village...'}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-slate-900/95 text-white placeholder-slate-400 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium shadow-lg border border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Quick Sample Search Pills for ease of use */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-amber-200 font-semibold">
                {language === 'HI' ? 'त्वरित उदाहरण:' : 'Quick Sample Lookups:'}
              </span>
              {parcels.map((p) => (
                <button
                  key={p.ulpin}
                  onClick={() => {
                    setSelectedParcel(p);
                    setSearchTerm(p.surveyKhasraNo);
                  }}
                  className={`px-3 py-1 rounded-full border transition-all text-xs font-semibold ${
                    selectedParcel.ulpin === p.ulpin
                      ? 'bg-white text-slate-900 border-white shadow'
                      : 'bg-black/30 hover:bg-black/50 text-white border-white/20'
                  }`}
                >
                  {p.surveyKhasraNo} ({p.village})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-white font-black text-9xl">
          LUME
        </div>
      </div>

      {/* Main Selected Parcel Details Card */}
      <div className="bg-slate-900 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-white">
        {/* Top Header with Audio Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700 font-bold">
                ULPIN: {selectedParcel.ulpin}
              </span>
              <span className="bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-semibold">
                {selectedParcel.landType}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mt-2">
              {selectedParcel.surveyKhasraNo} • Village: {selectedParcel.village}
            </h3>
            <p className="text-sm text-slate-400">
              {selectedParcel.tehsil}, {selectedParcel.district}, {selectedParcel.state} • Landowner: <strong className="text-slate-200">{selectedParcel.ownerNameMasked}</strong> ({selectedParcel.landAreaAcre} Acres)
            </p>
            <div className="text-xs text-amber-400 mt-1">
              Project: {selectedParcel.projectTitle}
            </div>
          </div>

          {/* Large Accessible Audio Listen Button (for elderly citizens & ease of use) */}
          <button
            onClick={handleSpeakStatus}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span className="text-sm">
              {isSpeaking 
                ? (language === 'HI' ? 'आवाज़ रोकें' : 'Stop Listening') 
                : (language === 'HI' ? '🔊 स्थिति सुनें (Audio)' : '🔊 Listen Aloud (Voice)')}
            </span>
          </button>
        </div>

        {/* 4-Step Plain Language Progress Pipeline */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
            {language === 'HI' ? 'आपकी ज़मीन की प्रक्रिया के 4 चरण:' : '4-Step Journey of Your Land Acquisition:'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-emerald-500/50 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. {language === 'HI' ? 'सर्वे एवं पहचान' : 'Survey & Notice'}</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {language === 'HI' ? 'धारा 4 / 3A प्रारंभिक अधिसूचना पूर्ण' : 'Sec 4 SIA / Sec 3A identified'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400 space-y-1 ring-2 ring-amber-400/30">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>2. {language === 'HI' ? 'मूल्यांकन एवं सुनवाई' : 'Valuation & Hearing'}</span>
              </div>
              <p className="text-amber-100 text-[11px] font-medium">
                {language === 'HI' ? '● वर्तमान स्थिति: दावा प्रस्तुत करने का समय' : '● Current Stage: Submit registered sale deeds'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1 opacity-70">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <span>3. {language === 'HI' ? 'अंतिम पंचाट (Award)' : 'Final Award'}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {language === 'HI' ? 'धारा 23 / 3G के तहत अंतिम आदेश' : 'Compensation order formally issued'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1 opacity-70">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                <span>4. {language === 'HI' ? 'खाते में भुगतान (PFMS)' : 'Direct Bank Credit'}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {language === 'HI' ? 'सीधे आपके बैंक खाते में राशि हस्तांतरण' : 'Direct DB transfer into Aadhaar account'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Status Box (Large & Ultra-Clear) */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {language === 'HI' ? 'वर्तमान स्थिति विवरण (Official Status):' : 'Current Official Status:'}
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {language === 'HI' ? selectedParcel.currentStageStatusHindi : selectedParcel.currentStageStatus}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">{language === 'HI' ? 'अगला वैधानिक कदम:' : 'Next Statutory Action:'}</span>
              <strong className="text-emerald-300 font-medium text-sm mt-0.5 block">
                {language === 'HI' ? selectedParcel.statutoryNextStepHindi : selectedParcel.statutoryNextStep}
              </strong>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">{language === 'HI' ? 'अगली सुनवाई / शिविर की तिथि:' : 'Next Hearing / Camp Schedule:'}</span>
              <strong className="text-amber-300 font-medium text-sm mt-0.5 block">
                {selectedParcel.nextHearingOrDate}
              </strong>
            </div>
          </div>
        </div>

        {/* Fair Compensation Range (RFCTLARR Section 26 Explainer) */}
        <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                {language === 'HI' ? 'उचित मुआवज़ा अधिकार (RFCTLARR धारा 26)' : 'Statutory Fair Compensation Range (RFCTLARR Section 26)'}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'HI'
                  ? 'कानून के अनुसार: सर्किल दर या तहसील में उच्चतम 50% बिक्री विलेखों का औसत (जो भी अधिक हो) + 100% सोलेशियम (दोगुनी राशि)।'
                  : 'By Law: Higher of Circle Rate or Average of top 50% registered sale deeds + Mandatory 100% Solatium (doubling the compensation).'}
              </p>
            </div>

            <span className="text-[11px] bg-emerald-900/60 text-emerald-200 border border-emerald-700 px-3 py-1 rounded-full font-bold self-start">
              100% Solatium Included
            </span>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400">
                {language === 'HI' ? 'इस क्षेत्र में अनुमानित उचित दायरा:' : 'Locality Fair Estimated Range (per acre):'}
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                ₹{selectedParcel.fairCompensationRangePerAcre.minLakh} Lakh – ₹{selectedParcel.fairCompensationRangePerAcre.maxLakh} Lakh / Acre
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 max-w-xs leading-tight">
              <strong className="text-slate-300 block mb-1">
                {language === 'HI' ? 'गोपनीयता सुरक्षा:' : 'Privacy Protection Rule:'}
              </strong>
              {language === 'HI'
                ? 'निजी बैंक खाते कभी सार्वजनिक नहीं किए जाते। केवल स्थानीय तहसील का वास्तविक दायरा दिखाया जाता है ताकि कोई बिचौलिया आपको कम राशि न बताए।'
                : 'Individual private bank payments are never exposed (PRD Sec 16). Only anonymized tehsil ranges are shown so no broker can mislead you.'}
            </div>
          </div>
        </div>

        {/* Official Gazette Notices Table */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
            {language === 'HI' ? 'आधिकारिक राजपत्र एवं अधिसूचनाएं:' : 'Verified Official Gazette Notices & Orders:'}
          </h4>

          <div className="space-y-2">
            {selectedParcel.officialNotices.map((notice, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-white block">{notice.title}</strong>
                    <span className="text-slate-400 text-[11px] font-mono">Gazette Ref: {notice.gazetteRef} • {notice.date}</span>
                  </div>
                </div>

                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 cursor-pointer hover:underline">
                  <span>Verified Notice</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Minute Citizen Grievance / Spot-Hearing Request Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              {language === 'HI' ? 'आपत्ति दर्ज करें या शिविर में व्यक्तिगत सुनवाई मांगें' : 'Submit Objection, Boundary Query, or Request Spot-Hearing'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'HI'
                ? 'सीधे सक्षम प्राधिकारी (CALA / DLAO) के पास पंजीकृत होता है। आपको तुरंत पावती रसीद नंबर मिलेगा।'
                : 'Directly logged into the Competent Authority priority queue. Generates an instant verifiable receipt number.'}
            </p>
          </div>
        </div>

        {submittedReceipt ? (
          <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-300">
              {language === 'HI' ? 'आपकी आपत्ति सफलतापूर्वक दर्ज हो गई है!' : 'Your Grievance Has Been Registered Successfully!'}
            </h4>
            <div className="font-mono text-xl font-black bg-slate-900 text-amber-400 py-2 px-4 rounded-xl border border-amber-500/40 inline-block">
              Receipt No: {submittedReceipt}
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {language === 'HI'
                ? 'सक्षम प्राधिकारी के कार्यालय द्वारा 7 कार्यदिवसों के भीतर आपसे संपर्क किया जाएगा। सुनवाई की तिथि का एसएमएस भेजा गया है।'
                : 'The Land Acquisition Officer will review your submission within 7 working days. Please save this receipt number for your records.'}
            </p>
            <button
              onClick={() => setSubmittedReceipt(null)}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
            >
              Submit Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {language === 'HI' ? 'आपका नाम (Applicant Name)' : 'Your Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Rameshwar Jadhav"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {language === 'HI' ? 'मोबाइल नंबर (Mobile Number for SMS)' : 'Mobile Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {language === 'HI' ? 'समस्या का प्रकार (Category)' : 'Issue Category'}
                </label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="COMPENSATION_DISPUTE">Valuation / Market Sale Deed Difference (Sec 26)</option>
                  <option value="BOUNDARY_ERROR">Land Survey / Boundary Pegging Error</option>
                  <option value="UNRECORDED_TREE_WELL">Unrecorded Trees, Well, Borewell, or Farmhouse</option>
                  <option value="TENANT_RIGHTS">Joint Khata Heirship / Succession Affidavit</option>
                  <option value="HARVEST_DELAY">Request Grace Period for Standing Crop Harvest</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  {language === 'HI' ? 'संबद्ध भूमि संख्या (Parcel Ref)' : 'Referenced Parcel'}
                </label>
                <input
                  type="text"
                  disabled
                  value={`${selectedParcel.surveyKhasraNo} (${selectedParcel.village})`}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                {language === 'HI' ? 'अपनी बात या अनुरोध विस्तार से लिखें (Details)' : 'Describe Your Request or Concern in Detail'}
              </label>
              <textarea
                rows={3}
                required
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder="Write your concerns here in your own words (English, Hindi, or local language)..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'HI' ? 'आपत्ति दर्ज करें एवं पावती प्राप्त करें' : 'Submit & Receive Official Receipt'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Citizen Rights & FAQ Accordion (For every age group) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-white">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          {language === 'HI' ? 'अक्सर पूछे जाने वाले सवाल एवं आपके अधिकार' : 'Know Your Fundamental Land Rights (RFCTLARR 2013)'}
        </h3>

        <div className="space-y-2">
          {[
            {
              q: language === 'HI' ? 'क्या मेरी बहु-फसली सिंचित भूमि को आसानी से अधिग्रहित किया जा सकता है?' : 'Can my multi-crop irrigated land be acquired easily?',
              a: language === 'HI'
                ? 'नहीं। RFCTLARR अधिनियम 2013 की धारा 10 के अनुसार, बहु-फसली सिंचित भूमि को केवल "अंतिम विकल्प" के रूप में ही लिया जा सकता है, और इसके लिए राज्य सरकार की विशेष अनुमति व वैकल्पिक कृषि निवेश अनिवार्य है।'
                : 'No. Under RFCTLARR Section 10, irrigated multi-cropped land cannot be acquired except as a demonstrable last resort, strictly capped per district, with mandatory compensatory agricultural investment.'
            },
            {
              q: language === 'HI' ? 'उचित मुआवज़ा (Solatium) क्या होता है?' : 'What is Solatium and how does it double my compensation?',
              a: language === 'HI'
                ? 'भूमि की बाज़ार दर तय होने के बाद, कानूनन सरकार को 100% सोलेशियम (अतिरिक्त 100% सांत्वना राशि) जोड़ना होता है। उदाहरण के लिए, यदि मूल मूल्यांकन 15 लाख रुपये है, तो कुल मुआवज़ा 30 लाख रुपये प्रति एकड़ मिलेगा।'
                : 'Under Section 30 of RFCTLARR, a 100% Solatium (mandatory compensation doubling) must be added on top of the calculated market value, plus 12% annual interest from the SIA date.'
            },
            {
              q: language === 'HI' ? 'यदि खसरा में मेरे पूर्वज का नाम है और संयुक्त खाता है, तो क्या करें?' : 'What if the land is registered under my late ancestor or a joint family Khata?',
              a: language === 'HI'
                ? 'आपको किसी अदालत में सालों तक भटकने की आवश्यकता नहीं है। ल्युमे के माध्यम से आपका ज़िला प्रशासन गाँव में ही "विशेष पारिवारिक उत्तराधिकार शिविर" आयोजित करता है, जहाँ हलफनामा देकर सीधे नाम दर्ज किया जाता है।'
                : 'You do not have to endure protracted civil litigation. District authorities organize mobile Lekhpal succession camps directly at the Panchayat Bhavan to certify heirship affidavits on the spot.'
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/40">
              <button
                onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between text-sm font-bold text-slate-200 hover:text-white"
              >
                <span>{item.q}</span>
                {faqOpenIdx === idx ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {faqOpenIdx === idx && (
                <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
