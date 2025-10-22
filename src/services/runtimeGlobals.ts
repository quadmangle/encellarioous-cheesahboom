// src/services/runtimeGlobals.ts
/**
 * Shared runtime helpers for accessing configuration that is bridged through
 * global variables exposed on the window object.
 */

const VALID_STACKS = ['google', 'cloudflare', 'tinyml', 'chattia7'] as const;
export type ActiveServiceStack = (typeof VALID_STACKS)[number];

declare global {
  // eslint-disable-next-line no-var
  var __ACTIVE_SERVICE_STACK__: ActiveServiceStack | undefined;
  // eslint-disable-next-line no-var
  var __tinyStackReady__: Promise<unknown> | undefined;
}

const FALLBACK_STACK: ActiveServiceStack = 'chattia7';

const isActiveServiceStack = (value: unknown): value is ActiveServiceStack =>
  typeof value === 'string' && (VALID_STACKS as readonly string[]).includes(value);

export const resolveActiveServiceStack = (): ActiveServiceStack => {
  const candidate = typeof globalThis !== 'undefined' ? globalThis.__ACTIVE_SERVICE_STACK__ : undefined;
  if (isActiveServiceStack(candidate)) {
    return candidate;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.__ACTIVE_SERVICE_STACK__ = FALLBACK_STACK;
  }

  return FALLBACK_STACK;
};

export const isTinyStackEnabled = (stack: ActiveServiceStack = resolveActiveServiceStack()): boolean =>
  stack === 'tinyml' || stack === 'chattia7';

export const awaitTinyStackReady = async (): Promise<void> => {
  const readiness = typeof globalThis !== 'undefined' ? globalThis.__tinyStackReady__ : undefined;
  if (readiness && typeof (readiness as Promise<unknown>).then === 'function') {
    await readiness;
  }
};
