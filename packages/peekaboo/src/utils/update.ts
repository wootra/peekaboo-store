import { INIT_VALUE } from '../consts';
import { BooType, PeekabooObj, PeekabooObjSourceData, Store } from '../types';

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

export { updatePeekaboo };
