import { BooType, PeekabooObj } from '../types';

function getContent<U>(peekaboo: PeekabooObj<U>) {
	return Object.keys(peekaboo.store.booMap).reduce(
		(acc, key) => {
			const boo = peekaboo.store.booMap[key] as BooType<any>;
			const id = boo.__booId;
			if ('leaf' === boo.__booType) {
				acc[id] = boo.get();
			}
			return acc;
		},
		{} as Record<string, any>
	);
}
function _setObjByKey(obj: Record<string, any>, value: any, keysArr: string[], index: number) {
	if (keysArr.length === 0) return;
	const currKey = keysArr[index];

	if (index === keysArr.length - 1) {
		obj[currKey] = value;
		return;
	}
	if (!obj[currKey]) {
		obj[currKey] = {};
	}
	_setObjByKey(obj[currKey], value, keysArr, index + 1);
}
function _convertContentToObj(contentObj: Record<string, any>) {
	return Object.keys(contentObj).reduce(
		(acc, key) => {
			const keysArr = key.split('.');
			_setObjByKey(acc, contentObj[key], keysArr, 0);

			return acc;
		},
		{} as Record<string, any>
	);
}
function getContentAsObject<U>(peekaboo: PeekabooObj<U>) {
	const contentObj = getContent(peekaboo);
	return _convertContentToObj(contentObj);
}
export { getContent, getContentAsObject, _setObjByKey, _convertContentToObj };
