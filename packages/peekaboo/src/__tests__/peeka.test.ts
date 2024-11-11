import { isPeekaLayer, peeka } from 'src/peeka';

describe('peeka', () => {
	describe('peeka', () => {
		it('should create peeka object', () => {
			const obj = peeka({ p1: 123, p2: 223 });
			expect(obj).toEqual({
				peekabooType: 'peeka',
				init: { p1: 123, p2: 223 },
			});
		});

		it('should be a frozen object', () => {
			const obj = peeka({ p1: 123, p2: 223 });
			try {
				obj.init.p1 = 888;
			} catch (e) {
				expect((e as Error).message).toBe("Cannot assign to read only property 'p1' of object '#<Object>'");
			}
			expect(obj.init.p1).toBe(123);
		});

		it('should not change the original object', () => {
			const obj = { p1: { value: 111 }, p2: 223 };
			const peekaObj = peeka(obj);
			expect(peekaObj.init.p1).toBe(obj.p1);
		});

		it('should throw error when non-object is given', () => {
			// @ts-ignore
			expect(() => peeka(123)).toThrow('Peeka value must be an object');
			// @ts-ignore
			expect(() => peeka('a2')).toThrow('Peeka value must be an object');
			// @ts-ignore
			expect(() => peeka(true)).toThrow('Peeka value must be an object');
		});
	});

	describe('isPeekaLayer', () => {
		const obj = {
			a: {
				b: {
					c: 1,
					d: peeka({ e: 2, f: 3 }),
				},
			},
		};
		it('should return true when peeka object is given', () => {
			expect(isPeekaLayer(obj, ['a', 'b', 'd'])).toBe(true);
		});

		it('should return false when NOT peeka object is given', () => {
			expect(isPeekaLayer(obj, ['a', 'b', 'c'])).toBe(false);
		});

		it('should throw error when NOT right key is given', () => {
			expect(() => isPeekaLayer(obj, ['a', 'b', 'k'])).toThrow();
		});

		it('should return if it is peeka when key array is empty', () => {
			expect(isPeekaLayer({ a: 1 }, [])).toBe(false);
			expect(isPeekaLayer(1, [])).toBe(false);
			expect(isPeekaLayer(peeka({ a: 1 }), [])).toBe(true);
		});
	});
});
