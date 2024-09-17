'use client';

import { createPeekaboo } from 'peekaboo';
import { useEffect } from 'react';
const obj = Object.freeze({
	test1: {
		value: 1,
		children: {
			test2: 3,
		},
	},
	test2: {
		value: 2,
	},
});

const peekaboo = createPeekaboo(obj);

export default function Page() {
	useEffect(() => {
		console.log('peekaboo', peekaboo);
	}, []);
	return (
		<>
			<h1>Web</h1>
		</>
	);
}
