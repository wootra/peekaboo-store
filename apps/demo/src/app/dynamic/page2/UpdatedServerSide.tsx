'use client';

import React, { memo, useMemo } from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';
import { peekaboo } from '../_data/const';
import { convertArrayToBoo } from './convertArrayToBoo';

function FromGet<T>({ boo }: { boo: BooType<T> }) {
	return <div>val from get: {JSON.stringify(boo.get())}</div>;
}

const Memoized = React.memo(FromGet) as typeof FromGet;

function UpdatedFromServerSide({ arr }: { arr: readonly string[] }) {
	const boo = useMemo(() => convertArrayToBoo(peekaboo, arr), [arr]);
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

export default memo(UpdatedFromServerSide) as typeof UpdatedFromServerSide;
