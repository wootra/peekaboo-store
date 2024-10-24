'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const LinkStyler = ({ className }: { className: string }) => {
	const location = usePathname();
	useEffect(() => {
		if (!document) return;
		const links = document.getElementsByClassName(className);
		for (let i = 0; i < links.length; i++) {
			const link = links[i] as HTMLAnchorElement;
			if (location.includes(link.getAttribute('href') ?? 'NaN')) {
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
			console.log('locatoin', location);
		}
	}, [location]);
	return <div></div>;
};

export default LinkStyler;
