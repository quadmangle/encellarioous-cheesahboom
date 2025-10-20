type RuntimeEnv = Record<string, string | undefined>;

declare global {
  // eslint-disable-next-line no-var
  var __OPS_RUNTIME_ENV__?: RuntimeEnv;
  interface Window {
    __OPS_RUNTIME_ENV__?: RuntimeEnv;
  }
}

const readRuntimeValue = (key: string): string | undefined => {
  const globalEnv = (globalThis as typeof globalThis & { __OPS_RUNTIME_ENV__?: RuntimeEnv }).__OPS_RUNTIME_ENV__;
  const fromGlobal = globalEnv?.[key];
  if (typeof fromGlobal === 'string' && fromGlobal.trim().length > 0) {
    return fromGlobal;
  }

  if (typeof process !== 'undefined' && process.env) {
    const fromProcess = process.env[key];
    if (typeof fromProcess === 'string' && fromProcess.trim().length > 0) {
      return fromProcess;
    }
  }

  return undefined;
};

/**
 * Central configuration for all external service integrations used across the app.
 *
 * Values can be supplied at runtime by assigning to `window.__OPS_RUNTIME_ENV__`
 * before the bundle executes (or by providing matching process environment
 * variables during static builds). This keeps credentials out of source control
 * while avoiding toolchain-specific helpers.
 */
export const integrationConfig = {
  googleGemini: {
    /**
     * Google AI Studio API key.
     * Console: https://aistudio.google.com/app/apikey
     */
    apiKey: readRuntimeValue('GEMINI_API_KEY') ?? '',
    /**
     * Gemini model identifier to request during chat escalations.
     */
    model: readRuntimeValue('GEMINI_MODEL') ?? 'gemini-2.5-flash',
  },
  cloudflare: {
    /**
     * Cloudflare Worker endpoint that proxies calls to Workers AI.
     */
    workerUrl: readRuntimeValue('CLOUDFLARE_WORKER_URL') ?? '',
  },
  tensorFlow: {
    /**
     * TensorFlow.js toxicity model URL.
     */
    toxicityModelUrl:
      readRuntimeValue('TF_TOXICITY_MODEL_URL') ??
      'https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1',
  },
  knowledgeBase: {
    /**
     * Location of the JSONL corpus used for BM25 retrieval.
     */
    corpusUrl: readRuntimeValue('KB_CORPUS_URL') ?? '/ops_bm25_corpus.jsonl',
  },
  webLLM: {
    /**
     * WebLLM model identifier loaded in the browser.
     */
    modelId: readRuntimeValue('WEBLLM_MODEL_ID') ?? 'gemma-2b-it-q4f32_1',
  },
} as const;

export type IntegrationConfig = typeof integrationConfig;
