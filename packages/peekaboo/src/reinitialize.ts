import { createBooUidFromLayer } from './createBooUid';
import { isPeekaType } from './peeka';
import { PeekaType, Store } from './types';

const reinitialize = (
	store: Store,
	initData: Record<string, any>,
	updatedObj: any,
	keyToUpdate: string,
	parentKeysStacks: string[] = []
) => {
	if (updatedObj === undefined) return;

	if (typeof initData !== 'object') {
		throw new Error('wrong usage. should be used only for object type since its reference should be updated.');
	}

	const booUid = createBooUidFromLayer(store, [...parentKeysStacks, keyToUpdate]);
	store.booMap[booUid].__resetUsage();
	if (!keyToUpdate) {
		for (const key in initData) {
			reinitialize(store, initData, updatedObj[key], key, [...parentKeysStacks, keyToUpdate]);
		}
	} else {
		if (isPeekaType(initData[keyToUpdate])) {
			(initData[keyToUpdate] as PeekaType<any>).init = updatedObj;
		} else if (typeof initData[keyToUpdate] !== 'object') {
			initData[keyToUpdate] = updatedObj;
		} else {
			if (Array.isArray(initData[keyToUpdate])) {
				if (initData[keyToUpdate] !== updatedObj) {
					initData[keyToUpdate] = updatedObj;
				}
				return;
			}
			for (const key in initData[keyToUpdate]) {
				reinitialize(store, initData[keyToUpdate], updatedObj[key], key, [...parentKeysStacks, keyToUpdate]);
			}
		}
	}
};

export { reinitialize };
