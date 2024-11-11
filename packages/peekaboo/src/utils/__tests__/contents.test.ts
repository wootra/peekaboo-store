import { createPeekaboo } from 'src/Peekaboo';
import { getContent, getContentAsObject } from '../content';
const defaultVal = {
	key1: {
		key2: 'value',
		key3: 12,
		key4: true,
	},
	key2: 123,
};

const store = createPeekaboo(defaultVal);

describe('content', () => {
	describe('getContent', () => {
		it('should get all contents with dot notation', () => {
			const content = getContent(store);
			expect(content).toEqual({
				'key1.key2': 'value',
				'key1.key3': 12,
				'key1.key4': true,
				key2: 123,
			});
		});
	});

	describe('getContentAsObject', () => {
		it('should get all contents as object', () => {
			const content = getContentAsObject(store);
			expect(content).toEqual(defaultVal);
		});
	});
});
