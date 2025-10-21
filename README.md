# Ops Online Support

Ops Online Support is a React single-page application that compiles to static assets. The current toolkit focuses on an esbuild-powered workflow so the experience can launch from any static host (including opening `index.html` directly from disk) without relying on a development server runtime.

## Architecture Notes

- React + TypeScript source lives under `src/` with framework-agnostic modules.
- `build.mjs` uses `esbuild` to produce `assets/app.js` and copy the shared stylesheet into `assets/app.css`.
- Inline SVG icons remove the need for external icon CDNs, keeping the page self-contained.
- The Google Gemini escalation layer ships as a guided placeholder while local-first stacks (Chattia7, TinyML, Cloudflare hooks) remain pluggable.
- Runtime secrets can be injected by assigning values to `window.__OPS_RUNTIME_ENV__` before `assets/app.js` executes. This keeps credentials out of the bundle and avoids environment-specific bundler APIs.
- OPS CySec Core compliance matrix renders from `src/data/compliance.ts`, surfacing dual-app governance requirements in both English and Spanish inside `ComplianceChecklist`.

## Building

```bash
npm install
npm run build
```

The build step outputs:

- `assets/app.js` – bundled JavaScript application
- `assets/app.css` – copied stylesheet from `styles/app.css`

After running the build you can open `index.html` directly or host it from any static server.

> **Note**: The automated environment used for this refactor does not allow outbound npm installs, so the commands above should be executed locally.

## Type Checking

Run `npm run typecheck` to execute a `tsc --noEmit` pass once dependencies are installed.

## Package Manifest Tests

Execute `npm run test` to validate that `package.json` contains the required metadata, npm scripts, and dependency declarations. The manifest validator can also be run directly via `npm run test:package` when updating tooling or adding dependencies.

## Directory Overview

- `src/` – React components, contexts, hooks, and AI service layers
- `styles/app.css` – Tailwind-inspired design tokens bundled as a static stylesheet
- `build.mjs` – esbuild bundler used for production assets
- `ops_bm25_corpus.jsonl` – Search corpus leveraged by the BM25 retriever

The application defaults to the locally orchestrated `chattia7` stack, ensuring offline availability while preserving seven-layer security and policy controls.