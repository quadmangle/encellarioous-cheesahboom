import esbuild from 'esbuild';
import { mkdir, readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const outDir = 'dist';

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function copyIfExists(source, destination) {
  try {
    await access(source, fsConstants.F_OK);
    await ensureDir(path.dirname(destination));
    await copyFile(source, destination);
    console.log(`copied ${source} -> ${destination}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function writeIndexHtml() {
  const htmlPath = path.resolve('index.html');
  const htmlContents = await readFile(htmlPath, 'utf8');
  const distHtml = htmlContents.replace('./dist/index.js', './index.js');
  await writeFile(path.join(outDir, 'index.html'), distHtml, 'utf8');
  console.log('wrote dist/index.html');
}

async function run() {
  await ensureDir(outDir);

  await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outdir: outDir,
    format: 'esm',
    sourcemap: true,
    target: ['es2020'],
    jsx: 'automatic',
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.json': 'json'
    },
    tsconfig: 'tsconfig.json',
    minify: true,
    logLevel: 'info'
  });

  await writeIndexHtml();
  await copyIfExists('ops_bm25_corpus.jsonl', path.join(outDir, 'ops_bm25_corpus.jsonl'));
  await copyIfExists('runtime-config.js', path.join(outDir, 'runtime-config.js'));
  await copyIfExists('metadata.json', path.join(outDir, 'metadata.json'));

  console.log('\nBuild complete. The static site is available in dist/.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
