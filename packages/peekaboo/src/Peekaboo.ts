import { INIT_VALUE, UPDATE_VALUE } from './consts';
import { PeekaType, PeekabooObj, PeekabooParsed, BooType, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		data: {},
	};
};

const createValueObj = <T>(store: Store, value: PeekaType<T>, booIdSrc: string): BooType<T> => {
	const booId = `${store.storeId}-${booIdSrc}`;
	let initValue = value.init;
	store.data[booId] = initValue;
	let isUsed = false;
	const set = (newValue: T) => {
		store.data[booId] = newValue;
		if (window !== undefined) {
			window.dispatchEvent(
				new CustomEvent(UPDATE_VALUE, {
					detail: {
						id: booId,
						current: newValue,
					},
				})
			);
		}
	};
	const __initialize = (newVal?: T) => {
		initValue = newVal !== undefined ? newVal : initValue;
		isUsed = false;
		store.data[booId] = newVal;
	};

	return Object.freeze({
		booId,
		init: () => initValue,
		used: () => isUsed,
		__initialize,
		get: () => {
			isUsed = true;
			return store.data[booId] as T;
		},
		set,
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
				if ('peekabooType' in obj[key as K] && (obj[key as K] as PeekaType<any>).peekabooType === 'peeka') {
					acc[key as K] = createValueObj(store, obj[key as K], currKey);
				} else {
					acc[key as K] = convert(store, obj[key as K], currKey);
				}
			} else {
				acc[key as K] = createValueObj(store, peeka(obj[key as K]), currKey);
			}

			return acc;
		},
		{} as Record<K, unknown>
	);
};

const update = <U extends { [Key in keyof U]: U[Key] }, K extends keyof U = keyof U>(
	store: Store,
	obj: U,
	parentKey: string
) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			const currKey = parentKey ? `${parentKey}.${key}` : key;
			if (obj[key as K] && typeof obj[key as K] === 'object') {
				if ('peekabooType' in obj[key as K] && (obj[key as K] as PeekaType<any>).peekabooType === 'peeka') {
					if (acc[key as K] === undefined) {
						acc[key as K] = createValueObj(store, obj[key as K], currKey);
					}
					(acc[key as K] as BooType<unknown>).__initialize((obj[key as K] as PeekaType<unknown>).init);
				} else {
					acc[key as K] = update(store, obj[key as K], currKey);
				}
			} else {
				throw new Error('you should wrap this value with peeka - where is triggering error is:' + currKey);
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

const wrap = <U extends { [Key in keyof U]: U[Key] }, K extends keyof U = keyof U>(obj: U) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			if (obj[key as K] && typeof obj[key as K] === 'object') {
				acc[key as K] = wrap(obj[key as K]);
			} else {
				acc[key as K] = peeka(obj[key as K]);
			}

			return acc;
		},
		{} as Record<K, unknown>
	);
};
function updatePeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	peekaboo: PeekabooObj<U>,
	initData: U
): void {
	if (!initData || typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}
	const store = peekaboo.store;
	const wrappedData = wrap(initData) as unknown as U;

	const newData = update<U>(store, wrappedData, '') as unknown as PeekabooParsed<U>;
	peekaboo.data = newData;

	if (window !== undefined) {
		window.dispatchEvent(new CustomEvent(INIT_VALUE));
	}
}

function peeka<T>(value: T): PeekaType<T> {
	return {
		peekabooType: 'peeka',
		init: value,
	};
}

type MapOrBoolean = Record<string, boolean> | boolean;
type RecurrsiveLogMap = Record<string, MapOrBoolean | Record<string, MapOrBoolean>>;

function getUsageLog(peekaboo: PeekabooObj<Record<string, any>>) {
	const logs = {} as RecurrsiveLogMap;
	const recurrsiveLogging = (data: Record<string, PeekabooParsed<any>>, child: RecurrsiveLogMap) => {
		Object.keys(data).forEach(key => {
			if (data[key] && typeof data[key] === 'object') {
				if ('used' in data[key] && typeof data[key].used === 'function') {
					child[key] = (data[key].used as () => boolean)() as boolean;
				} else {
					child[key] = {};
					recurrsiveLogging(data[key] as Record<string, PeekabooParsed<any>>, child[key]);
				}
			}
		});
	};
	recurrsiveLogging(peekaboo.data as Record<string, PeekabooParsed<any>>, logs);
	return logs;
}
function createSlice<
	U extends { [Key in keyof U & `_${string}`]: U[Key] },
	T extends { [Key in keyof T & `_${string}`]: T[Key] },
	K extends PeekabooParsed<T>,
>(peekaboo: PeekabooObj<U>, sliceFunc: (_peekabooData: PeekabooParsed<U>) => K) {
	return () => {
		try {
			return sliceFunc(peekaboo.data);
		} catch (e) {
			return;
		}
	};
}

export { createPeekaboo, updatePeekaboo, peeka, getUsageLog, update, createSlice };
