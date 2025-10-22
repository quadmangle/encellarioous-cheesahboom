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

const MAX_HISTORY_MESSAGES = 20;

interface StreamExtraction {
  text: string;
  override?: boolean;
}

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
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.text === 'string') {
      return candidate.text;
    }
    if (candidate.delta !== undefined) {
      return flattenToString(candidate.delta);
    }
    if (candidate.message !== undefined) {
      return flattenToString(candidate.message);
    }
    if (candidate.response !== undefined) {
      return flattenToString(candidate.response);
    }
    if (candidate.result !== undefined) {
      return flattenToString(candidate.result);
    }
    if (candidate.output_text !== undefined) {
      return flattenToString(candidate.output_text);
    }
    if (candidate.content !== undefined) {
      return flattenToString(candidate.content);
    }
    if (candidate.choices !== undefined) {
      return flattenToString(candidate.choices);
    }
  }
  return '';
};

const buildHistoryPayload = (history: ChatMessage[], newMessage: string) => {
  const normalisedHistory = history
    .map((message) => ({ role: message.role, text: message.text }))
    .slice(-MAX_HISTORY_MESSAGES);

  const trimmedMessage = newMessage.trim();
  const lastEntry = normalisedHistory.at(-1);
  const needsAppend =
    trimmedMessage.length > 0 && (!lastEntry || lastEntry.role !== 'user' || lastEntry.text.trim() !== trimmedMessage);

  if (needsAppend) {
    normalisedHistory.push({ role: 'user', text: trimmedMessage });
  }

  return normalisedHistory;
};

const processWorkerStream = async (response: Response, onChunk: (chunk: string) => void) => {
  if (!response.body) {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const jsonPayload = await response.json();
      const message = flattenToString(jsonPayload);
      onChunk(message.trim().length > 0 ? message : 'Cloudflare Worker returned an empty response.');
      return;
    }

    const fallbackText = (await response.text()).trim();
    onChunk(fallbackText.length > 0 ? fallbackText : 'Cloudflare Worker returned an empty response.');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let aggregated = '';
  let emitted = false;

  const emit = ({ text, override }: StreamExtraction) => {
    if (override) {
      aggregated = text;
    } else {
      aggregated += text;
    }
    emitted = true;
    onChunk(aggregated);
  };

  const handleLine = (rawLine: string) => {
    const trimmedLine = rawLine.trim();
    if (!trimmedLine) {
      return;
    }

    const withoutPrefix = trimmedLine.startsWith('data:')
      ? trimmedLine.slice('data:'.length).trim()
      : trimmedLine;

    if (!withoutPrefix) {
      return;
    }

    try {
      const parsed = JSON.parse(withoutPrefix);
      const text = flattenToString(parsed);
      if (text.trim().length > 0) {
        emit({ text });
      }
    } catch {
      emit({ text: withoutPrefix });
    }
  };

  while (true) {
    const { value, done } = await reader.read();
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

  buffer += decoder.decode();
  if (buffer.trim().length > 0) {
    handleLine(buffer);
    buffer = '';
  }

  if (!emitted) {
    onChunk('Cloudflare Worker returned an empty response.');
  }
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  history,
  newMessage,
  onChunk,
) => {
  const {
    cloudflare: { workerUrl, authToken },
  } = runtimeConfig;

  if (!workerUrl) {
    const message =
      'Cloudflare AI service is not configured. Set CLOUDFLARE_WORKER_URL via window.__OPS_RUNTIME_ENV__ or an environment variable before building.';
    console.warn(message);
    onChunk(message);
    return;
  }

  const payloadHistory = buildHistoryPayload(history, newMessage);

  if (payloadHistory.length === 0) {
    onChunk('Please provide a message for Chattia to process.');
    return;
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(workerUrl, {
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
