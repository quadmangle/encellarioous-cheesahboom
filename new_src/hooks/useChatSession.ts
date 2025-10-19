import { useCallback, useEffect, useState } from 'react';
import type { Language } from '../types';
import { ensureSession, onSessionChange, startNewSession } from '../services/chattia';
import type { ChatSession } from '../services/chattia';
import type { ChatMessage } from '../types';

export const useChatSession = (language: Language, history: ChatMessage[]) => {
  const [session, setSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureSession(language, history)
      .then((value) => {
        if (!cancelled) {
          setSession(value);
        }
      })
      .catch((error) => {
        console.warn('Unable to ensure chat session', error);
      });
    const unsubscribe = onSessionChange((value) => {
      setSession(value);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [language, history]);

  const restartSession = useCallback(async () => {
    const newSession = await startNewSession(language);
    setSession(newSession);
  }, [language]);

  return { session, restartSession };
};
