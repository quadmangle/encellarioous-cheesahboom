// src/services/efficiency/knowledgeBaseService.ts
/**
 * Layer 3: Knowledge Base & RAG (Retrieval-Augmented Generation)
 *
 * Objective: Provide fast, accurate, and deterministic answers for known questions
 * by searching a curated knowledge base before engaging any generative models.
 */
import { BM25 } from './bm25';
import { SERVICES_DATA } from '../../constants';
import type { ServiceKey } from '../../types';

// --- Corpus Creation ---
// We build a searchable corpus from the existing constants file.
// This ensures that the AI's knowledge is always in sync with the website content.

interface CorpusDoc {
    key: ServiceKey;
    text: string;
    // We store the pre-formatted answer to return directly.
    answer: string;
}

const createCorpus = (): CorpusDoc[] => {
    return (Object.keys(SERVICES_DATA) as ServiceKey[]).map(key => {
        const service = SERVICES_DATA[key]['en']; // Search knowledge in English for consistency
        const features = service.modal.features.join(', ');
        // The searchable text includes title, description, and features for better matching.
        // Title is repeated to give it more weight.
        const text = `${service.title}. ${service.title}. ${service.desc}. ${service.modal.content} Features include: ${features}`;
        
        // The pre-canned answer that will be returned if this document is a strong match.
        const answer = `I can certainly help with that. Our **${service.title}** service is designed to ${service.desc.toLowerCase()}.\n\nKey features include:\n*   ${service.modal.features.slice(0, 4).join('\n*   ')}\n\nIs there anything specific you would like to know about this service?`;

        return { key, text, answer };
    });
};

const corpus = createCorpus();
const searchIndex = new BM25<ServiceKey>(corpus);

const MIN_RELEVANCE_SCORE = 1.0; // Threshold to prevent irrelevant answers

/**
 * Searches the knowledge base for a relevant answer to the user's query.
 * @param query The user's input text.
 * @returns The pre-canned answer as a string if a relevant document is found, otherwise null.
 */
export const searchKnowledgeBase = (query: string): string | null => {
    const results = searchIndex.search(query);
    
    if (results.length > 0 && results[0].score > MIN_RELEVANCE_SCORE) {
        const bestResultKey = results[0].doc.key;
        const matchingDoc = corpus.find(doc => doc.key === bestResultKey);
        
        if (matchingDoc) {
            console.log(`[KB Service] Found relevant document '${bestResultKey}' with score: ${results[0].score}`);
            return matchingDoc.answer;
        }
    }

    console.log('[KB Service] No relevant document found above threshold.');
    return null;
};