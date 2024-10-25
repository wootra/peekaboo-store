'use client';

import { PeekabooObjSourceData, updatePeekaboo } from 'peekaboo-store';
import { useEffect } from 'react';
import { peekaboo } from './_data/const';
const mockData: Partial<PeekabooObjSourceData<typeof peekaboo>> = {
	routes: {
		page1: {
			header: {
				title: 'page1-header-title',
				subTitle: 'page1-header-subtitle',
			},
		},
		page2: {
			header: {
				// @ts-ignore
				title: 3,
				subTitle: 'page2-header-subtitle',
			},
		},
		extra: {
			header: {
				title: 'extra-header-title',
				subTitle: 'extra-header-subtitle',
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
