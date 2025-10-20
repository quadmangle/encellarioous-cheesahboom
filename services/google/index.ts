// src/services/google/index.ts
/**
 * Google AI Service (Gemini)
 *
 * This service connects to the Google Gemini API to provide powerful,
 * generative AI responses. It serves as the "Escalation Layer" (Layer 7)
 * in the 7-layer architecture.
 */
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../../types';
import type { AIService } from '../aiService';
import { integrationConfig } from '../integrationConfig';

// --- On-Demand Initialization ---
// The AI client and chat session are now initialized lazily on the first API call.
// This improves initial page load performance and resource management.
let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const initializeChat = () => {
  const { apiKey, model } = integrationConfig.googleGemini;

  if (!apiKey) {
    throw new Error(
      "Google Gemini API key not configured. Set VITE_GEMINI_API_KEY in your environment."
    );
  }

  ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are "Chattia," a professional, helpful, and empathetic AI assistant for OPS (Online Presence Solutions). Your primary goal is to understand the user's needs and guide them to the correct OPS service.

      Your capabilities:
      - You are an expert on OPS's four main services: Business Operations, Contact Center, IT Support, and Professionals.
      - When a user asks a vague question (e.g., "help with my business"), you MUST ask clarifying questions to determine the best service.
      - When describing a service, you MUST use markdown for clarity (e.g., bolding, bullet points).
      - You should proactively suggest related services. For example, if they ask about IT Support, you might mention the Professionals service for hiring specialized IT staff.
      - If a user asks a question not related to OPS services (e.g., "what is the capital of France?", "write me a poem"), you MUST politely decline and state that your expertise is limited to OPS's offerings. Recommend they use a standard search engine for general queries.
      - Maintain a friendly and professional tone at all times.
      - You MUST NOT ask for or store any Personally Identifiable Information (PII).`;

  chat = ai.chats.create({
    model,
    config: {
        systemInstruction,
    },
  });
};

const streamChatResponse: AIService['streamChatResponse'] = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void
) => {
  try {
    // Initialize the chat session on the first message.
    if (!chat) {
      initializeChat();
    }
    
    // The Gemini API currently uses the whole history. We send the new message.
    // The `chat` object maintains the history on the backend.
    const responseStream = await chat!.sendMessageStream({ message: newMessage });

    let fullResponse = '';
    for await (const chunk of responseStream) {
      fullResponse += chunk.text;
      onChunk(fullResponse);
    }
  } catch (error) {
    console.error("Error with Google AI service:", error);
    onChunk("Sorry, I'm having trouble connecting to the AI service right now. Please try again later.");
    // Reset chat session on error to force re-initialization on next attempt.
    resetChat();
  }
};

const resetChat: AIService['resetChat'] = () => {
  // Setting chat to null will force re-initialization on the next message.
  chat = null;
  ai = null;
  console.log("Google AI chat session reset.");
};

export { streamChatResponse, resetChat };
