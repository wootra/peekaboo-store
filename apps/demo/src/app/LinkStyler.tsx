'use client';

import { usePathname } from 'next/navigation';
import { memo, useEffect } from 'react';

const LinkStyler = ({ className }: { className: string }) => {
	const location = usePathname();
	useEffect(() => {
		if (!document) return;
		const links = document.getElementsByClassName(className);
		for (let i = 0; i < links.length; i++) {
			const link = links[i] as HTMLAnchorElement;
			if (location.includes(link.getAttribute('href') ?? 'NaN')) {
				if (link.classList.contains('active')) continue;
				link.classList.add('active');
			} else {
				if (link.classList.contains('active')) {
					link.classList.remove('active');
				}
			}
			console.log('location', location);
		}
	}, [location]);
	return null;
};

export default memo(LinkStyler);
