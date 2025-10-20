# OPS Service Stack Reference

This document catalogs the AI service implementations extracted from `1_Ops-chattia-llm-connected.zip` and now tracked in the repository for operational visibility.

## AI Service Gateway
- `new_src/services/aiService.ts` exposes a plug-and-play abstraction with `ACTIVE_SERVICE_STACK` defaulting to `chattia7`, enabling Google, Cloudflare, TinyML, or the seven-layer Chattia stack to be swapped without touching the UI. It imports each stack and re-exports `streamChatResponse` and `resetChat` from the selected provider.【F:new_src/services/aiService.ts†L13-L62】

## Cloud Escalation & Sealed Operations
- **Google Gemini escalation** initializes `GoogleGenAI` on demand, seeds a strict system instruction, and streams responses via `sendMessageStream` while resetting the chat on failure.【F:new_src/services/google/index.ts†L1-L77】
- **Cloudflare Workers placeholder** highlights the configuration hook for a Workers AI endpoint, warning when the worker URL is missing and providing request scaffolding for a JSON POST call.【F:new_src/services/cloudflare/index.ts†L1-L62】
- **Chattia7 sealed orchestration** layers:
  - L1 session core builds signed sessions, mirrors chat history, and emits state changes.【F:new_src/services/chattia/layers/l1-conversation.ts†L1-L88】
  - L2 edge firewall rate-limits, sanitizes, and drops injection or honeypot-triggering inputs while syncing recent bot replies.【F:new_src/services/chattia/layers/l2-edge-firewall.ts†L1-L81】
  - L3 policy guardrails whitelists OPS topics and blocks disallowed themes per language.【F:new_src/services/chattia/layers/l3-policy-guardrails.ts†L1-L54】
  - L4 knowledge layer lazily loads the BM25 search corpus from `ops_bm25_corpus.jsonl` and ranks multilingual documents.【F:new_src/services/chattia/layers/l4-knowledge.ts†L1-L91】
  - L5 local intelligence classifies intent, surfaces knowledge hits, and crafts language-aware fallbacks.【F:new_src/services/chattia/layers/l5-local-intelligence.ts†L1-L104】
  - L6 encrypted memory stores AES-GCM protected transcripts and tracks analytics for intents.【F:new_src/services/chattia/layers/l6-memory.ts†L1-L111】
  - L7 sealed orchestration records HMAC-audited escalations before invoking the Cloudflare fallback with progress updates.【F:new_src/services/chattia/layers/l7-orchestration.ts†L1-L42】

## TinyML/TinyLLM Edge Stack
- The TinyML router orchestrates firewall checks, knowledge lookups, local classification, TinyLLM streaming, TinyAI agents, and final escalation to Google with progress hooks.【F:new_src/services/tinyml/router.ts†L1-L96】
- Layer toggles live in `config.ts`, selecting TensorFlow vs. placeholder TinyML, WebLLM vs. placeholder TinyLLM, and TinyAI providers.【F:new_src/services/tinyml/config.ts†L1-L23】
- The TinyML dispatcher delegates to provider modules and returns provider metadata with each classification.【F:new_src/services/tinyml/tinyml.ts†L1-L44】
  - The TensorFlow provider wraps the singleton toxicity classifier, defaulting to a safe escalation path on errors.【F:new_src/services/tinyml/providers/tinyml_tensorflow.ts†L1-L33】
  - Placeholder providers allow development without the heavy models.【F:new_src/services/tinyml/providers/tinyml_placeholder.ts†L1-L17】
- The TinyLLM dispatcher forwards to WebLLM or placeholder providers with shared streaming signatures.【F:new_src/services/tinyml/tinyllm.ts†L1-L35】
  - The WebLLM provider depends on the efficiency service to manage initialization, requiring progress callbacks.【F:new_src/services/tinyml/providers/tinyllm_webllm.ts†L1-L33】
- TinyAI dispatch currently routes to a placeholder agent, keeping the layer optional until a real agent is supplied.【F:new_src/services/tinyml/tinyai.ts†L1-L26】【F:new_src/services/tinyml/providers/tinyai_placeholder.ts†L1-L17】

## Efficiency & Shared Utilities
- The WebLLM singleton handles progressive initialization, progress reporting, and streaming completions for the Gemma 2B model, exposing `initialize`, `initializeOrGetResponse`, and `getWebLLMResponse` helpers.【F:new_src/services/efficiency/webllm.ts†L1-L133】
- The TensorFlow.js service lazily loads the toxicity model, exposes `getToxicityScores`, and provides an `isToxic` helper, all behind a promise-controlled singleton.【F:new_src/services/efficiency/tensorflowService.ts†L1-L92】
- The knowledge base service composes a corpus from `SERVICES_DATA`, builds canned responses, and queries a generic BM25 index with a relevance threshold.【F:new_src/services/efficiency/knowledgeBaseService.ts†L1-L62】
- The generic BM25 implementation tokenizes documents, calculates IDF, and ranks matches for reuse across knowledge modules.【F:new_src/services/efficiency/bm25.ts†L1-L90】

## Simulation & Legacy Hooks
- `new_src/services/geminiService.ts` remains as a simulated streaming responder for environments without external AI credentials, guiding users toward OPS offerings while exercising the chat UI.【F:new_src/services/geminiService.ts†L1-L26】
- Empty scaffolds such as `new_src/services/googleAIService.ts` or `new_src/services/webllm.ts` mark extension points for future integrations retained from the original archive.
