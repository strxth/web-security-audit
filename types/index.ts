export type Severity = 'critical' | 'high' | 'medium';

export type OwaspCode =
  | 'A01'
  | 'A02'
  | 'A03'
  | 'A04'
  | 'A05'
  | 'A06'
  | 'A07'
  | 'A08'
  | 'A09'
  | 'A10';

export interface Check {
  id: string;
  category: string;
  severity: Severity;
  owasp: OwaspCode;
  title: string;
  detail: string;
  fix: string;
  references?: { label: string; url: string }[];
}

export interface SeverityMeta {
  label: string;
  points: number;
  badge: string; // Tailwind classes for the pill badge
  ring: string; // border color classes
  bg: string; // card background
  text: string; // text color
  bar: string; // progress bar fill
}

export interface AuditStats {
  critical: { done: number; total: number };
  high: { done: number; total: number };
  medium: { done: number; total: number };
}

export type FilterSeverity = 'all' | Severity;
export type FilterCategory = 'all' | string;
