import { UPDATE_VALUE } from './consts';
import { createBooUid, createBooUidFromLayer } from './createBooUid';
import { reinitialize } from './reinitialize';
import { _getObjByKey, stripPeeka, syncAndCollectChanged, updateValuesInObjByKey } from './transformers';
import { BooNodeType, BooType, PartialType, Store, UpdateDetail } from './types';

type BooInfo = {
	booType: BooNodeType;
	parentKeys: string[];
	parentBoo: BooType<any> | null;
	booKey: string;
};
const createBooObj = <T>(__store: Store, booInfo: BooInfo) => {
	const { booType: __booType, parentKeys: __layerKeys, parentBoo, booKey } = booInfo;

	const __parentBoo = parentBoo; // only for valid branch. should not
	const __booId = __parentBoo?.__booId ? `${__parentBoo.__booId}.${booKey}` : booKey;
	const __booUId = createBooUid(__store, __booId);
	const usageInfo = {
		isUsed: false,
		isEverUsed: false,
	};

	// __store.data[__booUId] = initValue;

	const __waterFallRefs = new Set<BooType<any>>();
	const __appendWaterFallSet = (boo: BooType<any>) => {
		__waterFallRefs.add(boo);
	};
	const __transformer: { func: ((_val: T) => T) | null } = { func: null };

	const init = () =>
		booKey
			? (stripPeeka(_getObjByKey(__store.initData, __layerKeys)[booKey]) as T)
			: (stripPeeka(_getObjByKey(__store.initData, __layerKeys)) as T);

	// core algorithm:
	// save the value in the store both in the saved, and data at the same time.
	// for peeka node, should update the data itself, but if not, should update following algorithm:
	// - data object update algorithm:
	// - check all 'children' nodes until it meets
	// - __waterFallRefs travel recurrsively, until it meets 'changed' value (in the leaf node) comparing to snapshot,
	// - add the changed leaf Boo object to `tempIdSet` in the store.
	// - and return true to notify parent Boo object should be also added in the updateQueue.
	// - in the recurrsive logic, when a change found, all parent Boo should be added in the updateQueue as well.
	// - if the hook is registered(store.hookRegisteredCount[booUid] > 0), should create update event. if not, don't create event.
	// - clear tempIdSet
	// - update snapshot to match with value
	const set = (newValue: T | PartialType<T>) => {
		const tempIdSet = new Set<string>();
		const initDataObj = _getObjByKey(__store.initData, __layerKeys);
		const dataObj = _getObjByKey(__store, __layerKeys);
		const snapshotObj = _getObjByKey(__store.snapshot, __layerKeys);
		const onChanged = (arr: string[]) => {
			tempIdSet.add(createBooUidFromLayer(__store, arr));
		};

		updateValuesInObjByKey(initDataObj, { [booKey]: newValue }, dataObj, booKey);
		const isChanged = syncAndCollectChanged(initDataObj, dataObj, snapshotObj, booKey, onChanged);
		if (isChanged) {
			// when found some value is changed in the below level,
			// all parent should be updated in case there are parent boo is used in the hook.

			let currParent = __parentBoo;
			while (currParent) {
				tempIdSet.add(currParent.__booUId);
				currParent = currParent.__parentBoo;
			}
			tempIdSet.add(__booUId);

			// filter out if there are no
			const idsToCheck = [...tempIdSet]; //.filter(id => __store.hookRegisteredCount(id) > 0);
			const idSet = new Set(idsToCheck);

			if (window !== undefined) {
				window.dispatchEvent(
					new CustomEvent(UPDATE_VALUE, {
						detail: {
							idSet: idSet,
							storeId: __store.storeId,
							current: newValue,
							forceRender: true, // __booType === 'branch',
						} as UpdateDetail<T>,
					})
				);
			}
		}
	};

	const __resetUsage = () => {
		usageInfo.isUsed = false;
	};

	const __initialize = (newVal?: T | PartialType<T>) => {
		const initValue = init();
		const newValToSet = newVal ?? (initValue as PartialType<T>);

		const initDataObj = _getObjByKey(__store.initData, [...__layerKeys]);

		reinitialize(__store, initDataObj, newVal, booKey, __layerKeys);
		set(newValToSet);
	};

	const reset = () => {
		__initialize();
	};

	const __used = () => {
		return usageInfo.isUsed;
	};

	const __allUsed = () => {
		return usageInfo.isUsed;
	};

	const __everUsed = () => {
		return usageInfo.isEverUsed;
	};

	const __allEverUsed = () => {
		return usageInfo.isEverUsed;
	};

	const get = () => {
		usageInfo.isUsed = true;
		usageInfo.isEverUsed = true;
		return _getObjByKey(__store, __layerKeys)[booKey] as T;
	};

	const boo: BooType<T> = {
		__store,
		__booUId,
		__booId,
		__layerKeys,
		__booType,
		__parentBoo,
		init,
		reset,
		__resetUsage,
		__used,
		__allUsed,
		__everUsed,
		__allEverUsed,
		__initialize,
		__waterFallRefs,
		__appendWaterFallSet,
		isDerived: () => __transformer.func !== null,
		get,
		set,
	} as const;

	return Object.freeze(boo);
};

export type { BooInfo };
export { createBooObj };
