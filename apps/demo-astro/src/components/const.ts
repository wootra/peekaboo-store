import { createPeekaboo } from 'peekaboo-store';

const peekaboo = createPeekaboo({
	routes: {
		page1: {
			value: 0,
		},
	},
});

export { peekaboo };
