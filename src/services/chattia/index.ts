import type { ChatMessage, AIProgress } from '../../types';
import type { AIService } from '../aiService';
import { handleChat } from './orchestrator';
import { resetSession, startNewSession, ensureSession, getActiveSession, onSessionChange } from './layers/l1-conversation';
import { getAnalyticsSnapshot, getDecryptedTranscript } from './layers/l6-memory';

const streamChatResponse: AIService['streamChatResponse'] = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
  onProgress?: (progress: AIProgress) => void,
) => {
  await handleChat(history, newMessage, onChunk, onProgress);
};

const resetChat: AIService['resetChat'] = () => {
  resetSession();
};

export { streamChatResponse, resetChat, startNewSession, ensureSession, getActiveSession, onSessionChange, getAnalyticsSnapshot, getDecryptedTranscript };
export type { ChatSession } from './types';
