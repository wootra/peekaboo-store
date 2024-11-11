'use client';

import { useEffect, useReducer } from 'react';
import { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE, INIT_VALUE } from '../consts';
import { validateBoo } from '../utils';

// const deepEquial = <T>(a: T, b: T) => {

// 	if (a === b) return true;
// 	if (typeof a !== 'object' || typeof b !== 'object') return false;
// 	const keysA = Object.keys(a);
// 	const keysB = Object.keys(b);
// 	if (keysA.length !== keysB.length) return false;
// 	for (let key of keysA) {
// 		if (!keysB.includes(key) || !deepEquial(a[key], b[key])) return false;
// 	}
// 	return true;
// }

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: { value: T }, a: (_v: { value: T }) => { value: T }) => a(s), {
		value: boo.get() ?? (boo.init() as T),
	});
	// const valRef = useRef<T>(state);
	// valRef.current = state;

	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent<UpdateDetail<T>>;
			const shouldUpdate =
				ev.type === UPDATE_VALUE &&
				ev.detail.idSet?.has(boo.__booUId) &&
				ev.detail.storeId === boo.__store.storeId;
			const shouldInit = ev.type === INIT_VALUE && ev.detail.storeId === boo.__store.storeId;

			if (shouldUpdate || shouldInit) {
				const updated = boo.get() as T;

				// if (valRef.current === updated && !ev.detail.forceRender) return;
				setState(state => {
					if (ev.detail.forceRender && ev.detail.forceRender && typeof updated === 'object') {
						return { value: { ...updated } };
					}
					if (state.value !== updated) {
						return { value: updated };
					}
					return state;
					// return state;
				});
			}
		};
		window.addEventListener(UPDATE_VALUE, listener);
		window.addEventListener(INIT_VALUE, listener);
		boo.__store.registerHook(boo);
		return () => {
			window.removeEventListener(UPDATE_VALUE, listener);
			window.removeEventListener(INIT_VALUE, listener);
			boo.__store.unregisterHook(boo);
		};
	}, [boo]);

	return state.value;
};
