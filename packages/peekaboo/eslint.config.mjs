import love from 'eslint-config-love';
import tsParser from '@typescript-eslint/parser';
export default [
	{
		...love,
		files: ['**/*.ts'],
		rules: {
			...love.rules,
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/strict-boolean-expressions': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/prefer-destructuring': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'arrow-body-style': 'off',
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
		},
		languageOptions: {
			...love.languageOptions,
			parser: tsParser,
		},
		ignores: [
			'*.js',
			'tsup.config.ts',
			'jest.config.ts',
			'*.test.ts',
			'vitest.config.ts',
			'tagging.js',
			'dist/**/*',
			'node_modules/**/*',
			'coverage/**/*',
			'coverage',
			'coverage/lcov-report/*.js',
		],
	},
];
// module.exports = {
// 	root: true,
// 	extends: ['@acme/eslint-config/react-internal.js'],
// 	parser: '@typescript-eslint/parser',
// 	parserOptions: {
// 		project: true,
// 	},
// 	rules: {
// 		'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
// 	},
// };
