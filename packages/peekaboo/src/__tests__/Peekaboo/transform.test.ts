import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('transform', () => {
		it('should transform data', () => {
			const peekaboo = createPeekaboo({ key1: { key2: 'value' } });
			peekaboo.data.key1._boo.transform(val => {
				return {
					key2: val.key2.toUpperCase(),
				};
			});
			expect(peekaboo.data.key1._boo.get()).toStrictEqual({ key2: 'VALUE' });
			peekaboo.data.key1._boo.set({ key2: 'new value' });
			expect(peekaboo.data.key1._boo.get()).toStrictEqual({ key2: 'NEW VALUE' });
		});

		it('should NOT transform original data', () => {
			const peekaboo = createPeekaboo({ key1: { key2: 'value' } });
			peekaboo.data.key1._boo.transform(val => {
				return {
					key2: val.key2.toUpperCase(),
				};
			});
			expect(peekaboo.data._boo.get()).toStrictEqual({ key1: { key2: 'value' } });
			expect(peekaboo.data.key1.key2._boo.get()).toBe('value'); // children also should not change.
			peekaboo.data.key1._boo.set({ key2: 'new value' });
			expect(peekaboo.data._boo.get()).toStrictEqual({ key1: { key2: 'new value' } });
			expect(peekaboo.data.key1.key2._boo.get()).toBe('new value'); // children also should not change.
		});

		// it('should NOT allow type change', () => {
		// 	const peekaboo = createPeekaboo({ key1: { key2: 'value' } });
		// 	peekaboo.data.key1._boo.transform(val => {
		// 		return {
		// 			key2: val.key2.length,
		// 		};
		// 	});
		// });
	});
});
