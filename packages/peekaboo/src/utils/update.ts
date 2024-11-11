import { PeekabooObj, PeekabooObjPartialSourceData } from '../types';

function updatePeekaboo<U extends { [Key in keyof U & `_${string}`]: U[Key] }>(
	peekaboo: PeekabooObj<U>,
	initData: PeekabooObjPartialSourceData<PeekabooObj<U>>
): void {
	if (!initData || typeof initData !== 'object') {
		throw new Error('Peekaboo initData must be an object');
	}
	peekaboo.data._boo.__initialize(initData as U);
}

export { updatePeekaboo };
