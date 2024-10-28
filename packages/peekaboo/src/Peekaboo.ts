import { UPDATE_VALUE } from './consts';
import {
	PeekaType,
	PeekabooObj,
	PeekabooParsed,
	BooType,
	Store,
	UpdateDetail,
	BooTypeBase,
	LeafBooType,
	BranchBooType,
	BooKeyTypes,
} from './types';

let storeIdBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = <T>(clonedData: T): Store => {
	const storeId = storeIdBase++;

	return {
		storeId: `peekabooStore-${storeId}`,
		booMap: {},
		savedData: clonedData,
		data: {},
		parentMap: {},
	};
};
const createBooUid = (store: Store, booId: string) => `${store.storeId}-${booId}`;

const getChildSet = <U>(obj: Record<keyof U, BooType<U[keyof U]>>, set: Set<string> = new Set<string>()) => {
	Object.keys(obj).forEach(key => {
		const boo = obj[key as keyof typeof obj];
		set.add(boo.__booUId);
		if ('__childrenBoo' in boo) {
			getChildSet(boo.__childrenBoo as Record<keyof U, BooType<U[keyof U]>>, set);
		}
	});
	return set;
};

const createValueObj = <T>(
	__store: Store,
	value: PeekaType<T>,
	parentKey: string,
	booKey: string,
	__childrenBoo: Record<keyof T, BooType<T[keyof T]>> | null = null
) => {
	const __booId = parentKey ? `${parentKey}.${booKey}` : booKey;
	const __booUId = createBooUid(__store, __booId);
	const __parentUId = createBooUid(__store, parentKey);
	let initValue = value.init;

	let isUsed = false;
	let isEverUsed = false;

	const __booType = __childrenBoo === null ? 'leaf' : 'branch';
	__store.data[__booUId] = initValue;
	const idSet = __childrenBoo === null ? new Set<string>() : getChildSet<T>(__childrenBoo);
	idSet.add(__booUId);

	const set = (newValue: T, eventBubling = true, ignoreUpdate = false) => {
		if (typeof newValue !== typeof initValue && ignoreUpdate === false) {
			console.warn(
				`[${__booId}] Type mismatch. Expected ${typeof initValue} but got ${typeof newValue}. ignoring...`
			);
			return;
		}
		if (!ignoreUpdate) {
			if (__booType === 'branch' && __childrenBoo) {
				Object.keys(__childrenBoo).forEach(key => {
					if (newValue && typeof newValue === 'object' && typeof key === 'string') {
						// @ts-ignore
						__childrenBoo[key as keyof T].set(newValue[key], false);
					}
				});
			} else {
				// when leaf node, update actual data in the reference.
				if (__store.data[__parentUId] && typeof __store.data[__parentUId] === 'object') {
					(__store.data[__parentUId] as any)[booKey] = newValue; // only leaf will update the value
				}
			}
		}
		if (window !== undefined) {
			window.dispatchEvent(
				new CustomEvent(UPDATE_VALUE, {
					detail: {
						idSet: idSet,
						storeId: __store.storeId,
						current: newValue,
						forceRender: ignoreUpdate,
					} as UpdateDetail<T>,
				})
			);
		}
		if (eventBubling) {
			const parentBoo = __store.booMap[__parentUId];
			if (parentBoo) {
				parentBoo.set(parentBoo.get(), true, true);
			}
		}
	};
	const __initialize = (newVal?: T) => {
		if (typeof newVal !== typeof initValue) {
			console.warn(
				`[${__booId}] Type mismatch. Expected ${typeof initValue} but got ${typeof newVal}. ignoring...`
			);
			return;
		}
		initValue = newVal !== undefined ? newVal : initValue;
		__store.data[__booUId] = initValue;
		if (typeof newVal !== typeof initValue) {
			console.warn(
				`[${__booId}] Type mismatch. Expected ${typeof initValue} but got ${typeof newVal}. ignoring...`
			);
			return;
		}
		if (__booType === 'branch' && __childrenBoo) {
			Object.keys(__childrenBoo).forEach(key => {
				if (newVal && typeof newVal === 'object' && typeof key === 'string') {
					// @ts-ignore
					__childrenBoo[key as keyof T].__initialize(newVal[key]);
				}
			});
		} else {
			// when leaf node, update actual data in the reference.
			if (__store.data[__parentUId] && typeof __store.data[__parentUId] === 'object') {
				(__store.data[__parentUId] as any)[booKey] = newVal; // only leaf will update the value
			}
		}

		isUsed = false;
	};

	const __used = () => {
		return isUsed;
	};

	const __allUsed = () => {
		return isUsed;
	};

	const __everUsed = () => {
		return isEverUsed;
	};

	const __allEverUsed = () => {
		return isEverUsed;
	};

	const get = () => {
		isUsed = true;
		isEverUsed = true;
		if (__booType === 'leaf') {
			if (__store.data[__parentUId] && typeof __store.data[__parentUId] === 'object') {
				return (__store.data[__parentUId] as any)[booKey] as T; // only leaf will update the value
			}
		}
		return __store.data[__booUId] as T;
	};

	const commonBoo: BooTypeBase<T> = {
		__store,
		__booUId,
		__booId,
		init: () => initValue,
		__used,
		__allUsed,
		__everUsed,
		__allEverUsed,
		__initialize,
		get,
		set,
	} as const;

	if (__booType === 'leaf') {
		const boo: LeafBooType<T> = Object.freeze({
			...commonBoo,
			__booType,
		});

		__store.booMap[__booUId] = boo as BooType<unknown>;
		return boo;
	} else {
		if (typeof value.init !== 'object') {
			throw new Error('branch boo should have object value only.');
		}
		if (!__childrenBoo) {
			throw new Error('__changeSet should not be null in this case.');
		}
		const keysToFilter = new Set([...Object.keys(commonBoo), '__booType', '__childrenBoo'] as BooKeyTypes<T>[]);
		const includedProhibitedKeys = Object.keys(value.init as object).filter(key =>
			keysToFilter.has(key as BooKeyTypes<T>)
		);
		if (includedProhibitedKeys.length > 0) {
			throw new Error(
				'Peekaboo object cannot have keys that are reserved for peekaboo. what you have: [' +
					includedProhibitedKeys.join(', ') +
					']'
			);
		}
		const boo: BranchBooType<T> = Object.freeze({
			...commonBoo,
			__booType,
			__childrenBoo,
		}) as BranchBooType<T>;
		__store.booMap[__booUId] = boo as BooType<unknown> & { __booType: 'branch' };
		return boo;
	}
};

const convert = <U extends { [Key in keyof U]: U[Key] }>(store: Store, obj: U, parentKey: string) => {
	return Object.keys(obj).reduce(
		(acc, key) => {
			const currKey = parentKey ? `${parentKey}.${key}` : key;
			const currUID = createBooUid(store, currKey);
			if (obj[key as keyof U] && typeof obj[key as keyof U] === 'object') {
				if (
					'peekabooType' in obj[key as keyof U] &&
					(obj[key as keyof U] as PeekaType<any>).peekabooType === 'peeka'
				) {
					acc[key as keyof U] = createValueObj(store, obj[key as keyof U], parentKey, key) as BooType<
						U[keyof U]
					>; // no childrenSet
				} else {
					const parent = convert(store, obj[key as keyof U], currKey);

					acc[key as keyof U] = {
						...(createValueObj(store, peeka(obj[key as keyof U]), parentKey, key, parent) as BooType<
							U[keyof U]
						>),
						...parent,
					};
					Object.keys(parent).forEach(key => {
						const child = parent[key as keyof U];
						if ('__booUId' in child) {
							store.parentMap[child.__booUId as string] = currUID;
						}
					});
				}
			} else {
				acc[key as keyof U] = createValueObj(store, peeka(obj[key as keyof U]), parentKey, key);
			}

			return acc;
		},
		{} as Record<
			keyof U,
			| BooType<U[keyof U]>
			| (BooType<U[keyof U]> & Record<keyof U[keyof U], BooType<U[keyof U][keyof U[keyof U]]>>)
		>
	);
};

function cloneInitData<T extends Record<string, any>>(
	initData: Record<keyof T, T[keyof T]>,
	dest: any = {}
): Record<keyof T, T[keyof T]> {
	for (const key in initData) {
		if (typeof initData[key] === 'object') {
			if ((initData[key] as PeekaType<T[keyof T]>).peekabooType === 'peeka') {
				dest[key] = initData[key];
			} else {
				if (!dest[key]) {
					dest[key] = {} as T[keyof T];
				}
				dest[key] = cloneInitData(initData[key as keyof T] as T[keyof T], dest[key]);
			}
		} else {
			dest[key] = initData[key];
		}
	}
	return dest as Record<keyof T, T[keyof T]>;
}

function createPeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(initData: U): PeekabooObj<U> {
	if (!initData || typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}
	const cloned = cloneInitData(initData);
	const store = createStore(cloned);
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
