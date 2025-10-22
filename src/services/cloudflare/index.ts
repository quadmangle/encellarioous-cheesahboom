// src/services/cloudflare/index.ts
/**
 * Cloudflare AI Service (Workers AI)
 *
 * Connects the escalation layer to a Cloudflare Worker that proxies requests
 * to Workers AI. The worker URL and optional bearer token are injected at
 * runtime through `window.__OPS_RUNTIME_ENV__` (or process environment
 * variables during the build).
 */
import type { ChatMessage } from '../../types';
import type { AIService } from '../aiService';
import { runtimeConfig } from '../runtimeConfig';

const { workerUrl: cloudflareWorkerUrl, authToken } = runtimeConfig.cloudflare;

type WorkerChunk = {
  text?: string;
  delta?: unknown;
  response?: unknown;
  result?: unknown;
  message?: unknown;
  output?: unknown;
  error?: unknown;
};

interface ExtractedChunk {
  text: string;
  override?: boolean;
}

const FALLBACK_EMPTY_MESSAGE = 'Cloudflare AI Worker returned an empty response.';
const UNCONFIGURED_MESSAGE =
  'Cloudflare AI service is not configured. Provide CLOUDFLARE_WORKER_URL via window.__OPS_RUNTIME_ENV__ or src/services/runtimeConfig.ts.';

const sanitiseHistory = (history: ChatMessage[]) =>
  history
    .filter((message) => !message.isLoading)
    .map((message) => ({ role: message.role, text: message.text }));

const flattenToString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value == null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => flattenToString(entry)).join('');
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const candidateKeys: Array<keyof WorkerChunk> = ['text', 'delta', 'response', 'result', 'message', 'output'];
    for (const key of candidateKeys) {
      const nested = record[key as string];
      if (nested !== undefined) {
        const flattened = flattenToString(nested);
        if (flattened) {
          return flattened;
        }
      }
    }
  }

  return '';
};

const extractTextFromWorkerPayload = (payload: unknown): ExtractedChunk | null => {
  if (!payload) {
    return null;
  }

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed ? { text: trimmed } : null;
  }

  if (typeof payload === 'object') {
    const chunk = payload as WorkerChunk;

    if (typeof chunk.error === 'string' && chunk.error.trim().length > 0) {
      return {
        text: `Cloudflare Worker error: ${chunk.error.trim()}`,
        override: true,
      };
    }

    const flattened = flattenToString(chunk).trim();
    if (flattened) {
      return { text: flattened };
    }

    const stringified = JSON.stringify(chunk);
    return stringified ? { text: stringified } : null;
  }

  return { text: String(payload) };
};

const emitNonStreamingBody = async (response: Response, onChunk: (chunk: string) => void) => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const jsonPayload = await response.json();
    const extracted = extractTextFromWorkerPayload(jsonPayload);
    const message = extracted?.text.trim().length ? extracted.text : FALLBACK_EMPTY_MESSAGE;
    onChunk(message);
    return;
  }

  const textPayload = (await response.text()).trim();
  onChunk(textPayload.length > 0 ? textPayload : FALLBACK_EMPTY_MESSAGE);
};

const processWorkerStream = async (response: Response, onChunk: (chunk: string) => void) => {
  const body = response.body;
  if (!body) {
    await emitNonStreamingBody(response, onChunk);
    return;
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let aggregated = '';
  let emitted = false;

  const emitChunk = ({ text, override }: ExtractedChunk) => {
    if (override) {
      aggregated = text;
    } else {
      aggregated += text;
    }
    emitted = true;
    onChunk(aggregated);
  };

  const handleLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    const withoutPrefix = trimmed.startsWith('data:') ? trimmed.slice('data:'.length).trim() : trimmed;
    if (!withoutPrefix) {
      return;
    }

    try {
      const parsed = JSON.parse(withoutPrefix);
      const extracted = extractTextFromWorkerPayload(parsed);
      if (extracted) {
        emitChunk(extracted);
      }
      return;
    } catch (error) {
      // Fall through to treat the payload as plain text when parsing fails.
    }

    emitChunk({ text: withoutPrefix });
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      handleLine(line);
      newlineIndex = buffer.indexOf('\n');
    }
  }

  const remainder = buffer.trim();
  if (remainder) {
    handleLine(remainder);
  }

  if (!emitted) {
    onChunk(FALLBACK_EMPTY_MESSAGE);
  }
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  history,
  newMessage,
  onChunk,
) => {
  if (!cloudflareWorkerUrl) {
    console.warn(UNCONFIGURED_MESSAGE);
    onChunk(UNCONFIGURED_MESSAGE);
    return;
  }

  const payloadHistory = sanitiseHistory(history);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken && authToken.trim().length > 0) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(cloudflareWorkerUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ history: payloadHistory, newMessage }),
    });

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 2000);
      throw new Error(`Cloudflare Worker responded with status ${response.status}: ${errorBody}`);
    }

    await processWorkerStream(response, onChunk);
  } catch (error) {
    console.error('Error communicating with Cloudflare AI Worker:', error);
    onChunk('Error connecting to the Cloudflare AI service.');
  }
};

const resetChat: AIService['resetChat'] = () => {
  console.log('Cloudflare chat session reset.');
};

export { streamChatResponse, resetChat };
