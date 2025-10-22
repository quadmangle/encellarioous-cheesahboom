// src/services/tinyml/dependencies.ts
/**
 * Runtime dependency loader for the TinyML/TinyLLM stack.
 *
 * The TensorFlow.js toxicity model and the WebLLM runtime are distributed as
 * standalone browser bundles that expose globals (`tf`, `toxicity`, `webllm`).
 * This helper loads those bundles on demand so that the Tiny stack can operate
 * without requiring the scripts to be hard-coded in `index.html`.
 */
import { ACTIVE_TINYLLM_PROVIDER, ACTIVE_TINYML_PROVIDER } from './config';

const TFJS_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js';
const TOXICITY_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js';
const WEBLLM_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.57/dist/web-llm.min.js';

const NEEDS_TINY_STACK_DEPENDENCIES =
  ACTIVE_TINYML_PROVIDER === 'tensorflow' || ACTIVE_TINYLLM_PROVIDER === 'webllm';

const scriptPromises = new Map<string, Promise<void>>();
let dependenciesPromise: Promise<void> | null = null;
let dependenciesReady = false;

const markScriptLoaded = (script: HTMLScriptElement) => {
  script.dataset.tinyStackLoaded = 'true';
};

const isScriptLoaded = (script: HTMLScriptElement) =>
  script.dataset.tinyStackLoaded === 'true' ||
  script.getAttribute('data-tiny-stack-loaded') === 'true' ||
  (script as any).readyState === 'complete';

const loadScript = (src: string): Promise<void> => {
  if (typeof document === 'undefined') {
    throw new Error('Cannot load Tiny stack scripts outside of a browser environment.');
  }

  if (scriptPromises.has(src)) {
    return scriptPromises.get(src)!;
  }

  const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
  if (existingScript) {
    if (isScriptLoaded(existingScript)) {
      markScriptLoaded(existingScript);
      return Promise.resolve();
    }

    const existingPromise = new Promise<void>((resolve, reject) => {
      existingScript.addEventListener(
        'load',
        () => {
          markScriptLoaded(existingScript);
          resolve();
        },
        { once: true },
      );
      existingScript.addEventListener(
        'error',
        () => {
          scriptPromises.delete(src);
          reject(new Error(`Failed to load script: ${src}`));
        },
        { once: true },
      );
    });

    scriptPromises.set(src, existingPromise);
    return existingPromise;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.dataset.tinyStack = 'true';

  const promise = new Promise<void>((resolve, reject) => {
    script.addEventListener(
      'load',
      () => {
        markScriptLoaded(script);
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      'error',
      () => {
        scriptPromises.delete(src);
        script.remove();
        reject(new Error(`Failed to load script: ${src}`));
      },
      { once: true },
    );
  });

  scriptPromises.set(src, promise);
  const target = document.head || document.body || document.documentElement;
  if (!target) {
    scriptPromises.delete(src);
    script.remove();
    throw new Error('Unable to inject script element into the document.');
  }
  target.appendChild(script);
  return promise;
};

export const needsTinyStackDependencies = () => NEEDS_TINY_STACK_DEPENDENCIES;
export const areTinyStackDependenciesReady = () => dependenciesReady;

export const ensureTinyStackDependencies = async (): Promise<void> => {
  if (!NEEDS_TINY_STACK_DEPENDENCIES) {
    dependenciesReady = true;
    return;
  }

  if (dependenciesReady) {
    return;
  }

  if (dependenciesPromise) {
    return dependenciesPromise;
  }

  dependenciesPromise = (async () => {
    const loaders: Promise<void>[] = [];

    if (ACTIVE_TINYML_PROVIDER === 'tensorflow') {
      loaders.push(
        (async () => {
          await loadScript(TFJS_SCRIPT_SRC);
          await loadScript(TOXICITY_SCRIPT_SRC);
        })(),
      );
    }

    if (ACTIVE_TINYLLM_PROVIDER === 'webllm') {
      loaders.push(loadScript(WEBLLM_SCRIPT_SRC));
    }

    await Promise.all(loaders);
    dependenciesReady = true;
  })();

  try {
    await dependenciesPromise;
  } catch (error) {
    dependenciesPromise = null;
    throw error;
  }
};
