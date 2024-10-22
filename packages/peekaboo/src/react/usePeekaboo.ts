'use client';

import { useEffect, useReducer } from 'react';
import { BooType } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useReducer((s: T, a: (_v: T) => T) => a(s), boo.get() ?? boo.init);
	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent;
			if (ev.type === UPDATE_VALUE && ev.detail.id === boo.booId) {
				// setTimeout(() => {
				console.log('listening');
				setState(state => {
					if (boo.get() !== state) return boo.get();
					return state;
				});
				// });
			}
		};
		window.addEventListener(UPDATE_VALUE, listener);
		return () => {
			window.removeEventListener(UPDATE_VALUE, listener);
		};
	}, [boo]);
	return state;
};
