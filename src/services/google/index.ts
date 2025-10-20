// src/services/google/index.ts
/**
 * Google AI Service (Gemini)
 *
 * In the serverless/offline build we cannot bundle the official
 * `@google/genai` SDK because it requires network access at install
 * time. Instead we keep a graceful placeholder that preserves the
 * seven-layer architecture contract while instructing integrators on
 * how to add the escalation layer when online credentials are
 * available.
 */
import type { ChatMessage } from '../../types';
import type { AIService } from '../aiService';

const unsupportedMessage =
  "The Google Gemini escalation stack is unavailable in this offline build. " +
  "Provide a compatible adapter or run the experience with the local 'chattia7' stack.";

const streamChatResponse: AIService['streamChatResponse'] = async (
  _history: ChatMessage[],
  _newMessage: string,
  onChunk: (chunk: string) => void
) => {
  console.warn('Google AI stack not bundled in the offline distribution.');
  onChunk(unsupportedMessage);
};

const resetChat: AIService['resetChat'] = () => {
  console.warn('Google AI stack reset invoked without an active SDK.');
};

export { streamChatResponse, resetChat };
