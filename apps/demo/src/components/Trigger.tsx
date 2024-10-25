'use client';

import React from 'react';

import { BooType } from 'peekaboo-store';

function Trigger<T>({ boo, options }: { boo: BooType<T>; options: T[] }) {
	const onClick = (val: T) => {
		boo.set(val);
	};

	return (
		<div>
			<h2>{JSON.stringify(boo.init())}</h2>
			{options.map((opt, idx) => {
				return (
					<button key={'btn-' + idx} onClick={() => onClick(opt)}>
						click {idx}
					</button>
				);
			})}
		</div>
	);
}

export default Trigger;
