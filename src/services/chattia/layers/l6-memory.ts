import type { ChatSession, LocalIntent, MemoryRecordMetadata } from '../types';
import { encryptPayload, decryptPayload, subtleCryptoAvailable } from '../utils/crypto';

const STORAGE_KEY = 'chattia_encrypted_memory_v1';

interface StoredRecord {
  sessionId: string;
  timestamp: number;
  iv: string;
  data: string;
}

interface AnalyticsSnapshot {
  totalInteractions: number;
  byIntent: Record<LocalIntent, number>;
  encryptedAtRest: boolean;
}

const analytics: AnalyticsSnapshot = {
  totalInteractions: 0,
  byIntent: {
    greeting: 0,
    service_info: 0,
    contact: 0,
    join: 0,
    pricing: 0,
    policies: 0,
    unknown: 0,
  },
  encryptedAtRest: subtleCryptoAvailable(),
};

const updateAnalytics = (intent: LocalIntent) => {
  analytics.totalInteractions += 1;
  analytics.byIntent[intent] += 1;
};

const readStoredRecords = (): StoredRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as StoredRecord[];
  } catch (error) {
    console.warn('Failed to read stored memory', error);
    return [];
  }
};

const persistRecords = (records: StoredRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to persist encrypted memory', error);
  }
};

export const recordEncryptedInteraction = async (
  session: ChatSession,
  userQuestion: string,
  assistantAnswer: string,
  metadata: MemoryRecordMetadata,
) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const payload = JSON.stringify({
      userQuestion,
      assistantAnswer,
      metadata,
    });
    const encrypted = await encryptPayload(session.signature, payload);
    const records = readStoredRecords();
    records.push({
      sessionId: session.id,
      timestamp: Date.now(),
      iv: encrypted.iv,
      data: encrypted.data,
    });
    persistRecords(records);
    updateAnalytics(metadata.intent);
  } catch (error) {
    console.warn('Failed to encrypt interaction', error);
  }
};

export const getDecryptedTranscript = async (session: ChatSession) => {
  const records = readStoredRecords().filter((record) => record.sessionId === session.id);
  const decrypted: Array<{ userQuestion: string; assistantAnswer: string; metadata: MemoryRecordMetadata }> = [];
  for (const record of records) {
    const payload = await decryptPayload(session.signature, { iv: record.iv, data: record.data });
    if (payload) {
      try {
        decrypted.push(JSON.parse(payload));
      } catch (error) {
        console.warn('Unable to parse decrypted payload', error);
      }
    }
  }
  return decrypted;
};

export const getAnalyticsSnapshot = (): AnalyticsSnapshot => ({ ...analytics, byIntent: { ...analytics.byIntent } });
