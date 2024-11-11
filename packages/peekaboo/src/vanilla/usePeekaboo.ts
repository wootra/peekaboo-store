'use client';

import { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>, setState: (_val: T) => void) => {
	validateBoo(boo);
	let state = boo.get() ?? boo.init();
	const listener: EventListenerOrEventListenerObject = e => {
		const ev = e as CustomEvent<UpdateDetail<T>>;

		const shouldUpdate =
			ev.type === UPDATE_VALUE &&
			ev.detail.idSet?.has(boo?.__booUId) &&
			ev.detail.storeId === boo?.__store.storeId;
		const shouldInit = ev.detail.storeId === boo?.__store.storeId;
		if (shouldUpdate || shouldInit) {
			if (state !== boo.get()) {
				state = boo.get();
				setState(boo.get());
			}
		}
	};
	window.addEventListener(UPDATE_VALUE, listener);
	boo.__store.registerHook(boo.__booUId);
	return () => {
		window.removeEventListener(UPDATE_VALUE, listener);
		boo.__store.unregisterHook(boo.__booUId);
	};
};
