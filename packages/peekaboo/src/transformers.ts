import { isDataTypeSame } from './isDataTypeSame';
import { isPeekaType } from './peeka';
import { OrgTypes, PeekaType } from './types';

function cloneInitData<T extends { [Key in keyof T]: T[Key] }>(initData: T, dest: any = {}): T {
	for (const key in initData) {
		if (isPeekaType(initData[key])) {
			dest[key] = initData[key]; // do not clone more.
			continue;
		}
		if (typeof initData[key] === 'object') {
			if (Array.isArray(initData[key])) {
				dest[key] = initData[key]; // do not clone more.
				continue;
			} else {
				if (!dest[key]) {
					dest[key] = {} as T[keyof T];
				}
				dest[key] = cloneInitData(initData[key as keyof T] as T[keyof T], dest[key]);
			}
		} else {
			dest[key] = initData[key];
		}
	}
	return dest;
}

function sanitizeInitData<T extends { [Key in keyof T]: T[Key] }>(initData: T, dest: any = {}): OrgTypes<T> {
	for (const key in initData) {
		if (isPeekaType(initData[key])) {
			dest[key] = (initData[key] as PeekaType<T[keyof T]>).init;
			continue;
		}
		if (typeof initData[key] === 'object') {
			if (Array.isArray(initData[key])) {
				dest[key] = initData[key]; // array should be as it is.
			} else {
				if (!dest[key]) {
					dest[key] = {} as T[keyof T];
				}
				dest[key] = sanitizeInitData(initData[key as keyof T] as T[keyof T], dest[key]);
			}
		} else {
			dest[key] = initData[key];
		}
	}
	return dest;
}

/**
 * return original data from PeekaType.
 * if it is not PeekaType, return as it is.
 */
const stripPeeka = (value: any) => {
	if (isPeekaType(value)) return (value as PeekaType<unknown>).init;
	if (typeof value === 'object' && !Array.isArray(value)) {
		return Object.keys(value).reduce(
			(acc, key) => {
				acc[key] = stripPeeka(value[key]);
				return acc;
			},
			{} as Record<string, any>
		);
	}
	return value;
};

const syncAndCollectChanged = (
	initData: Record<string, any>,
	updatedObj: Record<string, any>,
	objToSync: Record<string, any>,
	keyToUpdate: string,
	onChanged: (_keyStack: string[], _updatedValue: any) => void,
	parentKeysStacks: string[] = []
): boolean => {
	if (updatedObj[keyToUpdate] === undefined) return false;

	const call = () => {
		onChanged([...parentKeysStacks, keyToUpdate], updatedObj[keyToUpdate]);
	};
	if (isPeekaType(initData[keyToUpdate]) || typeof initData[keyToUpdate] !== 'object') {
		if (objToSync[keyToUpdate] !== updatedObj[keyToUpdate]) {
			objToSync[keyToUpdate] = updatedObj[keyToUpdate];
			call();
			return true;
		}
		return false;
	} else {
		if (typeof initData[keyToUpdate] === 'object' && Array.isArray(initData[keyToUpdate])) {
			if (initData[keyToUpdate] !== updatedObj[keyToUpdate]) {
				objToSync[keyToUpdate] = updatedObj[keyToUpdate];
				console.warn(
					'Array is considered as a peeka object. Please wrap it with peeka function to suppress this warning message.',
					`key is: keyToUpdate - which is an array`,
					objToSync[keyToUpdate],
					'<==',
					updatedObj[keyToUpdate]
				);
				call();
				return true;
			}
			return false;
		}
		let isChanged = false;
		for (const key in initData[keyToUpdate]) {
			if (
				syncAndCollectChanged(
					initData[keyToUpdate],
					updatedObj[keyToUpdate],
					objToSync[keyToUpdate],
					key,
					onChanged,
					[...parentKeysStacks, keyToUpdate]
				)
			) {
				isChanged = true;
			}
		}
		if (isChanged) {
			call();
		}
		return isChanged;
	}
};

const updateDataIfTypeSame = (
	target: Record<string, unknown>,
	key: string,
	value: unknown,
	parentKeyStack: string[]
) => {
	if (!isDataTypeSame(target[key], value, [...parentKeyStack, key])) {
		return;
	}
	target[key] = value;
};

const updateValuesInObjByKey = (
	initData: Record<string, unknown>, // structure to keep. should check peeka type from here.
	updatedObj: Record<string, unknown>, // values to update. should have matching structure with objToSync
	objToSync: Record<string, unknown>, // target object to update.
	keyToUpdate: string, // target item to update.
	parentKeysStacks: string[] = []
) => {
	if (updatedObj[keyToUpdate] === undefined) return false;

	if (isPeekaType(initData[keyToUpdate]) || typeof initData[keyToUpdate] !== 'object') {
		if (objToSync[keyToUpdate] !== updatedObj[keyToUpdate]) {
			updateDataIfTypeSame(objToSync, keyToUpdate, updatedObj[keyToUpdate], parentKeysStacks);
		}
	} else {
		if (typeof initData[keyToUpdate] === 'object' && Array.isArray(initData[keyToUpdate])) {
			if (objToSync[keyToUpdate] !== updatedObj[keyToUpdate]) {
				updateDataIfTypeSame(objToSync, keyToUpdate, updatedObj[keyToUpdate], parentKeysStacks);
			}
			return;
		}
		for (const key in initData[keyToUpdate]) {
			updateValuesInObjByKey(
				initData[keyToUpdate] as Record<string, unknown>,
				updatedObj[keyToUpdate] as Record<string, unknown>,
				objToSync[keyToUpdate] as Record<string, unknown>,
				key,
				[...parentKeysStacks, keyToUpdate]
			);
		}
	}
};

/**
 * tet object's value accessed by keys array.
 * if the node in the middle does not exist, return undefined.
 * do not assign index parameter manually. it is used for recursive call.
 */
function _getObjByKey(obj: Record<string, any>, keysArr: string[]) {
	if (keysArr.length === 0) return obj;
	let currObj = obj;

	for (let i = 0; currObj && i < keysArr.length - 1; i++) {
		const currKey = keysArr[i];

		currObj = currObj[currKey];
	}
	return currObj?.[keysArr[keysArr.length - 1]];
}

/**
 * set object's value accessed by keys array.
 * if the node in the middle does not exist, create the non-existing node automatically.
 * do not assign index parameter manually. it is used for recursive call.
 */
function _setObjByKey(obj: Record<string, any>, value: any, keysArr: string[]) {
	const errMsg = 'should check the code! empty key is found. keysArr is:';
	if (keysArr.length === 0 || keysArr.filter(Boolean).length === 0) {
		console.error(errMsg, keysArr);
		return;
	}
	let currObj = obj;

	for (let i = 0; i < keysArr.length - 1; i++) {
		const currKey = keysArr[i];

		if (!currObj[currKey]) {
			currObj[currKey] = {};
		}
		currObj = currObj[currKey];
	}
	currObj[keysArr[keysArr.length - 1]] = value;
}

/**
 * convert 1D object to nested object.
 * i.e. { 'key1.key2': 'value' } => { key1: { key2: 'value' } }
 */
function _convertContentToObj(contentObj: Record<string, any>) {
	return Object.keys(contentObj).reduce(
		(acc, key) => {
			const keysArr = key.split('.');
			_setObjByKey(acc, contentObj[key], keysArr);

			return acc;
		},
		{} as Record<string, any>
	);
}

export {
	cloneInitData,
	sanitizeInitData,
	_convertContentToObj,
	_setObjByKey,
	_getObjByKey,
	stripPeeka,
	syncAndCollectChanged,
	updateValuesInObjByKey,
	updateDataIfTypeSame,
};
