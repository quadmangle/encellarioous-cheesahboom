import { build } from 'esbuild';
import { mkdir, rm, copyFile } from 'fs/promises';
import { resolve } from 'path';

const outDir = resolve('assets');

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

await copyFile('styles/app.css', resolve(outDir, 'app.css'));
