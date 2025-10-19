/**
 * Central configuration for all external service integrations used across the app.
 *
 * Update the values here (or the associated environment variables) when rotating
 * API keys, switching providers, or pointing to different deployment endpoints.
 * Every service file imports from this module so there is a single place to review
 * and replace integration values.
 */
export const integrationConfig = {
  googleGemini: {
    /**
     * Google AI Studio API key.
     * Set via Vite environment variable `VITE_GEMINI_API_KEY`.
     * Console: https://aistudio.google.com/app/apikey
     */
    apiKey: import.meta.env.VITE_GEMINI_API_KEY ?? '',
    /**
     * Gemini model identifier to request during chat escalations.
     * Override with `VITE_GEMINI_MODEL` to test different releases quickly.
     */
    model: import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash',
  },
  cloudflare: {
    /**
     * Cloudflare Worker endpoint that proxies calls to Workers AI.
     * Configure through `VITE_CLOUDFLARE_WORKER_URL` for rapid redeployments.
     */
    workerUrl: import.meta.env.VITE_CLOUDFLARE_WORKER_URL ?? '',
  },
  tensorFlow: {
    /**
     * TensorFlow.js toxicity model URL.
     * Override with `VITE_TF_TOXICITY_MODEL_URL` to point at a custom hosted model.
     */
    toxicityModelUrl:
      import.meta.env.VITE_TF_TOXICITY_MODEL_URL ??
      'https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1',
  },
  knowledgeBase: {
    /**
     * Location of the JSONL corpus used for BM25 retrieval.
     * Update with `VITE_KB_CORPUS_URL` when relocating the dataset.
     */
    corpusUrl: import.meta.env.VITE_KB_CORPUS_URL ?? '/ops_bm25_corpus.jsonl',
  },
  webLLM: {
    /**
     * WebLLM model identifier loaded in the browser.
     * Override with `VITE_WEBLLM_MODEL_ID` to test lighter or heavier models.
     */
    modelId: import.meta.env.VITE_WEBLLM_MODEL_ID ?? 'gemma-2b-it-q4f32_1',
  },
} as const;

export type IntegrationConfig = typeof integrationConfig;
