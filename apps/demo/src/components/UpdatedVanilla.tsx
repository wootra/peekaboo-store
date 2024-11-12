'use client';

import React, { memo, useEffect, useState } from 'react';
import { addBooEvent } from 'peekaboo-store/vanilla';

import { BooType } from 'peekaboo-store';

function FromGet<T>({ boo }: { boo: BooType<T> }) {
	return <div>val from get: {JSON.stringify(boo.get())}</div>;
}

const Memoized = React.memo(FromGet) as typeof FromGet;

function UpdatedVanilla<T>({ boo }: { boo: BooType<T> }) {
	const [val, setVal] = useState(boo.get() ?? boo.init());
	useEffect(() => {
		return addBooEvent(boo, setVal);
	}, [boo]);
	return (
		<div>
			<Memoized boo={boo} />
			<div>
				updated for {JSON.stringify(boo.init())}: {JSON.stringify(val)}
			</div>
		</div>
	);
}

export default memo(UpdatedVanilla) as typeof UpdatedVanilla;
