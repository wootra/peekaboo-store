import { PeekabooMap, PeekabooValue, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		data: {},
	};
};

const createValueObj = <T>(store: Store, value: T, valueId: string): PeekabooValue<T> => {
	store.data[valueId] = value;

	return {
		valueId,
		init: value,
		get: () => store.data[valueId] as T,
		set: (newValue: T) => {
			store.data[valueId] = newValue;
		},
	};
};

const convert = (store: Store, obj: Record<string, { value: unknown; children?: unknown[] }>, parentKey: string) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			const currKey = parentKey ? `${parentKey}.${key}` : key;
			acc[key] = {
				value: createValueObj(store, obj[key].value, currKey),
			};
			if (obj[key].children) {
				if (!Array.isArray(obj[key].children)) {
					throw new Error('Peekaboo children must be an array');
				}
				acc[key].children = obj[key]!.children!.map((child: any) => convert(store, child, currKey));
			}
			return acc;
		},
		{} as Record<string, { value: unknown; children?: unknown[] }>
	);
};

function createPeekaboo<U, T extends PeekabooMap<U> = PeekabooMap<U>>(initData: U): T {
	const store = createStore();
	if (typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}

	const converted = convert(store, initData as Record<string, { value: unknown; children?: unknown[] }>, '');

	return {
		store,
		data: converted,
	} as unknown as T;
}

export { createPeekaboo };
