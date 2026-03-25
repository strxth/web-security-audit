import type { Check } from '@/types';
import { SEVERITY_META, CATEGORY_ICONS, OWASP_NAMES } from '@/data/checks';

export function generatePdfReport(
  checks: Check[],
  checked: Record<string, boolean>,
  score: number,
  passedCount: number
) {
  const totalCount = checks.length;
  const pct = Math.round(score);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Group checks by category
  const categories = Array.from(new Set(checks.map((c) => c.category)));
  const grouped = categories.map((cat) => ({
    category: cat,
    icon: CATEGORY_ICONS[cat] ?? '🔹',
    checks: checks.filter((c) => c.category === cat),
  }));

  // Severity summary
  const severities = ['critical', 'high', 'medium'] as const;
  const severitySummary = severities.map((sev) => {
    const sevChecks = checks.filter((c) => c.severity === sev);
    const done = sevChecks.filter((c) => checked[c.id]).length;
    return { sev, done, total: sevChecks.length, meta: SEVERITY_META[sev] };
  });

  // OWASP summary
  const owaspCodes = Array.from(new Set(checks.map((c) => c.owasp))).sort();
  const owaspRows = owaspCodes.map((code) => {
    const owaspChecks = checks.filter((c) => c.owasp === code);
    const done = owaspChecks.filter((c) => checked[c.id]).length;
    return { code, name: OWASP_NAMES[code], done, total: owaspChecks.length };
  });

  const scoreColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f97316' : '#ef4444';
  const scoreLabel =
    pct >= 80 ? 'Good' : pct >= 50 ? 'Needs Improvement' : 'At Risk';

  const checkRows = checks
    .map((check) => {
      const isPassed = !!checked[check.id];
      const meta = SEVERITY_META[check.severity];
      const sevColors: Record<string, string> = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
      };
      const sevColor = sevColors[check.severity] ?? '#6b7280';
      return `
        <tr class="check-row ${isPassed ? 'passed' : 'failed'}">
          <td class="status-cell">
            <span class="status-badge ${isPassed ? 'badge-pass' : 'badge-fail'}">
              ${isPassed ? '✓ Pass' : '✗ Fail'}
            </span>
          </td>
          <td class="title-cell">${escapeHtml(check.title)}</td>
          <td class="sev-cell">
            <span class="sev-pill" style="background:${sevColor};color:#fff">${meta.label}</span>
          </td>
          <td class="owasp-cell">${check.owasp}</td>
        </tr>`;
    })
    .join('');

  const categoryDetails = grouped
    .map(({ category, icon, checks: catChecks }) => {
      const catPassed = catChecks.filter((c) => checked[c.id]).length;
      const catItems = catChecks
        .map((check) => {
          const isPassed = !!checked[check.id];
          const meta = SEVERITY_META[check.severity];
          const sevColors: Record<string, string> = {
            critical: '#ef4444',
            high: '#f97316',
            medium: '#eab308',
          };
          const sevColor = sevColors[check.severity] ?? '#6b7280';
          return `
          <div class="check-item ${isPassed ? 'check-passed' : 'check-failed'}">
            <div class="check-header">
              <span class="check-status-icon">${isPassed ? '✓' : '✗'}</span>
              <strong class="check-title">${escapeHtml(check.title)}</strong>
              <span class="sev-pill-sm" style="background:${sevColor};color:#fff">${meta.label}</span>
              <span class="owasp-tag">${check.owasp} · ${OWASP_NAMES[check.owasp]}</span>
            </div>
            <p class="check-detail">${escapeHtml(check.detail)}</p>
            ${
              !isPassed
                ? `<div class="fix-block"><div class="fix-label">Recommended Fix</div><pre class="fix-code">${escapeHtml(check.fix)}</pre></div>`
                : ''
            }
          </div>`;
        })
        .join('');
      return `
        <div class="category-section">
          <h2 class="category-heading">
            <span class="cat-icon">${icon}</span>
            ${escapeHtml(category)}
            <span class="cat-score">${catPassed}/${catChecks.length} passed</span>
          </h2>
          ${catItems}
        </div>`;
    })
    .join('');

  const severityCards = severitySummary
    .map(({ sev, done, total }) => {
      const sevColors: Record<string, string> = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
      };
      const color = sevColors[sev];
      return `
        <div class="sev-card" style="border-left:4px solid ${color}">
          <div class="sev-card-label" style="color:${color}">${SEVERITY_META[sev].label}</div>
          <div class="sev-card-count">${done}<span class="sev-card-total">/${total}</span></div>
          <div class="sev-card-sub">checks passed</div>
        </div>`;
    })
    .join('');

  const owaspTableRows = owaspRows
    .map(({ code, name, done, total }) => {
      const allPassed = done === total;
      return `
        <tr>
          <td><strong>${code}</strong></td>
          <td>${escapeHtml(name)}</td>
          <td class="${allPassed ? 'owasp-ok' : 'owasp-warn'}">${done}/${total}</td>
          <td>${allPassed ? '✓' : '✗'}</td>
        </tr>`;
    })
    .join('');

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - pct / 100);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Security Audit Report — ${date}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      color: #1e293b;
      background: #fff;
      line-height: 1.5;
    }

    /* ── Cover page ── */
    .cover {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 60px 40px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      text-align: center;
      page-break-after: always;
    }
    .cover-logo { font-size: 64px; margin-bottom: 16px; }
    .cover-title { font-size: 32pt; font-weight: 800; letter-spacing: -0.5px; }
    .cover-subtitle { font-size: 13pt; color: #94a3b8; margin-top: 8px; margin-bottom: 40px; }
    .cover-score-ring { margin: 20px 0 8px; }
    .cover-score-ring svg { filter: drop-shadow(0 0 20px rgba(${pct >= 80 ? '34,197,94' : pct >= 50 ? '249,115,22' : '239,68,68'},0.4)); }
    .cover-score-label { font-size: 14pt; color: #94a3b8; margin-top: 4px; }
    .cover-score-status { font-size: 18pt; font-weight: 700; color: ${scoreColor}; }
    .cover-meta { margin-top: 40px; font-size: 10pt; color: #64748b; }
    .cover-meta span { display: block; margin: 2px 0; }

    /* ── Page layout ── */
    .page { padding: 40px 48px; max-width: 900px; margin: 0 auto; }

    /* ── Section headers ── */
    .section-title {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin: 40px 0 24px;
    }

    /* ── Summary cards ── */
    .summary-row {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .sev-card {
      flex: 1;
      min-width: 140px;
      padding: 16px 20px;
      border-radius: 10px;
      background: #f8fafc;
      border-left-width: 4px;
      border-left-style: solid;
    }
    .sev-card-label { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .sev-card-count { font-size: 28pt; font-weight: 800; color: #0f172a; line-height: 1.1; }
    .sev-card-total { font-size: 16pt; color: #94a3b8; }
    .sev-card-sub { font-size: 9pt; color: #64748b; }

    /* ── Summary table ── */
    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
    thead tr { background: #0f172a; color: #fff; }
    thead th { padding: 10px 12px; text-align: left; font-weight: 600; }
    tbody tr { border-bottom: 1px solid #e2e8f0; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 8px 12px; }
    .check-row.passed td { opacity: 0.75; }
    .status-cell { width: 80px; }
    .sev-cell { width: 90px; }
    .owasp-cell { width: 60px; font-family: monospace; }

    /* ── Badges ── */
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 9pt;
      font-weight: 600;
    }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-fail { background: #fee2e2; color: #991b1b; }
    .sev-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 600;
    }
    .sev-pill-sm {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 600;
      vertical-align: middle;
    }
    .owasp-tag {
      font-size: 8.5pt;
      color: #64748b;
      margin-left: 4px;
    }

    /* ── OWASP table ── */
    .owasp-ok { color: #166534; font-weight: 600; }
    .owasp-warn { color: #991b1b; font-weight: 600; }

    /* ── Category sections ── */
    .category-section { margin-bottom: 40px; page-break-inside: avoid; }
    .category-heading {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px 14px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .cat-icon { font-size: 16pt; }
    .cat-score { margin-left: auto; font-size: 10pt; font-weight: 600; color: #64748b; }

    /* ── Check items ── */
    .check-item {
      padding: 14px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid #e2e8f0;
      page-break-inside: avoid;
    }
    .check-passed { background: #f0fdf4; border-color: #bbf7d0; }
    .check-failed { background: #fff; }
    .check-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    .check-status-icon {
      font-size: 12pt;
      font-weight: 700;
      width: 20px;
      text-align: center;
    }
    .check-passed .check-status-icon { color: #16a34a; }
    .check-failed .check-status-icon { color: #dc2626; }
    .check-title { font-size: 10.5pt; color: #0f172a; }
    .check-detail { font-size: 9.5pt; color: #475569; margin: 4px 0 0 28px; }

    .fix-block { margin: 10px 0 0 28px; }
    .fix-label { font-size: 8.5pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .fix-code {
      background: #0f172a;
      color: #e2e8f0;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 8pt;
      font-family: 'Cascadia Code', 'Fira Code', 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.5;
    }

    /* ── Footer ── */
    .report-footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 9pt;
      color: #94a3b8;
    }

    /* ── Print ── */
    @media print {
      body { font-size: 10pt; }
      .cover { min-height: 100vh; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>

  <!-- Cover -->
  <div class="cover">
    <div class="cover-logo">🔐</div>
    <div class="cover-title">Security Audit Report</div>
    <div class="cover-subtitle">OWASP Top 10 · Next.js Application</div>

    <div class="cover-score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1e293b" stroke-width="12"/>
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke="${scoreColor}"
          stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset.toFixed(2)}"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="66" text-anchor="middle" fill="#fff" font-size="26" font-weight="800" font-family="Segoe UI,sans-serif">${pct}%</text>
        <text x="70" y="84" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="Segoe UI,sans-serif">score</text>
      </svg>
    </div>

    <div class="cover-score-status">${scoreLabel}</div>
    <div class="cover-score-label">${passedCount} of ${totalCount} checks passed</div>

    <div class="cover-meta">
      <span>Generated: ${date}</span>
      <span>Based on OWASP Top 10 2021</span>
    </div>
  </div>

  <!-- Executive Summary -->
  <div class="page">
    <div class="section-title">Executive Summary</div>

    <div class="summary-row">
      ${severityCards}
    </div>

    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Check</th>
          <th>Severity</th>
          <th>OWASP</th>
        </tr>
      </thead>
      <tbody>
        ${checkRows}
      </tbody>
    </table>

    <!-- OWASP Coverage -->
    <div class="section-title" style="margin-top:48px">OWASP Top 10 Coverage</div>
    <table>
      <thead>
        <tr>
          <th style="width:60px">Code</th>
          <th>Category</th>
          <th style="width:80px">Progress</th>
          <th style="width:40px"></th>
        </tr>
      </thead>
      <tbody>${owaspTableRows}</tbody>
    </table>

    <!-- Detailed Findings -->
    <div class="section-title page-break" style="margin-top:48px">Detailed Findings</div>
    ${categoryDetails}

    <div class="report-footer">
      Security Audit Report · Generated ${date} · Based on OWASP Top 10 2021 (owasp.org/Top10)
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
