'use client';

import React, { useRef, useState } from 'react';

import { peekaboo } from 'app/dynamic/_data/const';
import { setUpdateOptions } from 'peekaboo-store';

const page2HeaderSlice = peekaboo.data.routes.page2;
// const timeout = 10;
const count = 100000;
const CrazyTest = () => {
	const [crazy, setCrazy] = useState<ReturnType<typeof setTimeout> | number>(-1);
	const [crazy2, setCrazy2] = useState<ReturnType<typeof setTimeout> | number>(-1);
	const [timeout, setTimeoutValue] = useState(100);
	const onTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valueToChange = Number(e.target.value);
		if (valueToChange < 1 || valueToChange > 1000) return;
		setUpdateOptions({ eventOptimizeInMs: valueToChange });
		setTimeoutValue(valueToChange);
	};
	const [performance, SetPerformance] = useState(0);
	const numRef = useRef(0);
	const numRef2 = useRef(0);
	const startTime = useRef(0);
	const [updated, setUpdated] = useState(0);
	const onCrazy = () => {
		if (crazy !== -1) {
			const timeSpent = (Date.now() - startTime.current) / 1000; // sec
			// setUpdated(timeSpent);
			setUpdated(Math.round(numRef.current / timeSpent));
			const fullPerformance = count * (1000 / timeout) * timeSpent;
			SetPerformance(Math.round((numRef.current / fullPerformance) * 10000) / 100);
			startTime.current = Date.now();
			clearInterval(crazy as number);
			clearInterval(crazy2 as number);
			numRef.current = 0;
			setCrazy(-1);
			setCrazy2(-1);
		} else {
			startTime.current = Date.now();
			const id = setInterval(() => {
				// console.count('count');
				for (let i = 0; i < count; i++) {
					page2HeaderSlice.header.title._boo.set(`${numRef.current.toFixed(10)}`);
					numRef.current++;
				}
			}, timeout);

			const id2 = setInterval(() => {
				page2HeaderSlice.instantUpdate.count._boo.set(numRef2.current, { instantDispatch: true });
				numRef2.current++;
			}, timeout);
			setCrazy(id);
			setCrazy2(id2);
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
			<div>updated: {updated}/sec</div>
			<div>performance: {performance}%</div>
			<div>
				update Timeout: <input type='number' onChange={onTimeoutChange} value={timeout} />
			</div>
		</div>
	);
};

export default CrazyTest;
