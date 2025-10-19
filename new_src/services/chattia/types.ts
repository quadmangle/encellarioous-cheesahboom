import type { ChatMessage, Language } from '../../types';

export interface SessionInteraction {
  role: ChatMessage['role'];
  text: string;
  timestamp: number;
}

export interface RateLimitState {
  tokens: number;
  lastReset: number;
}

export interface ChatSession {
  id: string;
  language: Language;
  createdAt: number;
  updatedAt: number;
  signature: string;
  honeypotToken: string;
  interactions: SessionInteraction[];
  rateLimit: RateLimitState;
}

export interface FirewallDecision {
  allowed: boolean;
  sanitizedText: string;
  reason?: string;
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export interface KnowledgeDocument {
  docId: string;
  title: string;
  body: string;
  url?: string;
  lang: Language;
  category?: string;
  tags?: string[];
}

export interface KnowledgeHit {
  document: KnowledgeDocument;
  score: number;
  highlight: string;
}

export interface KnowledgeResult {
  hit: KnowledgeHit | null;
}

export type LocalIntent =
  | 'greeting'
  | 'service_info'
  | 'contact'
  | 'join'
  | 'pricing'
  | 'policies'
  | 'unknown';

export interface LocalIntelligenceResult {
  handled: boolean;
  answer?: string;
  intent: LocalIntent;
}

export interface MemoryRecordMetadata {
  intent: LocalIntent;
  knowledgeDocId?: string;
  escalated?: boolean;
}

export interface AuditLogEntry {
  sessionId: string;
  timestamp: number;
  hmac: string;
  target: 'cloudflare-worker';
  payloadSummary: string;
}

