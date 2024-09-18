import { PeekaType, PeekabooObj, PeekabooParsed, BooType, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		data: {},
	};
};

const createValueObj = <T>(store: Store, value: T, booId: string): BooType<T> => {
	store.data[booId] = value;

	return Object.freeze({
		booId,
		init: value,
		get: () => store.data[booId] as T,
		set: (newValue: T) => {
			store.data[booId] = newValue;
		},
	});
};

const convert = <U extends { [Key in keyof U]: U[Key] }, K extends keyof U = keyof U>(
	store: Store,
	obj: U,
	parentKey: string
) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			const currKey = parentKey ? `${parentKey}.${key}` : key;
			if (obj[key as K] && typeof obj[key as K] === 'object') {
				acc[key as K] = convert(store, obj[key as K], currKey);
			} else {
				acc[key as K] = createValueObj(store, obj[key as K], currKey);
			}

			return acc;
		},
		{} as Record<K, unknown>
	);
};

function createPeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(initData: U): PeekabooObj<U> {
	const store = createStore();
	if (!initData || typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}

	const converted = convert<U>(store, initData, '') as unknown as PeekabooParsed<U>;

	return {
		store,
		data: converted,
	};
}

function peeka<T>(value: T): PeekaType<T> {
	return {
		init: value,
	};
}

export { createPeekaboo, peeka };
