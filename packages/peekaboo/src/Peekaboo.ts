import { UPDATE_VALUE } from './consts';
import { PeekaType, PeekabooObj, PeekabooParsed, BooType, Store, UpdateDetail } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		data: {},
	};
};

const createValueObj = <T>(
	store: Store,
	value: PeekaType<T>,
	booIdSrc: string,
	childrenSet: Set<string> = new Set<string>()
): BooType<T> => {
	const booId = `${store.storeId}-${booIdSrc}`;
	let initValue = value.init;
	store.data[booId] = initValue;
	let isUsed = false;
	let isEverUsed = false;
	const idSet = new Set<string>(childrenSet);
	idSet.add(booId);
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
						idSet: idSet,
						storeId: store.storeId,
						current: newValue,
					} as UpdateDetail<T>,
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
		everUsed: () => isEverUsed,
		__initialize,
		get: () => {
			isUsed = true;
			isEverUsed = true;
			return store.data[booId] as T;
		},
		childrenSet,
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
					acc[key as K] = createValueObj(store, obj[key as K], currKey); // no childrenSet
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

export { createPeekaboo, peeka };
