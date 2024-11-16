import { createBooUidFromLayer } from './createBooUid';
import { isDataTypeSame } from './isDataTypeSame';
import { isPeekaType } from './peeka';
import { replaceDataIfTypeSame } from './transformers';
import type { PeekaType, Store } from './types';

const reinitialize = (props: {
	store: Store;
	initData: Record<string, any>;
	updatedObj: any;
	keyToUpdate: string;
	parentKeysStacks: string[];
}) => {
	const { store, initData, updatedObj, keyToUpdate, parentKeysStacks } = props;
	if (updatedObj === undefined) return;

	if (typeof initData !== 'object') {
		throw new Error('wrong usage. should be used only for object type since its reference should be updated.');
	}

	const booUid = createBooUidFromLayer(store, [...parentKeysStacks, keyToUpdate]);
	const boo = store.booMap[booUid];
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- validation code
	if (!boo) {
		console.error('boo is not found for ' + booUid, 'from', Object.keys(store.booMap));
		throw new Error(`boo not found in ${booUid}`);
	}
	boo.__resetUsage();

	if (isPeekaType(initData[keyToUpdate])) {
		const peekaData = initData[keyToUpdate] as PeekaType<any>;
		const isSame = isDataTypeSame(peekaData.init, updatedObj, [...parentKeysStacks, keyToUpdate]);
		if (isSame) {
			peekaData.init = updatedObj;
		}
	} else if (
		typeof initData[keyToUpdate] !== 'object' ||
		initData[keyToUpdate] === null ||
		initData[keyToUpdate] === undefined
	) {
		replaceDataIfTypeSame(initData, keyToUpdate, updatedObj, parentKeysStacks);
	} else {
		if (Array.isArray(initData[keyToUpdate])) {
			replaceDataIfTypeSame(initData, keyToUpdate, updatedObj, parentKeysStacks);
			return;
		}
		for (const key in initData[keyToUpdate]) {
			reinitialize({
				store,
				initData: initData[keyToUpdate],
				updatedObj: updatedObj[key],
				keyToUpdate: key,
				parentKeysStacks: [...parentKeysStacks, keyToUpdate],
			});
		}
	}
};

export { reinitialize };
