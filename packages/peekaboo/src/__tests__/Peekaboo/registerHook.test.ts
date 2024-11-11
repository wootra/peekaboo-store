import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('registerHook', () => {
		it('should return count when registered', () => {
			const peekaboo = createPeekaboo({ key1: 'value', key2: 123, key3: true });
			let count: number;
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(0);
			peekaboo.store.registerHook(peekaboo.data.key1._boo.__booUId);
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(1);
			peekaboo.store.registerHook(peekaboo.data.key1._boo.__booUId);
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(2);
			peekaboo.store.unregisterHook(peekaboo.data.key1._boo.__booUId);
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(1);
			peekaboo.store.unregisterHook(peekaboo.data.key1._boo.__booUId);
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(0);
			peekaboo.store.unregisterHook(peekaboo.data.key1._boo.__booUId);
			count = peekaboo.store.hookRegisteredCount(peekaboo.data.key1._boo.__booUId);
			expect(count).toBe(0);
		});
	});
});
