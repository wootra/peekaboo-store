import Link from 'next/link';
import styles from 'app/layout.module.css';
import LinkStyler from 'app/LinkStyler';
import 'app/layout.css';
import DataLoader from './DataLoader';

export default function PageLayout({ children }: { children: React.ReactNode }) {
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
			{children}
			<DataLoader />
			<LinkStyler className={styles.link} />
		</>
	);
}
