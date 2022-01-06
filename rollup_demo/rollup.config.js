import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import myPlugin from './rollup-plugin-my-plugin';

export default [
  {
    input: 'virtual-module', // resolved by our plugin
    plugins: [myPlugin()],
    output: [
      {
        file: 'bundle-virtual.js',
        format: 'es',
      },
    ],
  },
  {
    input: 'src/main.js',
    output: [
      {
        file: 'bundle2.js',
        format: 'cjs',
      },
      {
        file: 'bundle2.min.js',
        format: 'iife',
        name: 'version',
        plugins: [terser()],
      },
    ],
    plugins: [json()],
  },
];
