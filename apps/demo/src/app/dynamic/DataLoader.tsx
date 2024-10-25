'use client';

import { updatePeekaboo } from 'peekaboo-store';
import { useEffect } from 'react';
import { peekaboo } from './_data/const';
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
const DataLoader = () => {
	useEffect(() => {
		setTimeout(() => {
			updatePeekaboo(peekaboo, mockData);
		}, 2000);
	}, []);
	return null;
};

export default DataLoader;
