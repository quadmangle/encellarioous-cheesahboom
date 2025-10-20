import type { ChatMessage } from '../types';

/**
 * This service provides a simulated chat response for demonstration purposes.
 * It does not connect to any external AI/LLM service.
 * To enable a real AI chatbot, integrate `services/google/index.ts` and
 * configure your keys in `services/integrationConfig.ts` (or set matching
 * values on `window.__OPS_RUNTIME_ENV__`).
 */

export const streamChatResponse = async (history: ChatMessage[], newMessage: string, onChunk: (chunk: string) => void) => {
    // Simulate a streaming response
    const simulatedResponse = "This is a simulated response as the AI model is not configured. I can provide detailed information on **Business Operations**, **Contact Center** solutions, **IT Support**, and our skilled **Professionals** service. How can I assist you today?";
    const words = simulatedResponse.split(' ');
    let currentResponse = '';
    for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 50));
        currentResponse += (currentResponse ? ' ' : '') + word;
        onChunk(currentResponse);
    }
};

// Function to reset chat session if needed.
// Since this is a simulated service, there's no session to reset.
export const resetChat = () => {
    // No action needed for simulated chat.
};