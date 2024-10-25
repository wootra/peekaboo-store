import { createPeekaboo, peeka } from 'peekaboo-store';

const contents = {
	header: {
		languageDropdown: 'kr',
		title: peeka({
			label: 'Title',
			image: '/images/home.jpg',
			ariaLabel: 'welcome',
		}),
		menus: {
			home: peeka({
				label: 'Home',
				link: '/home',
			}),
			about: peeka({
				label: 'About',
				link: '/about',
			}),
		},
	},
	contents: {
		aboutPage: {
			title: 'Title-about',
			introduction: 'we are...(some random text)',
		},
		homePage: {
			title: 'Title-home',
			hero: {
				image: '/images/hero.jpg',
				text: 'Hello! we are...',
			},
		},
	},
};
const contentPeekaboo = createPeekaboo(contents);
export { contentPeekaboo };
