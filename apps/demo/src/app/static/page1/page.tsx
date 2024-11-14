'use client';

import React from 'react';
import Updated from 'components/Updated';
import { peekaboo } from 'app/static/_data/const';
import Trigger from 'components/Trigger';
const page1HeaderSlice = peekaboo.data.routes.page1.header;
function Page() {
	return (
		<div>
			<Trigger boo={page1HeaderSlice.title._boo} options={['title1', 'title2']} />
			<Trigger boo={page1HeaderSlice.subTitle._boo} options={['subTitle1', 'subTitle2']} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			<Updated boo={page1HeaderSlice.title._boo} />
			<Updated boo={page1HeaderSlice.subTitle._boo} />
		</div>
	);
}

export default Page;
