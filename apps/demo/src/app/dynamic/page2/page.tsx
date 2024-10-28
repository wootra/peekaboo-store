'use client';

import React, { useEffect, useMemo } from 'react';
import Updated from 'components/Updated';

import Trigger from 'components/Trigger';
import { peekaboo } from 'app/dynamic/_data/const';
import { createSlice } from 'peekaboo-store/utils/slices';
import { getUsageLog } from 'peekaboo-store/utils/usage';

const page2HeaderSlice = createSlice(peekaboo, data => data.routes.page2.header);
const titles = ['title1', 'title2'];
const subTitles = ['subTitle1', 'subTitle2'];

export default function Page() {
	useEffect(() => {
		// @ts-ignore
		window.logUsed = () => getUsageLog(peekaboo);
	}, []);
	const arrays = useMemo(() => {
		return new Array(10).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<Updated boo={page2HeaderSlice()} />
					<Updated boo={page2HeaderSlice()} />
				</div>
			);
		});
	}, []);
	return (
		<div>
			<Trigger boo={page2HeaderSlice().title} options={titles} />
			<Trigger boo={page2HeaderSlice().subTitle} options={subTitles} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
