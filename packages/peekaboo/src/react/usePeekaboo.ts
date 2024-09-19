'use client';

import { useEffect, useReducer } from 'react';
import { BooType } from '../types';
import { UPDATE_VALUE } from '../consts';

const validateBoo = (boo: BooType<any>) => {
	if (!boo.booId) throw new Error('booId is required');
	if (!boo.get) throw new Error('get is required');
	if (!boo.set) throw new Error('set is required');
	if (!boo.init) throw new Error('init is required');
};

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: T, a: (_v: T) => T) => a(s), boo.init);
	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent;
			if (ev.type === UPDATE_VALUE && ev.detail.id === boo.booId) {
				setTimeout(() => {
					setState(state => {
						if (boo.get() !== state) return boo.get();
						return state;
					});
				});
			}
		};
		window.addEventListener(UPDATE_VALUE, listener);
		return () => {
			window.removeEventListener(UPDATE_VALUE, listener);
		};
	}, [boo]);
	return state;
};
