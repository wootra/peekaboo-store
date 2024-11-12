'use client';

import { useEffect, useState } from 'react';
import { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useState(() => boo.get() ?? (boo.init() as T));

	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent<UpdateDetail>;
			const shouldUpdate =
				ev.type === UPDATE_VALUE &&
				ev.detail.idSet?.has(boo.__booUId) &&
				ev.detail.storeId === boo.__store.storeId;

			if (shouldUpdate) {
				const updated = boo.get() as T;

				setState(updated);
			}
		};
		if (typeof window !== 'undefined') {
			window.addEventListener(UPDATE_VALUE, listener);
		}
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener(UPDATE_VALUE, listener);
			}
		};
	}, [boo]);

	return state;
};
