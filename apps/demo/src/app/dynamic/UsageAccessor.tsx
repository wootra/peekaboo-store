'use client';

import { useEffect } from 'react';

import { peekaboo } from 'app/dynamic/_data/const';
import { BooNodeTypeToSelect, getUsageLog, IncludeType } from 'peekaboo-store/utils/usage';
import { getContent, getContentAsObject } from 'peekaboo-store/utils/content';

const UsageAccessor = () => {
	useEffect(() => {
		// @ts-ignore
		window.getUsageLog = function (nodeType: BooNodeTypeToSelect = 'all', includes: IncludeType = 'all') {
			return getUsageLog(peekaboo, nodeType, includes);
		};
		// @ts-ignore
		window.getContent = () => getContent(peekaboo);
		// @ts-ignore
		window.getContentAsObject = () => getContentAsObject(peekaboo);
	}, []);

	return null;
};

export default UsageAccessor;
