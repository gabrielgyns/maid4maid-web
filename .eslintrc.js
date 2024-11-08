/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
      '@rocketseat/eslint-config/next',
      'next/core-web-vitals',
      'next',
      'eslint:recommended',
    ],
    plugins: ['simple-import-sort'],
    rules: {
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      'simple-import-sort/imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'object-shorthand': 'warn',
      camelcase: 'off',
      'react/no-unescaped-entities': 'off', // Yes or No?
      'prettier/prettier': ['error', { semi: true, singleQuote: true }],
    },
  };