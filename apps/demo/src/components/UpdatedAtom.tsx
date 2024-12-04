'use client';

import React, { memo } from 'react';

import { createStore, useAtomValue } from 'jotai';
import { PrimitiveAtom } from 'jotai';
type Store = ReturnType<typeof createStore>;
function FromGetAtom<T>({ store, atomVal }: { store: Store; atomVal: PrimitiveAtom<T> }) {
	const val = store.get(atomVal);
	return <div>val from get: {JSON.stringify(val)}</div>;
}

function FromHookAtom<T>({ atomVal }: { atomVal: PrimitiveAtom<T> }) {
	const val = useAtomValue(atomVal);
	return <div>val from hook: {JSON.stringify(val)}</div>;
}

const MemoizedGetAtom = React.memo(FromGetAtom) as typeof FromGetAtom;
const MemoizedHookAtom = React.memo(FromHookAtom) as typeof FromHookAtom;

function UpdatedAtom<T>({ atomVal, store }: { store: Store; atomVal: PrimitiveAtom<T> }) {
	return (
		<div style={{ border: '1px solid gray', padding: '1rem' }}>
			<h3>Atom Update{atomVal.debugLabel}</h3>
			<MemoizedGetAtom store={store} atomVal={atomVal} />
			<MemoizedHookAtom atomVal={atomVal} />
		</div>
	);
}
export { MemoizedGetAtom, MemoizedHookAtom };
export default memo(UpdatedAtom) as typeof UpdatedAtom;
