import { createBooObj } from './createBooObj';
import { createBooUid } from './createBooUid';
import { isPeekaType } from './peeka';
import type { BooType, Store } from './types';

const createBooLayers = (props: {
	store: Store;
	obj: Record<string, any>;
	parentBoo: BooType<any>;
	parsed: Record<string, any>;
	parentKeys: string[];
}) => {
	const { store, obj, parentBoo, parsed, parentKeys } = props;
	const parentKey = parentBoo.__booId;
	for (const key in obj) {
		const currKey = parentKey ? `${parentKey}.${key}` : key;
		const currUID = createBooUid(store, currKey);
		if (!parsed[key]) {
			parsed[key] = {};
		}
		const isBranchType =
			obj[key] && typeof obj[key] === 'object' && !isPeekaType(obj[key]) && !Array.isArray(obj[key]);
		const newBoo = createBooObj(store, {
			booKey: key,
			booType: isBranchType ? 'branch' : 'leaf',
			parentBoo,
			parentKeys,
		}) as BooType<unknown>;

		if (isBranchType) {
			createBooLayers({
				store,
				obj: obj[key],
				parentBoo: newBoo,
				parsed: parsed[key],
				parentKeys: [...parentKeys, key],
			});
		}
		parsed[key]._boo = newBoo;
		store.booMap[currUID] = newBoo;
	}
};

export { createBooLayers };
