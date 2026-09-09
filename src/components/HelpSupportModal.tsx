import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  PhoneCall, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  LifeBuoy, 
  Wrench, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  X,
  Volume2,
  FileQuestion
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SupportTicket } from '../types';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'EN' | 'HI';
  onOpenTutorial: () => void;
  onReplaySplash: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenTutorial,
  onReplaySplash
}) => {
  const [activeTab, setActiveTab] = useState<'FAQS' | 'TROUBLESHOOTING' | 'CONTACT' | 'GUIDES'>('FAQS');
  const [faqFilter, setFaqFilter] = useState<'ALL' | 'CITIZEN' | 'OFFICER' | 'LAW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Ticket form state
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('CITIZEN_GRIEVANCE');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  // FAQ Knowledge Base
  const faqs = [
    {
      category: 'CITIZEN',
      q: language === 'HI' ? 'मेरी ज़मीन का सही मुआवज़ा कैसे तय होता है?' : 'How is fair market compensation calculated for my land?',
      a: language === 'HI'
        ? 'RFCTLARR अधिनियम 2013 की धारा 26 के अनुसार, आपकी ज़मीन का मूल्य या तो सरकारी सर्किल दर अथवा पिछले 3 वर्षों में उस क्षेत्र में पंजीकृत उच्चतम 50% बिक्री विलेखों के औसत में से जो भी अधिक हो, उस पर तय होता है। इसके ऊपर 100% सोलेशियम (अनिवार्य दोगुनी राशि) और 12% वार्षिक ब्याज जोड़ा जाता है।'
        : 'Under RFCTLARR Act 2013 Section 26, your base land compensation is calculated as the higher of: (a) Circle Rate / Guideline Value, or (b) Average of top 50% registered sale deeds in the tehsil over the preceding 3 years. On top of this base, a mandatory 100% Solatium (doubling the compensation) is added under Section 30, plus 12% per annum interest from the preliminary notification date.'
    },
    {
      category: 'CITIZEN',
      q: language === 'HI' ? 'क्या मेरी सिंचित बहु-फसली भूमि को आसानी से लिया जा सकता है?' : 'Can my irrigated multi-crop agricultural land be acquired easily?',
      a: language === 'HI'
        ? 'नहीं। धारा 10 के तहत बहु-फसली सिंचित भूमि को केवल "अंतिम विकल्प" के रूप में ही लिया जा सकता है। इसके लिए राज्य सरकार की उच्च स्तरीय समिति की पूर्व अनुमति और पूरे ज़िले के लिए सख्त सीमा (Cap) निर्धारित होती है। ल्युमे का उपग्रह एनडीवीआई स्वतः ऐसी भूमि की पहचान कर नोटिस रोकता है।'
        : 'No. Section 10 of RFCTLARR prohibits the acquisition of irrigated multi-cropped land except as a demonstrable exceptional last resort, strictly capped to a small percentage of net sown area in the district. LUME uses Sentinel-2 NDVI satellite imagery to classify multi-crop parcels automatically to safeguard farmer rights.'
    },
    {
      category: 'CITIZEN',
      q: language === 'HI' ? 'यदि भूमि मेरे स्वर्गीय पिता के नाम पर दर्ज है, तो मुआवज़ा कैसे मिलेगा?' : 'What if the land is registered under my late parent and succession is pending?',
      a: language === 'HI'
        ? 'आपको लंबी कानूनी लड़ाई लड़ने की आवश्यकता नहीं है। ज़िला प्रशासन "विशेष पारिवारिक उत्तराधिकार शिविर" आयोजित करता है, जहाँ ग्राम सभा और लेखपाल की उपस्थिति में हलफनामा प्रस्तुत कर सीधे वारिसों के बैंक खातों में डीबीटी किया जाता है।'
        : 'You do not need to undergo protracted civil litigation. District authorities organize mobile Lekhpal succession camps directly at the Panchayat Bhavan where legal heir affidavits are verified on the spot to enable direct PFMS transfer.'
    },
    {
      category: 'OFFICER',
      q: language === 'HI' ? 'धारा 11 की 12 माह की समयसीमा समाप्त होने पर क्या प्रभाव होता है?' : 'What happens if the Section 11 preliminary notification lapses after 12 months?',
      a: language === 'HI'
        ? 'RFCTLARR अधिनियम की धारा 19(1) के अनुसार, यदि प्रारंभिक अधिसूचना के 12 महीनों के भीतर घोषणा (Declaration) प्रकाशित नहीं की जाती, तो पूरी अधिग्रहण प्रक्रिया स्वतः रद्द हो जाती है। नए सिरे से एसआईए और अधिसूचना करनी पड़ती है। ल्युमे 90 दिन पहले ही चेतावनी अलार्म सक्रिय कर देता है।'
        : 'Under RFCTLARR Section 19(1), if the declaration is not published within 12 months of the Section 11 preliminary notification, the entire acquisition proceeding automatically lapses by law. The acquiring agency must restart SIA and notification from scratch. LUME alerts officers at 90 days remaining to prevent lapse.'
    },
    {
      category: 'OFFICER',
      q: language === 'HI' ? 'एनएचएआई की 336-दिवसीय सांविधिक घड़ी क्या है?' : 'What is NHAI’s 336-Day Section 3 Statutory Clock?',
      a: language === 'HI'
        ? 'राष्ट्रीय राजमार्ग अधिनियम की धारा 3 के अंतर्गत भूमि अधिग्रहण को त्वरित करने के लिए एनएचएआई ने धारा 3A से 3D और पंचाट तक 336 दिनों की सख्त समयसीमा तय की है। ल्युमे हर चरण (3A, 3B, 3C, 3D, 3G) के शेष दिनों की वास्तविक समय गणना करता है।'
        : 'Under the National Highways Act Section 3 framework, NHAI operates on an expedited 336-day timeline from Section 3A notification through Section 3D declaration to Section 3G award and possession. LUME tracks days elapsed vs statutory limits at each milestone.'
    },
    {
      category: 'LAW',
      q: language === 'HI' ? 'ल्युमे का एआई मॉडल किस डेटा पर आधारित है?' : 'What empirical dataset grounds the LUME Machine Learning model?',
      a: language === 'HI'
        ? 'ल्युमे का मॉडल भाटनागर एवं सहयोगियों (arXiv:2307.16285 / जर्नल ऑफ बिग डेटा 2025) के शोध पर आधारित है, जिसे 4.2 मिलियन भारतीय अदालती और इंफ्रास्ट्रक्चर मामलों पर परखा गया है। यह 84.2% सटीकता के साथ विलंब का पूर्वानुमान करता है और मोनोटोनिक बाधाओं के साथ काम करता है।'
        : 'LUME is benchmarked against peer-reviewed empirical research by Bhatnagar et al. (arXiv:2307.16285, 2023 / Journal of Big Data 2025) across 4.2 million Indian lower court and infrastructure delay records. It achieves 84.2% holdout accuracy and enforces monotonic non-increasing risk constraints.'
    }
  ];

  // Troubleshooting Solutions
  const troubleshootingGuides = [
    {
      title: language === 'HI' ? '1. मुझे अपना 14-अंक भू-आधार (ULPIN) या खसरा नहीं मिल रहा है' : '1. Cannot find land parcel using ULPIN or Khasra number',
      icon: Search,
      steps: [
        language === 'HI' ? 'अपने गाँव के नाम या तहसील से खोजें (जैसे "Shirwal" या "Taraura")।' : 'Try searching by village name or tehsil (e.g. "Shirwal" or "Taraura").',
        language === 'HI' ? 'गट / खसरा संख्या में बिना स्पेस के नंबर दर्ज करें (जैसे "418/2")।' : 'Enter the survey number without spaces (e.g. "418/2" or "712/क").',
        language === 'HI' ? 'यदि आपकी भूमि हाल ही में अधिसूचित हुई है, तो तहसील कार्यालय के नोटिस बोर्ड से राजपत्र संख्या की पुष्टि करें।' : 'Check if your parcel is under preliminary Section 11 notification or draft SIA appraisal.'
      ]
    },
    {
      title: language === 'HI' ? '2. स्थिति विवरण की आवाज़ (Speech Narration) नहीं बज रही है' : '2. Status audio narration is not speaking aloud',
      icon: Volume2,
      steps: [
        language === 'HI' ? 'सुनिश्चित करें कि आपके मोबाइल या कंप्यूटर का मीडिया वॉल्यूम चालू है।' : 'Ensure your device media volume is turned up and not muted.',
        language === 'HI' ? 'ब्राउज़र में ध्वनि अनुमति (Audio permission) की जांच करें।' : 'Check browser permissions for Web Speech Synthesis (supported in Chrome, Safari, Edge, Firefox).',
        language === 'HI' ? 'एक बार "Stop" दबाकर दोबारा "🔊 स्थिति सुनें" पर क्लिक करें।' : 'Click the audio button again to reset speech synthesis.'
      ]
    },
    {
      title: language === 'HI' ? '3. परिदृश्य अनुकरण (What-If Simulation) में जोखिम क्यों नहीं बढ़ रहा?' : '3. Why does increasing compensation decrease delay risk monotonically?',
      icon: Sparkles,
      steps: [
        language === 'HI' ? 'यह वैज्ञानिक मोनोटोनिक बाधाओं (Monotonic Constraints) के कारण है।' : 'LUME enforces strict monotonic directional constraints.',
        language === 'HI' ? 'कानूनन जब मुआवज़ा धारा 26 के बाज़ार दर के समीप पहुँचता है, तो किसान आपत्तियां घटती हैं, जिससे विलंब कभी नहीं बढ़ सकता।' : 'When compensation approaches fair market valuation, litigated stay injunctions systematically decrease.',
        language === 'HI' ? 'यह विरोधाभासी सिमुलेशन त्रुटियों को रोकता है।' : 'This mathematically guarantees that policy interventions behave realistically without AI hallucinations.'
      ]
    },
    {
      title: language === 'HI' ? '4. उपग्रह एनडीवीआई पर पीला (AMBER) संकेत क्यों दिख रहा है?' : '4. Why does the satellite view display an AMBER evidence warning?',
      icon: AlertCircle,
      steps: [
        language === 'HI' ? 'मानसून के दौरान घने बादलों के कारण सेंटिनल-2 उपग्रह पिक्सल आंशिक रूप से ढक सकते हैं।' : 'During heavy monsoon cloud cover, optical Sentinel-2 pixels may be obscured.',
        language === 'HI' ? 'ल्युमे ऐसे समय में मनमाना अनुमान लगाने के बजाय पारदर्शी एम्बर संकेत देता है।' : 'LUME Section 9.2 Evidence Health protocol defaults to AMBER to avoid false positive classification.',
        language === 'HI' ? 'स्थानीय पटवारी / लेखपाल के भौतिक फसल निरीक्षण रिकॉर्ड को वरीयता दी जाती है।' : 'Ground inspection reports by the local Patwari/Lekhpal serve as mandatory fallback.'
      ]
    }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = faqFilter === 'ALL' || item.category === faqFilter;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketPhone || !ticketSubject) return;
    const id = `TKT-LUME-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicketId(id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-6 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                {language === 'HI' ? 'ल्युमे सहायता केंद्र एवं मार्गदर्शिका' : 'LUME Help Center & Knowledge Base'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'HI' ? 'सभी उम्र के नागरिकों एवं अधिकारियों के लिए सुलभ' : 'Accessible for all ages, landowners, and officers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/90 px-6 py-2 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('FAQS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'FAQS'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'अक्सर पूछे जाने वाले सवाल' : 'FAQs & Legal'}</span>
          </button>

          <button
            onClick={() => setActiveTab('TROUBLESHOOTING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'TROUBLESHOOTING'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'समस्या निवारण' : 'Troubleshooting Tips'}</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTACT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'CONTACT'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'संपर्क एवं सहायता टिकट' : 'Contact & Support Ticket'}</span>
          </button>

          <button
            onClick={() => setActiveTab('GUIDES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'GUIDES'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'ट्यूटोरियल एवं परिचय' : 'Guided Tutorials'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: FAQS */}
          {activeTab === 'FAQS' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={language === 'HI' ? 'सवाल या नियम खोजें...' : 'Search questions, legal sections, or keywords...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-1">
                  {(['ALL', 'CITIZEN', 'OFFICER', 'LAW'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqFilter(cat)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        faqFilter === cat
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-2">
                {filteredFaqs.map((item, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/50">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full text-left p-3.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {item.q}
                      </span>
                      {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-3.5 pt-0 text-[11px] text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-900/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TROUBLESHOOTING */}
          {activeTab === 'TROUBLESHOOTING' && (
            <div className="space-y-4">
              <div className="text-slate-300">
                {language === 'HI'
                  ? 'अक्सर सामने आने वाली तकनीकी और प्रशासनिक समस्याओं का त्वरित समाधान:'
                  : 'Quick step-by-step resolutions for common technical and administrative hurdles:'}
              </div>

              <div className="space-y-3">
                {troubleshootingGuides.map((guide, idx) => {
                  const Icon = guide.icon;
                  return (
                    <div key={idx} className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{guide.title}</span>
                      </div>
                      <ul className="space-y-1.5 pl-6 list-disc text-slate-300 text-[11px]">
                        {guide.steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SUPPORT TICKET */}
          {activeTab === 'CONTACT' && (
            <div className="space-y-5">
              {/* Toll-Free Helpline Callout */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <PhoneCall className="w-4 h-4" />
                    <span>{language === 'HI' ? 'राष्ट्रीय भूमि अधिग्रहण नागरिक हेल्पलाइन' : 'National Land Acquisition Citizen Helpline'}</span>
                  </div>
                  <div className="text-xl font-black text-white mt-1">
                    1800-11-LUME (5863)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Toll-free • Available 8:00 AM – 8:00 PM IST in 12 Regional Languages
                  </p>
                </div>

                <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-[11px] text-slate-300">
                  <strong className="text-emerald-400 block">WhatsApp Assistant:</strong>
                  <span>+91 94200-LUME-1</span>
                </div>
              </div>

              {/* Support Ticket Submission Form */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-700 pb-2">
                  <h3 className="font-bold text-xs text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-400" />
                    {language === 'HI' ? 'प्राथमिकता सहायता टिकट दर्ज करें' : 'Submit a Priority Support Ticket / Legal Grievance'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Directly routed to the District Land Acquisition Officer (CALA) desk with statutory SLA tracking.
                  </p>
                </div>

                {submittedTicketId ? (
                  <div className="bg-emerald-950/80 border border-emerald-500 rounded-xl p-5 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-emerald-300 text-sm">
                      {language === 'HI' ? 'सहायता टिकट सफलतापूर्वक दर्ज!' : 'Support Ticket Successfully Logged!'}
                    </h4>
                    <div className="font-mono text-base font-bold bg-slate-900 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 inline-block">
                      {submittedTicketId}
                    </div>
                    <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                      An SMS confirmation has been sent. Your assigned officer will review this within 48 statutory hours.
                    </p>
                    <button
                      onClick={() => setSubmittedTicketId(null)}
                      className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={ticketName}
                          onChange={(e) => setTicketName(e.target.value)}
                          placeholder="e.g. Rameshwar Jadhav"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Phone Number (SMS receipt)</label>
                        <input
                          type="tel"
                          required
                          value={ticketPhone}
                          onChange={(e) => setTicketPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Category</label>
                        <select
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="CITIZEN_GRIEVANCE">Citizen Grievance / Boundary Objection</option>
                          <option value="VALUATION_DISPUTE">Valuation & Solatium Calculation Discrepancy</option>
                          <option value="STATUTORY_QUERY">RFCTLARR Section 11 / 19 Statutory Query</option>
                          <option value="SYSTEM_BUG">System Technical Issue / Registry Sync</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Brief summary of request..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Provide full details, parcel numbers, village name, or specific questions..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'HI' ? 'टिकट भेजें एवं रसीद लें' : 'Submit Ticket & Generate Receipt'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GUIDED TUTORIALS & SPLASH REPLAY */}
          {activeTab === 'GUIDES' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-xs text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Interactive Walkthroughs & App Replay</span>
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Need a refresher on how the platform operates? You can launch the guided pitch tour or replay the intro splash screen anytime.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTutorial();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-transform hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch 7-Minute SIH Guided Tour</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onReplaySplash();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Replay LUME Splash Intro</span>
                  </button>
                </div>
              </div>

              {/* Visual Quick Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl space-y-1">
                  <strong className="text-amber-300 block">For Citizens & Landowners:</strong>
                  <p className="text-slate-400 leading-snug">
                    Navigate to "Citizen Jan-Seva" &gt; Enter your 14-digit ULPIN or Khasra No. &gt; Click "🔊 स्थिति सुनें" for speech narration &gt; Inspect your Section 26 fair compensation estimate.
                  </p>
                </div>

                <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl space-y-1">
                  <strong className="text-emerald-400 block">For Officers & DMs:</strong>
                  <p className="text-slate-400 leading-snug">
                    Navigate to "Officer Intelligence" &gt; Pick an acquisition corridor &gt; Inspect SHAP drivers &gt; Open "Scenario Lab" to test compensation adjustments &gt; Commit to Decision Log.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>RFCTLARR 2013 Statutory Compliance Desk</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
