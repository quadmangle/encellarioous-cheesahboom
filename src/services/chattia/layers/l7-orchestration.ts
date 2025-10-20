import type { ChatMessage } from '../../../types';
import type { AIProgress } from '../../../types';
import * as CloudflareService from '../../cloudflare';
import { computeHmac } from '../utils/crypto';
import type { AuditLogEntry, ChatSession } from '../types';

const auditTrail: AuditLogEntry[] = [];

export const escalateToSealedFallback = async (
  session: ChatSession,
  history: ChatMessage[],
  sanitizedText: string,
  onChunk: (chunk: string) => void,
  onProgress?: (progress: AIProgress) => void,
): Promise<boolean> => {
  const payloadSummary = sanitizedText.slice(0, 120);
  const hmac = await computeHmac(session.signature, payloadSummary);
  auditTrail.push({
    sessionId: session.id,
    timestamp: Date.now(),
    hmac,
    target: 'cloudflare-worker',
    payloadSummary,
  });
  if (onProgress) {
    onProgress({ status: 'fetching', message: 'Consulting sealed OPS AI fallback...' });
  }
  try {
    await CloudflareService.streamChatResponse(history, sanitizedText, onChunk);
    return true;
  } catch (error) {
    console.error('Sealed orchestration fallback failed', error);
    onChunk(
      session.language === 'es'
        ? 'No se pudo contactar con la IA en la nube certificada. Intenta nuevamente más tarde.'
        : 'We could not reach the sealed cloud AI fallback. Please try again later.'
    );
    return false;
  }
};

export const getAuditTrail = (): AuditLogEntry[] => [...auditTrail];
