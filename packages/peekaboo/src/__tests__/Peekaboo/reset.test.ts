import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('reset', () => {
		it('should reset to init value', () => {
			const peekaboo = createPeekaboo({ key1: 'value', key2: 123, key3: true });
			peekaboo.data.key1._boo.set('value2');
			expect(peekaboo.data.key1._boo.get()).toBe('value2');
			peekaboo.data.key1._boo.reset();
			expect(peekaboo.data.key1._boo.get()).toBe('value');
		});
	});
});
