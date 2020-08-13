import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import path from 'path';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;

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
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
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
      }
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

    alias({
      entries: [
        { find: '~components', replacement: path.join(__dirname, './src/components') },
        { find: '~helpers', replacement: path.join(__dirname, './src/helpers') },
      ],
    }),

    replace({
      exclude: 'node_modules/**',
      __TRANSMISSION_HOST__: process.env.TRANSMISSION_HOST ? `"${process.env.TRANSMISSION_HOST}"` : undefined,
      __TRANSMISSION_PORT__: process.env.TRANSMISSION_PORT ? `"${process.env.TRANSMISSION_PORT}"` : undefined,
      __TRANSMISSION_USERNAME__: process.env.TRANSMISSION_USERNAME ? `"${process.env.TRANSMISSION_USERNAME}"` : undefined,
      __TRANSMISSION_PATH__: process.env.TRANSMISSION_PATH ? `"${process.env.TRANSMISSION_PATH}"` : undefined,
      __TRANSMISSION_PASSWORD__: process.env.TRANSMISSION_PASSWORD ? `"${process.env.TRANSMISSION_PASSWORD}"` : undefined,
      __TRANSMISSION_SSL__: process.env.TRANSMISSION_SSL ? !!process.env.TRANSMISSION_SSL : undefined,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    production && babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      include: ['src/**', 'node_modules/svelte/**'],
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
