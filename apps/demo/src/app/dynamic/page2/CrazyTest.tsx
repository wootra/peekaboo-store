'use client';

import React, { useRef, useState } from 'react';

import { peekaboo } from 'app/dynamic/_data/const';
import { createSlice } from 'peekaboo-store/utils/slices';

const page2HeaderSlice = createSlice(peekaboo, data => data.routes.page2.header);
const timeout = 100;
const count = 10000;
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
				for (let i = 0; i < count; i++) {
					page2HeaderSlice().title._boo.set(`${numRef.current.toFixed(10)}`);
					numRef.current++;
				}
			}, timeout);
			setCrazy(id);
		}
	};
	return (
		<div style={{ padding: '1rem', border: '1px solid gray', borderRadius: '1rem' }}>
			<button onClick={onCrazy}>{(crazy as number) < 0 ? 'crazy!' : 'stop being crazy'}</button>
			<p>this is testing 'set' function's performance. </p>
			<p>when timeout time is smaller, it creates events more, so affecting the performance.</p>
			<p>the purpose of this test is logical efficiency.</p>
			<div>setting count per timeout: {count}</div>
			<div>interval count: {1000 / timeout}/s</div>
			<div>rendered: {rendered}/sec</div>
			<div>performance: {(rendered / ((1000 / timeout) * count)) * 100}%</div>
		</div>
	);
};

export default CrazyTest;
