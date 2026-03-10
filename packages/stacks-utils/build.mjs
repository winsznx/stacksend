import { build } from 'esbuild';

await Promise.all([
  build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    outfile: 'dist/index.js',
    external: ['zod'],
  }),
  build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'neutral',
    format: 'cjs',
    outfile: 'dist/index.cjs',
    external: ['zod'],
  }),
]);
