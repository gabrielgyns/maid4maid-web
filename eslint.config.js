// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config({
  files: ['**/*.{ts,tsx}'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier,
  ],
  plugins: {
    react: react,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react', '^@?\\w'], // React and external packages
          ['^@/'], // Absolute imports
          ['^[./]'], // Relative imports
          ['^.+\\.css$'], // Style imports
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'react-refresh/only-export-components': 'off',
  },
});
