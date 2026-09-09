import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Scale, 
  Info, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export interface IPIWeights {
  w1RiskMovement: number;   // default: 0.35
  w2Urgency: number;        // default: 0.30
  w3Criticality: number;    // default: 0.20
  w4Actionability: number;  // default: 0.15
  version: string;
}

interface IPIConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: IPIWeights;
  onSaveWeights: (newWeights: IPIWeights) => void;
  language: 'EN' | 'HI';
}

export const IPIConfiguratorModal: React.FC<IPIConfiguratorModalProps> = ({
  isOpen,
  onClose,
  weights,
  onSaveWeights,
  language
}) => {
  const [w1, setW1] = useState(weights.w1RiskMovement);
  const [w2, setW2] = useState(weights.w2Urgency);
  const [w3, setW3] = useState(weights.w3Criticality);
  const [w4, setW4] = useState(weights.w4Actionability);

  if (!isOpen) return null;

  const total = Math.round((w1 + w2 + w3 + w4) * 100) / 100;
  const isNormalized = Math.abs(total - 1.0) < 0.01;

  const handleResetDefaults = () => {
    setW1(0.35);
    setW2(0.30);
    setW3(0.20);
    setW4(0.15);
  };

  const handleSave = () => {
    onSaveWeights({
      w1RiskMovement: w1,
      w2Urgency: w2,
      w3Criticality: w3,
      w4Actionability: w4,
      version: `v${Date.now().toString().slice(-4)}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'HI' ? 'हस्तक्षेप प्राथमिकता सूचकांक (IPI) कॉन्फ़िगरेशन' : 'Intervention Priority Index (IPI) Configuration (F09)'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                PRD Section 14.2 Formula Weights Tuning
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mathematical Formula Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Transparent Mathematical Ranking Formula:</span>
          </div>
          <div className="font-mono text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto">
            IPI = ({w1.toFixed(2)} × RiskMovement) + ({w2.toFixed(2)} × Urgency) + ({w3.toFixed(2)} × Criticality) + ({w4.toFixed(2)} × Actionability)
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Sum of Weights: <strong className={isNormalized ? 'text-emerald-400' : 'text-rose-400'}>{total.toFixed(2)} / 1.00</strong></span>
            <span>Current Version: {weights.version}</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs">
          {/* w1: Risk Movement */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="text-white font-bold">w₁: Risk Movement (Simulated Delta)</span>
              <span className="font-mono text-emerald-400 font-bold">{(w1 * 100).toFixed(0)}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Weights how dramatically an intervention reduces delay probability in the Scenario Lab.
            </p>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={w1}
              onChange={(e) => setW1(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* w2: Urgency */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="text-white font-bold">w₂: Urgency (Days Remaining to Statutory Deadline)</span>
              <span className="font-mono text-amber-400 font-bold">{(w2 * 100).toFixed(0)}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prioritizes corridors where the NHAI 336-day clock or RFCTLARR Sec 11 12-month limit is closest to lapsing.
            </p>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={w2}
              onChange={(e) => setW2(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* w3: Criticality */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="text-white font-bold">w₃: Project Criticality (Capex & Strategic Corridor)</span>
              <span className="font-mono text-emerald-400 font-bold">{(w3 * 100).toFixed(0)}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Accounts for multi-thousand crore freight/highway corridors over local feeder acquisitions.
            </p>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={w3}
              onChange={(e) => setW3(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* w4: Actionability */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="text-white font-bold">w₄: Actionability (Clear Legal Playbook Exists)</span>
              <span className="font-mono text-teal-400 font-bold">{(w4 * 100).toFixed(0)}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Prioritizes issues where the Collector or CALA has immediate authority to order Lok Adalats or revise rates.
            </p>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={w4}
              onChange={(e) => setW4(parseFloat(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset PRD Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold hover:bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
            >
              Apply Versioned Weights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
