'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CHECKS, SEVERITY_META } from '@/data/checks';
import type { FilterCategory, FilterSeverity, AuditStats } from '@/types';

const STORAGE_KEY = 'security-audit-v1';

export function useAuditState() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist whenever checked changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // Ignore storage quota errors
    }
  }, [checked, hydrated]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const checkAll = useCallback(() => {
    const all: Record<string, boolean> = {};
    CHECKS.forEach((c) => (all[c.id] = true));
    setChecked(all);
  }, []);

  const clearAll = useCallback(() => setChecked({}), []);

  const checkCategory = useCallback((category: string) => {
    setChecked((prev) => {
      const next = { ...prev };
      CHECKS.filter((c) => c.category === category).forEach(
        (c) => (next[c.id] = true)
      );
      return next;
    });
  }, []);

  const { score, stats, passedCount } = useMemo(() => {
    let earned = 0;
    let total = 0;
    const stats: AuditStats = {
      critical: { done: 0, total: 0 },
      high: { done: 0, total: 0 },
      medium: { done: 0, total: 0 },
    };

    CHECKS.forEach((c) => {
      const pts = SEVERITY_META[c.severity].points;
      total += pts;
      stats[c.severity as keyof AuditStats].total += 1;
      if (checked[c.id]) {
        earned += pts;
        stats[c.severity as keyof AuditStats].done += 1;
      }
    });

    return {
      score: total > 0 ? (earned / total) * 100 : 0,
      stats,
      passedCount: Object.values(checked).filter(Boolean).length,
    };
  }, [checked]);

  return {
    checked,
    hydrated,
    toggle,
    checkAll,
    clearAll,
    checkCategory,
    score,
    stats,
    passedCount,
    totalCount: CHECKS.length,
  };
}

export function useFilters() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [showPassed, setShowPassed] = useState(true);

  const filteredChecks = useMemo(() => {
    const q = search.toLowerCase();
    return CHECKS.filter((c) => {
      if (filterSeverity !== 'all' && c.severity !== filterSeverity)
        return false;
      if (filterCategory !== 'all' && c.category !== filterCategory)
        return false;
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.detail.toLowerCase().includes(q) &&
        !c.category.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, filterSeverity, filterCategory]);

  const visibleChecks = useCallback(
    (checked: Record<string, boolean>) =>
      filteredChecks.filter((c) => showPassed || !checked[c.id]),
    [filteredChecks, showPassed]
  );

  return {
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
  };
}

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { dark, toggle };
}
