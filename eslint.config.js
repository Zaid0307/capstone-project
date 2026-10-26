import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['build', 'storybook-static', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/setupTests.js', 'src/test-utils.jsx'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },
  {
    files: ['*.config.js', '.storybook/**'],
    languageOptions: { globals: { ...globals.node } },
  },
];
