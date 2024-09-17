import { PeekabooMap, PeekabooObj, PeekabooValue, Store } from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;
let valueIdBase = Math.round(Math.random() * (1000000 - 1)) + 1000000;

const createStore = (): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		valueIdBase,
		data: {},
	};
};

const createValueObj = <T>(store: Store, value: T): PeekabooValue<T> => {
	const valueId = `peekabooValue-${store.valueIdBase++}`;
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

const convert = (store: Store, obj: Record<string, { value: unknown; children?: unknown[] }>) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			acc[key] = {
				value: createValueObj(store, obj[key].value),
			};
			if (obj[key].children) {
				if (!Array.isArray(obj[key].children)) {
					throw new Error('Peekaboo children must be an array');
				}
				acc[key].children = obj[key]!.children!.map((child: any) => convert(store, child));
			}
			return acc;
		},
		{} as Record<string, { value: unknown; children?: unknown[] }>
	);
};

function Peekaboo<T>(initData: PeekabooMap<T>): PeekabooObj<T> {
	const store = createStore();
	if (typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}

	const converted = convert(store, initData as Record<string, { value: unknown; children?: unknown[] }>);

	return {
		store,
		data: converted,
	} as unknown as PeekabooObj<T>;
}

export { Peekaboo };
