// src/services/efficiency/tinyml/router.ts
/**
 * Layer 1: Router & Orchestrator
 *
 * Objective: Act as the central brain for the 7-layer architecture. It receives
 * a user message, routes it through the appropriate layers, and determines the
 * final response strategy (e.g., use local knowledge, use local LLM, escalate).
 */
import type { ChatMessage, AIProgress } from '../../../types';

// Import all the layers
import { validateAndSanitize } from './firewall';
import { searchKnowledgeBase } from '../knowledgeBaseService';
import { getTinyMLClassification } from './tinyml';
import { getTinyLLMResponse } from './tinyllm';
import { getTinyAIResponse } from './tinyai';
import * as EscalationService from '../../google'; // Layer 7: Escalation

/**
 * The main router function that orchestrates the AI response.
 */
export const routeMessage = async (
    userMessage: ChatMessage,
    history: ChatMessage[],
    onChunk: (chunk: string) => void,
    onProgress?: (progress: AIProgress) => void,
): Promise<void> => {
    console.log(`[Router] Routing message: "${userMessage.text}"`);

    // --- Layer 2: Meta-Firewall ---
    const firewallResult = validateAndSanitize(userMessage.text);
    if (!firewallResult.isAllowed) {
        console.warn(`[Router] Firewall blocked message. Reason: ${firewallResult.blockReason}`);
        onChunk(firewallResult.blockReason || 'Your message could not be processed.');
        return;
    }
    const sanitizedText = firewallResult.sanitizedText;
    console.log('[Router] Layer 2 (Firewall): Passed');

    // --- Layer 3: Knowledge Base (RAG) ---
    const kbResponse = searchKnowledgeBase(sanitizedText);
    if (kbResponse) {
        console.log('[Router] Layer 3 (Knowledge Base): Answer found. Responding directly.');
        onChunk(kbResponse);
        return;
    }
    console.log('[Router] Layer 3 (Knowledge Base): No answer found.');

    // --- Layer 4: TinyML Classification ---
    const classification = await getTinyMLClassification(sanitizedText);
    console.log('[Router] Layer 4 (TinyML): Classification result:', classification);
    if (classification.isToxic) {
        console.warn('[Router] TinyML detected toxic content. Blocking response.');
        onChunk('I cannot respond to that. Please keep the conversation respectful.');
        return;
    }

    // --- Layer 5: TinyLLM (On-Device Generative) ---
    // If the intent is a simple question, we can try the local LLM first.
    if (classification.intent === 'Simple_Question') {
        console.log('[Router] Intent is "Simple_Question", attempting Layer 5 (TinyLLM).');
        try {
            // We pass the onProgress callback down to the TinyLLM provider.
            await getTinyLLMResponse(sanitizedText, history, onChunk, onProgress);
            console.log('[Router] Layer 5 (TinyLLM): Response generated successfully.');
            return; // Success, end of flow.
        } catch (error) {
            console.warn('[Router] Layer 5 (TinyLLM) failed. Escalating.', error);
            // Fall through to escalation.
        }
    }

    // --- Layer 6: TinyAI (Constrained Agentic Logic) ---
    console.log('[Router] Attempting Layer 6 (TinyAI).');
    const agentResponse = await getTinyAIResponse(sanitizedText, history);
    if (agentResponse) {
        console.log('[Router] Layer 6 (TinyAI): Agentic response generated.');
        onChunk(agentResponse);
        return; // Success, end of flow.
    }
    console.log('[Router] Layer 6 (TinyAI): No action taken, proceeding.');


    // --- Layer 7: Escalation to Cloud LLM ---
    console.log('[Router] Escalating to Layer 7 (Cloud LLM - Google).');
    if (onProgress) {
        onProgress({ status: 'fetching', message: 'Consulting cloud AI...' });
    }
    try {
        await EscalationService.streamChatResponse(history, sanitizedText, onChunk);
    } catch (error) {
        console.error('[Router] Layer 7 (Escalation) failed:', error);
        onChunk('Sorry, I encountered an issue while connecting to our advanced AI. Please try again later.');
    }
};