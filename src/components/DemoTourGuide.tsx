import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sliders, 
  Compass, 
  FileText,
  Volume2
} from 'lucide-react';

export interface TourStep {
  id: number;
  timeWindow: string;
  title: string;
  subhead: string;
  pitchScript: string;
  actionHint: string;
  targetView: 'OFFICER' | 'CITIZEN' | 'GIS' | 'TRUST_REGISTRY';
  targetTab?: string;
  targetProjectId?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 0,
    timeWindow: '0:00 - 1:00',
    title: '1. Portfolio Command Center',
    subhead: 'Prioritizing the Operational Risk at Scale',
    pitchScript: '"Government already records the acquisition process across BhoomiRashi, LACRRIS, and NGDRS. LUME makes those records predictive — so the next bottleneck becomes visible while there is still time to act. Here, our Stage-Risk Engine flags NH-48 and the Dedicated Freight Corridor at 84% and 91% risk."',
    actionHint: 'Notice the statutory clock countdown (336-day NHAI clock & 12-month RFCTLARR Sec 11 clock).',
    targetView: 'OFFICER',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 1,
    timeWindow: '1:00 - 2:00',
    title: '2. Project Intelligence Room',
    subhead: 'Understanding the Granular Stage State',
    pitchScript: '"We never collapse land acquisition into an opaque number. We decompose it stage-by-stage. For NH-48, we are in Section 3G Valuation. 284 days have elapsed out of the 336-day self-imposed clock. Only 52 days remain."',
    actionHint: 'Review the statutory process pipeline timeline from Section 4 SIA to Section 38 Disbursement.',
    targetView: 'OFFICER',
    targetTab: 'OVERVIEW',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 2,
    timeWindow: '2:00 - 3:00',
    title: '3. Prediction & Critical Path',
    subhead: 'Connecting Bottlenecks to Downstream Dependencies',
    pitchScript: '"LUME predicts an 84% probability of missing the milestone with an expected 94-day overshoot. The Critical Path View immediately reveals why: a pending compensation dispute in Khandala and a Forest Clearance under PARIVESH."',
    actionHint: 'Observe how the dependency engine isolates the exact bottleneck blocking contractor possession.',
    targetView: 'OFFICER',
    targetTab: 'OVERVIEW',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 3,
    timeWindow: '3:00 - 4:00',
    title: '4. Evidence Trace & Precedent Memory',
    subhead: 'Proving Why with SHAP and Comparable History',
    pitchScript: '"Every prediction carries provenance. The SHAP attribution engine traces back to NGDRS sale deeds showing a 36% compensation gap, and High Court writ petitions. In the Precedent tab, we see the Khed-Chiplun 4-laning corridor faced this exact issue 95 km away and resolved it via Lok Adalat."',
    actionHint: 'Check the Evidence Health indicator (GREEN) and the Precedent match similarity of 92%.',
    targetView: 'OFFICER',
    targetTab: 'EVIDENCE',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 4,
    timeWindow: '4:00 - 5:00',
    title: '5. The Intervention Scenario Lab',
    subhead: 'What-If Simulation with Monotonic Constraints',
    pitchScript: '"Here is our signature interaction: The Scenario Lab. An officer can test: What if we raise the compensation offer by 35% toward the Section 26 fair-market value? Watch the risk drop from 84% down to 41%. Notice our scientific boundary: this is modelled sensitivity under historical correlation, monotonically constrained so higher compensation never increases risk."',
    actionHint: 'Try moving the slider or clicking the quick scenario buttons to see the risk curve adjust instantly!',
    targetView: 'OFFICER',
    targetTab: 'SCENARIO',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 5,
    timeWindow: '5:00 - 6:00',
    title: '6. Priority Queue & Decision Log',
    subhead: 'Moving from Prediction to Accountable Human Action',
    pitchScript: '"Prediction without action is useless. The Intervention Priority Index transparently ranks candidate follow-ups: risk movement × urgency × criticality. The Collector assigns a joint Lok Adalat review, and the decision is permanently logged in the audit trail."',
    actionHint: 'Inspect the auditable decision record and review packet exportable for the District Collector.',
    targetView: 'OFFICER',
    targetTab: 'DECISIONS',
    targetProjectId: 'proj-nh48-pune-satara'
  },
  {
    id: 6,
    timeWindow: '6:00 - 7:00',
    title: '7. Citizen Jan-Seva & Trust Center',
    subhead: 'Transparency for Every Citizen & Validated ML Trust',
    pitchScript: '"LUME answers the Dec 2025 Parliamentary Standing Committee mandate: publish transparent compensation and R&R status. Our Jan-Seva portal is built so any age group — from an elderly farmer needing voice narration to a youth checking a survey number — can see fair compensation ranges and submit hearings with dignity."',
    actionHint: 'Switch to the Citizen Jan-Seva portal to test audio narration, bilingual Hindi/English, and survey lookup!',
    targetView: 'CITIZEN'
  }
];

interface DemoTourGuideProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCloseTour: () => void;
  onGoToStep: (index: number) => void;
}

export const DemoTourGuide: React.FC<DemoTourGuideProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onCloseTour,
  onGoToStep
}) => {
  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[480px] z-50 bg-slate-900/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl shadow-2xl shadow-black/80 text-white overflow-hidden transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 px-4 py-2 flex items-center justify-between text-slate-950 font-bold text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
          <span className="uppercase tracking-wider">SIH 2026 Pitch Walkthrough Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-mono text-[11px]">
            {currentStep.timeWindow}
          </span>
          <button 
            onClick={onCloseTour}
            className="hover:bg-slate-950/20 p-1 rounded-full text-slate-950"
            title="Exit tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3">
        {/* Step Progress Pills */}
        <div className="flex items-center gap-1 justify-between">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => onGoToStep(idx)}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-amber-400 ring-2 ring-amber-400/40'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-700'
              }`}
              title={`Jump to step ${idx + 1}: ${step.title}`}
            />
          ))}
        </div>

        <div>
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
            Step {currentStepIndex + 1} of {TOUR_STEPS.length}
          </div>
          <h3 className="text-base font-bold text-white leading-snug">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-300 font-medium">
            {currentStep.subhead}
          </p>
        </div>

        {/* Pitch Talking Point Box */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs leading-relaxed text-slate-200">
          <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
            <Volume2 className="w-3 h-3" />
            Judge Demo Script (What to say):
          </div>
          <p className="italic text-slate-100 font-sans">
            {currentStep.pitchScript}
          </p>
        </div>

        {/* Interactive Hint */}
        <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/40 rounded-lg px-2.5 py-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>{currentStep.actionHint}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] text-slate-400">
            {currentStepIndex + 1} / {TOUR_STEPS.length}
          </span>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md shadow-amber-500/20"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
