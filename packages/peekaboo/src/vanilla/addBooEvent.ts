'use client';

import type { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const addBooEvent = <T>(boo: BooType<T>, setState: (_val: T) => void) => {
	validateBoo(boo);
	let state = boo.get() ?? boo.init();
	const listener: EventListenerOrEventListenerObject = e => {
		const ev = e as CustomEvent<UpdateDetail>;

		const storeMatch = boo.__booType === 'derived' ? true : ev.detail.storeId === boo.__store?.storeId;

		const shouldUpdate = ev.type === UPDATE_VALUE && ev.detail.idSet?.has(boo.__booUId) && storeMatch;

		if (shouldUpdate) {
			const updated = boo.get();
			if (state !== updated) {
				state = updated;
				setState(updated);
			}
		}
	};
	let eventAdded = false;
	if (typeof window !== 'undefined') {
		eventAdded = true;
		window.addEventListener(UPDATE_VALUE, listener);
	}
	return () => {
		if (typeof window !== 'undefined' && eventAdded) {
			window.removeEventListener(UPDATE_VALUE, listener);
		}
	};
};
