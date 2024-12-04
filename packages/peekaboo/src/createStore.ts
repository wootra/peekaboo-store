import { UPDATE_VALUE } from './consts';
import { cloneInitData, sanitizeInitData } from './transformers';
import type { BooSetOptions, BooType, PeekabooOptions, PeekabooUpdateOptions, Store, UpdateDetail } from './types';

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
		if (!boo) {
			console.error('boo for ' + id + ' is not found in booMap', booMap);
			continue;
		}
		collectAllWaterfalls(boo, allIds);
	}
	return allIds;
};

const booMap: Record<string, BooType<unknown>> = {};

type EventReceiver = {
	eventOptimizeInMs: number;
	timerId: number;
};
const eventReceiver: EventReceiver = {
	eventOptimizeInMs: 100,
	timerId: -1,
};

const setUpdateOptions = (eventOptions: PeekabooUpdateOptions) => {
	const { eventOptimizeInMs = 100 } = eventOptions;
	eventReceiver.eventOptimizeInMs = eventOptimizeInMs;
};

const triggerNow = (idSet: Set<string>) => {
	window.dispatchEvent(
		new CustomEvent<UpdateDetail>(UPDATE_VALUE, {
			detail: {
				idSet,
				// storeId,
				forceRender: true,
			},
		})
	);
};

const idSetsToUpdate: Set<string> = new Set<string>();
let reservedToUpdate = false;
const updateNow = () => {
	if (idSetsToUpdate.size > 0) {
		if (typeof window !== 'undefined') {
			triggerNow(idSetsToUpdate);
			idSetsToUpdate.clear();
		}
		reservedToUpdate = false;
	}
};

const triggerDispatch = (idSet: Set<string>, setOptions?: BooSetOptions) => {
	let countToUpdate = 0;
	const allIds = fillAllDerivedBooIds(booMap, idSet);
	if (setOptions?.instantDispatch) {
		triggerNow(allIds);
		return;
	}
	for (const id of allIds) {
		if (!idSetsToUpdate.has(id)) {
			idSetsToUpdate.add(id);
			countToUpdate++;
		} else {
			const boo = booMap[id];
			if (boo?.__usageInfo().isDirty) {
				// ignore redundant render
				continue;
			}
			countToUpdate++;
		}
	}

	if (countToUpdate > 0) {
		if (!reservedToUpdate) {
			reservedToUpdate = true;
			// for the first request, update directly for the performance

			if (typeof window !== 'undefined' && eventReceiver.timerId === -1) {
				queueMicrotask(() => {
					updateNow();
				});
				eventReceiver.timerId = setTimeout(() => {
					updateNow();
					eventReceiver.timerId = -1;
				}, eventReceiver.eventOptimizeInMs);
			}

			// } else {
		}
	}
};

const createStore = <U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	initData: U,
	options?: PeekabooOptions
): Store => {
	const { staticId } = options ?? {};
	const storeIdBase = staticId ?? storeIdNumBase++;
	const storeId = `peekabooStore-${storeIdBase}`;

	const cloned = cloneInitData(initData);
	const snapshot = sanitizeInitData(initData);
	const data = sanitizeInitData(initData);

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

export { createStore, setUpdateOptions };
