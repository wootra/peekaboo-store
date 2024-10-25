'use client';

import { atom } from 'jotai';
import { peeka, createPeekaboo } from 'peekaboo-store';

function patom<T>(val: T) {
	return peeka(atom(val));
}

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
			header: peeka({
				title: 'page1-header-title(init)',
				subTitle: 'page1-header-subtitle(init)',
			}),
		},
		page2: {
			header: {
				title: 'page2-header-title(init)',
				subTitle: 'page2-header-subtitle(init)',
			},
		},
	},
};

export const peekaboo = createPeekaboo(peeks);
