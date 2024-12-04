'use client';

import React, { memo } from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function FromGet<T>({ boo }: { boo: BooType<T> }) {
	return <div>val from get: {JSON.stringify(boo.get())}</div>;
}
function FromInit<T>({ boo }: { boo: BooType<T> }) {
	return <div>val from init: {JSON.stringify(boo.init())}</div>;
}

function FromHook<T>({ boo }: { boo: BooType<T> }) {
	const val = usePeekaboo(boo);
	return <div>val from hook: {JSON.stringify(val)}</div>;
}

const MemoizedGet = React.memo(FromGet) as typeof FromGet;
const MemoizedInit = React.memo(FromInit) as typeof FromInit;
const MemoizedHook = React.memo(FromHook) as typeof FromHook;

function Updated<T>({ boo }: { boo: BooType<T> }) {
	return (
		<div style={{ border: '1px solid gray', padding: '1rem' }}>
			<h3>{boo.__booId}</h3>
			<MemoizedGet boo={boo} />
			<MemoizedInit boo={boo} />
			<MemoizedHook boo={boo} />
		</div>
	);
}
export { MemoizedGet, MemoizedInit, MemoizedHook };
export default memo(Updated) as typeof Updated;
