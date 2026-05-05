import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];
