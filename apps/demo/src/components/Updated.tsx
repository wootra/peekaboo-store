'use client';

import React, { memo } from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function FromGet<T>({ boo }: { boo: BooType<T> }) {
	return <div>val from get: {JSON.stringify(boo.get())}</div>;
}

const Memoized = React.memo(FromGet) as typeof FromGet;

function Updated<T>({ boo }: { boo: BooType<T> }) {
	const val = usePeekaboo(boo);
	return (
		<div>
			<Memoized boo={boo} />
			<div>
				updated for {JSON.stringify(boo.init())}: {JSON.stringify(val)}
			</div>
		</div>
	);
}

export default memo(Updated) as typeof Updated;
