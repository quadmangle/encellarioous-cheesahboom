// src/services/efficiency/tinyml/index.ts
/**
 * TinyML/LLM/AI Service Stack (7-Layer Architecture)
 *
 * This is the main entry point for the security-first, on-device/edge AI stack.
 * It follows the defined 7-layer architecture, starting with the router.
 */
import type { ChatMessage, AIProgress } from '../../../types';
import type { AIService } from '../../aiService';
import { routeMessage } from './router';

// In a real implementation, you might manage some ephemeral session state here.
let sessionHistory: ChatMessage[] = [];

const streamChatResponse: AIService['streamChatResponse'] = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
  onProgress?: (progress: AIProgress) => void // Accept the onProgress callback
) => {
  sessionHistory = history; // Sync history
  const userMessage: ChatMessage = { role: 'user', text: newMessage };
  
  // The new message is routed through the 7-layer architecture.
  // The router will now handle streaming chunks directly.
  await routeMessage(userMessage, sessionHistory, onChunk, onProgress);
};

const resetChat: AIService['resetChat'] = () => {
  sessionHistory = [];
  // We might need a way to reset the WebLLM session here if it maintains context.
  console.log("TinyML session reset.");
};

export { streamChatResponse, resetChat };