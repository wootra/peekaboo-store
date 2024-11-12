'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
	const [crazy, setCrazy] = useState<ReturnType<typeof setTimeout> | number>(-1);
	const numRef = useRef(0);
	const startTime = useRef(0);
	const [rendered, setRendered] = useState(0);
	const onCrazy = () => {
		if (crazy !== -1) {
			setRendered(Math.round(numRef.current / ((Date.now() - startTime.current) / 1000)));
			startTime.current = Date.now();
			clearInterval(crazy as number);
			numRef.current = 0;
			setCrazy(-1);
		} else {
			startTime.current = Date.now();
			const id = setInterval(() => {
				// console.count('count');
				for (let i = 0; i < 100000; i++) {
					page2HeaderSlice().title._boo.set(`${numRef.current.toFixed(10)}`);
					numRef.current++;
				}
			}, 100);
			setCrazy(id);
		}
	};
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
			<button onClick={onCrazy}>{(crazy as number) < 0 ? 'crazy!' : 'stop being crazy'}</button>
			<Trigger boo={page2HeaderSlice().title._boo} options={titles} />
			<Trigger boo={page2HeaderSlice().subTitle._boo} options={subTitles} />
			<div>rendered: {rendered}/sec</div>
			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
