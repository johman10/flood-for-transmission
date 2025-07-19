import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import svelte from 'eslint-plugin-svelte';
import parser from 'svelte-eslint-parser';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        __TRANSMISSION_HOST__: 'readonly',
        __TRANSMISSION_PORT__: 'readonly',
        __TRANSMISSION_USERNAME__: 'readonly',
        __TRANSMISSION_PATH__: 'readonly',
        __TRANSMISSION_PASSWORD__: 'readonly',
        __TRANSMISSION_SSL__: 'readonly',
        __ENV__: 'readonly',
      },
      parser: babelParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },

    rules: {
      'svelte/valid-compile': [
        'error',
        {
          ignoreWarnings: true,
        },
      ],
    },
  },
  {
    files: ['**/*.svelte'],

    languageOptions: {
      parser: parser,
    },
  },
];
