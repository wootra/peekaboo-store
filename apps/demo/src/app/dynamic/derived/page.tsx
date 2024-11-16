'use client';

import React from 'react';
import Updated from 'components/Updated';
import { peekaboo } from 'app/dynamic/_data/const';
import Trigger from 'components/Trigger';
import { BooDataType } from 'peekaboo-store';
import { deriveBoo } from 'peekaboo-store/utils/deriveBoo';
const page1HeaderSlice = peekaboo.data.routes.page1.header;
const titles: BooDataType<typeof page1HeaderSlice._boo>[] = [
	{
		subTitle: 'subTitle1',
		title: 'title1',
	},
	{
		subTitle: 'subTitle2',
		title: 'title2',
	},
	{
		subTitle: 'subTitle3',
		title: 'title3',
	},
];
const derived = deriveBoo(peekaboo, get => {
	return {
		subtitle: get(page1HeaderSlice._boo).subTitle + '_derived',
		title: get(page1HeaderSlice._boo).title + '_derived',
	};
});

export default function Page() {
	return (
		<div>
			<Trigger boo={page1HeaderSlice._boo} options={titles} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			<Updated boo={page1HeaderSlice.title._boo} />
			<Updated boo={page1HeaderSlice.subTitle._boo} />
			<Updated boo={derived} />
		</div>
	);
}
