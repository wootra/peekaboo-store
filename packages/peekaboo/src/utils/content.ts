import { _convertContentToObj } from '../transformers';
import { BooType, OrgTypes, PeekabooObj } from '../types';

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

function getContentAsObject<U>(peekaboo: PeekabooObj<U>) {
	const contentObj = getContent(peekaboo);
	return _convertContentToObj(contentObj) as OrgTypes<U>;
}

export { getContent, getContentAsObject };
