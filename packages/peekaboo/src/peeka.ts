import { PeekaType } from './types';

/**
 * create a peeka object.
 */
function peeka<T extends object>(value: T): PeekaType<T> {
	if (typeof value !== 'object') {
		throw new Error('Peeka value must be an object');
	}
	return {
		peekabooType: 'peeka',
		init: Object.freeze(value),
	};
}

/**
 * check if the object is a peeka object.
 */
const isPeekaType = (obj: unknown) => {
	return obj && typeof obj === 'object' && (obj as any).peekabooType === 'peeka';
};

/**
 * check if the layer of the object is a peeka object.
 */
const isPeekaLayer = (obj: any, keys: string[], index?: number) => {
	if (keys.length === 0) return isPeekaType(obj);
	const indexToSearch = index ?? keys.length - 1;
	let objToSearch = obj;
	for (let i = 0; i < indexToSearch; i++) {
		if (!objToSearch[keys[i]]) {
			const errorCode = Math.random().toString(36).substring(7);
			console.error(
				`${errorCode}: key ${keys[i]} is not valid for object. must be a bug`,
				'keys:',
				keys,
				'index',
				index,
				'object to search',
				objToSearch
			);
			throw new Error(`key is not found. check above error message. code is: ${errorCode}`);
		}
		objToSearch = objToSearch[keys[i]];
	}
	return isPeekaType(objToSearch[keys[indexToSearch]]);
};
export { peeka, isPeekaType, isPeekaLayer };