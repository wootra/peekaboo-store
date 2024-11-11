'use client';

import { useEffect, useReducer } from 'react';
import { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: { value: T }, a: (_v: { value: T }) => { value: T }) => a(s), {
		value: boo.get() ?? (boo.init() as T),
	});

	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent<UpdateDetail<T>>;
			const shouldUpdate =
				ev.type === UPDATE_VALUE &&
				ev.detail.idSet?.has(boo.__booUId) &&
				ev.detail.storeId === boo.__store.storeId;
			const shouldInit = ev.detail.storeId === boo.__store.storeId;

			if (shouldUpdate || shouldInit) {
				const updated = boo.get() as T;

				setState(state => {
					if (ev.detail.forceRender && ev.detail.forceRender && typeof updated === 'object') {
						return { value: { ...updated } };
					}
					if (state.value !== updated) {
						return { value: updated };
					}
					return state;
				});
			}
		};
		window.addEventListener(UPDATE_VALUE, listener);
		boo.__store.registerHook(boo.__booUId);
		return () => {
			window.removeEventListener(UPDATE_VALUE, listener);
			boo.__store.unregisterHook(boo.__booUId);
		};
	}, [boo]);

	return state.value;
};
