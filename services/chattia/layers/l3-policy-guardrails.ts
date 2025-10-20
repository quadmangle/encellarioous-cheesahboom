import type { ChatSession, PolicyDecision } from '../types';

const ALLOWED_TOPICS = [
  'ops',
  'operations',
  'business operations',
  'contact center',
  'it support',
  'professional services',
  'cybersecurity',
  'pricing',
  'membership',
  'join ops',
  'support portal',
  'service catalog',
  'ai assistant',
];

const BLOCKED_PATTERNS = [
  /bitcoin|crypto/i,
  /politic/i,
  /religion/i,
  /personal advice/i,
  /medical/i,
];

export const enforceGuardrails = (
  session: ChatSession,
  sanitizedText: string,
): PolicyDecision => {
  const lower = sanitizedText.toLowerCase();
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(lower))) {
    return {
      allowed: false,
      reason:
        session.language === 'es'
          ? 'Solo puedo ayudar con información del sitio OPS en línea. Por favor formula preguntas sobre nuestros servicios.'
          : 'I can only assist with information from the OPS Online Support site. Please ask about our services.',
    };
  }

  const inScope = ALLOWED_TOPICS.some((topic) => lower.includes(topic));
  if (!inScope) {
    return {
      allowed: false,
      reason:
        session.language === 'es'
          ? 'Para mantener la seguridad, Chattia solo responde a temas del sitio OPS. Pregunta sobre Operaciones, TI, Contact Center o Servicios Profesionales.'
          : 'To keep things secure, Chattia only answers about the OPS site. Ask about Business Operations, IT Support, the Contact Center, or Professional Services.',
    };
  }

  return { allowed: true };
};
