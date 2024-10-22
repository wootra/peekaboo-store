'use client';

import { useEffect, useReducer, useRef } from 'react';
import { BooType } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: T, a: (_v: T) => T) => a(s), boo.get() ?? boo.init);
	const valRef = useRef<T>(state);

	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent;
			if (ev.type === UPDATE_VALUE && ev.detail.id === boo.booId) {
				if (valRef.current === boo.get()) return;
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
