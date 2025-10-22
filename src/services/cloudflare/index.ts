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
import type { AIService } from "../aiService";
import { integrationConfig } from '../integrationConfig';

const { workerUrl: CLOUDFLARE_WORKER_URL } = integrationConfig.cloudflare;
const streamChatResponse: AIService['streamChatResponse'] = async (
  history,
  newMessage,
  onChunk,
) => {
  if (!CLOUDFLARE_WORKER_URL) {
    const msg =
      "Cloudflare AI service is not configured. Provide CLOUDFLARE_WORKER_URL via window.__OPS_RUNTIME_ENV__ or src/services/integrationConfig.ts.";
    console.warn(msg);
    onChunk(msg);
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
