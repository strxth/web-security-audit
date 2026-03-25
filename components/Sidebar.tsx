'use client';

import { CATEGORIES, CATEGORY_ICONS, CHECKS } from '@/data/checks';

interface Props {
  checked: Record<string, boolean>;
  activeCategory?: string;
}

export default function Sidebar({ checked, activeCategory }: Props) {
  const scrollTo = (category: string) => {
    const id = `cat-${category.replace(/\s+/g, '-')}`;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="sticky top-32 hidden h-[calc(100vh-8rem)] w-56 shrink-0 overflow-y-auto pb-8 lg:block">
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Categories
      </p>
      <ul className="space-y-0.5">
        {CATEGORIES.map((cat) => {
          const total = CHECKS.filter((c) => c.category === cat).length;
          const done = CHECKS.filter(
            (c) => c.category === cat && checked[c.id]
          ).length;
          const allDone = done === total;
          const isActive = activeCategory === cat;

          return (
            <li key={cat}>
              <button
                onClick={() => scrollTo(cat)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-base leading-none">
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="flex-1 truncate text-xs font-medium">
                  {cat}
                </span>
                <span
                  className={`shrink-0 text-[11px] font-semibold tabular-nums ${
                    allDone
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {done}/{total}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
