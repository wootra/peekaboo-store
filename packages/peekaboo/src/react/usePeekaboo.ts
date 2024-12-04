'use client';

import { useEffect, useState } from 'react';
import type { BooType, UpdateDetail } from '../types';
import { UPDATE_VALUE } from '../consts';
import { validateBoo } from '../utils';

export const usePeekaboo = <T>(boo: BooType<T>) => {
	validateBoo(boo);
	const [state, setState] = useState(boo.get() ?? boo.init());
	useEffect(() => {
		const listener: EventListenerOrEventListenerObject = e => {
			const ev = e as CustomEvent<UpdateDetail>;

			// derived type does not need to match with storeId

			const shouldUpdate = ev.type === UPDATE_VALUE && ev.detail.idSet?.has(boo.__booUId);

			if (shouldUpdate) {
				queueMicrotask(() => {
					const updated = boo.get();
					if (boo.__booType === 'branch') {
						setState({ ...updated });
					} else {
						setState(updated);
					}
				});
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
