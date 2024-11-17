/* eslint-env node */

import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import dotenv from 'dotenv';
import babel from '@rollup/plugin-babel';
import * as url from 'url';
import childProcess from 'child_process';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

if (!production) {
  dotenv.config();
}

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = childProcess.spawn('npm', ['run', 'serve', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

function getParsedEnvVariable(key, type = 'string') {
  if (!(key in process.env)) {
    return undefined;
  }

  switch (type) {
    case 'boolean':
      return process.env[key] === 'true';
    default:
      return JSON.stringify(process.env[key]);
  }
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'es',
    name: 'app',
    dir: 'public/build',
  },
  preserveEntrySignatures: false,
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
    }),

    copy({
      targets: [
        {
          src: 'src/helpers/constants/defaultConfig.json',
          dest: 'public',
          rename: 'config.json.defaults',
        },
      ],
    }),

    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.json', '.node', '.svelte'],
      dedupe: ['svelte'],
    }),
    commonjs(),

    json(),

    alias({
      entries: [
        {
          find: '~components',
          replacement: path.join(__dirname, './src/components'),
        },
        {
          find: '~helpers',
          replacement: path.join(__dirname, './src/helpers'),
        },
      ],
    }),

    replace({
      preventAssignment: true,
      exclude: 'node_modules/**',
      values: {
        __TRANSMISSION_HOST__: getParsedEnvVariable('TRANSMISSION_HOST'),
        __TRANSMISSION_PORT__: getParsedEnvVariable('TRANSMISSION_PORT'),
        __TRANSMISSION_USERNAME__: getParsedEnvVariable(
          'TRANSMISSION_USERNAME'
        ),
        __TRANSMISSION_PATH__: getParsedEnvVariable('TRANSMISSION_PATH'),
        __TRANSMISSION_PASSWORD__: getParsedEnvVariable(
          'TRANSMISSION_PASSWORD'
        ),
        __TRANSMISSION_SSL__:
          getParsedEnvVariable('TRANSMISSION_SSL', 'boolean') || false,
        __ENV__: production ? '"production"' : '"development"',

        __DARK_MODE__: getParsedEnvVariable('FLOOD_DARK_MODE'),
        __SWITCH_COLORS__: getParsedEnvVariable(
          'FLOOD_SWITCH_COLORS',
          'boolean'
        ),
        __NOTATION_24H__: getParsedEnvVariable('FLOOD_NOTATION_24H', 'boolean'),
        __WRAP_HEADER__: getParsedEnvVariable('FLOOD_WRAP_HEADER', 'boolean'),
        __COMMON_PATH__: getParsedEnvVariable('FLOOD_COMMON_PATH'),
        __COLUMNS__: getParsedEnvVariable('FLOOD_COLUMNS'),
        __SORT_COLUMN__: getParsedEnvVariable('FLOOD_SORT_COLUMN'),
        __SORT_DIRECTION__: getParsedEnvVariable('FLOOD_SORT_DIRECTION'),
        __SHOW_DISK_USAGE__: getParsedEnvVariable(
          'FLOOD_SHOW_DISK_USAGE',
          'boolean'
        ),
      },
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    production &&
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        include: ['src/**', 'node_modules/svelte/**'],
      }),

    // If we're building for production (npm run build
    // instead of npm start), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
