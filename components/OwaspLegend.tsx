import { CHECKS, OWASP_NAMES } from '@/data/checks';
import type { OwaspCode } from '@/types';

interface Props {
  checked: Record<string, boolean>;
}

export default function OwaspLegend({ checked }: Props) {
  const owaspCodes = Object.keys(OWASP_NAMES) as OwaspCode[];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
        OWASP Top 10 Coverage
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {owaspCodes.map((code) => {
          const covered = CHECKS.filter((c) => c.owasp === code);
          if (covered.length === 0) return null;
          const done = covered.filter((c) => checked[c.id]).length;
          const pct =
            covered.length > 0 ? Math.round((done / covered.length) * 100) : 0;
          const allDone = pct === 100;
          const hasProgress = pct > 0 && pct < 100;

          return (
            <div
              key={code}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <span
                className={`shrink-0 text-xs font-bold ${
                  allDone
                    ? 'text-green-600 dark:text-green-400'
                    : hasProgress
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-red-500 dark:text-red-400'
                }`}
              >
                {code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                  {OWASP_NAMES[code]}
                </p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      allDone
                        ? 'bg-green-500'
                        : hasProgress
                          ? 'bg-orange-400'
                          : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold ${
                  allDone
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
