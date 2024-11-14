'use client';

import React, { useMemo } from 'react';

import { peekaboo } from '../_data/const';
import { convertArrayToBoo } from './convertArrayToBoo';

function TriggerFromServerSide<T>({ arr, options }: { arr: readonly string[]; options: T[] }) {
	const boo = useMemo(() => convertArrayToBoo(peekaboo, arr), [arr]);
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

export default TriggerFromServerSide;
