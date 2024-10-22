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
			header: {
				title: peeka('page1-header-title'),
				subTitle: peeka('page1-header-subtitle'),
			},
		},
		page2: {
			header: {
				title: peeka('page2-header-title'),
				subTitle: peeka('page2-header-subtitle'),
			},
		},
	},
};

export const peekaboo = createPeekaboo(peeks);
