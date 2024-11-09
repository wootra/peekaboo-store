import { createPeekaboo } from 'src/Peekaboo';
import { _setObjByKey, _convertContentToObj, getContent, getContentAsObject } from '../content';
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
	describe('_convertContentToObj', () => {
		it('should convert content to object', () => {
			const contentObj = {
				'key1.key2': 'value',
			};
			const result = _convertContentToObj(contentObj);
			expect(result).toEqual({ key1: { key2: 'value' } });
		});
	});

	describe('_setObjByKey', () => {
		it('should set value to object by key', () => {
			const obj = {};
			const value = 'value';
			const keysArr = ['key1', 'key2'];
			const index = 0;
			_setObjByKey(obj, value, keysArr, index);
			expect(obj).toEqual({ key1: { key2: 'value' } });
		});
	});

	describe('getContent', () => {
		it('should get all contents with dot notation', () => {
			const content = getContent(store);
			expect(content).toEqual({
				'key1.key2': 'value',
				'key1.key3': 12,
				'key1.key4': true,
				key2: 123,
			});
		});
	});

	describe('getContentAsObject', () => {
		it('should get all contents as object', () => {
			const content = getContentAsObject(store);
			expect(content).toEqual(defaultVal);
		});
	});
});
