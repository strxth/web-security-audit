'use client';

import { Moon, Sun, FileDown } from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import type { Check } from '@/types';
import { generatePdfReport } from '@/lib/generatePdfReport';

interface Props {
  score: number;
  passedCount: number;
  totalCount: number;
  dark: boolean;
  onToggleDark: () => void;
  checks: Check[];
  checked: Record<string, boolean>;
}

export default function Header({
  score,
  passedCount,
  totalCount,
  dark,
  onToggleDark,
  checks,
  checked,
}: Props) {
  const pct = Math.round(score);
  const progressColor =
    pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-orange-400' : 'bg-red-500';

  function handleExportPdf() {
    generatePdfReport(checks, checked, score, passedCount);
  }

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-700 ${progressColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 mt-1">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 shadow-sm backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/90">
            {/* Brand */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="text-2xl" aria-hidden>
                🔐
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold leading-tight text-slate-900 dark:text-white">
                  Security Audit
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  OWASP Top 10 · {passedCount}/{totalCount} checks passed
                </p>
              </div>
            </div>

            {/* Gauge (hidden on small screens) */}
            <div className="mr-4 hidden sm:block">
              <ScoreGauge score={score} size={54} showLabel={false} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                title="Export PDF report"
              >
                <FileDown className="h-4 w-4" />
              </button>
              <button
                onClick={onToggleDark}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
