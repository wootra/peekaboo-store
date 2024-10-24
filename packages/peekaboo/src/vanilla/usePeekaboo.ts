'use client';

import { BooType } from '../types';
import { INIT_VALUE, UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>, setState: (_val: T) => void) => {
	validateBoo(boo);
	let state = boo.get() ?? boo.init();
	const listener: EventListenerOrEventListenerObject = e => {
		const ev = e as CustomEvent;
		const shouldUpdate =
			ev.type === UPDATE_VALUE && ev.detail.id === boo?.booId && ev.detail.storeId === boo?.store.storeId;
		const shouldInit = ev.type === INIT_VALUE && ev.detail.storeId === boo?.store.storeId;
		if (shouldUpdate || shouldInit) {
			if (state !== boo.get()) {
				state = boo.get();
				setState(boo.get());
			}
		}
	};
	window.addEventListener(UPDATE_VALUE, listener);
	window.addEventListener(INIT_VALUE, listener);
	return () => {
		window.removeEventListener(UPDATE_VALUE, listener);
		window.removeEventListener(INIT_VALUE, listener);
	};
};
