import type { ChatMessage, Language } from '../../../types';
import { computeSessionSignature, generateRandomId } from '../utils/crypto';
import type { ChatSession, SessionInteraction } from '../types';

let activeSession: ChatSession | null = null;
const listeners = new Set<(session: ChatSession | null) => void>();

const notify = () => {
  listeners.forEach((listener) => {
    try {
      listener(activeSession);
    } catch (error) {
      console.warn('Chattia session listener error', error);
    }
  });
};

const buildSession = async (language: Language): Promise<ChatSession> => {
  const id = generateRandomId('sess');
  const signature = await computeSessionSignature(id);
  const now = Date.now();
  return {
    id,
    language,
    createdAt: now,
    updatedAt: now,
    signature,
    honeypotToken: generateRandomId('hp'),
    interactions: [],
    rateLimit: {
      tokens: 0,
      lastReset: now,
    },
  };
};

const syncHistoryIntoSession = (session: ChatSession, history: ChatMessage[]) => {
  const sanitizedHistory: SessionInteraction[] = history
    .filter((msg) => Boolean(msg.text))
    .map((msg) => ({
      role: msg.role,
      text: msg.text,
      timestamp: Date.now(),
    }));
  session.interactions = sanitizedHistory;
  session.updatedAt = Date.now();
};

export const ensureSession = async (language: Language, history: ChatMessage[]): Promise<ChatSession> => {
  if (!activeSession) {
    activeSession = await buildSession(language);
  } else if (activeSession.language !== language) {
    activeSession.language = language;
    activeSession.updatedAt = Date.now();
  }
  syncHistoryIntoSession(activeSession, history);
  notify();
  return activeSession;
};

export const startNewSession = async (language: Language): Promise<ChatSession> => {
  activeSession = await buildSession(language);
  notify();
  return activeSession;
};

export const resetSession = () => {
  activeSession = null;
  notify();
};

export const appendInteractionToSession = (interaction: SessionInteraction) => {
  if (!activeSession) {
    return;
  }
  activeSession.interactions.push(interaction);
  activeSession.updatedAt = Date.now();
  notify();
};

export const onSessionChange = (listener: (session: ChatSession | null) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getActiveSession = (): ChatSession | null => activeSession;
