'use client';

import React from 'react';
import Updated from 'components/Updated';
import { peekaboo } from 'app/dynamic/_data/const';
import Trigger from 'components/Trigger';
import { BooDataType } from 'peekaboo-store';
import { createSlice } from 'peekaboo-store/utils/slices';
const page1HeaderSlice = createSlice(peekaboo, data => data.routes.page1.header);
const titles: BooDataType<ReturnType<typeof page1HeaderSlice>['_boo']>[] = [
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
export default function Page() {
	return (
		<div>
			<Trigger boo={page1HeaderSlice()._boo} options={titles} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			<Updated boo={page1HeaderSlice().title._boo} />
			<Updated boo={page1HeaderSlice().subTitle._boo} />
		</div>
	);
}
