export type RuntimeEnv = {
  API_KEY?: string;
  GEMINI_API_KEY?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __OPS_RUNTIME_ENV__?: RuntimeEnv;
  interface Window {
    __OPS_RUNTIME_ENV__?: RuntimeEnv;
  }
}

const STORAGE_PREFIX = 'ops.runtime.';

const readFromGlobal = (key: keyof RuntimeEnv): string | undefined => {
  const env = (globalThis as typeof globalThis & { __OPS_RUNTIME_ENV__?: RuntimeEnv }).__OPS_RUNTIME_ENV__;
  const value = env?.[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const readFromStorage = (key: keyof RuntimeEnv): string | undefined => {
  try {
    if (typeof localStorage === 'undefined') {
      return undefined;
    }
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return stored && stored.length > 0 ? stored : undefined;
  } catch (error) {
    console.warn('Unable to read runtime env from localStorage:', error);
    return undefined;
  }
};

export const getRuntimeEnvValue = (key: keyof RuntimeEnv): string | undefined => {
  return readFromGlobal(key) ?? readFromStorage(key);
};

export const cacheRuntimeEnvValue = (key: keyof RuntimeEnv, value: string) => {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
  } catch (error) {
    console.warn('Unable to persist runtime env to localStorage:', error);
  }
};
