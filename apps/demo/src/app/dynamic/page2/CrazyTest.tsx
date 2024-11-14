'use client';

import React, { useRef, useState } from 'react';

import { peekaboo } from 'app/dynamic/_data/const';
import { createSlice } from 'peekaboo-store/utils/slices';

const page2HeaderSlice = createSlice(peekaboo, data => data.routes.page2.header);

const CrazyTest = () => {
	const [crazy, setCrazy] = useState<ReturnType<typeof setTimeout> | number>(-1);
	const numRef = useRef(0);
	const startTime = useRef(0);
	const [rendered, setRendered] = useState(0);
	const onCrazy = () => {
		if (crazy !== -1) {
			setRendered(Math.round(numRef.current / ((Date.now() - startTime.current) / 1000)));
			startTime.current = Date.now();
			clearInterval(crazy as number);
			numRef.current = 0;
			setCrazy(-1);
		} else {
			startTime.current = Date.now();
			const id = setInterval(() => {
				// console.count('count');
				for (let i = 0; i < 100000; i++) {
					page2HeaderSlice().title._boo.set(`${numRef.current.toFixed(10)}`);
					numRef.current++;
				}
			}, 100);
			setCrazy(id);
		}
	};
	return (
		<div>
			<button onClick={onCrazy}>{(crazy as number) < 0 ? 'crazy!' : 'stop being crazy'}</button>
			<div>rendered: {rendered}/sec</div>
		</div>
	);
};

export default CrazyTest;
