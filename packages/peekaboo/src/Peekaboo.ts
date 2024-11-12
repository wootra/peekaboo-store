import { BooType, PeekabooObj, PeekabooOptions, PeekabooParsed } from './types';
import { createBooLayers } from './createBooLayers';
import { createBooObj } from './createBooObj';
import { createStore } from './createStore';
import { createBooUid } from './createBooUid';

function createPeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	initData: U,
	options?: PeekabooOptions
): PeekabooObj<U> {
	if (!initData || typeof initData !== 'object' || Object.keys(initData).length === 0) {
		throw new Error('Peekaboo initData must be an object, and not empty');
	}
	// make 2 copies to prevent mutation

	const store = createStore<U>(initData, options);
	const converted = {} as PeekabooParsed<U>;
	const rootBoo = createBooObj<U>(store, {
		booKey: 'data',
		booType: 'branch',
		parentBoo: null,
		parentKeys: [],
	});
	createBooLayers(store, initData, rootBoo, converted, ['data']);
	converted._boo = rootBoo;
	const currUID = createBooUid(store, 'data');
	store.booMap[currUID] = rootBoo as BooType<unknown>;

	return {
		store,
		data: converted,
	};
}

export { createPeekaboo };
