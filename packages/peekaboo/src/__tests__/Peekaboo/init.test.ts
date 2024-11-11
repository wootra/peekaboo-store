import { peeka } from 'src/peeka';
import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('init', () => {
		const peekaObj = { a: 1 };
		const defaultVal = { key1: 'value', key2: 123, key3: true, peeka: peeka(peekaObj) };
		let store: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
		beforeEach(() => {
			store = createPeekaboo(defaultVal);
		});

		it('should get init value', () => {
			store.data.key1._boo.set('value2');
			expect(store.data.key1._boo.init()).toBe('value');
		});

		it('should get init value without peeka object', () => {
			expect(store.data.peeka._boo.init()).toBe(peekaObj);
			expect(store.data.peeka._boo.init()).toStrictEqual({ a: 1 });
		});
	});
});
