import { PeekabooObj } from '../types';

function createSlice<U extends { [Key in keyof U & `_${string}`]: U[Key] }, T extends unknown>(
	peekaboo: PeekabooObj<U>,
	sliceFunc: (_peekabooData: PeekabooObj<U>['data']) => T
) {
	return () => {
		return sliceFunc(peekaboo.data) as T;
	};
}

export { createSlice };
