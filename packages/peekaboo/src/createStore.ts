import { cloneInitData, sanitizeInitData } from './transformers';
import { Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(initData: U): Store => {
	const storeId = storeIdBase++;
	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);
	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		snapshot: {
			data: snapshot,
		}, // used only for comparison
		data, // will be returned to the user
		initData: { data: cloned },
	};
};

export { createStore };
