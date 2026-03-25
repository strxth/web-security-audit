import { SEVERITY_META } from '@/data/checks';
import type { AuditStats } from '@/types';

interface Props {
  stats: AuditStats;
}

export default function StatsGrid({ stats }: Props) {
  const severities = ['critical', 'high', 'medium'] as const;

  return (
    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
      {severities.map((sev) => {
        const meta = SEVERITY_META[sev];
        const s = stats[sev];
        const pct = s.total > 0 ? (s.done / s.total) * 100 : 0;
        const allDone = s.done === s.total;

        return (
          <div
            key={sev}
            className={`flex flex-col justify-between rounded-xl border bg-white px-5 py-4 transition-colors dark:bg-slate-900 ${
              allDone
                ? 'border-green-200 dark:border-green-900'
                : `${meta.ring} ${meta.bg}`
            }`}
          >
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  allDone ? 'text-green-600 dark:text-green-500' : meta.text
                }`}
              >
                {meta.label}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {s.done}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  /{s.total}
                </span>
              </div>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  allDone ? 'bg-green-500' : meta.bar
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
