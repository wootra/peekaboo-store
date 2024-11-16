import { UPDATE_VALUE } from './consts';
import { cloneInitData, sanitizeInitData } from './transformers';
import type { BooType, PeekabooOptions, Store, UpdateDetail } from './types';

let storeIdNumBase = Math.round(Math.random() * (1000 - 1)) + 1000;

const collectAllWaterfalls = (boo: BooType<unknown>, idSet: Set<string>) => {
	for (const derived of boo.__waterFallRefs) {
		idSet.add(derived.__booUId);
		collectAllWaterfalls(derived, idSet);
	}
};

const fillAllDerivedBooIds = (booMap: Store['booMap'], idSet: Set<string>) => {
	const allIds = new Set<string>([...idSet]);
	for (const id of idSet) {
		const boo = booMap[id];
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- validation
		if (!boo) {
			console.error('boo for ' + id + ' is not found in booMap', booMap);
			continue;
		}
		collectAllWaterfalls(boo, allIds);
	}
	return allIds;
};

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	initData: U,
	options?: PeekabooOptions
): Store => {
	const { staticId, eventOptimizeInMs = 100 } = options ?? {};
	const storeIdBase = staticId ?? storeIdNumBase++;
	const storeId = `peekabooStore-${storeIdBase}`;
	const booMap = {} as unknown as Store['booMap'];
	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);
	let timerId = -1;

	const idSetsToUpdate: Set<string>[] = [];
	const updateNow = () => {
		if (idSetsToUpdate.length > 0) {
			if (typeof window !== 'undefined') {
				const firstSet = idSetsToUpdate.shift() as unknown as Set<string>;
				const allIds = fillAllDerivedBooIds(booMap, firstSet);
				window.dispatchEvent(
					new CustomEvent<UpdateDetail>(UPDATE_VALUE, {
						detail: {
							idSet: allIds,
							storeId,
							forceRender: true,
						},
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
		booMap,
		snapshot: {
			data: snapshot,
		}, // used only for comparison
		data, // will be returned to the user
		initData: { data: cloned },
		triggerDispatch,
	};
};

export { createStore };
