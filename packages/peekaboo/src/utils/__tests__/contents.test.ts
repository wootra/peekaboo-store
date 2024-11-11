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
				'data.key1.key2': 'value',
				'data.key1.key3': 12,
				'data.key1.key4': true,
				'data.key2': 123,
			});
		});
	});

	describe('getContentAsObject', () => {
		it('should get all contents as object', () => {
			const content = getContentAsObject(store);
			expect(content).toStrictEqual({ data: defaultVal });
		});
	});
});
