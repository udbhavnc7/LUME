import React, { useState, useMemo } from 'react';
import {
  Cpu,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  LandAcquisitionProject,
  ModelEvaluationRun,
  CalibrationPoint,
} from '../types';
import { evaluateModel, calculateCalibration } from '../services/modelEvaluationService';
import { getProjectSnapshots } from '../data/demoDataV7';
import { kaplanMeier, SurvivalEstimate } from '../services/survivalService';
import { InsufficientDataState } from './InsufficientDataState';

interface ModelEvaluationScreenProps {
  projects: LandAcquisitionProject[];
  language: 'EN' | 'HI';
}

export const ModelEvaluationScreen: React.FC<ModelEvaluationScreenProps> = ({
  projects,
  language,
}) => {
  const historicalSnapshots = useMemo(() => {
    const snapshots: Record<string, ReturnType<typeof getProjectSnapshots>> = {};
    for (const p of projects) {
      snapshots[p.id] = getProjectSnapshots(p.id);
    }
    return snapshots;
  }, [projects]);

  const evaluation = useMemo(
    () => evaluateModel(projects, historicalSnapshots),
    [projects, historicalSnapshots]
  );

  const survival: SurvivalEstimate = useMemo(() => kaplanMeier([]), []);

  const getMetricStatus = (value: number, threshold: number, invert = false) => {
    const isGood = invert ? value < threshold : value > threshold;
    return isGood ? 'text-emerald-400' : value > threshold * 0.8 ? 'text-amber-400' : 'text-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          {language === 'HI' ? 'मॉडल मूल्यांकन एवं सत्यापन' : 'Model Evaluation & Validation'}
        </div>
        <h2 className="text-xl font-extrabold text-white">
          {language === 'HI'
            ? 'वास्तविक मॉडल प्रदर्शन मीट्रिक्स'
            : 'Real Model Performance Metrics'}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {language === 'HI'
            ? 'उपलब्ध डेटा से गणना की गई वास्तविक मीट्रिक्स। अपर्याप्त डेटा के मामलों में "अपर्याप्त डेटा" प्रदर्शित किया जाता है।'
            : 'Metrics calculated from available data. Insufficient data cases show "INSUFFICIENT DATA" instead of fabricated scores.'}
        </p>
      </div>

      {/* Evaluation Period */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-3">Evaluation Period</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900 rounded-lg p-2">
            <div className="text-slate-400">Training</div>
            <div className="text-white font-bold">{evaluation.trainingPeriod}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-2">
            <div className="text-slate-400">Validation</div>
            <div className="text-white font-bold">{evaluation.validationPeriod}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-2">
            <div className="text-slate-400">Holdout</div>
            <div className="text-white font-bold">{evaluation.holdoutPeriod}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-2">
            <div className="text-slate-400">Predictions</div>
            <div className="text-white font-bold">{evaluation.datasetSize}</div>
          </div>
        </div>
      </div>

      {/* Model Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Baseline (Historical Duration)</div>
          <div className="text-2xl font-black text-slate-300 mt-1">
            {evaluation.baselineAuc > 0 ? `${(evaluation.baselineAuc * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Brier: {evaluation.baselineBrier > 0 ? evaluation.baselineBrier.toFixed(3) : 'N/A'}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-4 bg-gradient-to-b from-emerald-950/20 to-transparent">
          <div className="text-emerald-400 text-xs font-medium">Champion (Gradient Boosted)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {evaluation.championAuc > 0 ? `${(evaluation.championAuc * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Brier: {evaluation.championBrier > 0 ? evaluation.championBrier.toFixed(3) : 'N/A'}
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Calibration Error</div>
          <div className={`text-2xl font-black mt-1 ${getMetricStatus(evaluation.calibrationError, 0.05, true)}`}>
            {evaluation.calibrationError > 0 ? evaluation.calibrationError.toFixed(3) : 'INSUFFICIENT DATA'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: &lt; 0.05
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          Detailed Metrics
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">ROC-AUC</div>
            <div className={`text-lg font-bold mt-0.5 ${getMetricStatus(evaluation.championAuc, 0.7)}`}>
              {evaluation.championAuc > 0 ? evaluation.championAuc.toFixed(3) : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">PR-AUC</div>
            <div className={`text-lg font-bold mt-0.5 ${getMetricStatus(evaluation.championPrAuc, 0.6)}`}>
              {evaluation.championPrAuc > 0 ? evaluation.championPrAuc.toFixed(3) : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Precision@K</div>
            <div className={`text-lg font-bold mt-0.5 ${getMetricStatus(evaluation.precisionAtK, 0.7)}`}>
              {evaluation.precisionAtK > 0 ? `${(evaluation.precisionAtK * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Recall@K</div>
            <div className={`text-lg font-bold mt-0.5 ${getMetricStatus(evaluation.recallAtK, 0.7)}`}>
              {evaluation.recallAtK > 0 ? `${(evaluation.recallAtK * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Median Warning Lead Time</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {evaluation.medianWarningLeadTimeDays > 0 ? `${evaluation.medianWarningLeadTimeDays}d` : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Coverage</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {evaluation.coveragePct > 0 ? `${evaluation.coveragePct}%` : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Brier Score</div>
            <div className={`text-lg font-bold mt-0.5 ${getMetricStatus(evaluation.championBrier, 0.1, true)}`}>
              {evaluation.championBrier > 0 ? evaluation.championBrier.toFixed(3) : 'INSUFFICIENT DATA'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 text-center">
            <div className="text-slate-400 text-[10px]">Baseline Accuracy</div>
            <div className="text-lg font-bold text-slate-300 mt-0.5">
              {evaluation.baselineAuc > 0 ? `${(evaluation.baselineAuc * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
            </div>
          </div>
        </div>
      </div>

      {/* Kaplan–Meier / Model Governance */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Kaplan–Meier survival strata &amp; model governance
        </div>
        {survival.status === 'ABSENT' ? (
          <InsufficientDataState
            language={language}
            title={language === 'HI' ? 'जीवित रहने का अनुमान अनुपलब्ध' : 'Survival estimate unavailable'}
            description={
              language === 'HI'
                ? `n बहुत कम है (${survival.reason ?? 'EMPTY_REFERENCE_SET'})। प्रति जीवित रहने वक्र केवल पर्याप्त पुष्ट टाइमलाइन पर दिखता है।`
                : `Reference set too small (${survival.reason ?? 'EMPTY_REFERENCE_SET'}). Curves and CIs render only from confirmed timelines with adequate n.`
            }
          />
        ) : (
          <div className="text-xs text-slate-300">
            n={survival.n} • median={survival.medianDays ?? '—'}d
          </div>
        )}
        <div className="mt-3 text-[11px] text-slate-400 space-y-1">
          <p>Abstention threshold: n &lt; 5 → INSUFFICIENT_DATA (configurable).</p>
          <p>Calibration, Brier, and AUC remain ABSENT until a confirmed evaluation run exists.</p>
          <p>Playbooks and delay effects are labeled DRAFT: pending expert review.</p>
        </div>
      </div>

      {/* Insufficient Data Warning */}
      {evaluation.insufficientDataMetrics.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-700/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
            <AlertTriangle className="w-4 h-4" />
            Insufficient Data for Some Metrics
          </div>
          <div className="text-xs text-slate-300">
            The following metrics cannot be reliably calculated with current data:
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {evaluation.insufficientDataMetrics.map((metric, idx) => (
              <span key={idx} className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                {metric}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Responsible AI Boundaries */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
        <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-2">
          <ShieldCheck className="w-3 h-3" />
          Responsible AI Boundaries
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <p>LUME never determines legal rights, compensation, citizen eligibility, or issues government orders.</p>
          <p>LUME predicts process risk, explains evidence, finds precedent, and prioritizes investigations.</p>
          <p>All decisions require human officer review and approval.</p>
        </div>
      </div>
    </div>
  );
};
