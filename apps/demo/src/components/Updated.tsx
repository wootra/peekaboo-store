'use client';

import React from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function Updated<T>({ boo }: { boo: () => BooType<T> | undefined }) {
	const val = usePeekaboo(boo, 'loading' as T);
	return (
		<div>
			<div>val from get: {boo()?.get()?.toString()}</div>
			<div>
				updated for {boo()?.init() as string}: {JSON.stringify(val)}
			</div>
		</div>
	);
}

export default Updated;
