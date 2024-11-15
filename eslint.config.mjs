import globals from "globals";
import babelParser from "@babel/eslint-parser";
import parser from "svelte-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("plugin:svelte/recommended"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.browser,
            __TRANSMISSION_HOST__: "readonly",
            __TRANSMISSION_PORT__: "readonly",
            __TRANSMISSION_USERNAME__: "readonly",
            __TRANSMISSION_PATH__: "readonly",
            __TRANSMISSION_PASSWORD__: "readonly",
            __TRANSMISSION_SSL__: "readonly",
            __ENV__: "readonly",
        },

        parser: babelParser,
        ecmaVersion: 2021,
        sourceType: "module",
    },

    rules: {
        "svelte/valid-compile": ["error", {
            ignoreWarnings: true,
        }],
    },
}, {
    files: ["**/*.svelte"],

    languageOptions: {
        parser: parser,
    },
}];