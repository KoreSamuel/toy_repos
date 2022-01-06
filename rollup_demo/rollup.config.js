import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'bundle2.js',
      format: 'cjs'
    },
    {
      file: 'bundle2.min.js',
      format: 'iife',
      name: 'version',
      plugins: [ terser() ]
    }
  ],
  plugins: [json()]
};
