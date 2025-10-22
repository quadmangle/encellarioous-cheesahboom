import { build } from 'esbuild';
import { mkdir, rm, copyFile } from 'fs/promises';
import { resolve } from 'path';

const outDir = resolve('assets');

const copyOptionalAsset = async (source, destination) => {
  try {
    await copyFile(source, destination);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.warn(`Skipping optional asset ${source} because it does not exist.`);
      return;
    }
    throw error;
  }
};

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: resolve(outDir, 'app.js'),
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  sourcemap: false,
  jsx: 'automatic',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  },
  define: {
    'process.env.API_KEY': '""',
    'process.env.NODE_ENV': '"production"'
  }
});

await build({
  entryPoints: ['src/service-worker.ts'],
  bundle: true,
  outfile: resolve('service-worker.js'),
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  sourcemap: false,
  loader: {
    '.ts': 'ts'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

await copyFile('styles/app.css', resolve(outDir, 'app.css'));
await copyOptionalAsset('ops_bm25_corpus.jsonl', resolve(outDir, 'ops_bm25_corpus.jsonl'));
