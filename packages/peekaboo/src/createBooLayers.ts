import { createBooObj } from './createBooObj';
import { createBooUid } from './createBooUid';
import { isPeekaType } from './peeka';
import { BooType, Store } from './types';

const createBooLayers = (
	store: Store,
	obj: Record<string, any>,
	parentBoo: BooType<any>,
	parsed: Record<string, any>,
	parentKeys: string[]
) => {
	const parentKey = parentBoo.__booId;
	for (const key in obj) {
		const currKey = parentKey ? `${parentKey}.${key}` : key;
		const currUID = createBooUid(store, currKey);
		let newBoo: BooType<unknown>;
		if (!parsed[key]) {
			parsed[key] = {};
		}
		if (obj[key] && typeof obj[key] === 'object') {
			if (isPeekaType(obj[key]) || Array.isArray(obj[key])) {
				newBoo = createBooObj(store, {
					booKey: key,
					booType: 'leaf',
					parentBoo,
					parentKeys: parentKeys,
				}) as BooType<unknown>;
			} else {
				newBoo = createBooObj(store, {
					booKey: key,
					booType: 'branch',
					parentBoo,
					parentKeys: parentKeys,
				}) as BooType<unknown>;

				createBooLayers(store, obj[key], newBoo, parsed[key], [...parentKeys, key]);
			}
		} else {
			newBoo = createBooObj(store, {
				booKey: key,
				booType: 'leaf',
				parentBoo,
				parentKeys: parentKeys,
			}) as BooType<unknown>;
		}
		parsed[key]._boo = newBoo;
		store.booMap[currUID] = newBoo;
	}
};

export { createBooLayers };
