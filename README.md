# OPS Online Support Platform (Static Build)

This repository now ships a ready-to-open static bundle of the OPS Online Support Platform.  All assets are pre-built so you can double-click `index.html` (or host the folder on any static web host) to review the bilingual experience without installing Node.js, running Vite, or starting an API server.

## What you get
- **Bilingual UX** – English/Spanish copy is embedded in the JavaScript bundle with instant language switching.
- **Adaptive theme** – Light and dark modes respect stored preferences and system defaults.
- **Modals & accessibility** – Focus management, aria labels, and keyboard interactions are preserved in the static output.
- **Contact form demo** – Submissions succeed instantly when no API endpoint is configured so reviewers can observe the full flow without a backend.

## How to preview
1. Clone or download the repository.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
3. Explore the navigation links in the header to visit each section.

> Tip: If you prefer to serve the files locally (useful for older browsers that restrict `file://` requests), run any static file server such as `python -m http.server` from the repository root. No build step is required.

## Directory layout
```
.
├── assets/         # Compiled JavaScript and CSS bundles
├── index.html      # Entry point – references the static assets with relative paths
├── sitemap.xml     # SEO sitemap generated from the original routes
└── vite.svg        # Favicon referenced by the entry document
```

## Contact form behaviour
The original React app called an OPS API. In this static bundle the default `API_BASE_URL` is empty, so submissions simulate a successful response after a short delay. When you eventually connect a backend, set `window.__API_BASE_URL__` before loading the page to restore real requests.

## Governance & compliance notes
The bundle retains the accessibility, localisation, and security-centric UX copy from the full application. Because everything is pre-built, there are no node_modules, dev servers, or CLIs required to audit the experience—ideal for governance reviews and stakeholder demos.

---
If you need to regenerate the bundle from source, restore the original React project history or rebuild from the pre-static tag. For day-to-day reviews, opening `index.html` is all that is required.
