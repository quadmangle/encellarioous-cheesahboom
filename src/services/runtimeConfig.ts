// src/services/runtimeConfig.ts
/**
 * Runtime integration configuration for browser-delivered services.
 *
 * Values can be supplied either through the global `window.__OPS_RUNTIME_ENV__`
 * shim (populated before the bundle executes) or via process environment
 * variables when building statically. This mirrors the server-side integration
 * config but keeps the browser bundle self-contained.
 */

type RuntimeEnv = Record<string, string | undefined>;

declare global {
  // eslint-disable-next-line no-var
  var __OPS_RUNTIME_ENV__: RuntimeEnv | undefined;
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

export const runtimeConfig = {
  googleGemini: {
    /** Google AI Studio API key. */
    apiKey: readRuntimeValue('GEMINI_API_KEY') ?? '',
    /** Gemini model identifier to request during chat escalations. */
    model: readRuntimeValue('GEMINI_MODEL') ?? 'gemini-2.5-flash',
  },
  cloudflare: {
    /** HTTP endpoint for the Cloudflare Worker that fronts Workers AI. */
    workerUrl: readRuntimeValue('CLOUDFLARE_WORKER_URL') ?? '',
    /** Optional bearer token used when the worker enforces authentication. */
    authToken:
      readRuntimeValue('CLOUDFLARE_WORKER_AUTH') ?? readRuntimeValue('CLOUDFLARE_API_TOKEN') ?? '',
  },
} as const;

export type RuntimeConfig = typeof runtimeConfig;
