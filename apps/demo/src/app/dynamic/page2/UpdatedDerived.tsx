'use client';

import Updated from 'components/Updated';
import React from 'react';
import { peekaboo } from '../_data/const';
import { deriveBoo } from 'peekaboo-store/utils/deriveBoo';
const page2HeaderSlice = peekaboo.data.routes.page2.header;

const derived = deriveBoo(get => {
	return {
		subtitle: get(page2HeaderSlice._boo).subTitle + '_derived',
		title: get(page2HeaderSlice._boo).title + '_derived',
	};
});
const derived2 = deriveBoo(get => {
	const data = get(derived);
	return {
		subtitle: data.subtitle + '_again',
		title: data.title + '_again',
	};
});

const UpdatedDerived = () => {
	return (
		<div style={{ border: '1px solid gray', padding: '1rem' }}>
			<h3>derived</h3>
			<Updated boo={derived} />
			<Updated boo={derived2} />
		</div>
	);
};

export default UpdatedDerived;
