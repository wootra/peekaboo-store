import type { PeekabooObj } from '../types';

/**
 * @deprecated in favor of just using partial object.
 * i.e.
 * const partial = peekaboo.data.routes.page1.header;
 * usePeekaboo(partial.title._boo);
 */
function createSlice<U extends { [Key in keyof U & `_${string}`]: U[Key] }, T>(
	peekaboo: PeekabooObj<U>,
	sliceFunc: (_peekabooData: PeekabooObj<U>['data']) => T
) {
	return () => sliceFunc(peekaboo.data);
}

export { createSlice };
