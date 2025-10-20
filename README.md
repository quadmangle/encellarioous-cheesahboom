# Ops Online Support

This project hosts the interactive OPS customer experience portal built with React 19 and Vite. It unifies the landing experience, contextual service discovery, and AI-assisted support fabric that powers the OPS ecosystem.

## Project Layout

```
├── App.tsx                     # Root application shell
├── components/                 # UI components and modals
├── contexts/                   # Global state providers (theme, language, etc.)
├── hooks/                      # Custom hooks (drag, chat session orchestration)
├── services/                   # Integration layer for AI/ML, search, and automation
│   ├── integrationConfig.ts    # 🔐 Single source for external URLs and API keys
│   └── ...
├── vanilla-app/                # Lightweight vanilla JS prototype kept for reference
├── types.ts                    # Shared TypeScript contracts
├── vite.config.ts              # Vite build/dev configuration
└── ops_bm25_corpus.jsonl       # Knowledge base corpus for local BM25 search
```

All integration points (Gemini, Cloudflare Workers AI, TensorFlow.js, WebLLM, and the BM25 corpus) source their credentials and URLs from `services/integrationConfig.ts`. Update that file—or the matching `VITE_*` environment variables—when rotating keys or pointing at new endpoints.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
3. **Build for production**
   ```bash
   npm run build
   ```

Vite exposes the app on [http://localhost:3000](http://localhost:3000) by default (configured in `vite.config.ts`).

## Environment Variables & Integrations

| Variable | Purpose | Default | Notes |
| --- | --- | --- | --- |
| `VITE_GEMINI_API_KEY` | Google AI Studio API key used by the Gemini escalation layer. | _required_ | Obtain from https://aistudio.google.com/app/apikey |
| `VITE_GEMINI_MODEL` | Gemini model identifier. | `gemini-2.5-flash` | Change to `gemini-2.0-pro` or custom releases as needed. |
| `VITE_CLOUDFLARE_WORKER_URL` | Cloudflare Worker endpoint that proxies Workers AI requests. | empty | Required to enable the Cloudflare escalation path. |
| `VITE_TF_TOXICITY_MODEL_URL` | TensorFlow.js toxicity model URL. | `https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1` | Override to host your own secured model. |
| `VITE_KB_CORPUS_URL` | Location of the OPS BM25 JSONL corpus. | `/ops_bm25_corpus.jsonl` | Useful when serving from a CDN or API. |
| `VITE_WEBLLM_MODEL_ID` | WebLLM in-browser model identifier. | `gemma-2b-it-q4f32_1` | Tune for latency/quality trade-offs. |

> 🗂️ **Tip:** When editing URLs or keys, start with `services/integrationConfig.ts`—comments point to the relevant provider consoles for quick navigation.

## Security & Compliance Checklist

- Keep API keys outside of version control. Use `.env` files or secure secrets management.
- Ensure HTTPS when deploying to production, especially for TensorFlow/WebLLM script loading.
- Review the OPS CyberSec Core controls before enabling live AI endpoints.

## Legacy Prototype

The `vanilla-app/` directory preserves the original static implementation for historical context. The React/Vite app is the authoritative source for production builds.
