import { cloneInitData, sanitizeInitData } from './transformers';
import { BooType, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(initData: U): Store => {
	const storeId = storeIdBase++;
	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);
	const hookRegisteredCount: Record<string, number> = {};

	const registerHook = (booUId: string) => {
		if (hookRegisteredCount[booUId] === undefined) {
			hookRegisteredCount[booUId] = 1;
		} else {
			hookRegisteredCount[booUId]++;
		}
	};
	const unregisterHook = (booUId: string) => {
		if (hookRegisteredCount[booUId] === undefined) {
			console.warn(
				'hookRegisteredCount is not found. could be because of hot-loading or you removed this hook multiple times.'
			);
			return;
		}
		hookRegisteredCount[booUId]--;
		if (hookRegisteredCount[booUId] === 0) {
			delete hookRegisteredCount[booUId];
		}
	};
	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		snapshot: {
			data: snapshot,
		}, // used only for comparison
		data, // will be returned to the user
		initData: { data: cloned },
		hookRegisteredCount: booUId => {
			return hookRegisteredCount[booUId] ?? 0;
		},
		registerHook,
		unregisterHook,
	};
};

export { createStore };
