# Ops Online Support

The OPS Online Support experience is a React single-page application that runs entirely as static assets. The goal of this refactor is to remove the Vite development server dependency and keep the seven-layer "Chattia7" architecture intact while allowing the portal to be served from any static host (including loading the `index.html` file directly from disk).

## Key Changes

- React + TypeScript source now lives under `src/` with no Vite-specific APIs.
- A lightweight `esbuild` script (`build.mjs`) bundles the application into `assets/app.js` and copies the shared stylesheet.
- Font Awesome CDN dependencies were replaced with inline SVG icons so the site renders without external network calls.
- The Google Gemini escalation stack exposes a graceful placeholder because the official SDK cannot be bundled in the offline build. Local AI stacks (Chattia7, TinyML, Cloudflare placeholders) remain intact.

## Building

```bash
npm install
npm run build
```

The build step produces:

- `assets/app.js` – bundled JavaScript application
- `assets/app.css` – copied stylesheet from `styles/app.css`

After running the build you can open `index.html` directly from the filesystem or host it from any static server.

> **Note**: The automated environment used for this refactor does not allow outbound npm installs, so tests/builds could not be executed here. The commands above should be run locally.

## Type Checking

Run `npm run typecheck` to execute a `tsc --noEmit` pass once dependencies are installed.

## Directory Overview

- `src/` – React components, contexts, hooks, and AI service layers
- `styles/app.css` – Tailwind-inspired design tokens bundled as a static stylesheet
- `build.mjs` – ESBuild bundler used for production assets
- `ops_bm25_corpus.jsonl` – Search corpus leveraged by the BM25 retriever

The application defaults to the locally orchestrated `chattia7` stack, ensuring offline availability while preserving the seven-layer security and policy controls.