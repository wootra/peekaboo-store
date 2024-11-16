import { _convertContentToObj } from '../transformers';
import type { BooType, OrgTypes, PeekabooObj } from '../types';

function getContent<U>(peekaboo: PeekabooObj<U>) {
	return Object.keys(peekaboo.store.booMap).reduce<Record<string, any>>((acc, key) => {
		const boo = peekaboo.store.booMap[key] as BooType<any>;
		const id = boo.__booId;
		if (boo.__booType === 'leaf') {
			acc[id] = boo.get();
		}
		return acc;
	}, {});
}

function getContentAsObject<U>(peekaboo: PeekabooObj<U>) {
	const contentObj = getContent(peekaboo);
	return _convertContentToObj(contentObj) as OrgTypes<U>;
}

export { getContent, getContentAsObject };
