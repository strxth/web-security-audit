import AuditDashboard from '@/components/AuditDashboard';
import WebSecurityResources from '@/components/WebSecurityResources';

export default function Home() {
  return (
    <>
      <AuditDashboard />

      {/* Section divider — bridges the audit dashboard and resources */}
      <div className="relative overflow-hidden">
        {/* Gradient fade from dashboard bg */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-950 dark:to-transparent" />

        <div className="relative px-4 py-10">
          {/* Horizontal rule with centre label */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-300 dark:via-slate-700 dark:to-slate-700" />
            <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
              <svg
                className="h-3.5 w-3.5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Learning Resources
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-300 dark:via-slate-700 dark:to-slate-700" />
          </div>
        </div>

        {/* Gradient fade into resources bg */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950 dark:to-transparent" />
      </div>

      <WebSecurityResources />
    </>
  );
}
