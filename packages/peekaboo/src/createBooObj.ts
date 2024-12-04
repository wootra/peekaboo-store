import { createBooUid, createBooUidFromLayer } from './createBooUid';
import { reinitialize } from './reinitialize';
import { _getObjByKey, stripPeeka, syncAndCollectChanged, updateValuesInObjByKey } from './transformers';
import type { BooNodeType, BooSetOptions, BooType, PartialType, Store, UsageInfo } from './types';

type BooInfo =
	| {
			booType: Exclude<BooNodeType, 'derived'>;
			parentKeys: string[];
			parentBoo: BooType<any> | null;
			booKey: string;
	  }
	| {
			booType: 'derived';
			parentKeys?: string[];
			parentBoo?: BooType<any> | null;
			booKey: string;
			unsub: () => void;
	  };

const createBooObj = <T>(__store: Store | undefined, booInfo: BooInfo) => {
	const { booType: __booType, parentKeys: __layerKeys = [], parentBoo = null, booKey } = booInfo;

	const __parentBoo = parentBoo; // only for valid branch. should not
	const __booId = __parentBoo?.__booId ? `${__parentBoo.__booId}.${booKey}` : booKey;
	const __booUId = createBooUid(__store, __booId);
	const usageInfo: UsageInfo = {
		isUsed: false,
		isEverUsed: false,
		isDirty: false, // when set is called, should be true, when get is called, should be false.
	};
	const __usageInfo = (info?: Partial<typeof usageInfo>) => {
		if (info) {
			Object.assign(usageInfo, info);
		}
		return usageInfo;
	};
	const __waterFallRefs = new Set<BooType<any>>();

	const __transformer: { func: ((_val: T) => T) | null } = { func: null };

	const dataObj = _getObjByKey(__store, __layerKeys);
	const initDataObj = _getObjByKey(__store?.initData, __layerKeys);
	const snapshotObj = _getObjByKey(__store?.snapshot, __layerKeys);

	const init = () => {
		// const initDataObj = _getObjByKey(__store.initData, __layerKeys);
		if (typeof initDataObj === 'object') {
			return stripPeeka(initDataObj[booKey]) as T;
		}
	};
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
	const set = (newValue: T | PartialType<T>, setOptions?: BooSetOptions) => {
		const idSet = new Set<string>();
		// const initDataObj = _getObjByKey(__store.initData, __layerKeys);
		// const dataObj = _getObjByKey(__store, __layerKeys);
		// const snapshotObj = _getObjByKey(__store.snapshot, __layerKeys);
		const onChanged = (arr: string[]) => {
			const booIdToUpdate = createBooUidFromLayer(__store, arr);
			if (__store?.booMap[booIdToUpdate]) {
				idSet.add(booIdToUpdate);
			}
		};
		if (!initDataObj || !dataObj || !snapshotObj || !__store) return;

		updateValuesInObjByKey({
			initData: initDataObj,
			updatedObj: { [booKey]: newValue },
			objToSync: dataObj,
			keyToUpdate: booKey,
		});
		const isChanged = syncAndCollectChanged({
			initData: initDataObj,
			updatedObj: dataObj,
			objToSync: snapshotObj,
			keyToUpdate: booKey,
			onChanged,
		});
		if (isChanged) {
			// when found some value is changed in the below level,
			// all parent should be updated in case there are parent boo is used in the hook.

			let currParent = __parentBoo;
			while (currParent) {
				idSet.add(currParent.__booUId);
				currParent = currParent.__parentBoo;
			}
			idSet.add(__booUId);
			__store.triggerDispatch(idSet, setOptions);
			usageInfo.isDirty = true;
		}
	};

	const __resetUsage = () => {
		usageInfo.isUsed = false;
	};

	const __initialize = (newVal?: T | PartialType<T>) => {
		const initValue = init();
		const newValToSet = newVal ?? (initValue as PartialType<T>);
		if (!__store || !initDataObj) return;
		// const initDataObj = _getObjByKey(__store.initData, [...__layerKeys]);

		reinitialize({
			store: __store,
			initData: initDataObj,
			updatedObj: newVal,
			keyToUpdate: booKey,
			parentKeysStacks: __layerKeys,
		});
		set(newValToSet);
	};

	const reset = () => {
		__initialize();
	};

	const get = () => {
		usageInfo.isUsed = true;
		usageInfo.isEverUsed = true;
		usageInfo.isDirty = false;
		if (__transformer.func) {
			return __transformer.func((dataObj as any)?.[booKey] as T);
		}
		// const dataObj = _getObjByKey(__store, __layerKeys);
		return (dataObj as any)?.[booKey] as T;
	};

	const transform = (func: ((_val: T) => T) | null) => {
		__transformer.func = func;
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
		__usageInfo,
		__resetUsage,
		__initialize,
		__waterFallRefs,
		transform,
		isTransformed: () => __transformer.func !== null,
		get,
		set,
	} as const;

	return Object.freeze(boo);
};

export type { BooInfo };
export { createBooObj };
