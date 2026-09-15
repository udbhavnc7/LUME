import React, { useState, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  ArrowLeft,
  Search,
  Database,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  ImportedDataset,
  DatasetColumnMapping,
  DatasetValidationReport,
} from '../types';
import {
  parseCSV,
  parseJSON,
  detectColumns,
  validateDataset,
  createImportedDataset,
} from '../services/datasetService';

interface DataImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (dataset: ImportedDataset, validationReport: DatasetValidationReport) => void;
  language: 'EN' | 'HI';
}

type WizardStep = 'UPLOAD' | 'MAPPING' | 'VALIDATION' | 'IMPORT_DECISION';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_ROW_COUNT = 50000;

export const DataImportWizard: React.FC<DataImportWizardProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  language,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('UPLOAD');
  const [dataset, setDataset] = useState<ImportedDataset | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [columnMappings, setColumnMappings] = useState<DatasetColumnMapping[]>([]);
  const [validationReport, setValidationReport] = useState<DatasetValidationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    const isCSV = file.name.toLowerCase().endsWith('.csv');
    const isJSON = file.name.toLowerCase().endsWith('.json');
    if (!isCSV && !isJSON) {
      setError('Unsupported file type. Please upload a CSV (.csv) or JSON (.json) file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const content = await file.text();
      let parsedHeaders: string[];
      let parsedRows: string[][];

      if (isCSV) {
        const parsed = parseCSV(content);
        parsedHeaders = parsed.headers;
        parsedRows = parsed.rows;
      } else {
        const parsed = parseJSON(content);
        parsedHeaders = parsed.headers;
        parsedRows = parsed.rows.map(r => parsedHeaders.map(h => String(r[h] || '')));
      }

      if (parsedRows.length > MAX_ROW_COUNT) {
        setError(`Dataset exceeds maximum limit of ${MAX_ROW_COUNT.toLocaleString()} rows (found ${parsedRows.length.toLocaleString()} rows).`);
        setIsProcessing(false);
        return;
      }

      setHeaders(parsedHeaders);
      setRows(parsedRows);

      const detectedMappings = detectColumns(parsedHeaders);
      const sampleRows = parsedRows.slice(0, 5);
      const mappingsWithSamples = detectedMappings.map(m => {
        const colIdx = parsedHeaders.indexOf(m.sourceColumn);
        return {
          ...m,
          sampleValues: colIdx >= 0 ? sampleRows.map(r => r[colIdx] || '').filter(Boolean) : [],
        };
      });
      setColumnMappings(mappingsWithSamples);

      const ds = createImportedDataset(
        file.name,
        file.size,
        file.name.endsWith('.csv') ? 'CSV' : 'JSON',
        parsedHeaders,
        parsedRows.length,
        mappingsWithSamples
      );
      setDataset(ds);

      setCurrentStep('MAPPING');
    } catch (err) {
      setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleMappingChange = (index: number, lumeField: string) => {
    setColumnMappings(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], lumeField, confidence: updated[index].autoDetected ? 0.5 : updated[index].confidence };
      return updated;
    });
  };

  const handleValidate = () => {
    if (!dataset) return;
    const report = validateDataset(rows, headers, columnMappings);
    report.datasetId = dataset.id;
    setValidationReport(report);
    dataset.validationStatus = report.rejectedRecords > 0 ? 'PARTIAL' : 'PASSED';
    setCurrentStep('VALIDATION');
  };

  const handleImport = () => {
    if (!dataset || !validationReport) return;
    onImportComplete(dataset, validationReport);
    onClose();
    resetWizard();
  };

  const resetWizard = () => {
    setCurrentStep('UPLOAD');
    setDataset(null);
    setHeaders([]);
    setRows([]);
    setColumnMappings([]);
    setValidationReport(null);
    setError(null);
  };

  const steps: { id: WizardStep; label: string; num: number }[] = [
    { id: 'UPLOAD', label: language === 'HI' ? 'अपलोड' : 'Upload', num: 1 },
    { id: 'MAPPING', label: language === 'HI' ? 'मैपिंग' : 'Mapping', num: 2 },
    { id: 'VALIDATION', label: language === 'HI' ? 'सत्यापन' : 'Validation', num: 3 },
    { id: 'IMPORT_DECISION', label: language === 'HI' ? 'आयात' : 'Import', num: 4 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {language === 'HI' ? 'डेटा सेट आयात विज़ार्ड' : 'Dataset Import Wizard'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'HI' ? 'CSV, JSON फाइलें आयात करें' : 'Import CSV or JSON files into LUME'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-800 overflow-x-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => {
                  if (step.id === 'UPLOAD' || (step.id === 'MAPPING' && dataset) || (step.id === 'VALIDATION' && validationReport)) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  currentStep === step.id
                    ? 'bg-emerald-600 text-white'
                    : steps.findIndex(s => s.id === currentStep) > idx
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {step.num}
                </span>
                {step.label}
              </button>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Step 1: Upload */}
          {currentStep === 'UPLOAD' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors">
                <Database className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-slate-300 mb-2">
                  {language === 'HI' ? 'फाइल यहां खींचें या क्लिक करें' : 'Drag file here or click to browse'}
                </p>
                <p className="text-[11px] text-slate-500 mb-4">
                  {language === 'HI' ? 'CSV या JSON फाइल समर्थित है' : 'Supports CSV and JSON files'}
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  {language === 'HI' ? 'फाइल चुनें' : 'Choose File'}
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {isProcessing && (
                <div className="text-center text-xs text-amber-400">
                  {language === 'HI' ? 'प्रोसेसिंग...' : 'Processing file...'}
                </div>
              )}

              {error && (
                <div className="bg-rose-950/50 border border-rose-700/50 rounded-xl p-3 text-xs text-rose-300">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {currentStep === 'MAPPING' && dataset && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">File: <strong className="text-white">{dataset.filename}</strong></span>
                  <span className="text-slate-400">Rows: <strong className="text-white">{dataset.rowCount.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Columns: <strong className="text-white">{dataset.columns.length}</strong></span>
                  <span className="text-slate-400">Type: <strong className="text-white">{dataset.fileType}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'HI' ? 'कॉलम मैपिंग' : 'Column Mapping'} - Dataset Column to LUME Field
                </div>
                {columnMappings.map((mapping, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-800 rounded-xl p-3">
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">{mapping.sourceColumn}</div>
                      {mapping.sampleValues.length > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Samples: {mapping.sampleValues.slice(0, 3).join(', ')}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <select
                      value={mapping.lumeField}
                      onChange={(e) => handleMappingChange(idx, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 min-w-[180px]"
                    >
                      <option value={mapping.sourceColumn}>-- Skip --</option>
                      {['project_id', 'title', 'district', 'state', 'authority', 'stage', 'criticality', 'latitude', 'longitude', 'notification_date', 'expected_duration', 'actual_duration', 'dependency_state', 'compensation_state', 'legal_state', 'outcome', 'area_hectares', 'landowners_count', 'budget_cr', 'compensation_disbursed_cr'].map(field => (
                        <option key={field} value={field}>{field.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                    {mapping.confidence > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        mapping.confidence >= 0.8 ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {Math.round(mapping.confidence * 100)}% auto
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCurrentStep('UPLOAD')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                  Back
                </button>
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {language === 'HI' ? 'सत्यापित करें' : 'Validate'}
                  <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Validation */}
          {currentStep === 'VALIDATION' && validationReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-slate-800 rounded-xl p-3">
                  <div className="text-slate-400 text-[10px]">Total Records</div>
                  <div className="text-xl font-bold text-white">{validationReport.totalRecords.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-950/50 border border-emerald-700/50 rounded-xl p-3">
                  <div className="text-emerald-400 text-[10px]">Valid</div>
                  <div className="text-xl font-bold text-emerald-400">{validationReport.validRecords.toLocaleString()}</div>
                </div>
                <div className="bg-amber-950/50 border border-amber-700/50 rounded-xl p-3">
                  <div className="text-amber-400 text-[10px]">Incomplete</div>
                  <div className="text-xl font-bold text-amber-400">{validationReport.incompleteRecords.toLocaleString()}</div>
                </div>
                <div className="bg-rose-950/50 border border-rose-700/50 rounded-xl p-3">
                  <div className="text-rose-400 text-[10px]">Rejected</div>
                  <div className="text-xl font-bold text-rose-400">{validationReport.rejectedRecords.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <div className="text-slate-400">Duplicate Groups</div>
                  <div className="font-bold text-white">{validationReport.duplicateGroups}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <div className="text-slate-400">Date Inconsistencies</div>
                  <div className="font-bold text-white">{validationReport.dateInconsistencies}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <div className="text-slate-400">Unknown Stages</div>
                  <div className="font-bold text-white">{validationReport.unknownStageLabels}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <div className="text-slate-400">Invalid Coordinates</div>
                  <div className="font-bold text-white">{validationReport.invalidCoordinates}</div>
                </div>
              </div>

              {validationReport.validationErrors.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <div className="text-xs font-bold text-slate-400 mb-2">
                    Validation Errors ({validationReport.validationErrors.length})
                  </div>
                  <div className="space-y-1">
                    {validationReport.validationErrors.slice(0, 20).map((err, idx) => (
                      <div key={idx} className={`text-[11px] p-2 rounded ${
                        err.severity === 'ERROR' ? 'bg-rose-950/30 text-rose-300' :
                        err.severity === 'WARNING' ? 'bg-amber-950/30 text-amber-300' :
                        'bg-slate-900 text-slate-400'
                      }`}>
                        Row {err.recordIndex + 1}: {err.message}
                      </div>
                    ))}
                    {validationReport.validationErrors.length > 20 && (
                      <div className="text-[10px] text-slate-500 text-center">
                        ...and {validationReport.validationErrors.length - 20} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCurrentStep('MAPPING')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep('IMPORT_DECISION')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {language === 'HI' ? 'आयात निर्णय' : 'Import Decision'}
                  <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Import Decision */}
          {currentStep === 'IMPORT_DECISION' && validationReport && dataset && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-xl p-5 text-xs space-y-3">
                <div className="text-sm font-bold text-white mb-2">Import Summary</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Valid records: </span>
                    <span className="text-emerald-400 font-bold">{validationReport.validRecords.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Rejected records: </span>
                    <span className="text-rose-400 font-bold">{validationReport.rejectedRecords.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Coverage: </span>
                    <span className="text-white font-bold">{validationReport.coveragePct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Data health: </span>
                    <span className={`font-bold ${
                      validationReport.rejectedRecords === 0 ? 'text-emerald-400' :
                      validationReport.rejectedRecords < validationReport.totalRecords * 0.1 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {validationReport.rejectedRecords === 0 ? 'EXCELLENT' :
                       validationReport.rejectedRecords < validationReport.totalRecords * 0.1 ? 'ACCEPTABLE' : 'NEEDS REVIEW'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleImport}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Import Valid Records ({validationReport.validRecords.toLocaleString()})
                </button>
                <button
                  onClick={() => setCurrentStep('VALIDATION')}
                  className="px-4 py-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors"
                >
                  Review Issues
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
