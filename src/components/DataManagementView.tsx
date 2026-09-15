import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Trash2,
  Eye,
  Shield,
  ArrowUpRight,
  Info,
  Layers,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { DataMode, ImportedDataset, DatasetValidationReport } from '../types';

interface DataManagementViewProps {
  language: 'EN' | 'HI';
  dataMode: DataMode;
  importedDatasets: ImportedDataset[];
  validationReports: DatasetValidationReport[];
  onOpenImport: () => void;
  onToggleDataMode: () => void;
}

export const DataManagementView: React.FC<DataManagementViewProps> = ({
  language,
  dataMode,
  importedDatasets,
  validationReports,
  onOpenImport,
  onToggleDataMode,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DATASETS' | 'VALIDATION' | 'SETTINGS'>('OVERVIEW');
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const totalRecords = importedDatasets.reduce((sum, d) => sum + d.rowCount, 0);
  const totalErrors = validationReports.reduce((sum, r) => sum + r.rejectedRecords, 0);
  const totalWarnings = validationReports.reduce((sum, r) => sum + r.incompleteRecords, 0);
  const avgCoverage = validationReports.length > 0 
    ? validationReports.reduce((sum, r) => sum + r.coveragePct, 0) / validationReports.length 
    : 0;

  const getValidationStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'FAILED': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'PARTIAL': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-blue-400" />
            {language === 'HI' ? 'डेटा प्रबंधन केंद्र' : 'Data Management Center'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {language === 'HI' 
              ? 'डेटा स्रोत, सत्यापन और आयात प्रबंधन' 
              : 'Data sources, validation, and import management'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Data Mode Toggle */}
          <button
            onClick={onToggleDataMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              dataMode === 'REAL_DATA'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${dataMode === 'REAL_DATA' ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {dataMode === 'REAL_DATA' ? 'REAL DATA' : 'DEMO MODE'}
          </button>
          
          {/* Import Button */}
          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            {language === 'HI' ? 'डेटा आयात करें' : 'Import Data'}
          </button>
        </div>
      </div>

      {/* Data Mode Banner */}
      <div className={`p-4 rounded-xl border ${
        dataMode === 'REAL_DATA' 
          ? 'bg-emerald-950/30 border-emerald-700/50' 
          : 'bg-slate-800/50 border-slate-700/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            dataMode === 'REAL_DATA' ? 'bg-emerald-600' : 'bg-slate-700'
          }`}>
            {dataMode === 'REAL_DATA' ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <Database className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${dataMode === 'REAL_DATA' ? 'text-emerald-300' : 'text-slate-300'}`}>
              {dataMode === 'REAL_DATA' 
                ? (language === 'HI' ? 'वास्तविक डेटा मोड सक्रिय' : 'Real Data Mode Active')
                : (language === 'HI' ? 'डेमो डेटा मोड' : 'Demo Data Mode')}
            </h3>
            <p className="text-sm text-slate-400">
              {dataMode === 'REAL_DATA'
                ? (language === 'HI' ? 'सत्यापित डेटा स्रोतों से वास्तविक पूर्वानुमान और विश्लेषण' : 'Live predictions and analysis from validated data sources')
                : (language === 'HI' ? 'प्रदर्शन के लिए नकली डेटा का उपयोग कर रहा है' : 'Using simulated data for demonstration')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{importedDatasets.length}</div>
            <div className="text-xs text-slate-400">{language === 'HI' ? 'आयातित डेटासेट' : 'Imported Datasets'}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">{language === 'HI' ? 'कुल रिकॉर्ड' : 'Total Records'}</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalRecords.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">{language === 'HI' ? 'औसत कवरेज' : 'Avg Coverage'}</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{avgCoverage.toFixed(1)}%</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-400">{language === 'HI' ? 'त्रुटियां' : 'Errors'}</span>
          </div>
          <div className="text-2xl font-bold text-rose-400">{totalErrors}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">{language === 'HI' ? 'चेतावनियां' : 'Warnings'}</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{totalWarnings}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
        {(['OVERVIEW', 'DATASETS', 'VALIDATION', 'SETTINGS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab === 'OVERVIEW' && (language === 'HI' ? 'अवलोकन' : 'Overview')}
            {tab === 'DATASETS' && (language === 'HI' ? 'डेटासेट' : 'Datasets')}
            {tab === 'VALIDATION' && (language === 'HI' ? 'सत्यापन' : 'Validation')}
            {tab === 'SETTINGS' && (language === 'HI' ? 'सेटिंग्स' : 'Settings')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          {/* Data Sources */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              {language === 'HI' ? 'डेटा स्रोत' : 'Data Sources'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-white">LACRRIS</span>
                </div>
                <p className="text-xs text-slate-400">Land Acquisition Case Repository</p>
                <div className="mt-2 text-xs text-emerald-400">Connected</div>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-white">NGDRS</span>
                </div>
                <p className="text-xs text-slate-400">National Land Record Digitization</p>
                <div className="mt-2 text-xs text-emerald-400">Connected</div>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-white">PARIVESH</span>
                </div>
                <p className="text-xs text-slate-400">Environmental Clearance Portal</p>
                <div className="mt-2 text-xs text-amber-400">Partial</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              {language === 'HI' ? 'हाल की गतिविधि' : 'Recent Activity'}
            </h3>
            <div className="space-y-3">
              {importedDatasets.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{language === 'HI' ? 'अभी तक कोई डेटा आयात नहीं किया गया' : 'No data imported yet'}</p>
                  <button
                    onClick={onOpenImport}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    {language === 'HI' ? 'पहला डेटासेट आयात करें' : 'Import your first dataset'}
                  </button>
                </div>
              ) : (
                importedDatasets.slice(0, 5).map((dataset) => (
                  <div
                    key={dataset.id}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
                  >
                    <div className="flex items-center gap-3">
                      {getValidationStatusIcon(dataset.validationStatus)}
                      <div>
                        <div className="text-sm font-medium text-white">{dataset.name}</div>
                        <div className="text-xs text-slate-400">
                          {dataset.rowCount.toLocaleString()} rows • {dataset.fileType} • {new Date(dataset.importedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        dataset.sourceClassification === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-400' :
                        dataset.sourceClassification === 'IMPORTED' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-600 text-slate-300'
                      }`}>
                        {dataset.sourceClassification}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DATASETS' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              {language === 'HI' ? 'सभी डेटासेट' : 'All Datasets'}
            </h3>
            <button
              onClick={onOpenImport}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              {language === 'HI' ? 'नया आयात' : 'New Import'}
            </button>
          </div>
          
          {importedDatasets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No datasets imported</p>
              <p className="text-sm mt-2">Import CSV, JSON, or XLSX files to get started</p>
              <button
                onClick={onOpenImport}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Import Data
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {importedDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedDataset === dataset.id
                      ? 'bg-slate-700/50 border-blue-500/50'
                      : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-500/50'
                  }`}
                  onClick={() => setSelectedDataset(selectedDataset === dataset.id ? null : dataset.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getValidationStatusIcon(dataset.validationStatus)}
                      <div>
                        <div className="text-sm font-medium text-white">{dataset.name}</div>
                        <div className="text-xs text-slate-400">
                          {dataset.filename} • {dataset.rowCount.toLocaleString()} rows • {dataset.fileType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        dataset.validationStatus === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' :
                        dataset.validationStatus === 'FAILED' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {dataset.validationStatus}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
                        selectedDataset === dataset.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {selectedDataset === dataset.id && (
                    <div className="mt-4 pt-4 border-t border-slate-600/50 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">Source:</span>
                          <span className="ml-2 text-white font-medium">{dataset.sourceClassification}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Encoding:</span>
                          <span className="ml-2 text-white font-medium">{dataset.encoding}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Schema:</span>
                          <span className="ml-2 text-white font-medium">{dataset.schemaVersion}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Imported:</span>
                          <span className="ml-2 text-white font-medium">{new Date(dataset.importedAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Columns:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dataset.columns.map((col, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'VALIDATION' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            {language === 'HI' ? 'सत्यापन रिपोर्ट' : 'Validation Reports'}
          </h3>
          
          {validationReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileCheck2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No validation reports</p>
              <p className="text-sm mt-2">Import data to see validation results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {validationReports.map((report) => {
                const dataset = importedDatasets.find(d => d.id === report.datasetId);
                return (
                  <div key={report.datasetId} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getValidationStatusIcon(report.rejectedRecords === 0 ? 'PASSED' : 'PARTIAL')}
                        <div>
                          <div className="text-sm font-medium text-white">{dataset?.name || 'Unknown Dataset'}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(report.validationTimestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{report.coveragePct.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400">Coverage</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                      <div className="p-2 bg-slate-600/30 rounded">
                        <div className="text-slate-400">Total</div>
                        <div className="text-white font-medium">{report.totalRecords.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-emerald-900/20 rounded">
                        <div className="text-emerald-400">Valid</div>
                        <div className="text-white font-medium">{report.validRecords.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-amber-900/20 rounded">
                        <div className="text-amber-400">Incomplete</div>
                        <div className="text-white font-medium">{report.incompleteRecords}</div>
                      </div>
                      <div className="p-2 bg-rose-900/20 rounded">
                        <div className="text-rose-400">Rejected</div>
                        <div className="text-white font-medium">{report.rejectedRecords}</div>
                      </div>
                      <div className="p-2 bg-slate-600/30 rounded">
                        <div className="text-slate-400">Duplicates</div>
                        <div className="text-white font-medium">{report.duplicateGroups}</div>
                      </div>
                    </div>
                    
                    {report.validationErrors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-600/50">
                        <div className="text-xs text-slate-400 mb-2">Recent Errors:</div>
                        <div className="space-y-1">
                          {report.validationErrors.slice(0, 3).map((error, i) => (
                            <div key={i} className="text-xs text-rose-300 flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Row {error.recordIndex + 1}: {error.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            {language === 'HI' ? 'डेटा सेटिंग्स' : 'Data Settings'}
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Data Mode</div>
                  <div className="text-xs text-slate-400">Switch between demo and real data</div>
                </div>
                <button
                  onClick={onToggleDataMode}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    dataMode === 'REAL_DATA'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-600 text-slate-300'
                  }`}
                >
                  {dataMode === 'REAL_DATA' ? 'Real Data' : 'Demo Mode'}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Auto-Validation</div>
                  <div className="text-xs text-slate-400">Automatically validate imported data</div>
                </div>
                <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Source Priority</div>
                  <div className="text-xs text-slate-400">Priority order for multi-source reconciliation</div>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  LACRRIS &gt; NGDRS &gt; PARIVESH
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="text-sm text-slate-400">
            <p className="font-medium text-slate-300 mb-1">About Data Management</p>
            <p>
              Import your land acquisition data from CSV, JSON, or XLSX files. The system will automatically 
              validate, map columns, and integrate data into the prediction pipeline. All imported data is 
              classified by source type (CONNECTED, IMPORTED, PUBLIC_REFERENCE, DEMO) for transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
