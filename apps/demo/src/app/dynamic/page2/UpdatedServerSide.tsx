'use client';

import React, { memo, useMemo } from 'react';

import { peekaboo } from '../_data/const';
import { convertArrayToBoo } from './convertArrayToBoo';
import Updated from 'components/Updated';

function UpdatedFromServerSide({ arr }: { arr: readonly string[] }) {
	const boo = useMemo(() => convertArrayToBoo(peekaboo, arr), [arr]);
	return <Updated boo={boo} />;
}

export default memo(UpdatedFromServerSide) as typeof UpdatedFromServerSide;
