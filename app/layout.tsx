import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Security Audit Dashboard',
  description:
    'Interactive OWASP Top 10 security checklist for web applications. Track and remediate critical vulnerabilities.',
  keywords: ['security', 'OWASP', 'web security', 'audit', 'checklist'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
