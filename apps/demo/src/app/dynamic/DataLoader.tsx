'use client';

import { useEffect } from 'react';
import { peekaboo } from './_data/const';
import { PeekabooObjSourceData } from 'peekaboo-store';
import { updatePeekaboo } from 'peekaboo-store/utils/update';
const mockDataAfterTimeout: Partial<PeekabooObjSourceData<typeof peekaboo>> = {
	routes: {
		page1: {
			header: {
				title: 'page1-header-title(timeout)',
				subTitle: 'page1-header-subtitle(timeout)',
			},
		},
		page2: {
			header: {
				// @ts-ignore
				title: 3,
				subTitle: 'page2-header-subtitle(timeout)',
			},
		},
		extra: {
			header: {
				title: 'extra-header-title(timeout)',
				subTitle: 'extra-header-subtitle(timeout)',
			},
		},
	},
};

const DataLoader = ({ dataDirect }: { dataDirect: object }) => {
	updatePeekaboo(peekaboo, dataDirect);
	useEffect(() => {
		setTimeout(() => {
			updatePeekaboo(peekaboo, mockDataAfterTimeout);
		}, 3000);
	}, []);
	return null;
};

export default DataLoader;
