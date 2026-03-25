import type { Check, SeverityMeta, OwaspCode } from '@/types';

export const CHECKS: Check[] = [
  // ── HTTPS & Headers ──────────────────────────────────────────────────────────
  {
    id: 'https-redirect',
    category: 'HTTPS & Headers',
    severity: 'critical',
    owasp: 'A02',
    title: 'Force HTTPS in production',
    detail:
      'Redirect all HTTP traffic to HTTPS with a 301 permanent redirect. Set HSTS with max-age ≥ 31,536,000, includeSubDomains, and preload to prevent downgrade attacks.',
    fix: `app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, \`https://\${req.headers.host}\${req.url}\`);
  }
  next();
});`,
    references: [
      {
        label: 'MDN: HSTS',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
      },
    ],
  },
  {
    id: 'helmet',
    category: 'HTTPS & Headers',
    severity: 'high',
    owasp: 'A05',
    title: 'Apply security headers with Helmet',
    detail:
      'Use the helmet middleware to automatically set X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a baseline Content-Security-Policy.',
    fix: `import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "https://trusted-cdn.com"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:", "https:"],
      objectSrc:  ["'none'"],
      frameSrc:   ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));`,
    references: [
      { label: 'helmetjs.github.io', url: 'https://helmetjs.github.io/' },
    ],
  },
  {
    id: 'csp-nonce',
    category: 'HTTPS & Headers',
    severity: 'medium',
    owasp: 'A05',
    title: "Use CSP nonces instead of 'unsafe-inline'",
    detail:
      "'unsafe-inline' defeats much of the XSS protection that CSP provides. Use per-request nonces for inline scripts and styles instead.",
    fix: `import crypto from 'crypto';

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// In Helmet CSP config:
scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`]

// In your HTML template:
// <script nonce="<%= nonce %>">...</script>`,
  },

  // ── Injection Prevention ──────────────────────────────────────────────────────
  {
    id: 'parameterized-queries',
    category: 'Injection Prevention',
    severity: 'critical',
    owasp: 'A03',
    title: 'Use parameterized queries — no raw SQL',
    detail:
      'Never interpolate user input directly into SQL strings. Use parameterized statements or a well-tested ORM. This is the single most important injection defense.',
    fix: `// ❌ VULNERABLE — never do this
db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

// ✅ SAFE — parameterized query
db.query('SELECT * FROM users WHERE email = ?', [email]);

// ✅ SAFE — ORM (Prisma example)
await prisma.user.findUnique({ where: { email } });`,
    references: [
      {
        label: 'OWASP SQL Injection',
        url: 'https://owasp.org/www-community/attacks/SQL_Injection',
      },
    ],
  },
  {
    id: 'input-validation',
    category: 'Injection Prevention',
    severity: 'high',
    owasp: 'A03',
    title: 'Validate all input with a schema library',
    detail:
      'Every incoming request body, query parameter, and route param must be validated against a strict schema. Reject unknown fields (stripUnknown or strict mode).',
    fix: `import { z } from 'zod';

const createUserSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/),
  name:     z.string().min(2).max(50),
});

app.post('/api/users', (req, res) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  // result.data is fully typed and safe
});`,
  },
  {
    id: 'xss-output',
    category: 'Injection Prevention',
    severity: 'high',
    owasp: 'A03',
    title: 'Sanitize HTML output — prevent XSS',
    detail:
      'Never set innerHTML from user-controlled data. If you must render rich HTML (e.g. from a CMS), sanitize it with DOMPurify before insertion. React escapes by default — avoid dangerouslySetInnerHTML.',
    fix: `import DOMPurify from 'isomorphic-dompurify';

// ❌ XSS risk
element.innerHTML = userInput;

// ✅ Safe — sanitize first
element.innerHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
});

// In React — avoid this pattern entirely when possible:
// <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />`,
  },
  {
    id: 'no-eval',
    category: 'Injection Prevention',
    severity: 'critical',
    owasp: 'A03',
    title: 'Ban eval() and dynamic code execution',
    detail:
      'eval(), new Function(string), and setTimeout(string) are code-injection vectors. Add an ESLint rule to prevent them and review any dynamic requires.',
    fix: `// .eslintrc.js
rules: {
  'no-eval': 'error',
  'no-new-func': 'error',
  'no-implied-eval': 'error',
}

// ❌ Never
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 100);

// ✅ Instead — use JSON.parse() for data, safe alternatives for logic`,
  },

  // ── CSRF Protection ───────────────────────────────────────────────────────────
  {
    id: 'csrf-tokens',
    category: 'CSRF Protection',
    severity: 'high',
    owasp: 'A08',
    title: 'CSRF tokens on all state-mutating endpoints',
    detail:
      'Generate a per-session CSRF token, deliver it to the client (via a cookie or API endpoint), and verify it on every POST, PUT, PATCH, and DELETE request.',
    fix: `import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
const csrfProtection = csrf({ cookie: { sameSite: 'strict', httpOnly: false } });

// Expose token to client
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protect all mutation routes
app.use('/api', csrfProtection);

// Client-side usage:
// headers: { 'CSRF-Token': csrfToken }`,
  },
  {
    id: 'samesite-cookies',
    category: 'CSRF Protection',
    severity: 'medium',
    owasp: 'A08',
    title: 'Set SameSite, HttpOnly, and Secure on cookies',
    detail:
      'SameSite=Strict or Lax prevents cookies from being sent in cross-origin requests. HttpOnly blocks JavaScript access. Secure ensures cookies are only sent over HTTPS.',
    fix: `res.cookie('sessionId', token, {
  httpOnly: true,                                    // not accessible via JS
  secure: process.env.NODE_ENV === 'production',     // HTTPS only
  sameSite: 'strict',                                // no cross-site sending
  maxAge: 15 * 60 * 1000,                           // 15 min
  path: '/',
});`,
  },

  // ── Secrets & Config ──────────────────────────────────────────────────────────
  {
    id: 'env-secrets',
    category: 'Secrets & Config',
    severity: 'critical',
    owasp: 'A02',
    title: 'Store all secrets in environment variables',
    detail:
      'API keys, DB credentials, JWT secrets, and third-party tokens must never be hardcoded in source. Use environment variables and validate their presence at startup.',
    fix: `// .env.local (never commit)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
ACCESS_TOKEN_SECRET=at-least-32-random-chars
REFRESH_TOKEN_SECRET=different-32-random-chars
STRIPE_SECRET_KEY=sk_live_xxx

// Startup validation
const required = ['DATABASE_URL', 'ACCESS_TOKEN_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(\`Missing env var: \${key}\`);
}`,
  },
  {
    id: 'no-committed-secrets',
    category: 'Secrets & Config',
    severity: 'critical',
    owasp: 'A02',
    title: '.env files excluded from version control',
    detail:
      'Verify .env and all variants are in .gitignore. Add automated scanning (truffleHog, git-secrets, GitHub secret scanning) to your CI pipeline.',
    fix: `# .gitignore
.env
.env.*
!.env.example     # commit the template — NOT the real values

# CI — scan for leaked secrets on every push
# GitHub Actions:
- uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: \${{ github.event.repository.default_branch }}
    head: HEAD`,
  },
  {
    id: 'secrets-manager',
    category: 'Secrets & Config',
    severity: 'medium',
    owasp: 'A02',
    title: 'Use a secrets manager for production credentials',
    detail:
      'Plain env vars in production can leak through logs and process dumps. Use AWS Secrets Manager, HashiCorp Vault, or similar to fetch secrets at runtime with rotation support.',
    fix: `import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(name: string): Promise<string> {
  const cmd = new GetSecretValueCommand({ SecretId: name });
  const response = await client.send(cmd);
  return response.SecretString!;
}

// Use at app startup, not on every request
const dbPassword = await getSecret('prod/app/db-password');`,
  },

  // ── Auth & Access Control ─────────────────────────────────────────────────────
  {
    id: 'jwt-rotation',
    category: 'Auth & Access Control',
    severity: 'high',
    owasp: 'A07',
    title: 'Short-lived access tokens with refresh rotation',
    detail:
      'Access tokens should expire in 15 minutes. Refresh tokens (7 days) must be rotated on every use — the old token is invalidated in the DB and a new pair is issued. This limits blast radius from stolen tokens.',
    fix: `const ACCESS_EXPIRY  = '15m';
const REFRESH_EXPIRY = '7d';

// Issue tokens
const accessToken  = jwt.sign({ userId, role }, ACCESS_SECRET,  { expiresIn: ACCESS_EXPIRY });
const refreshToken = jwt.sign({ userId },       REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

await db.refreshToken.create({ data: { userId, token: refreshToken, expiresAt: add7Days() } });

// Rotation on refresh
app.post('/api/auth/refresh', async (req, res) => {
  const payload = jwt.verify(req.body.refreshToken, REFRESH_SECRET);
  const stored  = await db.refreshToken.findUnique({ where: { token: req.body.refreshToken } });
  if (!stored) return res.status(401).json({ error: 'Token reuse detected' });

  await db.refreshToken.delete({ where: { token: req.body.refreshToken } }); // rotate
  // Issue new pair...
});`,
  },
  {
    id: 'rate-limiting',
    category: 'Auth & Access Control',
    severity: 'high',
    owasp: 'A07',
    title: 'Rate limit auth and sensitive endpoints',
    detail:
      'Limit login attempts to 5 per 15 minutes per IP to prevent credential stuffing. Apply broader limits (100 req / 15 min) to all API routes.',
    fix: `import rateLimit from 'express-rate-limit';

// Global API limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
}));

// Strict auth limit
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
}));`,
  },
  {
    id: 'rbac',
    category: 'Auth & Access Control',
    severity: 'high',
    owasp: 'A01',
    title: 'Enforce RBAC — never trust client-side roles',
    detail:
      "Every protected route must check the authenticated user's role server-side. Never derive permissions from request headers or body fields set by the client.",
    fix: `type Role = 'admin' | 'editor' | 'viewer';

const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role as Role))
      return res.status(403).json({ error: 'Forbidden' });
    next();
  };

// Usage
app.delete('/api/users/:id', authenticate, requireRole('admin'), deleteUserHandler);
app.put('/api/posts/:id',   authenticate, requireRole('admin', 'editor'), updatePostHandler);`,
  },
  {
    id: 'mfa',
    category: 'Auth & Access Control',
    severity: 'medium',
    owasp: 'A07',
    title: 'Offer MFA for privileged accounts',
    detail:
      'Multi-factor authentication dramatically reduces account takeover risk. Implement TOTP (RFC 6238) for all users, and enforce it for admin accounts.',
    fix: `import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Setup — generate secret for user
const secret = speakeasy.generateSecret({ name: \`MyApp (\${user.email})\` });
await db.user.update({ where: { id: userId }, data: { totpSecret: secret.base32 } });
const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url!);

// Verify on login
const valid = speakeasy.totp.verify({
  secret: user.totpSecret,
  encoding: 'base32',
  token: req.body.totpCode,
  window: 1, // allow 30s clock skew
});
if (!valid) return res.status(401).json({ error: 'Invalid MFA code' });`,
  },

  // ── Logging & Monitoring ──────────────────────────────────────────────────────
  {
    id: 'security-logging',
    category: 'Logging & Monitoring',
    severity: 'medium',
    owasp: 'A09',
    title: 'Log security-relevant events',
    detail:
      'Log authentication failures, access-control violations, input validation errors, and configuration changes. Each log entry should include timestamp, IP, userId, and resource.',
    fix: `import pino from 'pino';
const logger = pino({ level: 'info' });

// Auth failure
logger.warn({ event: 'AUTH_FAILURE', ip: req.ip, email: req.body.email }, 'Login failed');

// Access denied
logger.warn({ event: 'ACCESS_DENIED', userId: req.user?.id, path: req.path }, 'Forbidden');

// Suspicious input
logger.error({ event: 'VALIDATION_ERROR', ip: req.ip, body: req.body }, 'Invalid input');`,
  },
  {
    id: 'no-sensitive-logs',
    category: 'Logging & Monitoring',
    severity: 'high',
    owasp: 'A09',
    title: 'Never log passwords, tokens, or PII',
    detail:
      'Scrub sensitive fields before any log statement. Use a structured redaction allowlist rather than manually removing fields.',
    fix: `import pino from 'pino';

const logger = pino({
  redact: {
    paths: ['password', 'token', 'refreshToken', 'creditCard', 'ssn', '*.password'],
    censor: '[REDACTED]',
  },
});

// ❌ Logs full request body — leaks password
logger.info(req.body, 'Login request');

// ✅ Log only safe fields
logger.info({ email: req.body.email }, 'Login attempt');`,
  },

  // ── Dependencies ──────────────────────────────────────────────────────────────
  {
    id: 'npm-audit',
    category: 'Dependencies',
    severity: 'high',
    owasp: 'A06',
    title: 'Run npm audit in CI — fail on high/critical CVEs',
    detail:
      'Integrate dependency vulnerability scanning into every CI run. Use Dependabot or Renovate for automated PR-based updates.',
    fix: `# package.json
"scripts": {
  "audit:ci": "npm audit --audit-level=high"
}

# GitHub Actions — .github/workflows/audit.yml
- name: Security audit
  run: npm audit --audit-level=high

# Or use the dedicated action:
- uses: actions/dependency-review-action@v4
  if: github.event_name == 'pull_request'`,
  },
  {
    id: 'lockfile',
    category: 'Dependencies',
    severity: 'medium',
    owasp: 'A06',
    title: 'Commit lockfile and use npm ci in CI',
    detail:
      'Always commit package-lock.json or yarn.lock. Use npm ci (not npm install) in CI to guarantee a reproducible, lockfile-exact install.',
    fix: `# .gitignore — do NOT ignore the lockfile
# package-lock.json  ← remove this line if present

# CI install command
- run: npm ci   # uses lockfile exactly, fails if package.json ≠ lockfile

# Verify integrity
- run: npm audit signatures`,
  },
  {
    id: 'dependency-minimization',
    category: 'Dependencies',
    severity: 'medium',
    owasp: 'A06',
    title: 'Minimize and audit third-party dependencies',
    detail:
      "Every dependency is a potential attack surface. Periodically review transitive dependencies with 'npm ls', remove unused packages, and prefer well-maintained packages with small dep trees.",
    fix: `# Find unused dependencies
npx depcheck

# Inspect the full dependency tree
npm ls --all

# Check package health before installing
npx package-phobia <package-name>
npx is-website-vulnerable https://yoursite.com`,
  },
];

// ── Metadata maps ─────────────────────────────────────────────────────────────

export const SEVERITY_META: Record<string, SeverityMeta> = {
  critical: {
    label: 'Critical',
    points: 3,
    badge: 'bg-red-500 text-white',
    ring: 'border-red-200 dark:border-red-900',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    bar: 'bg-red-500',
  },
  high: {
    label: 'High',
    points: 2,
    badge: 'bg-orange-500 text-white',
    ring: 'border-orange-200 dark:border-orange-900',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500',
  },
  medium: {
    label: 'Medium',
    points: 1,
    badge: 'bg-yellow-400 text-yellow-900',
    ring: 'border-yellow-200 dark:border-yellow-900',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    bar: 'bg-yellow-400',
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  'HTTPS & Headers': '🔒',
  'Injection Prevention': '💉',
  'CSRF Protection': '🛡️',
  'Secrets & Config': '🔑',
  'Auth & Access Control': '👤',
  'Logging & Monitoring': '📋',
  Dependencies: '📦',
};

export const OWASP_NAMES: Record<OwaspCode, string> = {
  A01: 'Broken Access Control',
  A02: 'Cryptographic Failures',
  A03: 'Injection',
  A04: 'Insecure Design',
  A05: 'Security Misconfiguration',
  A06: 'Vulnerable Components',
  A07: 'Auth Failures',
  A08: 'Data Integrity Failures',
  A09: 'Logging Failures',
  A10: 'SSRF',
};

export const CATEGORIES = Array.from(new Set(CHECKS.map((c) => c.category)));
