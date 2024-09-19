'use client';

import React from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function Updated<T>({ boo }: { boo: BooType<T> }) {
	const val = usePeekaboo(boo);
	return (
		<div>
			updated for ${boo.init as string}: {JSON.stringify(val)}
		</div>
	);
}

export default Updated;
