const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  // Node.js — servidor e seeds (CommonJS)
  {
    files: ['server.js', 'db/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // Browser — módulos ES do frontend
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
      sourceType: 'module',
    },
  },
  {
    ignores: ['node_modules/'],
  },
];
