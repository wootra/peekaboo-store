'use client';

import React from 'react';

import { BooType } from 'peekaboo-store';

function Trigger<T>({ boo }: { boo: () => BooType<T> | undefined }) {
	const onClick = (num: number) => {
		boo()?.set(`${num}` as T);
	};

	return (
		<div>
			<h2>{boo()?.init() as string}</h2>

			<button onClick={() => onClick(1)}>click 1</button>
			<button onClick={() => onClick(2)}>click 2</button>
		</div>
	);
}

export default Trigger;
