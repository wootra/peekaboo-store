import Link from 'next/link';
import styles from 'app/layout.module.css';
import 'app/layout.css';

export default async function PageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<nav className={styles.pageLayout}>
				<Link href={'/dynamic/page1'} className={styles.link}>
					Page1
				</Link>
				<Link href={'/dynamic/page2'} className={styles.link}>
					Page2
				</Link>
				<Link href={'/dynamic/derived'} className={styles.link}>
					derived
				</Link>
			</nav>

			{children}
		</>
	);
}
