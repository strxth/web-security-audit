# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
npm run format     # Format with Prettier
```

No test suite is configured.

## Architecture

This is a **100% client-side** Next.js App Router app — there is no backend, no API routes, and no server-side data fetching. All state lives in the browser via `localStorage` (keys: `'security-audit-v1'` for check state, `'theme'` for dark mode). Hooks use a `hydrated` flag to prevent SSR hydration mismatches — initial state is empty and localStorage is loaded only after mount.

### Data flow

```
data/checks.ts  →  hooks/useAuditState.ts  →  components/AuditDashboard.tsx
     (static)          (state + logic)              (layout + composition)
```

- **`data/checks.ts`** is the single source of truth for all 21 security checks. Each check has: `id`, `category`, `severity` (`critical | high | medium`), `owasp` (`A01`–`A10`), `title`, `detail`, `fix` (code snippet), and `references`. All shared TypeScript types live in `types/index.ts`.
- **`hooks/useAuditState.ts`** exports three hooks used at the top level:
  - `useAuditState()` — checked state, toggle/checkAll/clearAll/checkCategory, score, stats
  - `useFilters()` — search, severity/category filter, showPassed, filteredChecks
  - `useDarkMode()` — dark mode toggle with system preference fallback
- **`components/AuditDashboard.tsx`** is the root component rendered by `app/page.tsx`. It owns the Intersection Observer (scroll-spy for sidebar) and composes all other components.

### Scoring

- Critical checks: 3 points, High: 2 points, Medium: 1 point (defined in `SEVERITY_META` in `data/checks.ts`)
- Score = (earned points / max points) × 100

### Adding or editing security checks

Edit `data/checks.ts` — the `CHECKS` array. The `CATEGORIES` array is derived automatically. Also update `OWASP_NAMES`, `CATEGORY_ICONS`, or `SEVERITY_META` in the same file if adding new values.

## Key configuration

- **Path alias**: `@/*` maps to the project root
- **Dark mode**: class-based Tailwind (`dark:` prefix), toggled via `document.documentElement.classList`
- **Custom Tailwind colors**: `critical`, `high`, `medium` severity palettes defined in `tailwind.config.ts`
- **Standalone build**: `next.config.js` uses `output: 'standalone'` for Docker deployment (see `Dockerfile`)
- **Print styles**: `app/globals.css` has `@media print` rules that hide interactive UI elements
