# OPS Online Support Platform

OPS Online Support Platform is a bilingual (English/Spanish) customer operations portal that showcases the OPS service catalogue and routes prospect requests to the contact center API. The solution pairs a Vite-powered React front end with a hardened Express API designed for OPS CyberSec Core compliance.

## Architecture at a Glance

| Layer | Key Technologies | Responsibilities |
| --- | --- | --- |
| Front end | React 19, React Router, styled-components, i18next | Adaptive UX with theme toggling, i18n, accessibility-forward layouts |
| API | Express 5, Helmet, express-validator, in-memory rate limiter | Secure processing of contact requests with validation, rate limiting, and audit logging |
| Tooling | Jest, Testing Library, Supertest, ESLint | Automated regression, localization parity, and security linting |

### Front-end Experience

- **Global design system** built with CSS custom properties and responsive grid primitives.
- **Theme preferences** persist across sessions and respect system settings while exposing a WCAG 2.1 AA compliant dark mode.
- **Internationalization** leverages i18next with parity tests to keep English and Spanish strings in sync.
- **Accessibility**: Semantic headings, labelled form controls, focus-trapped modals, and live regions for submission feedback.

### API Safeguards

- Helmet security headers with strict transport security toggled via environment variable.
- Input validation/sanitization for name, email, and message fields.
- IP based rate limiting to mitigate abuse along with structured JSON audit logs.
- Hook for downstream processing (email, ticketing, SIEM) documented and stubbed for extension.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install Dependencies

```bash
npm install
(cd server && npm install)
```

### Run the App Locally

```bash
# Start the API (default: http://localhost:3001)
npm run dev:server

# In a separate terminal start the front end (default: http://localhost:5173)
npm run dev
```

The front end reads `VITE_API_BASE_URL`; when unset it falls back to `/api`. During local development Vite proxies `/api` to the Express server.

To refresh the sitemap before deploying, run:

```bash
npm run generate:sitemap
```

### Testing & Quality Gates

```bash
# Run all test suites (front end + API)
npm test

# Front-end unit/integration tests
npm run test:frontend

# API tests
npm run test:backend

# ESLint (runs automatically in CI but available locally)
npm run lint
```

CI should also run dependency scans (e.g., `npm audit`) and Lighthouse/Playwright checks; see `.github/workflows/` for examples once the repo is wired to GitHub Actions.

## Configuration

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | API | Overrides the Express port (defaults to `3001`). |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | API | Tune abuse protection thresholds. |
| `ENFORCE_HTTPS` | API | When set to `true`, rejects insecure requests behind trusted proxies. |
| `VITE_API_BASE_URL` | Front end | Points the SPA at a remote API host when not co-located. |

## Compliance & Governance Notes

- Aligns with OPS CyberSec Core, mapping to NIST CSF and PCI DSS 4.0 requirements 3–11.
- Security headers: CSP stub, HSTS, X-Content-Type-Options, Referrer Policy, X-Frame-Options via Helmet.
- Privacy & governance links (Privacy, Accessibility, Incident Response) surface in the footer.
- Sitemap generation runs at build-time (`npm run generate:sitemap`) to support SEO governance.

## Roadmap

- Integrate queue/notification services (email, SIEM, ticketing) in `server/services/contactDispatcher.js`.
- Automate Lighthouse and Playwright audits in CI.
- Expand locale support (e.g., French, Portuguese) with translation parity tests ensuring coverage.
- Add progressive web app enhancements (service worker, offline caching) after threat modeling.

## License

Proprietary OPS internal project. Contact the OPS Governance Office for distribution or reuse approvals.
