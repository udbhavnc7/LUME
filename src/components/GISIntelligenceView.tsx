import React, { useState } from 'react';
import { LandAcquisitionProject } from '../types';
import { 
  MapPin, 
  Layers, 
  Satellite, 
  Wheat, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Maximize2, 
  Filter, 
  Info,
  CheckCircle2,
  Eye,
  Activity
} from 'lucide-react';

interface GISIntelligenceViewProps {
  projects: LandAcquisitionProject[];
  onSelectProject: (projectId: string) => void;
  language: 'EN' | 'HI';
}

export const GISIntelligenceView: React.FC<GISIntelligenceViewProps> = ({
  projects,
  onSelectProject,
  language
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);
  const [showSection10SatelliteLayer, setShowSection10SatelliteLayer] = useState(true);
  const [showPrecedentsOnMap, setShowPrecedentsOnMap] = useState(true);
  const [satelliteViewMode, setSatelliteViewMode] = useState<'NDVI_VEGETATION' | 'CADASTRAL_BOUNDARY' | 'INFRA_CORRIDOR'>('NDVI_VEGETATION');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6">
      {/* Top GIS Title Banner */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Satellite className="w-5 h-5 text-emerald-400" />
              GIS Geospatial Intelligence & Section 10 Satellite Verification (F10)
            </h2>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
              Sentinel-2 / ISRO Bhuvan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Multi-temporal satellite NDVI classification auto-flags RFCTLARR Section 10 "irrigated multi-cropped land" before notifications are gazetted, avoiding invalid acquisition challenges in High Court.
          </p>
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowSection10SatelliteLayer(!showSection10SatelliteLayer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              showSection10SatelliteLayer
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>Sec 10 Multi-Crop NDVI Layer</span>
          </button>

          <button
            onClick={() => setShowPrecedentsOnMap(!showPrecedentsOnMap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              showPrecedentsOnMap
                ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Historical Precedents</span>
          </button>
        </div>
      </div>

      {/* Main Map & Inspector Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">
          {/* Top Map Overlays */}
          <div className="flex items-center justify-between z-10">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 shadow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Coordinates: {activeProject.coordinates.lat.toFixed(3)}° N, {activeProject.coordinates.lng.toFixed(3)}° E</span>
            </div>

            {/* Satellite Spectrum Mode Buttons */}
            <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => setSatelliteViewMode('NDVI_VEGETATION')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  satelliteViewMode === 'NDVI_VEGETATION' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDVI Crops
              </button>
              <button
                onClick={() => setSatelliteViewMode('CADASTRAL_BOUNDARY')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  satelliteViewMode === 'CADASTRAL_BOUNDARY' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cadastral
              </button>
              <button
                onClick={() => setSatelliteViewMode('INFRA_CORRIDOR')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  satelliteViewMode === 'INFRA_CORRIDOR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Right-of-Way
              </button>
            </div>
          </div>

          {/* Simulated Satellite Stage Canvas / Graphic */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="satelliteGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#satelliteGlow)" />
            </svg>
          </div>

          {/* Interactive Geographic Corridor Canvas */}
          <div className="relative z-10 my-auto py-12 px-6 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full">
                Interactive Corridor Corridor Canvas
              </span>
              <h3 className="text-xl font-black text-white">
                {activeProject.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Corridor Stretch: {activeProject.totalAreaHectares} Hectares across {activeProject.tehsil} Tehsil
              </p>
            </div>

            {/* Visual Corridor Pipeline with Parcel Pins */}
            <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-800">
                <span>Start: Chainage 0+000 km</span>
                <span className="text-emerald-400 font-bold">Corridor Center</span>
                <span>End: Chainage 38+400 km</span>
              </div>

              {/* Highway / Rail Alignment Graphic Line */}
              <div className="relative h-20 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-around px-4 overflow-hidden">
                <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-teal-500 rounded-full" />
                
                {/* Parcel Checkpoints */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center ring-4 ring-emerald-950">
                    P1
                  </div>
                  <span className="text-[9px] text-slate-300 mt-1 font-mono">Sec 38 Paid</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white font-bold text-[11px] flex items-center justify-center ring-4 ring-rose-950 animate-bounce">
                    P2
                  </div>
                  <span className="text-[9px] text-rose-300 mt-1 font-mono font-bold">Sec 10 Flag</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center ring-4 ring-amber-950">
                    P3
                  </div>
                  <span className="text-[9px] text-amber-300 mt-1 font-mono">Sec 26 Gap</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center ring-4 ring-teal-950">
                    P4
                  </div>
                  <span className="text-[9px] text-slate-300 mt-1 font-mono">Possession</span>
                </div>
              </div>

              {/* Satellite NDVI Detection Callout */}
              {showSection10SatelliteLayer && activeProject.multiCropIrrigatedExposure && (
                <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3 text-xs flex items-center gap-3">
                  <Wheat className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-amber-200 text-[11px] leading-snug">
                    <strong>NDVI Multi-Temporal Classification:</strong> Parcel P2 (Gut 418/2) shows NDVI &gt; 0.62 consistently across Kharif and Rabi. RFCTLARR Section 10 "demonstrable last resort" statutory certificate required.
                  </div>
                </div>
              )}
            </div>

            {/* Quick Switch Corridor Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[11px] text-slate-400 font-mono">Switch Project Corridor:</span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    p.id === activeProject.id
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {p.projectCode.split('/')[3] || p.projectCode}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Map Legend */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-300 text-[11px]">Critical Delay Risk (&gt;70%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-300 text-[11px]">Moderate Risk (30-70%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300 text-[11px]">On Track (&lt;30%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 text-[11px]">Sec 10 Irrigated Multi-Crop</span>
              </div>
            </div>

            <span className="text-slate-500 font-mono text-[10px]">
              Spatial Resolution: 10m Multi-spectral (Bhuvan/Sentinel)
            </span>
          </div>
        </div>

        {/* Right Inspector & Drill-down Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-800/90 border border-slate-700 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Corridor Inspector
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {activeProject.projectCode}
              </h4>
            </div>

            <button
              onClick={() => onSelectProject(activeProject.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <span>Enter Room</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Delay Probability:</span>
              <strong className={`text-base font-black ${
                activeProject.modelOutput.delayProbability >= 0.7 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {Math.round(activeProject.modelOutput.delayProbability * 100)}%
              </strong>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Statutory Clock:</span>
              <strong className="text-base font-black text-amber-300">
                {activeProject.statutoryClockMaxDays - activeProject.currentStageElapsedDays}d left
              </strong>
            </div>
          </div>

          {/* Active Precedents around this coordinate */}
          {showPrecedentsOnMap && (
            <div className="space-y-2 pt-2">
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                <span>Nearby Historical Precedents</span>
                <span className="text-emerald-400 font-mono">{activeProject.precedents.length} cases</span>
              </div>

              {activeProject.precedents.map((prec) => (
                <div key={prec.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="truncate">{prec.projectName}</span>
                    <span className="text-emerald-400 font-mono text-[11px]">{prec.distanceKm} km</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Delayed {prec.initialDelayMonths} mos. Resolved via {prec.successfulIntervention.split(';')[0]}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Satellite Quality Gate / Evidence Health Notice */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">Section 9.2 Evidence Health Caveat:</strong>
            During monsoon cloud cover, satellite pixel confidence defaults to AMBER with ground verification fallback, preventing false positive classification.
          </div>
        </div>
      </div>
    </div>
  );
};
