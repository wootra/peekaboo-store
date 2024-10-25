import { INIT_VALUE, UPDATE_VALUE } from './consts';
import { PeekaType, PeekabooObj, PeekabooParsed, BooType, Store, PeekabooObjSourceData } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		data: {},
	};
};

const createValueObj = <T>(store: Store, value: PeekaType<T>, booIdSrc: string): BooType<T> => {
	const booId = `${store.storeId}-${booIdSrc}`;
	let initValue = value.init;
	store.data[booId] = initValue;
	let isUsed = false;
	const set = (newValue: T) => {
		if (typeof newValue !== typeof initValue) {
			console.warn(
				`[${booIdSrc}] Type mismatch. Expected ${typeof initValue} but got ${typeof newValue}. ignoring...`
			);
			return;
		}
		store.data[booId] = newValue;
		if (window !== undefined) {
			window.dispatchEvent(
				new CustomEvent(UPDATE_VALUE, {
					detail: {
						id: booId,
						storeId: store.storeId,
						current: newValue,
					},
				})
			);
		}
	};
	const __initialize = (newVal?: T) => {
		if (typeof newVal !== typeof initValue) {
			console.warn(
				`[${booIdSrc}] Type mismatch. Expected ${typeof initValue} but got ${typeof newVal}. ignoring...`
			);
			return;
		}
		initValue = newVal !== undefined ? newVal : initValue;
		isUsed = false;
		store.data[booId] = newVal;
	};

	store.booMap[booId] = Object.freeze({
		store,
		booId,
		init: () => initValue,
		used: () => isUsed,
		__initialize,
		get: () => {
			isUsed = true;
			return store.data[booId] as T;
		},
		set,
	}) as BooType<unknown>;
	return store.booMap[booId] as BooType<T>;
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
	updateObj: Partial<PeekabooObjSourceData<PeekabooObj<U>>>,
	parentKey: string
) => {
	Object.keys(updateObj).forEach(key => {
		const currKey = parentKey ? `${parentKey}.${key}` : key;
		const keyToFind = `${store.storeId}-${currKey}`;
		if (updateObj[key as K] && typeof updateObj[key as K] === 'object') {
			if (store.booMap[keyToFind]) {
				(store.booMap[keyToFind] as BooType<unknown>).__initialize(updateObj[key as K]);
			} else {
				update<U[K]>(store, updateObj[key as K] as Partial<U[K]>, currKey);
			}
		} else {
			// data is primitivetype
			if (store.booMap[keyToFind]) {
				(store.booMap[keyToFind] as BooType<unknown>).__initialize(updateObj[key as K]);
			} else {
				// but there are no existing boo.
				console.warn('path [' + currKey + '] does not exist. You need to set init structure for this first.');
			}
		}
	});
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

function updatePeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	peekaboo: PeekabooObj<U>,
	initData: Partial<PeekabooObjSourceData<PeekabooObj<U>>>
): void {
	if (!initData || typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}
	const store = peekaboo.store;
	update<U>(store, initData, '');

	if (window !== undefined) {
		window.dispatchEvent(
			new CustomEvent(INIT_VALUE, {
				detail: {
					storeId: store.storeId,
				},
			})
		);
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

function createSlice<U extends { [Key in keyof U & `_${string}`]: U[Key] }, T extends unknown>(
	peekaboo: PeekabooObj<U>,
	sliceFunc: (_peekabooData: PeekabooObj<U>['data']) => T
) {
	return () => {
		return sliceFunc(peekaboo.data) as T;
	};
}

export { createPeekaboo, updatePeekaboo, peeka, getUsageLog, update, createSlice };
