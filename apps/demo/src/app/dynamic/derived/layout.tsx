import styles from 'app/layout.module.css';
import LinkStyler from 'app/LinkStyler';
import 'app/layout.css';
import DataLoader from '../DataLoader';
import { PeekabooObjPartialSourceData } from 'peekaboo-store';
import { peekaboo } from '../_data/const';
import { Suspense } from 'react';
const dataAfterTimeout: Partial<PeekabooObjPartialSourceData<typeof peekaboo>> = {
	routes: {
		page1: {
			header: {
				title: 'page1-header-title(timeout)',
				subTitle: 'page1-header-subtitle(timeout)',
			},
		},
		page2: {
			header: {
				title: 'page2-header-title(timeout)',
				subTitle: 'page2-header-subtitle(timeout)',
			},
		},
	},
};

export default async function PageLayout({ children }: { children: React.ReactNode }) {
	const mockDataDirect: object = await new Promise(res => {
		const ret: Partial<PeekabooObjPartialSourceData<typeof peekaboo>> = {
			routes: {
				page1: {
					header: {
						title: 'page1-header-title(direct)',
						subTitle: 'page1-header-subtitle(direct)',
					},
				},
				page2: {
					header: {
						title: 'page2-header-title(direct)',
						subTitle: 'page2-header-subtitle(direct)',
					},
				},
			},
		};
		res(ret);
	});
	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<DataLoader dataDirect={mockDataDirect} dataAfterTimeout={dataAfterTimeout} />
				{children}
			</Suspense>
			<LinkStyler className={styles.link} />
		</>
	);
}
