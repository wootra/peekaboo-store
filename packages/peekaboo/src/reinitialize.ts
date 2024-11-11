import { createBooUidFromLayer } from './createBooUid';
import { isDataTypeSame } from './isDataTypeSame';
import { isPeekaType } from './peeka';
import { updateDataIfTypeSame } from './transformers';
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
			reinitialize(store, initData, updatedObj[key], key, [...parentKeysStacks]);
		}
	} else {
		if (isPeekaType(initData[keyToUpdate])) {
			const peekaData = initData[keyToUpdate] as PeekaType<any>;
			const isSame = isDataTypeSame(peekaData.init, updatedObj, [...parentKeysStacks, keyToUpdate]);
			if (isSame) {
				peekaData.init = updatedObj;
			}
		} else if (typeof initData[keyToUpdate] !== 'object') {
			updateDataIfTypeSame(initData, keyToUpdate, updatedObj, parentKeysStacks);
		} else {
			if (Array.isArray(initData[keyToUpdate])) {
				updateDataIfTypeSame(initData, keyToUpdate, updatedObj, parentKeysStacks);
			}
			for (const key in initData[keyToUpdate]) {
				reinitialize(store, initData[keyToUpdate], updatedObj[key], key, [...parentKeysStacks, keyToUpdate]);
			}
		}
	}
};

export { reinitialize };
