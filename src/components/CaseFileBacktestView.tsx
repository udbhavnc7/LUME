import React from 'react';
import { RECONSTRUCTED_CASE_FILES, ReconstructedCaseFile } from '../services/caseFileService';
import { InsufficientDataState } from './InsufficientDataState';
import { Fact } from './Fact';

interface CaseFileBacktestViewProps {
  language: 'EN' | 'HI';
  asOf?: string;
}

export function CaseFileBacktestView({ language, asOf }: CaseFileBacktestViewProps) {
  const cases = RECONSTRUCTED_CASE_FILES;
  const asOfLabel = asOf ?? new Date().toISOString().slice(0, 10);

  if (cases.length === 0) {
    return (
      <div className="space-y-4" data-testid="case-file-backtest">
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">
            {language === 'HI' ? 'पुनर्निर्मित केस फ़ाइल बैकटेस्ट' : 'Reconstructed case-file backtest'}
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            {language === 'HI'
              ? 'प्रत्येक केस फ़ाइल को स्रोत URL और SHA-256 के साथ सत्यापित करने के बाद ही यहाँ दिखाया जाता है।'
              : 'Case files appear only after reconstruction from primary sources with URL and SHA-256 per event.'}
          </p>
          <div className="flex flex-wrap gap-3 text-xs mb-4">
            <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-300">
              Registry size:{' '}
              <Fact
                value={String(cases.length)}
                provenance={null}
                absentLabel={`${cases.length} (ABSENT SOURCE)`}
              />
            </span>
            <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-400">
              Replay as-of: {asOfLabel}
            </span>
          </div>
          <InsufficientDataState
            language={language}
            title={language === 'HI' ? 'कोई सत्यापित केस फ़ाइल नहीं' : 'No verified case files'}
            description={
              language === 'HI'
                ? '5–10 वास्तविक परियोजनाओं को गज़ट/स्रोत दस्तावेज़ों से पुनर्निर्माण के बाद बैकटेस्ट यहाँ चलेगा। अभी अनुमानित टाइमलाइन नहीं दिखाई जाती।'
                : 'Backtest runs after 5–10 real projects are reconstructed from gazette and source documents. No estimated timelines are shown yet.'
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="case-file-backtest">
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">
          {language === 'HI' ? 'पुनर्निर्मित केस फ़ाइल बैकटेस्ट' : 'Reconstructed case-file backtest'}
        </h3>
        <p className="text-xs text-slate-400">n={cases.length} • replay as-of {asOfLabel}</p>
        {cases.map((file) => (
          <CaseFileCard key={file.id} file={file} language={language} />
        ))}
      </div>
    </div>
  );
}

function CaseFileCard({
  file,
  language,
}: {
  file: ReconstructedCaseFile;
  language: 'EN' | 'HI';
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold text-white">{file.project}</div>
        <div className="text-[11px] text-slate-400">
          {file.agency} • {file.state} • {file.statuteRoute}
        </div>
      </div>
      <div className="text-xs text-slate-300">{file.corridor}</div>
      <div className="text-[11px] text-slate-400">
        {language === 'HI' ? 'समीक्षक' : 'Reviewer'}: {file.reviewer}
      </div>
      <ul className="space-y-1 text-[11px] text-slate-300">
        {file.timeline.map((event, index) => (
          <li key={`${file.id}-${index}`} className="flex flex-wrap gap-2">
            <span className="text-slate-400">{event.date}</span>
            <span>{event.event}</span>
            <a
              className="text-emerald-400 hover:underline"
              href={event.source.url}
              target="_blank"
              rel="noreferrer"
            >
              source
            </a>
            <span className="font-mono text-slate-500">{event.source.documentHash.slice(0, 12)}…</span>
          </li>
        ))}
      </ul>
      {file.outcome && (
        <div className="text-[11px] text-emerald-300">
          {file.outcome.finalStatus} • {file.outcome.totalDays}d
        </div>
      )}
      {!file.outcome && (
        <div className="text-[11px] text-amber-400">Outcome ABSENT</div>
      )}
    </div>
  );
}
