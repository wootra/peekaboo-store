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
		expect(isDataTypeSame(null, undefined)).toBe(false);
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
		expect(isDataTypeSame(src, src)).toBe(true);
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
});
