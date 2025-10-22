// src/services/google/index.ts
/**
 * Google AI Service (Gemini)
 *
 * Provides a browser-friendly client that calls the public Gemini REST API
 * using standard `fetch` streaming. This keeps the seven-layer architecture
 * fully operational whenever valid credentials are supplied at runtime.
 */
import type { ChatMessage } from '../../types';
import type { AIService } from '../aiService';
import { runtimeConfig } from '../runtimeConfig';

type GeminiRole = 'user' | 'model';

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  role: GeminiRole;
  parts: GeminiPart[];
}

interface GeminiChunk {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

interface ExtractedChunk {
  text: string;
  override?: boolean;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MAX_HISTORY_MESSAGES = 20;

const BASE_SYSTEM_INSTRUCTION = `You are "Chattia," a professional, helpful, and empathetic AI assistant for OPS (Online Presence Solutions). Your primary goal is to understand the user's needs and guide them to the correct OPS service.

Your capabilities:
- You are an expert on OPS's four main services: Business Operations, Contact Center, IT Support, and Professionals.
- When a user asks a vague question (e.g., "help with my business"), you MUST ask clarifying questions to determine the best service.
- When describing a service, you MUST use markdown for clarity (e.g., bolding, bullet points).
- You should proactively suggest related services. For example, if they ask about IT Support, you might mention the Professionals service for hiring specialized IT staff.
- If a user asks a question not related to OPS services (e.g., "what is the capital of France?", "write me a poem"), you MUST politely decline and state that your expertise is limited to OPS's offerings. Recommend they use a standard search engine for general queries.
- Maintain a friendly and professional tone at all times.
- You MUST NOT ask for or store any Personally Identifiable Information (PII).`;

const normaliseHistory = (history: ChatMessage[], fallbackMessage: string) => {
  const systemMessages = history
    .filter((message) => message.role === 'system')
    .map((message) => message.text)
    .filter((text) => text.trim().length > 0);

  const conversationalMessages = history.filter((message) => message.role !== 'system');
  const cappedConversation =
    conversationalMessages.length > MAX_HISTORY_MESSAGES
      ? conversationalMessages.slice(-MAX_HISTORY_MESSAGES)
      : conversationalMessages;

  const trimmedFallback = fallbackMessage.trim();
  const hasTrailingUser = cappedConversation.at(-1)?.role === 'user';
  const finalConversation =
    hasTrailingUser || trimmedFallback.length === 0
      ? cappedConversation
      : [...cappedConversation, { role: 'user' as const, text: trimmedFallback }];

  const contents: GeminiContent[] = finalConversation.map((message) => ({
    role: message.role === 'bot' ? 'model' : 'user',
    parts: [{ text: message.text }],
  }));

  const systemInstruction =
    systemMessages.length > 0
      ? `${BASE_SYSTEM_INSTRUCTION}\n\nSession metadata:\n${systemMessages.join('\n')}`
      : BASE_SYSTEM_INSTRUCTION;

  return { contents, systemInstruction };
};

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
    if (candidate.candidates !== undefined) {
      return flattenToString(candidate.candidates);
    }
  }
  return '';
};

const extractTextFromGeminiPayload = (payload: unknown): ExtractedChunk | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const chunk = payload as GeminiChunk;

  if (chunk.promptFeedback?.blockReason) {
    const reason = chunk.promptFeedback.blockReason.replace(/_/g, ' ').toLowerCase();
    return {
      text: `Google Gemini blocked the response (reason: ${reason}). Please adjust your request and try again.`,
      override: true,
    };
  }

  if (!Array.isArray(chunk.candidates) || chunk.candidates.length === 0) {
    return null;
  }

  const [firstCandidate] = chunk.candidates;
  const parts = firstCandidate?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    return null;
  }

  const text = parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('');

  if (!text) {
    return null;
  }

  return { text };
};

const processGeminiStream = async (response: Response, onChunk: (chunk: string) => void) => {
  if (!response.body) {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const jsonPayload = await response.json();
      const extracted = extractTextFromGeminiPayload(jsonPayload) ?? { text: flattenToString(jsonPayload) };
      const message = extracted.text.trim().length > 0 ? extracted.text : 'Google Gemini returned an empty response.';
      onChunk(message);
      return;
    }

    const fallbackText = (await response.text()).trim();
    onChunk(fallbackText.length > 0 ? fallbackText : 'Google Gemini returned an empty response.');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let aggregated = '';
  let emitted = false;

  const applyExtraction = (extracted: ExtractedChunk) => {
    if (extracted.override) {
      aggregated = extracted.text;
    } else {
      aggregated += extracted.text;
    }
    emitted = true;
    onChunk(aggregated);
  };

  const processLine = (rawLine: string) => {
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
      const extracted = extractTextFromGeminiPayload(parsed);
      if (extracted) {
        applyExtraction(extracted);
      }
    } catch (error) {
      console.warn('[Google Gemini] Unable to parse stream chunk:', error, withoutPrefix);
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
      processLine(line);
      newlineIndex = buffer.indexOf('\n');
    }
  }

  buffer += decoder.decode();
  if (buffer.trim().length > 0) {
    processLine(buffer);
    buffer = '';
  }

  if (!emitted) {
    onChunk('Google Gemini did not return any content.');
  }
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  history,
  newMessage,
  onChunk,
) => {
  const {
    googleGemini: { apiKey, model },
  } = runtimeConfig;

  if (!apiKey) {
    const message =
      'Google Gemini API key not configured. Set GEMINI_API_KEY via window.__OPS_RUNTIME_ENV__ or an environment variable before building.';
    console.warn(message);
    onChunk(message);
    return;
  }

  const { contents, systemInstruction } = normaliseHistory(history, newMessage);

  if (contents.length === 0) {
    onChunk('Please provide a message for Chattia to process.');
    return;
  }

  try {
    const endpoint = `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:streamGenerateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemInstruction }],
        },
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 2000);
      throw new Error(`Gemini request failed with status ${response.status}: ${errorBody}`);
    }

    await processGeminiStream(response, onChunk);
  } catch (error) {
    console.error('Error with Google Gemini service:', error);
    onChunk("Sorry, I'm having trouble connecting to Google Gemini right now. Please try again later.");
  }
};

const resetChat: AIService['resetChat'] = () => {
  console.log('Google Gemini chat session reset.');
};

export { streamChatResponse, resetChat };
