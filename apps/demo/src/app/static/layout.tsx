import Link from 'next/link';
import styles from 'app/layout.module.css';
import 'app/layout.css';
import LinkStyler from 'app/LinkStyler';

export default function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav className={styles.pageLayout}>
				<Link href={'/static/page1'} className={styles.link}>
					Page1
				</Link>
				<Link href={'/static/page2'} className={styles.link}>
					Page2
				</Link>
			</nav>
			{children}
			<LinkStyler className={styles.link} />
		</>
	);
}
