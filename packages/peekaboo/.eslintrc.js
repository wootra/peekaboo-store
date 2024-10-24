module.exports = {
	root: true,
	extends: ['@acme/eslint-config/react-internal.js'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	rules: {
		'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
	},
};
