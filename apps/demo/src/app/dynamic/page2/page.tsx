'use client';

import React, { useEffect, useMemo } from 'react';
import Updated from 'components/Updated';

import Trigger from 'components/Trigger';
import { peekaboo } from 'app/dynamic/_data/const';
import { createSlice } from 'peekaboo-store/utils/slices';
import { BooNodeTypeToSelect, getUsageLog, IncludeType } from 'peekaboo-store/utils/usage';
import { getContent, getContentAsObject } from 'peekaboo-store/utils/content';

const page2HeaderSlice = createSlice(peekaboo, data => data.routes.page2.header);
const titles = ['title1', 'title2'];
const subTitles = ['subTitle1', 'subTitle2'];

export default function Page() {
	useEffect(() => {
		// @ts-ignore
		window.getUsageLog = function (nodeType: BooNodeTypeToSelect = 'all', includes: IncludeType = 'all') {
			return getUsageLog(peekaboo, nodeType, includes);
		};
		// @ts-ignore
		window.getContent = () => getContent(peekaboo);
		// @ts-ignore
		window.getContentAsObject = () => getContentAsObject(peekaboo);
	}, []);
	const arrays = useMemo(() => {
		return new Array(1000).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<Updated boo={page2HeaderSlice().subTitle._boo} />
					<Updated boo={page2HeaderSlice().title._boo} />
				</div>
			);
		});
	}, []);
	return (
		<div>
			<Trigger boo={page2HeaderSlice().title._boo} options={titles} />
			<Trigger boo={page2HeaderSlice().subTitle._boo} options={subTitles} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
