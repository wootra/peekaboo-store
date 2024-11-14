import { PeekabooObj } from '../types';

/**
 * @deprecated in favor of just using partial object.
 * i.e.
 * const partial = peekaboo.data.routes.page1.header;
 * usePeekaboo(partial.title._boo);
 */
function createSlice<U extends { [Key in keyof U & `_${string}`]: U[Key] }, T extends unknown>(
	peekaboo: PeekabooObj<U>,
	sliceFunc: (_peekabooData: PeekabooObj<U>['data']) => T
) {
	return () => {
		return sliceFunc(peekaboo.data) as T;
	};
}

export { createSlice };
