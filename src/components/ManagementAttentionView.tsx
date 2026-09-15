import React, { useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin,
  Layers,
  Target,
  Info,
  ChevronRight,
} from 'lucide-react';
import {
  LandAcquisitionProject,
  ManagementInsight,
  DistrictIntelligence,
} from '../types';
import { generateManagementInsights, calculateDistrictIntelligence } from '../services/portfolioHealthV8';

interface ManagementAttentionViewProps {
  projects: LandAcquisitionProject[];
  onSelectProject: (projectId: string) => void;
  language: 'EN' | 'HI';
}

export const ManagementAttentionView: React.FC<ManagementAttentionViewProps> = ({
  projects,
  onSelectProject,
  language,
}) => {
  const insights = useMemo(() => generateManagementInsights(projects, []), [projects]);
  const districtIntelligence = useMemo(() => calculateDistrictIntelligence(projects), [projects]);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-800 to-rose-500/15 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          {language === 'HI' ? 'प्रबंधन ध्यान दृश्य' : 'Management Attention View'}
        </div>
        <h2 className="text-xl font-extrabold text-white">
          {language === 'HI'
            ? 'आज प्रबंधन को क्या चर्चा करनी चाहिए?'
            : 'What Should Management Discuss Today?'}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {language === 'HI'
            ? 'शीर्ष खतरे, उभरते क्लस्टर, जोखिम वृद्धि, और अनसुलझे उच्च-महत्वपूर्ण निर्भरताएं'
            : 'Top threats, emerging clusters, risk increases, milestones approaching, repeated bottlenecks, and unresolved high-criticality dependencies'}
        </p>
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          Today's Intelligence Brief
        </div>

        {insights.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 text-center text-xs text-slate-400">
            No critical management insights detected at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-slate-800/90 border rounded-2xl p-5 shadow-sm ${
                  insight.severity === 'CRITICAL' ? 'border-rose-500/40' :
                  insight.severity === 'HIGH' ? 'border-amber-500/40' :
                  'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityStyle(insight.severity)}`}>
                        {insight.severity}
                      </span>
                      <span className="text-[10px] text-slate-400">{insight.type.replace(/_/g, ' ')}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                    <p className="text-xs text-slate-300">{insight.description}</p>
                    <div className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-1.5">
                      Recommended: {insight.recommendedDiscussion}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {insight.affectedProjectIds.slice(0, 3).map(projId => {
                        const proj = projects.find(p => p.id === projId);
                        return proj ? (
                          <button
                            key={projId}
                            onClick={() => onSelectProject(projId)}
                            className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {proj.projectCode}
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        ) : null;
                      })}
                      {insight.affectedProjectIds.length > 3 && (
                        <span className="text-[10px] text-slate-500">
                          +{insight.affectedProjectIds.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* District Intelligence */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          District Intelligence
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districtIntelligence.map((district) => (
            <div key={`${district.district}-${district.state}`} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{district.district}</span>
                  <span className="text-xs text-slate-400 font-normal">({district.state})</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{district.projectCount} projects</span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bottleneck Hotspot:</span>
                <p className="mt-0.5 text-amber-300 font-medium">{district.bottleneckHotspot}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900/60 rounded-lg p-1.5 text-center">
                  <div className="text-slate-500">Delay Rate</div>
                  <div className="font-bold text-white">{district.delayRate}%</div>
                </div>
                <div className="bg-slate-900/60 rounded-lg p-1.5 text-center">
                  <div className="text-slate-500">High Risk</div>
                  <div className="font-bold text-rose-400">{district.highRiskPct}%</div>
                </div>
              </div>

              <div className="border-t border-slate-700/60 pt-2 text-[11px] flex items-center justify-between text-slate-400">
                <span>Median Stage: <strong className="text-white">{district.medianStageDuration}d</strong></span>
                <span>Recurring: <strong className="text-amber-300">{district.recurringDependencies[0] || 'None'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
