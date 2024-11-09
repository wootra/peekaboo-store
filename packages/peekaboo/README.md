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

- lightweight! (core is 1.41kB, react hook is 451B)
- event driven content update
- content organize(manage your CMS system). hook managed labels will help you to update your SPA without full-reload.
- dynamic full content update support
- default value decides type automatically.
- very simple usage ( minimum boilerplate ). No Provider needed!

## Demo

- [DemoCode(React - Next.js)](https://github.com/wootra/peekaboo-store/tree/main/apps/demo)
- [DemoCode(Vanilla - Astro.js)](https://github.com/wootra/peekaboo-store/tree/main/apps/demo-astro)

## Event-Driven update

Peekaboo store update contents powered by custom event. It updates really fast. 

## Architecture shift

Organizing files and folders consumes so much time. And it is even harder to track if the contents are even still used!
With `peekaboo-store`, You can track all the contents in one or very smaller files and they are "type safe"!
`peekaboo-store` also supports dynamic loading content. 

### make a content schema (createPeekaboo)

Imagine you have content structure like below. For example, 

```typescript
import { createPeekaboo } from 'peekaboo-store';

const contents = {
	header: {
		languageDropdown: 'kr',
		title: {
			label: 'Title',
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

`createPeekaboo` creates Peekaboo object. And this object can be shared everywhere. There is no limitation of number of stores. You can make multiple if you want to manage the content based on pages. `peekaboo-store` will give you easy usage. Whereever you want to cut the data, use `._boo` to access to trackable `BooType` object. using `BooType`, you can either use hook, accessing to data with `.get()`, or set the data with `.set()`.

### consume data (usePeekaboo)

You can consume the data like this:

```typescript
import { contentPeekaboo } from 'app/sample1/_data/constant';
import { usePeekaboo } from 'peekaboo-store/react';

const Header = () => {
	const titleLabel = usePeekaboo(contentPeekaboo.data.header.title.label._boo);
	const titleImage = usePeekaboo(contentPeekaboo.data.header.title.image._boo);

	return (
		<div>
			<h1>{titleLabel}</h1>
			<p>{titleImage}</p>
		</div>
	);
};

export default Header;
```

Is `contentPeekaboo.data.header.title` too long? Don't be nervous. It will support typescript.

![peekaboo object is fully type supported](https://github.com/wootra/peekaboo-store/blob/main/packages/peekaboo/use-peekaboo-type-support.png?raw=true)

## Slice (createSlice)

Still annoying? Do you have to re-use it? No problem! use Slice.

```typescript
const titleSlice = createSlice(contentPeekaboo, data => data.header.title);

const Header = () => {
	const titleLabel = usePeekaboo(titleSlice().label._boo);
	const titleImage = usePeekaboo(titleSlice().image._boo);
    ...
```

## Use content as Object (peeka)

`peekaboo-store` is designed to be optimized to manage CMS contents. So if it is handling string, it makes sense. It also support `usageLog` that is useful to check if the labels are actually used or not.
But If you're lazy, and you know the labels or contents are always used together, then you can wrap it with `peeka` function when you initialize data schema.


```typescript
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

Then you can consume the header.title as one set of data. I call it Boo. (You know... peeka-boo!)

```typescript
'use client';

import React from 'react';
import { contentPeekaboo } from 'app/sample1/_data/constant';
import { usePeekaboo } from 'peekaboo-store/react';

const Header = () => {
	const header = usePeekaboo(contentPeekaboo.data.header.title._boo); // title Boo returns an object

	return (
		<div>
			<h1>{header?.label ?? ''}</h1>
			<p>{header?.image ?? ''}</p>
		</div>
	);
};

export default Header;
```

If you use peeka function, you can wrap any of object (even jotai atom!).

## Dynamic update full contents (updatePeekaboo)

`peekaboo-store` supports full or partial content update by simple function call.
Below is a simple example updating peekaboo object with a new data.
Don't worry if you're updating different shape (less data or more data).
If the data is not matching with the initial structure, it will not update the data.
Instead, it will show you warning message.

```typescript
import { PeekabooObjSourceData, updatePeekaboo } from 'peekaboo-store';
import { useEffect } from 'react';
import { peekaboo } from './_data/const';
const mockData: Partial<PeekabooObjSourceData<typeof peekaboo>> = {
	routes: {
		page1: {
			header: {
				title: 'page1-header-title',
				subTitle: 'page1-header-subtitle',
			},
		},
		page2: {
			header: {
				// @ts-ignore
				title: 3, // <--type mismatch
				subTitle: 'page2-header-subtitle',
			},
		},
		extra: { // <-- does not exist
			header: {
				title: 'extra-header-title',
				subTitle: 'extra-header-subtitle',
			},
		},
	},
};
const DataLoader = () => {
	useEffect(() => {
		setTimeout(() => {
			updatePeekaboo(peekaboo, mockData);
		}, 2000);
	}, []);
	return null;
};

export default DataLoader;


```

![error message for type mismatch](https://github.com/wootra/peekaboo-store/blob/main/packages/peekaboo/type-mismatch.png?raw=true)


## Direct data access without using hook

the real power comes out of event-driven update.
But sometimes you need to access to the data as part of other logic without creating a hook.
(i.e. from jotai atom logic)
you can use `BooType.get()` function to get the data. like `get` function, you also can get `BooType.init()` function to get what was init value.
like `BooType.get()` function you also can change the value of it. `BooType.set(value)` will update the Boo's value, and all the usePeekaboo hooks that is using this Boo will be triggered. `BooType.set` does not reset its usage which you can check by calling `BooType.used()` function. this `BooType.used()` function will return `true` if this BooType is referenced(`BooType.get()`) at least once. 

[Demo for .get(), .init()](https://github.com/wootra/peekaboo-store/blob/main/apps/demo/src/components/Updated.tsx)
[Demo for .set()](https://github.com/wootra/peekaboo-store/blob/main/apps/demo/src/components/Trigger.tsx)
[Demo for .used() - getUsageLog](https://github.com/wootra/peekaboo-store/blob/main/apps/demo/src/app/dynamic/page2/page.tsx)
## Initialize Boo

You can intialize Boo with `BooType.__initialize` function. With the argument, you can set it with other value (initialize return value of `.used()` to `false`). This function is also called when `updatePeekaboo` is called as well. If `updatePeekaboo` updates partial data, only updated `Boo` will be initialized. Unlike `BooType.used()`, `BooType.everUsed()` will not be updated to `false` even though 

## Content usage log

[Demo for .used() - getUsageLog](https://github.com/wootra/peekaboo-store/blob/main/apps/demo/src/app/dynamic/page2/page.tsx)

You can see usage report. This is useful if you want to track the orphan nodes.

In the above example code, it registers getUsageLog to the window object, so I can use the function in the browser console. It can be used to pass the value to the API.
```typescript
import { getUsageLog } from 'peekaboo-store/utils/usage';

const peekaboo = createPeekaboo({...});
getUsageLog(peekaboo, 'leaf', 'unused');
```

![alt text](https://github.com/wootra/peekaboo-store/blob/main/packages/peekaboo/getUsageLog.png?raw=true)

## Get current content

You can see all current contents of a peekaboo store. 

[Demo - getContent](https://github.com/wootra/peekaboo-store/blob/main/apps/demo/src/app/dynamic/page2/page.tsx)

```typescript
import { getContent } from 'peekaboo-store/utils/content';
const peekaboo = createPeekaboo({...});
const content = getContent(peekaboo);
// result will be flat object with '.' notation
// ex> { "key1.key2.key3": 'value', "key1.key2.key4": false }
```

or take the result as object form without `dot` connected format


```typescript
import { getContentAsObject } from 'peekaboo-store/utils/content';
const peekaboo = createPeekaboo({...});
const content = getContentAsObject(peekaboo);
// result will be multi-layer object
// ex> { key1: {key2: {key3: 'value', key4: false }}}
```

## Get schema from the initial data

You may want to create a validator for the data.
Peekaboo-store has a built-in schema generator powered by [zod](https://www.npmjs.com/package/zod)
the schema is automatically become `optional` structures for each items,
so even though a partial data is given, it will handle the parser properly.

```typescript
import { getSchema } from 'peekaboo-store/utils/schema';
const initValue = {
	key1: 'string-value',
	key2: 100
};
const peekaboo = createPeekaboo(initValue);
const schema = getSchema(peekaboo);
const parsed = schema.parse({key1: 'other-value'}); // okay!
const parsed2 = schema.parse({key1: 999}); // will throw error!
const parsed3 = schema.parse({key1: 'val', key3: 'test'}); // will return {key1: 'val'} only since key3 is not registered value!
```
