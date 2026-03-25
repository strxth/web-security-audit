'use client';

import { useMemo, useState, useEffect } from 'react';
import { CATEGORIES, CHECKS } from '@/data/checks';
import { useAuditState, useFilters, useDarkMode } from '@/hooks/useAuditState';
import Header from './Header';
import Sidebar from './Sidebar';
import StatsGrid from './StatsGrid';
import FilterBar from './FilterBar';
import CategorySection from './CategorySection';
import OwaspLegend from './OwaspLegend';
import ScoreGauge from './ScoreGauge';

export default function AuditDashboard() {
  const { dark, toggle: toggleDark } = useDarkMode();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const {
    checked,
    hydrated,
    toggle,
    checkAll,
    clearAll,
    checkCategory,
    score,
    stats,
    passedCount,
    totalCount,
  } = useAuditState();

  const {
    search,
    setSearch,
    filterSeverity,
    setFilterSeverity,
    filterCategory,
    setFilterCategory,
    showPassed,
    setShowPassed,
    filteredChecks,
    visibleChecks,
  } = useFilters();

  const visible = useMemo(
    () => visibleChecks(checked),
    [visibleChecks, checked]
  );

  // Group visible checks by category
  const groupedChecks = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      checks: visible.filter((c) => c.category === cat),
    })).filter((g) => g.checks.length > 0);
  }, [visible]);

  const isFiltering =
    search || filterSeverity !== 'all' || filterCategory !== 'all';

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const current =
            visibleEntries[0].target.getAttribute('data-category');
          if (current) setActiveCategory(current);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    const sections = document.querySelectorAll('section[data-category]');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groupedChecks, isFiltering]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        score={score}
        passedCount={passedCount}
        totalCount={totalCount}
        dark={dark}
        onToggleDark={toggleDark}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Hero stats — visible on mobile where sidebar is hidden */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {/* Score gauge (large, left on desktop) */}
          <div className="hidden w-[260px] shrink-0 flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#151b28] px-10 py-8 shadow-sm sm:flex">
            <ScoreGauge score={score} size={140} />
            <p className="mt-6 text-center text-xs font-medium text-slate-400">
              {passedCount} of {totalCount} passed
            </p>
          </div>

          {/* Stats grid */}
          <div className="min-w-0 flex-1">
            <StatsGrid stats={stats} />
            <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">
              Score: {Math.round(score)}% · {passedCount}/{totalCount} checks
              passed
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar
            search={search}
            onSearch={setSearch}
            filterSeverity={filterSeverity}
            onFilterSeverity={setFilterSeverity}
            filterCategory={filterCategory}
            onFilterCategory={setFilterCategory}
            showPassed={showPassed}
            onShowPassed={setShowPassed}
            onCheckAll={checkAll}
            onClearAll={clearAll}
            resultCount={visible.length}
            totalCount={totalCount}
          />
        </div>

        {/* Two-column layout: sidebar + checklist */}
        <div className="flex gap-8">
          {/* Sidebar — desktop only, hidden when filtering */}
          {!isFiltering && (
            <Sidebar checked={checked} activeCategory={activeCategory} />
          )}

          {/* Main checklist */}
          <div className="min-w-0 flex-1 space-y-8">
            {groupedChecks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <span className="text-4xl" aria-hidden>
                  {passedCount === totalCount ? '🎉' : '🔍'}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-700 dark:text-slate-200">
                  {passedCount === totalCount && !isFiltering
                    ? 'All checks passed!'
                    : 'No checks match your filters'}
                </h3>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  {passedCount === totalCount && !isFiltering
                    ? 'Your application is following all the security best practices.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
              </div>
            ) : (
              groupedChecks.map(({ category, checks }) => (
                <CategorySection
                  key={category}
                  category={category}
                  checks={checks}
                  checked={checked}
                  onToggle={toggle}
                  onCheckAll={checkCategory}
                />
              ))
            )}

            {/* OWASP legend — at the bottom */}
            <OwaspLegend checked={checked} />

            <footer className="text-center text-xs text-slate-400 dark:text-slate-600">
              Based on{' '}
              <a
                href="https://owasp.org/www-project-top-ten/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-600 dark:hover:text-slate-400"
              >
                OWASP Top 10
              </a>{' '}
              · Progress saved automatically · {CHECKS.length} checks across{' '}
              {CATEGORIES.length} categories
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
