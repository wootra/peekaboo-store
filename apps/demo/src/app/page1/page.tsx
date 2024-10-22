'use client';

import React from 'react';
import Updated from 'components/Updated';
import { peekaboo } from 'const';
import Trigger from 'components/Trigger';

export default function Page() {
	return (
		<div>
			<Trigger boo={peekaboo.data.routes.page1.header.title} />
			<Trigger boo={peekaboo.data.routes.page1.header.subTitle} />

			{/* <div>{dropDownIndex}</div> */}
			<h1>Web</h1>
			<Updated boo={peekaboo.data.routes.page1.header.title} />
			<Updated boo={peekaboo.data.routes.page1.header.subTitle} />
		</div>
	);
}
