import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      minify(),
    ],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
];
