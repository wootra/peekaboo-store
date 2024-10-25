# Peekaboo! (peekaboo-store)

---
| ![peekaboo](https://github.com/wootra/peekaboo-store/blob/main/packages/peekaboo/peekaboo.png?raw=true) |
---

Peekaboo (peekaboo-store) is a simple and lightweight store management library.

I know.. Whatis so special? Another state management library? Why don't you use jotai or RTK?

Well, I said __store-management__, not __state__ management. 

## Why do you need peekaboo-store?

When you make a big application, it is hard to manage shared variable or constant. (even jotai atoms!)

Jotai or Redux Toolkit can be a solution that share some variable, but to find where it is, you will realize it is a tough work.

With peekaboo-store, we will have full-typescript support for the data structure.

## Power of peekaboo-store

- event driven content update
- content organize(manage your CMS system)
- dynamic content update
- tree shaking


## Demo

- [DemoCode(React - Next.js)](https://github.com/wootra/peekaboo-store/tree/main/apps/demo)
- [DemoCode(Vanilla - Astro.js)](https://github.com/wootra/peekaboo-store/tree/main/apps/demo-astro)

## Event-Driven update

Peekaboo store update contents powered by custom event. It updates really fast. 

## Architecture shift

Organizing files and folders consumes so much time. And it is even harder to track if the contents are even still used!
With `peekaboo-store`, You can track all the contents in one or very smaller files and they are "type safe"!
`peekaboo-store` also supports dynamic loading content. 

### make content structure

Imagine you have 

```typescript
import { createPeekaboo } from 'peekaboo-store';

const contents = {
	header: {
		languageDropdown: 'kr',
		title: {
			image: '/images/home.jpg',
			ariaLabel: 'welcome',
		},
		menus: {
			home: {
				label: 'Home',
				link: '/home',
			},
			about: {
				label: 'About',
				link: '/about',
			},
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

```