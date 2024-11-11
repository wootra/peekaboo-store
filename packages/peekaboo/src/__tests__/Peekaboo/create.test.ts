import { isPeekaType, peeka } from 'src/peeka';
import { createPeekaboo } from 'src/Peekaboo';
describe('Peekaboo', () => {
	describe('createPeekaboo', () => {
		it('should create peekaboo', () => {
			const peekaboo = createPeekaboo({ key1: 'value', key2: 123, key3: true });
			expect(peekaboo.store).not.toBeUndefined();
			expect(peekaboo.data).not.toBeUndefined();
		});

		it('should throw error when passing non object or empty init data', () => {
			const errorMsg = 'Peekaboo initData must be an object, and not empty';
			// @ts-ignore
			expect(() => createPeekaboo(null)).toThrow(errorMsg);
			// @ts-ignore
			expect(() => createPeekaboo(undefined)).toThrow(errorMsg);
			expect(() => createPeekaboo(123)).toThrow(errorMsg);
			expect(() => createPeekaboo('string')).toThrow(errorMsg);
			expect(() => createPeekaboo([])).toThrow(errorMsg);
			expect(() => createPeekaboo({})).toThrow(errorMsg);
		});

		it('should not convert array in initData', () => {
			const arr = Object.freeze([1, 2, 3]);
			const obj = Object.freeze({ p1: 123 });
			const peekaObj = peeka(obj);

			const peekaboo = createPeekaboo({ arr, peekaObj });

			expect(peekaboo.store.data.arr).toStrictEqual([1, 2, 3]);
			expect(peekaboo.store.data.arr).toStrictEqual(arr);
			expect(peekaboo.store.data.arr).toBe(arr);

			expect(isPeekaType(peekaboo.store.initData.data.peekaObj)).toBeTruthy();
			expect(peekaboo.store.data.peekaObj).toBe(obj);
		});
	});
});
