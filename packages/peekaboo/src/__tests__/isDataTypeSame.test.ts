import { isDataTypeSame } from 'src/isDataTypeSame';

describe('isDataTypeSame', () => {
	it('should return true if primitive data type matches', () => {
		expect(isDataTypeSame(1, 2)).toBe(true);
		expect(isDataTypeSame('a', 'b')).toBe(true);
		expect(isDataTypeSame(true, false)).toBe(true);
		expect(isDataTypeSame(null, null)).toBe(true);
		expect(isDataTypeSame(undefined, undefined)).toBe(true);
	});

	it('should return false if primitive data type does not match', () => {
		expect(isDataTypeSame(1, 'a')).toBe(false);
		expect(isDataTypeSame('a', true)).toBe(false);
		expect(isDataTypeSame(true, null)).toBe(false);
	});

	it('should return true if dest type is null or undefined.', () => {
		expect(isDataTypeSame(null, null)).toBe(true);
		expect(isDataTypeSame(null, undefined)).toBe(true);
		expect(isDataTypeSame(null, 1)).toBe(true);
		expect(isDataTypeSame(null, 'a')).toBe(true);
		expect(isDataTypeSame(null, true)).toBe(true);
		expect(isDataTypeSame(null, {})).toBe(true);
	});

	it('should return true if full object matches', () => {
		const src = {
			key1: {
				key2: 'value',
				key3: 12,
				key4: true,
			},
			key2: 123,
		};
		const cmp = {
			key1: {
				key2: 'value1',
				key3: 122,
				key4: false,
			},
			key2: 999,
		};
		expect(isDataTypeSame(src, cmp)).toBe(true);
	});

	it('should return false if some item in the object does not match', () => {
		const src = {
			key1: {
				key2: 'value',
				key3: 12,
				key4: true,
			},
			key2: 123,
		};
		const cmp = {
			key1: {
				key2: 1,
				key3: 122,
				key4: false,
			},
			key2: 999,
		};
		expect(isDataTypeSame(src, cmp)).toBe(false);
	});

	it('should still match if partial cmp matches', () => {
		const src = {
			key1: {
				key2: 'value',
				key3: 12,
				key4: true,
			},
			key2: 123,
		};
		const cmp = {
			key1: {
				key2: 'value1',
			},
			key2: 999,
		};
		expect(isDataTypeSame(src, cmp)).toBe(true);
	});

	it('should still match if more cmp matches', () => {
		const src = {
			key1: {
				key2: 'value',
				key3: 12,
				key4: true,
			},
			key2: 123,
		};
		const cmp = {
			key1: {
				key2: 'value1',
				key3: 33,
				key4: false,
			},
			key2: 888,
			key3: 999,
		};
		expect(isDataTypeSame(src, cmp)).toBe(true);
	});

	it('should return true when array type matches', () => {
		expect(isDataTypeSame([1, 2, 3], [1, 2])).toBe(true);
		expect(isDataTypeSame([{}], [{}])).toBe(true);
		expect(isDataTypeSame([{ a: 1 }], [{ a: 3 }])).toBe(true);
		expect(isDataTypeSame([{ a: 1 }], [{ a: 3, b: 2 }])).toBe(true);
		expect(isDataTypeSame([{ a: 1, c: 3 }], [{ a: 3 }])).toBe(true); // even though object item does not match, its type matches, it is considered as match
	});

	it('should return true when one of the array is empty', () => {
		expect(isDataTypeSame([1, 2, 3], [])).toBe(true);
		expect(isDataTypeSame([], [1, 2, 3])).toBe(true);
	});

	it('should return true when one of the array is empty', () => {
		expect(isDataTypeSame([1, 2, 3], [])).toBe(true);
		expect(isDataTypeSame([], [1, 2, 3])).toBe(true);
	});

	it('should return false when only one is array', () => {
		expect(isDataTypeSame([1, 2, 3], 1)).toBe(false);
		expect(isDataTypeSame(1, [1, 2, 3])).toBe(false);
		expect(isDataTypeSame([1, 2, 3], { 0: 1, 1: 2, 2: 3 })).toBe(false);
		expect(isDataTypeSame({ 0: 1, 1: 2, 2: 3 }, [1, 2, 3])).toBe(false);
		expect(isDataTypeSame([1, 2, 3], 1)).toBe(false);
	});

	it("should return false when first array's item does not match", () => {
		expect(isDataTypeSame([{}], [1])).toBe(false);
		expect(isDataTypeSame([1], [{}])).toBe(false);
		expect(isDataTypeSame([{ a: 1 }], [{ a: 'a' }])).toBe(false);
		expect(isDataTypeSame([1, 2, 3], { 0: 1, 1: 2, 2: 3 })).toBe(false);
		expect(isDataTypeSame({ 0: 1, 1: 2, 2: 3 }, [1, 2, 3])).toBe(false);
		expect(isDataTypeSame([1, 2, 3], 1)).toBe(false);
	});
});
