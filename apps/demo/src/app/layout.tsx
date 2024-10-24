import Link from 'next/link';
import styles from 'app/layout.module.css';
import 'app/layout.css';
import LinkStyler from './LinkStyler';
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<nav className={styles.rootLayout}>
					<Link href={'/static'} className={styles.link}>
						Pre-defined init data
					</Link>
					<Link href={'/dynamic'} className={styles.link}>
						Network loaded init data
					</Link>
				</nav>
				{children}
				<LinkStyler className={styles.link} />
			</body>
		</html>
	);
}
