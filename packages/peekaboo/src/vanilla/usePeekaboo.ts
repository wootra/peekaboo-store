'use client';

import { BooType } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>, setState: (val: T) => void) => {
	validateBoo(boo);
	let state = boo.get() ?? boo.init;
	const listener: EventListenerOrEventListenerObject = e => {
		const ev = e as CustomEvent;
		if (ev.type === UPDATE_VALUE && ev.detail.id === boo.booId) {
			if (state !== boo.get()) {
				state = boo.get();
				setState(boo.get());
			}
		}
	};
	window.addEventListener(UPDATE_VALUE, listener);
	return () => {
		window.removeEventListener(UPDATE_VALUE, listener);
	};
};
