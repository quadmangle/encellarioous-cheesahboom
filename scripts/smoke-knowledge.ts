import { readFile } from 'node:fs/promises';
import path from 'node:path';

const originalFetch = globalThis.fetch;

const fileFetch: typeof fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string') {
    const resolveCorpus = (relativePath: string) => path.resolve(process.cwd(), relativePath);

    if (input.startsWith('./assets/')) {
      const text = await readFile(resolveCorpus(input), 'utf-8');
      return {
        async text() {
          return text;
        },
      } as unknown as Response;
    }

    if (input.startsWith('/assets/')) {
      const text = await readFile(resolveCorpus(`.${input}`), 'utf-8');
      return {
        async text() {
          return text;
        },
      } as unknown as Response;
    }
  }

  if (typeof originalFetch === 'function') {
    return originalFetch(input, init);
  }

  throw new Error(`Unhandled fetch target: ${input}`);
}) as typeof fetch;

async function main() {
  (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch = fileFetch;

  try {
    const { searchKnowledge } = await import('../src/services/chattia/layers/l4-knowledge');

    const query = 'How do we stay compliant with PCI DSS?';
    const result = await searchKnowledge(query, 'en');

    console.log('Knowledge hit for query:', query);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      delete (globalThis as { fetch?: typeof fetch }).fetch;
    }
  }
}

void main().catch((error) => {
  console.error('Knowledge smoke test failed:', error);
  process.exitCode = 1;
});
