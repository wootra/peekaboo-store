'use client';

import { peeka, createPeekaboo, PeekabooValue } from 'peekaboo';
import { useEffect } from 'react';
const obj = {
	_test1: peeka(12),
	_test2: {
		test3: {
			_test4: {
				test5: peeka('hi'),
			},
		},
	},
};

const peekaboo = createPeekaboo(obj);
peekaboo.data._test2.test3;
peekaboo.data._test1;

function test<T>(val: PeekabooValue<T>) {
	val.get();
}

test(peekaboo.data._test2.test3._test4.test5);

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
