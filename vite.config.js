/* eslint-env node */
import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const fromRoot = (dir) => path.resolve(import.meta.dirname, dir);

// Ships the default config next to the app so users can copy it to config.json
const copyDefaultConfig = () => ({
  name: 'copy-default-config',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'config.json.defaults',
      source: readFileSync(
        fromRoot('src/helpers/constants/defaultConfig.json')
      ),
    });
  },
});

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const stringOrUndefined = (value) =>
    value ? JSON.stringify(value) : 'undefined';

  return {
    // Transmission serves the UI from /transmission/web/ and the RPC from
    // /transmission/rpc, which the app reaches through the relative '../rpc'.
    base: command === 'serve' ? '/transmission/web/' : './',
    plugins: [
      tailwindcss(),
      svelte({
        // The original components predate these a11y checks; keep output readable
        onwarn: (warning, handler) => {
          if (warning.code?.startsWith('a11y')) return;
          handler(warning);
        },
      }),
      copyDefaultConfig(),
    ],
    resolve: {
      // The codebase imports components without their .svelte extension
      extensions: ['.mjs', '.js', '.json', '.svelte'],
      alias: {
        '~components': fromRoot('src/components'),
        '~helpers': fromRoot('src/helpers'),
        '$lib': fromRoot('src/lib'),
      },
    },
    define: {
      __TRANSMISSION_HOST__: stringOrUndefined(env.TRANSMISSION_HOST),
      __TRANSMISSION_PORT__: stringOrUndefined(env.TRANSMISSION_PORT),
      __TRANSMISSION_USERNAME__: stringOrUndefined(env.TRANSMISSION_USERNAME),
      __TRANSMISSION_PATH__: stringOrUndefined(env.TRANSMISSION_PATH),
      __TRANSMISSION_PASSWORD__: stringOrUndefined(env.TRANSMISSION_PASSWORD),
      __TRANSMISSION_SSL__: JSON.stringify(env.TRANSMISSION_SSL === 'true'),
      __ENV__: JSON.stringify(
        command === 'serve' ? 'development' : 'production'
      ),
    },
    server: {
      port: 8080,
      proxy: env.TRANSMISSION_PROXY
        ? {
            '/transmission/rpc': {
              target: env.TRANSMISSION_PROXY,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: true,
    },
  };
});
