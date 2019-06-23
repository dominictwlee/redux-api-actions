import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import analyze from 'rollup-plugin-analyzer';
import gzipPlugin from 'rollup-plugin-gzip';
import minify from 'rollup-plugin-babel-minify';

export default [
  {
    input: 'src/index.js',
    plugins: [
      analyze(),
      babel({
        exclude: 'node_modules/**',
      }),
      minify(),
      gzipPlugin(),
    ],
    external: ['normalizr'],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
];
