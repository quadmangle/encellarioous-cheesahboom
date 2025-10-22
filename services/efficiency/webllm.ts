// services/efficiency/webllm.ts
/**
 * WebLLM Service (Singleton)
 *
 * This service encapsulates all the complexity of loading, managing, and
 * interacting with the in-browser WebLLM engine. It follows a singleton pattern
 * to ensure the heavy model is only initialized once.
 */
import type { ChatMessage, AIProgress } from '../../types';
import { integrationConfig } from '../../src/services/runtime/integrationConfig';

// FIX: Declare the 'webllm' global variable, which is loaded from a script tag.
// This informs TypeScript of its existence and prevents "Cannot find name" errors.
declare var webllm: any;

type EngineStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

let engine: any = null;
let status: EngineStatus = 'uninitialized';
let initializationPromise: Promise<void> | null = null;
const MODEL_ID = integrationConfig.webLLM.modelId;

/**
 * Initializes the WebLLM engine. This is the core of the on-demand strategy.
 * It's an async process that reports its progress back to the UI.
 */
export const initialize = (onProgress: (progress: AIProgress) => void): Promise<void> => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            if (status !== 'uninitialized') return;

            console.log('Initializing WebLLM engine...');
            status = 'loading';

            try {
                if (typeof webllm === 'undefined') {
                    throw new Error('WebLLM library not loaded.');
                }
                
                const progressCallback = (report: any) => {
                    const progressUpdate: AIProgress = {
                        status: 'loading',
                        message: report.text,
                        progress: report.progress,
                    };
                    onProgress(progressUpdate);
                };

                onProgress({ status: 'initializing', message: 'Initializing AI Engine...' });

                // Create the engine, which will start downloading the model.
                engine = await webllm.CreateMLCEngine(MODEL_ID, {
                    initProgressCallback: progressCallback,
                });
                
                status = 'ready';
                console.log('WebLLM engine ready.');
                onProgress({ status: 'ready', message: 'AI Engine Ready.' });

            } catch (error) {
                status = 'error';
                const errorMessage = `Failed to initialize WebLLM engine: ${error.message}`;
                console.error(errorMessage, error);
                onProgress({ status: 'error', message: errorMessage });
                throw error;
            }
        })();
    }
    return initializationPromise;
};

/**
 * A combined function to either initialize the engine or generate a response if already initialized.
 * This simplifies the logic in the calling provider.
 */
export const initializeOrGetResponse = async (
    text: string,
    history: ChatMessage[],
    onChunk: (chunk: string) => void,
    onProgress: (progress: AIProgress) => void
) => {
    if (status !== 'ready') {
        // If the special "__INITIALIZE__" command is sent, start loading.
        if (text === '__INITIALIZE__') {
            await initialize(onProgress);
            return; // Initialization is done, wait for next user message.
        } else {
            throw new Error("WebLLM engine is not ready. It must be initialized first.");
        }
    }
    await getWebLLMResponse(text, history, onChunk);
};

/**
 * Generates a streaming response from the WebLLM engine.
 * Assumes the engine is already initialized and ready.
 */
export const getWebLLMResponse = async (
    text: string,
    history: ChatMessage[],
    onChunk: (chunk: string) => void
): Promise<void> => {
    if (status !== 'ready' || !engine) {
        throw new Error("WebLLM engine is not ready.");
    }

    try {
        // Format the history for the WebLLM model.
        // This may need to be adjusted based on the specific model's prompt template.
        const conversationHistory = history.map(msg => ({
            role: msg.role === 'bot' ? 'assistant' : msg.role,
            content: msg.text
        }));
        
        conversationHistory.push({ role: 'user', content: text });

        const chunks = await engine.chat.completions.create({
            stream: true,
            messages: conversationHistory,
        });

        let fullReply = "";
        for await (const chunk of chunks) {
            const delta = chunk.choices[0].delta.content;
            if (delta) {
                fullReply += delta;
                onChunk(fullReply);
            }
        }
    } catch (error) {
        console.error("Error during WebLLM chat completion:", error);
        throw error;
    }
};