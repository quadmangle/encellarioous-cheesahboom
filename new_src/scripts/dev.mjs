import esbuild from 'esbuild';
import path from 'node:path';
import process from 'node:process';

const entryFile = path.resolve('index.tsx');

const ctx = await esbuild.context({
  entryPoints: [entryFile],
  bundle: true,
  outdir: 'dist',
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
  logLevel: 'info'
});

await ctx.watch();

const { host, port } = await ctx.serve({
  servedir: '.',
  host: '0.0.0.0',
  port: 3000
});

console.log('\n┌──────────────────────────────────────────┐');
console.log(`│  Dev server ready at http://${host}:${port}/ │`);
console.log('└──────────────────────────────────────────┘');
console.log('Press Ctrl+C to stop.');

const shutdown = async () => {
  await ctx.dispose();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
