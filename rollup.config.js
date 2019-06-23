import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import analyze from 'rollup-plugin-analyzer';
import gzipPlugin from 'rollup-plugin-gzip';
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';

export default [
  {
    input: 'src/index.js',
    plugins: [
      analyze(),
      resolve({ modulesOnly: true }),
      babel({
        exclude: 'node_modules/**',
      }),
      minify(),
      gzipPlugin(),
    ],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },
];
