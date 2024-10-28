'use client';

import React from 'react';
import { contentPeekaboo } from 'app/sample1/_data/constant';
import { usePeekaboo } from 'peekaboo-store/react';
import { createSlice } from 'peekaboo-store/utils/slices';
const titleSlice = createSlice(contentPeekaboo, data => data.header.title);

const Header = () => {
	const header = usePeekaboo(titleSlice()._boo);
	return (
		<div>
			<h1>{header?.label ?? ''}</h1>
			<p>{header?.image ?? ''}</p>
		</div>
	);
};

export default Header;
