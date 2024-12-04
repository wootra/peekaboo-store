'use client';

import { atom, createStore } from 'jotai';
import { peeka, createPeekaboo } from 'peekaboo-store';

function patom<T>(val: T) {
	return peeka(atom(val));
}
const atomVal = atom('init');
const atomVal2 = atom(1);
const atoms = {
	page1: {
		dropDownIndex: patom(0),
		dropDownOptions: patom(['Option 1', 'Option 2', 'Option 3']),
	},
	page2: {
		inputValue: patom(''),
		buttonClicked: patom(false),
	},
};
const peeks = {
	atoms: atoms,
	routes: {
		page1: {
			header: {
				title: 'page1-header-title(init)',
				subTitle: 'page1-header-subtitle(init)',
			},
		},
		page2: {
			header: {
				title: 'page2-header-title(init)',
				subTitle: 'page2-header-subtitle(init)',
			},
			instantUpdate: {
				count: 0,
			},
		},
	},
};
const peekaboo = createPeekaboo(peeks);
const atomStore = createStore();
export { atomVal, atomVal2, peekaboo, atomStore };
