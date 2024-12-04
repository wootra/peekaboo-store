'use client';

import React, { useMemo } from 'react';
import UpdatedServerSide from './UpdatedServerSide';

import UsageAccessor from '../UsageAccessor';
import TriggerFromServerSide from './TriggerFromServerSide';
import CrazyTest from './CrazyTest';
import UpdatedDerived from './UpdatedDerived';
import Updated from 'components/Updated';
import { atomStore, atomVal, atomVal2, peekaboo } from 'app/dynamic/_data/const';
import CrazyTestAtom from './CrazyTestAtom';
import UpdatedAtom from 'components/UpdatedAtom';
import { Provider } from 'jotai';

const titles = ['title1', 'title2'];
const subTitles = ['subTitle1', 'subTitle2'];

export default function Page() {
	const arrays = useMemo(() => {
		return new Array(2000).fill(null).map((_, idx) => {
			return (
				<div key={`id_${idx}`}>
					<UpdatedAtom store={atomStore} atomVal={atomVal} />
					<UpdatedAtom store={atomStore} atomVal={atomVal2} />
					<UpdatedServerSide arr={['routes', 'page2', 'header', 'subTitle']} />
					<UpdatedServerSide arr={['routes', 'page2', 'header', 'title']} />
					<UpdatedDerived />
				</div>
			);
		});
	}, []);
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '500px 500px' }}>
			<Provider store={atomStore}>
				<CrazyTest />
				<CrazyTestAtom />
				<Updated boo={peekaboo.data.routes.page2.instantUpdate.count._boo} />
				<UpdatedAtom store={atomStore} atomVal={atomVal2} />
				<TriggerFromServerSide arr={['routes', 'page2', 'header', 'title']} options={titles} />
				<TriggerFromServerSide arr={['routes', 'page2', 'header', 'subTitle']} options={subTitles} />
				{/* <div>{dropDownIndex}</div> */}
				<UsageAccessor />
				{arrays}
			</Provider>
		</div>
	);
}
