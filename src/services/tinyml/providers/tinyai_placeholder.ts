// services/tinyml/providers/tinyai_placeholder.ts
/**
 * TinyAI Provider: Placeholder
 * A dummy implementation for Layer 6.
 */
import type { ChatMessage } from '../../../types';
import type { TinyAIProvider } from '../tinyai';

export const generateResponse: TinyAIProvider['generateResponse'] = async (
    text: string, 
    history: ChatMessage[]
): Promise<string | null> => {
    console.log("Using TinyAI Placeholder Provider. No agentic logic is configured.");
    // This placeholder does not provide a response, allowing the flow to continue
    // to the next layer (or end).
    return null;
};
