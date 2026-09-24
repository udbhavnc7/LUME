import React, { useState } from 'react';
import { ClipboardCheck, Clock3, UserRound } from 'lucide-react';
import { InsufficientDataState } from './InsufficientDataState';

export type PlaybookStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface PlaybookAction {
  id: string;
  title: string;
  statuteRef: string;
  ownerRole: string;
  dueDate: string | null;
  status: PlaybookStatus;
  evidenceRequired: boolean;
  outcomeNotes: string | null;
}

interface ActionWorkflowProps {
  language: 'EN' | 'HI';
  actions?: PlaybookAction[];
}

const DEFAULT_ACTIONS: PlaybookAction[] = [];

export function ActionWorkflow({ language, actions = DEFAULT_ACTIONS }: ActionWorkflowProps) {
  const [items, setItems] = useState<PlaybookAction[]>(actions);

  const advance = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const order: PlaybookStatus[] = ['DRAFT', 'OPEN', 'IN_PROGRESS', 'CLOSED'];
        const idx = order.indexOf(item.status);
        const next = order[Math.min(idx + 1, order.length - 1)];
        return { ...item, status: next };
      })
    );
  };

  return (
    <div className="space-y-4" data-testid="action-workflow">
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {language === 'HI' ? 'कार्य वर्कफ़्लो (DRAFT)' : 'Action workflow (DRAFT)'}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          {language === 'HI'
            ? 'प्लेबुक कार्य DRAFT: pending expert review तक बिना हस्ताक्षर के नहीं चलते।'
            : 'Playbook actions remain DRAFT until a serving officer or lawyer signs off.'}
        </p>

        {items.length === 0 ? (
          <InsufficientDataState
            language={language}
            title={language === 'HI' ? 'कोई सत्यापित प्लेबुक कार्य नहीं' : 'No verified playbook actions'}
            description={
              language === 'HI'
                ? 'कार्य केवल तब दिखते हैं जब सांविधिक ट्रिगर और स्वामी भूमिका स्रोत-पुष्ट हो।'
                : 'Actions appear only when statutory trigger and owner role are source-confirmed.'
            }
          />
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3 h-3" /> {item.statuteRef}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserRound className="w-3 h-3" /> {item.ownerRole}
                    </span>
                    <span>Due: {item.dueDate ?? 'ABSENT'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded border border-amber-700 text-amber-300 bg-amber-950/60">
                    {item.status}
                  </span>
                  {item.status !== 'CLOSED' && (
                    <button
                      className="text-[11px] px-2 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
                      onClick={() => advance(item.id)}
                    >
                      {language === 'HI' ? 'अगला' : 'Advance'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
