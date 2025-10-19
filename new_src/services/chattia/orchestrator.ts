import type { ChatMessage, AIProgress, Language } from '../../types';
import { ensureSession, appendInteractionToSession } from './layers/l1-conversation';
import { runEdgeFirewall } from './layers/l2-edge-firewall';
import { enforceGuardrails } from './layers/l3-policy-guardrails';
import { searchKnowledge } from './layers/l4-knowledge';
import { runLocalIntelligence } from './layers/l5-local-intelligence';
import { recordEncryptedInteraction } from './layers/l6-memory';
import { escalateToSealedFallback } from './layers/l7-orchestration';

const inferLanguageFromHistory = (history: ChatMessage[]): Language => {
  const metadata = history.find((item) => item.role === 'system' && item.text.includes('language'));
  if (metadata) {
    try {
      const parsed = JSON.parse(metadata.text);
      if (parsed.language === 'es' || parsed.language === 'en') {
        return parsed.language;
      }
    } catch (error) {
      console.warn('Unable to parse language metadata', error);
    }
  }
  return 'en';
};

export const handleChat = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (chunk: string) => void,
  onProgress?: (progress: AIProgress) => void,
): Promise<void> => {
  const language = inferLanguageFromHistory(history);
  const session = await ensureSession(language, history);
  const firewallDecision = runEdgeFirewall(session, newMessage, history);
  if (!firewallDecision.allowed) {
    const response = firewallDecision.reason || (language === 'es'
      ? 'No se pudo procesar tu mensaje.'
      : 'Your message could not be processed.');
    onChunk(response);
    appendInteractionToSession({ role: 'bot', text: response, timestamp: Date.now() });
    await recordEncryptedInteraction(session, firewallDecision.sanitizedText, response, {
      intent: 'unknown',
      escalated: false,
    });
    return;
  }

  const guardrailDecision = enforceGuardrails(session, firewallDecision.sanitizedText);
  if (!guardrailDecision.allowed) {
    const response = guardrailDecision.reason || (language === 'es'
      ? 'Solo puedo hablar sobre el contenido del sitio OPS.'
      : 'I can only discuss OPS site content.');
    onChunk(response);
    appendInteractionToSession({ role: 'bot', text: response, timestamp: Date.now() });
    await recordEncryptedInteraction(session, firewallDecision.sanitizedText, response, {
      intent: 'unknown',
      escalated: false,
    });
    return;
  }

  const knowledgeResult = await searchKnowledge(firewallDecision.sanitizedText, language);
  const localResult = runLocalIntelligence(language, firewallDecision.sanitizedText, knowledgeResult.hit);

  if (localResult.handled && localResult.answer) {
    onChunk(localResult.answer);
    appendInteractionToSession({ role: 'bot', text: localResult.answer, timestamp: Date.now() });
    await recordEncryptedInteraction(session, firewallDecision.sanitizedText, localResult.answer, {
      intent: localResult.intent,
      knowledgeDocId: knowledgeResult.hit?.document.docId,
      escalated: false,
    });
    return;
  }

  let finalResponse = '';
  const streamingHandler = (chunk: string) => {
    finalResponse = chunk;
    onChunk(chunk);
  };
  const escalated = await escalateToSealedFallback(
    session,
    history,
    firewallDecision.sanitizedText,
    streamingHandler,
    onProgress,
  );
  if (!finalResponse) {
    finalResponse = language === 'es'
      ? 'No obtuve respuesta del servicio en la nube. Inténtalo nuevamente.'
      : 'The sealed cloud fallback did not return a response. Please try again.';
    onChunk(finalResponse);
  }
  appendInteractionToSession({ role: 'bot', text: finalResponse, timestamp: Date.now() });
  await recordEncryptedInteraction(session, firewallDecision.sanitizedText, finalResponse, {
    intent: localResult.intent,
    knowledgeDocId: knowledgeResult.hit?.document.docId,
    escalated,
  });
};
