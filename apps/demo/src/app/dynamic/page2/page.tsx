import React, { useMemo } from 'react';
import UpdatedServerSide from './UpdatedServerSide';

import UsageAccessor from '../UsageAccessor';
import TriggerFromServerSide from './TriggerFromServerSide';

const titles = ['title1', 'title2'];
const subTitles = ['subTitle1', 'subTitle2'];

export default function Page() {
	const arrays = useMemo(() => {
		return new Array(1000).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<UpdatedServerSide arr={['routes', 'page2', 'header', 'subTitle']} />
					<UpdatedServerSide arr={['routes', 'page2', 'header', 'title']} />
				</div>
			);
		});
	}, []);
	return (
		<div>
			<UsageAccessor />
			<TriggerFromServerSide arr={['routes', 'page2', 'header', 'title']} options={titles} />
			<TriggerFromServerSide arr={['routes', 'page2', 'header', 'subTitle']} options={subTitles} />
			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			{arrays}
		</div>
	);
}
