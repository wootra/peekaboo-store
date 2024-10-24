'use client';

import { createSlice, updatePeekaboo } from 'peekaboo-store';
import { useEffect } from 'react';
import { StateType, peekaboo } from './_data/const';
const mockData: any = {
	routes: {
		page1: {
			header: {
				title: 'page1-header-title',
				subTitle: 'page1-header-subtitle',
			},
		},
		page2: {
			header: {
				title: 'page2-header-title',
				subTitle: 'page2-header-subtitle',
			},
		},
	},
};
const slice = createSlice(peekaboo, data => data.routes.page1.header);
const DataLoader = () => {
	useEffect(() => {
		const data = slice();
		if (!data) {
			setTimeout(() => {
				updatePeekaboo(peekaboo, mockData as StateType);
			}, 2000);
		}
	}, []);
	return null;
};

export default DataLoader;
