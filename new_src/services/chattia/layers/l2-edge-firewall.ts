import type { ChatMessage } from '../../../types';
import { appendInteractionToSession } from './l1-conversation';
import type { ChatSession, FirewallDecision } from '../types';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_TOKENS = 8;

const sanitize = (text: string): string =>
  text.replace(/[<>{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const containsInjectionPattern = (text: string): boolean => {
  const patterns = [
    /\bselect\b/i,
    /\binsert\b/i,
    /\bdrop\b/i,
    /\bunion\b/i,
    /<script/i,
  ];
  return patterns.some((pattern) => pattern.test(text));
};

export const runEdgeFirewall = (
  session: ChatSession,
  userInput: string,
  history: ChatMessage[],
): FirewallDecision => {
  const sanitizedText = sanitize(userInput);
  if (!sanitizedText) {
    return {
      allowed: false,
      sanitizedText,
      reason: 'Please enter a question about OPS services.',
    };
  }

  const now = Date.now();
  const { rateLimit } = session;
  if (now - rateLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimit.tokens = 0;
    rateLimit.lastReset = now;
  }
  rateLimit.tokens += 1;
  if (rateLimit.tokens > RATE_LIMIT_MAX_TOKENS) {
    return {
      allowed: false,
      sanitizedText,
      reason: 'Rate limit reached. Please wait a moment before asking again.',
    };
  }

  if (sanitizedText.includes(session.honeypotToken)) {
    return {
      allowed: false,
      sanitizedText,
      reason: 'Potential automation detected. Session locked.',
    };
  }

  if (containsInjectionPattern(sanitizedText)) {
    return {
      allowed: false,
      sanitizedText,
      reason: 'Security policy prevents processing that request.',
    };
  }

  appendInteractionToSession({ role: 'user', text: sanitizedText, timestamp: now });
  history
    .filter((item) => item.role === 'bot' && item.text)
    .slice(-3)
    .forEach((botMessage) => {
      appendInteractionToSession({ role: botMessage.role, text: botMessage.text, timestamp: now });
    });

  return {
    allowed: true,
    sanitizedText,
  };
};
