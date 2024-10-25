'use client';

import { useEffect, useReducer, useRef } from 'react';
import { BooType } from '../types';
import { UPDATE_VALUE, INIT_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: T, a: (_v: T) => T) => a(s), boo.get() ?? (boo.init() as T));
	const valRef = useRef<T>(state);
	valRef.current = state;

	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent;
			const shouldUpdate =
				ev.type === UPDATE_VALUE && ev.detail.id === boo.booId && ev.detail.storeId === boo.store.storeId;
			const shouldInit = ev.type === INIT_VALUE && ev.detail.storeId === boo.store.storeId;
			if (shouldUpdate || shouldInit) {
				if (valRef.current === boo.get()) return;
				setTimeout(() => {
					setState(state => {
						if (boo.get() !== state) return boo.get() as T;
						return state;
					});
				});
			}
		};
		window.addEventListener(UPDATE_VALUE, listener);
		window.addEventListener(INIT_VALUE, listener);
		return () => {
			window.removeEventListener(UPDATE_VALUE, listener);
			window.removeEventListener(INIT_VALUE, listener);
		};
	}, [boo]);

	return state;
};
