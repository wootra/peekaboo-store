'use client';

import React, { useEffect, useMemo } from 'react';
import Updated from 'components/Updated';

import Trigger from 'components/Trigger';
import { peekaboo } from 'const';
import { getUsageLog } from 'peekaboo-store';

export default function Page() {
	const slice = peekaboo.data.routes.page2;
	useEffect(() => {
		// @ts-ignore
		window.logUsed = () => getUsageLog(peekaboo);
	}, []);
	// const dropDownIndex = useAtomValue(peeks.atoms.page1.dropDownIndex.init);
	const arrays = useMemo(() => {
		return new Array(1000).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<Updated boo={slice.header.title} />
					<Updated boo={slice.header.subTitle} />
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
				<Trigger boo={slice.header.title} />
				<Trigger boo={slice.header.subTitle} />
			</div>

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
