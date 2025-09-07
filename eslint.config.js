// ESLint Flat Config for Astro + React + TypeScript
// https://eslint.org/docs/latest/use/configure/configuration-files-new
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import astro from "eslint-plugin-astro";

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  // Base JS/TS environment
  {
    name: "global-settings",
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 推奨ルール
  js.configs.recommended,

  // グローバルルール
  {
    name: "global",
    rules: {
      semi: ["error", "always"],
      "no-extra-semi": "error",
    },
  },

  // TypeScript .ts/.tsx
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true, // use tsconfig.json if present
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Opt-in tweaks suitable for this repo
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Use core semi rule (ESLint v9 + TS parser handles TS syntax)
      semi: ["error", "always"],
    },
  },

  // React .tsx
  {
    files: ["**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...(reactPlugin.configs?.recommended?.rules ?? {}),
      ...(reactHooks.configs?.recommended?.rules ?? {}),
      "react/react-in-jsx-scope": "off", // React 17+
      "react/prop-types": "off", // using TypeScript types instead
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // Astro flat recommended (includes parser/processor settings)
  ...astro.configs["flat/recommended"],

  // AstroのTSファイル (<script lang="ts">)にルールを適用
  {
    files: ["**/*.astro/*.ts", "*.astro/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      semi: ["error", "always"],
    },
  },

  // Ignore patterns
  {
    ignores: [
      "dist/",
      "node_modules/",
      "tmp/",
      ".astro/",
    ],
  },
]);
