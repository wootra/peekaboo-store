'use client';

import React from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function Updated<T>({ boo }: { boo: BooType<T> }) {
	const val = usePeekaboo(boo);
	return (
		<div>
			val from get: {boo.get()?.toString()}
			updated for {boo.init as string}: {JSON.stringify(val)}
		</div>
	);
}

export default Updated;
