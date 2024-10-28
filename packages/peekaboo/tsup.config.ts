import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'utils/slices': 'src/utils/slices.ts',
		'utils/update': 'src/utils/update.ts',
		'utils/usage': 'src/utils/usage.ts',
		'vanilla/index': 'src/vanilla/index.ts',
		'react/index': 'src/react/index.ts',
	},
	// banner: {
	// 	js: "'use client'",
	// },
	format: ['cjs', 'esm'],
	external: ['react'],
	dts: true,
	clean: true,
	minify: true,
	bundle: true,
});
