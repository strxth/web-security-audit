'use client';

import { Search, X } from 'lucide-react';
import { CATEGORIES } from '@/data/checks';
import type { FilterCategory, FilterSeverity } from '@/types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterSeverity: FilterSeverity;
  onFilterSeverity: (v: FilterSeverity) => void;
  filterCategory: FilterCategory;
  onFilterCategory: (v: FilterCategory) => void;
  showPassed: boolean;
  onShowPassed: (v: boolean) => void;
  onCheckAll: () => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount: number;
}

export default function FilterBar({
  search,
  onSearch,
  filterSeverity,
  onFilterSeverity,
  filterCategory,
  onFilterCategory,
  showPassed,
  onShowPassed,
  onCheckAll,
  onClearAll,
  resultCount,
  totalCount,
}: Props) {
  const hasActiveFilters =
    search || filterSeverity !== 'all' || filterCategory !== 'all';

  const clearFilters = () => {
    onSearch('');
    onFilterSeverity('all');
    onFilterCategory('all');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search checks…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
          />
        </div>

        {/* Severity filter */}
        <select
          value={filterSeverity}
          onChange={(e) => onFilterSeverity(e.target.value as FilterSeverity)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All severities</option>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
        </select>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={(e) => onFilterCategory(e.target.value as FilterCategory)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Show passed toggle */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          <input
            type="checkbox"
            checked={showPassed}
            onChange={(e) => onShowPassed(e.target.checked)}
            className="h-4 w-4 rounded accent-green-500"
          />
          Show passed
        </label>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}

        {/* Bulk actions */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={onCheckAll}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Mark all ✓
          </button>
          <button
            onClick={onClearAll}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Result count */}
      {(hasActiveFilters || !showPassed) && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Showing {resultCount} of {totalCount} checks
        </p>
      )}
    </div>
  );
}
