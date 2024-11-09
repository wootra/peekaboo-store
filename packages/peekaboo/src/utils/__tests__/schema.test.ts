import { _getSchemaFromObj } from 'src/utils/schema';

describe('_getSchemaFromObj', () => {
	const schemaBase = {
		key1: { key2: 'string', key3: 999, key4: 'test' },
		key2: {
			key1: false,
			key2: [9, 8, 7],
			key3: { a: 9 },
			key4: { b: 'test22' },
		},
	};
	it('should schema returns true when partial content is given', () => {
		const schema = _getSchemaFromObj(schemaBase);
		const partialContent = {
			key1: { key2: 'string', key3: 999 },
			key2: {
				key1: false,
				key2: [9, 8, 7],
				key3: { a: 9 },
			},
		};
		const result = schema.parse(partialContent);
		expect(result).toEqual({
			key1: { key2: 'string', key3: 999 },
			key2: {
				key1: false,
				key2: [9, 8, 7],
				key3: { a: 9 },
			},
		});
		expect(result).toBeTruthy();
	});

	it('should schema returns false when wrong content in obj is given', () => {
		const schema = _getSchemaFromObj(schemaBase);
		const wrongContent = {
			key1: { key2: 'string', key3: true, key4: 'test' },
			key2: {
				key1: false,
				key2: [9, 8, 7],
				key3: { a: 9 },
				key4: { b: 'test22' },
			},
		};
		expect(() => schema.parse(wrongContent)).toThrow();
	});

	it('should schema returns false when wrong content in arr is given', () => {
		const schema = _getSchemaFromObj(schemaBase);
		const wrongContent = {
			key1: { key2: 'string', key3: 999, key4: 'test' },
			key2: {
				key1: false,
				key2: [9, 'test', 7],
				key3: { a: 9 },
				key4: { b: 'test22' },
			},
		};
		expect(() => schema.parse(wrongContent)).toThrow();
	});

	it('should schema returns true, and pre-defined value when more content is given', () => {
		const schema = _getSchemaFromObj(schemaBase);
		const wrongContent = {
			key1: { key2: 'string', key3: 999, key4: 'test', key5: 'more' },
			key2: {
				key1: false,
				key2: [9, 8, 7],
				key3: { a: 9 },
				key4: { b: 'test44' },
				key5: 'more',
			},
		};
		const result = schema.parse(wrongContent);
		expect(result).toEqual({
			key1: { key2: 'string', key3: 999, key4: 'test' },
			key2: {
				key1: false,
				key2: [9, 8, 7],
				key3: { a: 9 },
				key4: { b: 'test44' },
			},
		});
		expect(result).toBeTruthy();
	});
});
