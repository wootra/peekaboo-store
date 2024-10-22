import { UPDATE_VALUE } from './consts';
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
	store.data[booId] = value.init;
	let used = false;
	return Object.freeze({
		booId,
		init: value.init,
		used: () => used,
		get: () => {
			used = true;
			return store.data[booId] as T;
		},
		set: (newValue: T) => {
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
				if ('peekabooType' in obj[key as K] && (obj[key as K] as PeekaType<any>).peekabooType === 'peeka') {
					acc[key as K] = createValueObj(store, obj[key as K], currKey);
				} else {
					acc[key as K] = convert(store, obj[key as K], currKey);
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

export { createPeekaboo, peeka, getUsageLog };
