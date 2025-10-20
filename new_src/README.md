# OPS Unified Portal (Esbuild Edition)

This directory now runs fully on top of an `esbuild` toolchain so that the UI
can be developed and deployed without relying on any particular dev-server.
The React application is bundled into modern ESM that the browser can load
directly, and a couple of
small Node scripts take care of the developer workflow (dev server, production
build, and preview).

## Prerequisites
- Node.js 18 or newer
- npm 9+

Install dependencies once:

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

The command launches an `esbuild` watcher and serves the project from
`http://localhost:3000/`. Open `http://localhost:3000/index.html` in your
browser to interact with the SPA. The server watches the source tree and
rebuilds on every change.

## Production build

```bash
npm run build
```

The optimized bundle is emitted to `dist/`:

- `dist/index.html` – static shell with script tags pointing at the compiled
  bundle
- `dist/index.js` – the React application bundled by esbuild
- `dist/ops_bm25_corpus.jsonl` – the BM25 knowledge base consumed by the
  Chattia 7-layer stack
- `dist/runtime-config.js` – copied only if you created one for secrets
- `dist/metadata.json` – preserved for downstream tooling

Deploy the `dist/` folder as a static site. If you want to preview that build
locally, run:

```bash
npm run preview
```

The preview server hosts `dist/` on `http://localhost:4173`.

## Configuring runtime secrets

The esbuild-based setup reads the Gemini escalation secrets from
`window.__OPS_RUNTIME_ENV__` at runtime.

1. Copy `runtime-config.example.js` to `runtime-config.js` in this folder.
2. Add your keys to the object:

   ```js
   window.__OPS_RUNTIME_ENV__ = {
     GEMINI_API_KEY: 'your-api-key',
   };
   ```

3. Keep `runtime-config.js` out of version control (it is listed in
   `.gitignore`). The dev server will serve the file automatically, and the
   production build copies it into `dist/` if it exists.

You can also set the value at runtime in the browser console:

```js
window.__OPS_RUNTIME_ENV__ = { GEMINI_API_KEY: '...' };
```

The Google Gemini service resolves the key through `getRuntimeEnvValue` and
persists it to `localStorage` so subsequent reloads keep the configuration.

## Repository layout

- `index.html` – SPA shell loaded in both dev and prod
- `index.tsx` / `App.tsx` – React root entry point
- `scripts/` – Node helpers for dev/build/preview
- `runtimeEnv.ts` – runtime environment helper shared across services
- `services/` – service implementations for the seven-layer stack and external
  fallbacks

Happy shipping!
