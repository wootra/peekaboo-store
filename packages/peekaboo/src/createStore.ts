import { cloneInitData, sanitizeInitData } from './transformers';
import { BooType, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(initData: U): Store => {
	const storeId = storeIdBase++;
	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);
	const hookRegisteredCount: Record<string, number> = {};

	const registerHook = (boo: BooType<any>) => {
		const key = boo.__booUId;
		if (hookRegisteredCount[key] === undefined) {
			hookRegisteredCount[key] = 1;
		} else {
			hookRegisteredCount[key]++;
		}
	};
	const unregisterHook = (boo: BooType<any>) => {
		const key = boo.__booUId;
		if (hookRegisteredCount[key] === undefined) {
			console.warn(
				'hookRegisteredCount is not found. could be because of hot-loading or you removed this hook multiple times.'
			);
		}
		hookRegisteredCount[key]--;
		if (hookRegisteredCount[key] === 0) {
			delete hookRegisteredCount[key];
		}
	};
	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		snapshot, // used only for comparison
		data, // will be returned to the user
		initData: cloned,
		hookRegisteredCount: (id: string) => {
			return hookRegisteredCount[id] ?? 0;
		},
		registerHook,
		unregisterHook,
	};
};

export { createStore };
