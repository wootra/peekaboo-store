import { UPDATE_VALUE } from './consts';
import { cloneInitData, sanitizeInitData } from './transformers';
import { PeekabooOptions, Store, UpdateDetail } from './types';

let storeIdNumBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	initData: U,
	options?: PeekabooOptions
): Store => {
	const { staticId, eventOptimizeInMs = 100 } = options ?? {};
	const storeIdBase = staticId ?? storeIdNumBase++;
	const storeId = `peekabooStore-${storeIdBase}`;
	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);
	let timerId = -1;

	let idSetsToUpdate: Set<string>[] = [];
	const updateNow = () => {
		if (idSetsToUpdate.length > 0) {
			if (typeof window !== 'undefined') {
				const firstSet = idSetsToUpdate.shift();
				window.dispatchEvent(
					new CustomEvent(UPDATE_VALUE, {
						detail: {
							idSet: firstSet,
							storeId,
							forceRender: true, // __booType === 'branch',
						} as UpdateDetail,
					})
				);
			}
		}
	};

	const triggerDispatch = (idSet: Set<string>) => {
		if (idSetsToUpdate.length < 2) {
			idSetsToUpdate.push(idSet);
		} else {
			// more than 2
			const lastOne = idSetsToUpdate[idSetsToUpdate.length - 1];
			[...idSet].forEach(id => {
				lastOne.add(id);
			});
		}
		if (timerId === -1) {
			updateNow();
			timerId = setTimeout(() => {
				updateNow();
				timerId = -1;
			}, eventOptimizeInMs);
		}
	};
	return {
		storeId,
		booMap: {},
		snapshot: {
			data: snapshot,
		}, // used only for comparison
		data, // will be returned to the user
		initData: { data: cloned },
		triggerDispatch,
	};
};

export { createStore };
