import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import process from 'node:process';

const normalizeNewlines = (value) => value.replace(/\r\n/g, '\n');

const hashContents = (value) => {
  const hash = createHash('sha256');
  hash.update(value);
  return hash.digest('hex');
};

const rootCorpusPath = new URL('../ops_bm25_corpus.jsonl', import.meta.url);
const newSrcCorpusPath = new URL('../new_src/ops_bm25_corpus.jsonl', import.meta.url);

const main = async () => {
  const [rootCorpus, newSrcCorpus] = await Promise.all([
    readFile(rootCorpusPath, 'utf8'),
    readFile(newSrcCorpusPath, 'utf8'),
  ]);

  const rootHash = hashContents(normalizeNewlines(rootCorpus));
  const newSrcHash = hashContents(normalizeNewlines(newSrcCorpus));

  if (rootHash !== newSrcHash) {
    throw new Error(
      'The OPS knowledge corpus differs between the legacy build and the esbuild edition. ' +
        'Sync ops_bm25_corpus.jsonl across / and /new_src before committing.',
    );
  }

  console.log('Knowledge corpus assets are in sync.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
