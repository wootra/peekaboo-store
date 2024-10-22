import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<nav style={{ position: 'sticky', top: 0, height: '30px', background: 'white', zIndex: 1 }}>
					<Link href={'/page1'}>Page1</Link>
					<Link href={'/page2'}>Page2</Link>
				</nav>
				{children}
			</body>
		</html>
	);
}
