'use client';

import React from 'react';
import { usePeekaboo } from 'peekaboo-store/react';

import { BooType } from 'peekaboo-store';

function Updated<T>({ boo }: { boo: BooType<T> }) {
	const val = usePeekaboo(boo);
	return (
		<div>
			updated for ${boo.booId}: {JSON.stringify(val)}
		</div>
	);
}

export default Updated;
