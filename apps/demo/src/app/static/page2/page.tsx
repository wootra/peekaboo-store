'use client';

import React, { useEffect, useMemo } from 'react';
import Updated from 'components/Updated';

import Trigger from 'components/Trigger';
import { peekaboo } from 'app/static/_data/const';
import { createSlice } from 'peekaboo-store/utils/slices';
import { getUsageLog } from 'peekaboo-store/utils/usage';

const page2Slice = createSlice(peekaboo, data => data.routes.page2);

/**
 *
 */
export default function Page() {
	useEffect(() => {
		// @ts-ignore
		window.logUsed = () => getUsageLog(peekaboo);
	}, []);
	// const dropDownIndex = useAtomValue(peeks.atoms.page1.dropDownIndex.init());
	const arrays = useMemo(() => {
		return new Array(1000).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<Updated boo={page2Slice()?.header.title._boo} />
					<Updated boo={page2Slice()?.header.subTitle._boo} />
				</div>
			);
		});
	}, []);
	return (
		<div>
			<div
				style={{
					position: 'sticky',
					top: '30px',
					background: 'white',
					zIndex: 1,
					display: 'flex',
					gap: '20px',
				}}
			>
				<Trigger boo={page2Slice()?.header.title._boo} options={['title1', 'title2']} />
				<Trigger boo={page2Slice()?.header.subTitle._boo} options={['subtitle1', 'subtitle2']} />
			</div>

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
