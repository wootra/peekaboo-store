import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	moduleNameMapper: {
		'src/(.*)': '<rootDir>/src/$1',
	},
	verbose: true,
};

export default config;
