const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  rules: {
		'no-case-declarations': 'error',
		'prefer-const': ['error', {
			'destructuring': 'any',
			'ignoreReadBeforeAssign': false
		}],
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
		'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off'
  },
});
