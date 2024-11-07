import { _setObjByKey, _convertContentToObj } from '../content';

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
});
