'use client';

import React from 'react';
import Updated from 'components/Updated';
import { peekaboo } from 'app/static/_data/const';
import Trigger from 'components/Trigger';
import { createSlice } from 'peekaboo-store/utils/slices';
const page1HeaderSlice = createSlice(peekaboo, data => data.routes.page1.header);
function Page() {
	return (
		<div>
			<Trigger boo={page1HeaderSlice()?.title.direct} options={['title1', 'title2']} />
			<Trigger boo={page1HeaderSlice()?.subTitle.direct} options={['subTitle1', 'subTitle2']} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			<Updated boo={page1HeaderSlice()?.title.direct} />
			<Updated boo={page1HeaderSlice()?.subTitle.direct} />
		</div>
	);
}

export default Page;
