import Link from 'next/link';
import styles from 'app/layout.module.css';
import LinkStyler from 'app/LinkStyler';
import 'app/layout.css';
import DataLoader from './DataLoader';
import { PeekabooObjSourceData } from 'peekaboo-store';
import { peekaboo } from './_data/const';
import { Suspense } from 'react';

export default async function PageLayout({ children }: { children: React.ReactNode }) {
	const mockDataDirect: object = await new Promise(res => {
		const ret: Partial<PeekabooObjSourceData<typeof peekaboo>> = {
			routes: {
				page1: {
					header: {
						title: 'page1-header-title(direct)',
						subTitle: 'page1-header-subtitle(direct)',
					},
				},
				page2: {
					header: {
						// @ts-ignore
						title: 3,
						subTitle: 'page2-header-subtitle(direct)',
					},
				},
				extra: {
					header: {
						title: 'extra-header-title(direct)',
						subTitle: 'extra-header-subtitle(direct)',
					},
				},
			},
		};
		res(ret);
	});
	return (
		<>
			<nav className={styles.pageLayout}>
				<Link href={'/dynamic/page1'} className={styles.link}>
					Page1
				</Link>
				<Link href={'/dynamic/page2'} className={styles.link}>
					Page2
				</Link>
			</nav>

			<Suspense fallback={<div>Loading...</div>}>
				<DataLoader dataDirect={mockDataDirect} />
				{children}
			</Suspense>
			<LinkStyler className={styles.link} />
		</>
	);
}
