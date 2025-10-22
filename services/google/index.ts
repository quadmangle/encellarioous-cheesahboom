// services/google/index.ts
/**
 * Google AI Service (Gemini)
 *
 * Provides the escalation layer that connects to Google Gemini. The module reads
 * credentials from `integrationConfig` which, in turn, supports runtime
 * injection through `window.__OPS_RUNTIME_ENV__` or standard process
 * environment variables during builds.
 */
import { GoogleGenAI, type Chat } from '@google/genai';
import type { ChatMessage } from '../../types';
import type { AIService } from '../aiService';
import { integrationConfig } from '../../src/services/runtime/integrationConfig';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const systemInstruction = `You are "Chattia," a professional, helpful, and empathetic AI assistant for OPS (Online Presence Solutions). Your primary goal is to understand the user's needs and guide them to the correct OPS service.

      Your capabilities:
      - You are an expert on OPS's four main services: Business Operations, Contact Center, IT Support, and Professionals.
      - When a user asks a vague question (e.g., "help with my business"), you MUST ask clarifying questions to determine the best service.
      - When describing a service, you MUST use markdown for clarity (e.g., bolding, bullet points).
      - You should proactively suggest related services. For example, if they ask about IT Support, you might mention the Professionals service for hiring specialized IT staff.
      - If a user asks a question not related to OPS services (e.g., "what is the capital of France?", "write me a poem"), you MUST politely decline and state that your expertise is limited to OPS's offerings. Recommend they use a standard search engine for general queries.
      - Maintain a friendly and professional tone at all times.
      - You MUST NOT ask for or store any Personally Identifiable Information (PII).`;

const initializeChat = () => {
  const { apiKey, model } = integrationConfig.googleGemini;

  if (!apiKey) {
    throw new Error(
      'Google Gemini API key not configured. Provide GEMINI_API_KEY via window.__OPS_RUNTIME_ENV__ or src/services/runtime/integrationConfig.ts.'
    );
  }

  ai = new GoogleGenAI({ apiKey });
  chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
  });
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  _history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void
) => {
  try {
    if (!chat) {
      initializeChat();
    }

    const responseStream = await chat!.sendMessageStream({ message: newMessage });

    let fullResponse = '';
    for await (const chunk of responseStream) {
      fullResponse += chunk.text;
      onChunk(fullResponse);
    }
  } catch (error) {
    console.error('Error with Google AI service:', error);
    onChunk("Sorry, I'm having trouble connecting to the AI service right now. Please try again later.");
    resetChat();
  }
};

const resetChat: AIService['resetChat'] = () => {
  chat = null;
  ai = null;
  console.log('Google AI chat session reset.');
};

export { streamChatResponse, resetChat };
