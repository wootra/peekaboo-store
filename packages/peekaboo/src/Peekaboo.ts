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

const getChildSet = <U>(obj: Record<keyof U, { _boo: BooType<U[keyof U]> }>, set: Set<string> = new Set<string>()) => {
	Object.keys(obj).forEach(key => {
		const boo = obj[key as keyof typeof obj];
		set.add(boo._boo.__booUId);
		if ('__childrenBoo' in boo._boo) {
			getChildSet(boo._boo.__childrenBoo as Record<keyof U, { _boo: BooType<U[keyof U]> }>, set);
		}
	});
	return set;
};

const isTypeSame = (a: any, b: any) => {
	if (typeof a !== typeof b) return false;
	if (a === null || b === null) return a === b;
	if (typeof a === 'object' && typeof b === 'object') {
		const keysA = Object.keys(a as object);
		const keysB = new Set(Object.keys(b as object));
		if (keysA.length !== keysB.size) return false;
		for (let keyInA of keysA) {
			if (!keysB.has(keyInA)) return false;
			if (!isTypeSame(a[keyInA], b[keyInA])) return false;
		}
	}
	return true;
};

const createValueObj = <T>(
	__store: Store,
	value: PeekaType<T>,
	parentKey: string,
	booKey: string,
	__childrenBoo: Record<keyof T, { _boo: BooType<T[keyof T]> }> | null = null
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
		if (!isTypeSame(newValue, initValue)) {
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
						__childrenBoo[key as keyof T]._boo.set(newValue[key], false);
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
		if (__booType === 'branch' && __childrenBoo) {
			if (typeof newVal !== typeof initValue) {
				console.warn(
					`[${__booId}] Type mismatch. Expected ${typeof initValue} but got ${typeof newVal}. ignoring...`
				);
				return;
			} else {
				initValue = newVal !== undefined ? newVal : initValue;

				__store.data[__booUId] = initValue;
				Object.keys(__childrenBoo).forEach(key => {
					if (newVal && typeof newVal === 'object' && typeof key === 'string') {
						// @ts-ignore
						__childrenBoo[key as keyof T]._boo.__initialize(newVal[key]);
					}
				});
			}
		} else {
			if (typeof newVal !== typeof initValue) {
				console.warn(
					`[${__booId}] Type mismatch. Expected ${typeof initValue} but got ${typeof newVal}. ignoring...`
				);
				if (parentKey) {
					if (__store.data[__parentUId] && typeof __store.data[__parentUId] === 'object') {
						(__store.data[__parentUId] as any)[booKey] = initValue; // only leaf will update the value
					}
				} else {
					__store.data[__booUId] = initValue;
				}
			} else {
				initValue = newVal !== undefined ? newVal : initValue;
				// when leaf node, update actual data in the reference.
				// only leaf will update the value
				if (parentKey) {
					if (__store.data[__parentUId] && typeof __store.data[__parentUId] === 'object') {
						(__store.data[__parentUId] as any)[booKey] = newVal;
					}
				} else {
					__store.data[__booUId] = newVal;
				}
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
		if (!value?.init || typeof value.init !== 'object') {
			throw new Error('branch boo should have object value only.');
		}
		if (!__childrenBoo) {
			throw new Error('__changeSet should not be null in this case.');
		}

		if ('_boo' in value.init) {
			throw new Error('Peekaboo object cannot have __boo keys that are reserved for peekaboo.');
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
					acc[key as keyof U] = {
						_boo: createValueObj(store, obj[key as keyof U], parentKey, key) as BooType<U[keyof U]>,
					}; // no childrenSet
				} else {
					const childrenBoo = convert(store, obj[key as keyof U], currKey);
					acc[key as keyof U] = {
						_boo: createValueObj(
							store,
							peekaAfterClean(obj[key as keyof U]),
							parentKey,
							key,
							childrenBoo
						) as BooType<U[keyof U]>,
						...childrenBoo,
					};
					Object.keys(childrenBoo).forEach(key => {
						const child = childrenBoo[key as keyof U];
						if ('__booUId' in child) {
							store.parentMap[child.__booUId as string] = currUID;
						}
					});
				}
			} else {
				acc[key as keyof U] = {
					_boo: createValueObj(store, peekaAfterClean(obj[key as keyof U]), parentKey, key),
				};
			}

			return acc;
		},
		{} as Record<
			keyof U,
			| { _boo: BooType<U[keyof U]> }
			| ({ _boo: BooType<U[keyof U]> } & Record<keyof U[keyof U], BooType<U[keyof U][keyof U[keyof U]]>>)
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

const cleanChildren = <T>(value: any) => {
	if (value && typeof value === 'object') {
		if ((value as PeekaType<unknown>).peekabooType === 'peeka') {
			return value.init;
		} else {
			Object.keys(value).forEach(key => {
				value[key] = cleanChildren(value[key]);
			});
			return value; // keep the reference
		}
	} else {
		return value;
	}
};

function peekaAfterClean<T>(value: T): PeekaType<T> {
	const afterClean = cleanChildren(value);

	return {
		peekabooType: 'peeka',
		init: afterClean,
	};
}

export { createPeekaboo, peeka };
