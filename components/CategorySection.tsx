'use client';

import { CheckSquare } from 'lucide-react';
import { CATEGORY_ICONS } from '@/data/checks';
import CheckItem from './CheckItem';
import type { Check } from '@/types';

interface Props {
  category: string;
  checks: Check[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onCheckAll: (category: string) => void;
}

export default function CategorySection({
  category,
  checks,
  checked,
  onToggle,
  onCheckAll,
}: Props) {
  const doneCount = checks.filter((c) => checked[c.id]).length;
  const allDone = doneCount === checks.length;
  const icon = CATEGORY_ICONS[category] ?? '📁';

  return (
    <section
      id={`cat-${category.replace(/\s+/g, '-')}`}
      data-category={category}
      className="scroll-mt-24"
    >
      {/* Category header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          {category}
        </h2>

        {/* Done badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            allDone
              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {doneCount}/{checks.length}
        </span>

        {/* Mark all button */}
        {!allDone && (
          <button
            onClick={() => onCheckAll(category)}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Mark all done
          </button>
        )}
      </div>

      {/* Checks */}
      <div className="space-y-2">
        {checks.map((check) => (
          <CheckItem
            key={check.id}
            check={check}
            checked={!!checked[check.id]}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
