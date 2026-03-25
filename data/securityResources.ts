export type ResourceCategory =
  | 'Guide'
  | 'Tool'
  | 'Interactive'
  | 'Framework'
  | 'Learning'
  | 'Community';

export interface SecurityResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: ResourceCategory;
}

export const securityResources: SecurityResource[] = [
  {
    id: 'owasp-top-10',
    title: 'OWASP Top 10',
    description:
      'The standard awareness document for developers about the most critical security risks to web applications.',
    url: 'https://owasp.org/www-project-top-ten/',
    category: 'Guide',
  },
  {
    id: 'owasp-cheat-sheets',
    title: 'OWASP Cheat Sheet Series',
    description:
      'Concise collection of high-value information on specific application security topics.',
    url: 'https://cheatsheetseries.owasp.org/',
    category: 'Guide',
  },
  {
    id: 'mdn-web-security',
    title: 'MDN Web Security',
    description:
      'Comprehensive documentation on web security concepts, threats, and best practices by Mozilla.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
    category: 'Learning',
  },
  {
    id: 'portswigger-academy',
    title: 'PortSwigger Web Security Academy',
    description:
      'Free, online web security training with interactive labs covering various vulnerabilities.',
    url: 'https://portswigger.net/web-security',
    category: 'Interactive',
  },
  {
    id: 'google-web-dev',
    title: 'Google Web Security (web.dev)',
    description:
      "Google's collection of articles and codelabs focused on building secure, fast, and reliable sites.",
    url: 'https://web.dev/secure/',
    category: 'Learning',
  },
  {
    id: 'owasp-asvs',
    title: 'OWASP ASVS',
    description:
      'Application Security Verification Standard for testing web application technical security controls.',
    url: 'https://owasp.org/www-project-application-security-verification-standard/',
    category: 'Framework',
  },
  {
    id: 'snyk-learn',
    title: 'Snyk Learn',
    description:
      'Interactive security education platform teaching developers about vulnerabilities and fixes.',
    url: 'https://learn.snyk.io/',
    category: 'Learning',
  },
  {
    id: 'hackerone-hacktivity',
    title: 'HackerOne Hacktivity',
    description:
      'Real-world disclosed vulnerabilities and bug bounty reports from the security community.',
    url: 'https://hackerone.com/hacktivity',
    category: 'Community',
  },
  {
    id: 'nist-csf',
    title: 'NIST Cybersecurity Framework',
    description:
      'The NIST framework providing voluntary guidance for managing cybersecurity risk.',
    url: 'https://www.nist.gov/cyberframework',
    category: 'Framework',
  },
  {
    id: 'security-headers',
    title: 'Security Headers Tool',
    description:
      'Analyze HTTP response headers and get actionable recommendations to improve security.',
    url: 'https://securityheaders.com/',
    category: 'Tool',
  },
];

export const categoryColors: Record<
  ResourceCategory,
  { bg: string; text: string; border: string }
> = {
  Guide: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  Tool: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  Interactive: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  Framework: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
  Learning: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  Community: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
  },
};
