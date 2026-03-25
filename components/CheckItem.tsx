'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { SEVERITY_META, OWASP_NAMES } from '@/data/checks';
import type { Check as CheckType } from '@/types';

interface Props {
  check: CheckType;
  checked: boolean;
  onToggle: (id: string) => void;
}

export default function CheckItem({ check, checked, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = SEVERITY_META[check.severity];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(check.fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 ${
        checked
          ? 'border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/20'
          : `${meta.ring} ${meta.bg}`
      }`}
    >
      {/* Header row */}
      <div
        className="flex cursor-pointer select-none items-center gap-3 px-4 py-3.5"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(check.id);
          }}
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            checked
              ? 'border-green-500 bg-green-500 focus:ring-green-400'
              : `${meta.text} border-current bg-white focus:ring-current dark:bg-slate-900`
          }`}
          aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
        >
          {checked && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <span
          className={`flex-1 text-sm font-semibold leading-snug transition-colors ${
            checked
              ? 'text-green-700 line-through opacity-60 dark:text-green-400'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {check.title}
        </span>

        {/* Badges */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.badge}`}
          >
            {meta.label}
          </span>
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {check.owasp}
          </span>
          <span className="text-slate-400 transition-transform duration-200 dark:text-slate-500">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="animate-slide-down border-t border-slate-200/70 px-4 pb-4 pt-3 dark:border-slate-700/50">
          {/* OWASP ref */}
          <p className="mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            OWASP {check.owasp} — {OWASP_NAMES[check.owasp]}
          </p>

          {/* Detail */}
          <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {check.detail}
          </p>

          {/* Code fix */}
          <div className="relative rounded-lg bg-slate-900 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-2">
              <span className="text-xs font-semibold text-slate-400">
                Recommended fix
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-slate-300">
              <code>{check.fix}</code>
            </pre>
          </div>

          {/* References */}
          {check.references && check.references.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {check.references.map((ref) => (
                <a
                  key={ref.url}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  {ref.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
