'use client';

import React, { useEffect } from 'react';
import { peekaboo } from './_data/const';
import { updatePeekaboo } from 'peekaboo-store/utils/update';

const DataLoader = ({ dataDirect, dataAfterTimeout }: { dataDirect: object; dataAfterTimeout: object }) => {
	updatePeekaboo(peekaboo, dataDirect); // server side data update!

	useEffect(() => {
		setTimeout(() => {
			updatePeekaboo(peekaboo, dataAfterTimeout);
		}, 3000);
	}, []);
	return null;
};

export default React.memo(DataLoader);
