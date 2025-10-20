import type { Language } from '../../../types';
import { BM25 } from '../../efficiency/bm25';
import type { KnowledgeDocument, KnowledgeHit, KnowledgeResult } from '../types';

const KNOWLEDGE_SOURCE_URL = './ops_bm25_corpus.jsonl';

let bm25Index: BM25<string> | null = null;
let documents: KnowledgeDocument[] = [];
let docMap = new Map<string, KnowledgeDocument>();
let corpusLoadPromise: Promise<void> | null = null;

const buildDocument = (raw: any): KnowledgeDocument => ({
  docId: raw.doc_id,
  title: raw.title,
  body: raw.body,
  url: raw.anchors?.[0],
  lang: raw.lang,
  category: raw.category,
  tags: raw.tags,
});

const ensureKnowledgeCorpus = async () => {
  if (bm25Index) {
    return;
  }
  if (!corpusLoadPromise) {
    corpusLoadPromise = (async () => {
      try {
        if (typeof fetch === 'undefined') {
          console.warn('Knowledge corpus cannot be loaded without fetch support.');
          documents = [];
          docMap = new Map();
          bm25Index = null;
          return;
        }
        const response = await fetch(KNOWLEDGE_SOURCE_URL);
        const text = await response.text();
        const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
        documents = lines.map((line) => buildDocument(JSON.parse(line)));
        docMap = new Map(documents.map((doc) => [doc.docId, doc]));
        const corpus = documents.map((doc) => ({
          key: doc.docId,
          text: `${doc.title}. ${doc.body}. ${(doc.tags || []).join(' ')}`,
        }));
        bm25Index = new BM25(corpus);
      } catch (error) {
        console.error('Failed to load OPS knowledge corpus', error);
        documents = [];
        docMap = new Map();
        bm25Index = null;
      }
    })();
  }
  await corpusLoadPromise;
};

const formatHighlight = (doc: KnowledgeDocument, language: Language): string => {
  const body = doc.body;
  if (language === 'es' && doc.lang === 'es') {
    return body;
  }
  if (language === 'en' && doc.lang === 'en') {
    return body;
  }
  return body;
};

export const searchKnowledge = async (query: string, language: Language): Promise<KnowledgeResult> => {
  await ensureKnowledgeCorpus();
  if (!bm25Index) {
    return { hit: null };
  }
  const results = bm25Index.search(query).slice(0, 3);
  if (results.length === 0) {
    return { hit: null };
  }

  const preferred = results.find((result) => docMap.get(result.doc.key)?.lang === language) || results[0];
  const doc = docMap.get(preferred.doc.key);
  if (!doc) {
    return { hit: null };
  }

  const highlight = formatHighlight(doc, language);
  const hit: KnowledgeHit = {
    document: doc,
    score: preferred.score,
    highlight,
  };
  return { hit };
};
