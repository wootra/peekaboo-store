import { peeka } from 'src/peeka';
import {
	_convertContentToObj,
	_setObjByKey,
	_getObjByKey,
	syncAndCollectChanged,
	cloneInitData,
	sanitizeInitData,
	updateValuesInObjByKey,
} from 'src/transformers';

describe('transformers', () => {
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
		it('should set value to object by key when structure does not exist', () => {
			const obj = {};
			const value = 'value';
			const keysArr = ['key1', 'key2'];
			_setObjByKey(obj, value, keysArr);
			expect(obj).toEqual({ key1: { key2: 'value' } });
		});

		it('should set value to object by key when structure exists', () => {
			const obj = { key1: { key2: 'org-value' } };
			const value = 'value';
			const keysArr = ['key1', 'key2'];
			_setObjByKey(obj, value, keysArr);
			expect(obj).toEqual({ key1: { key2: 'value' } });
		});

		it('should NOT set value to object by key when key is empty', () => {
			const obj = { key1: { key2: 'org-value' } };
			const value = 'value';
			_setObjByKey(obj, value, []);
			expect(obj).toEqual({ key1: { key2: 'org-value' } });
		});

		it('should NOT set value to object by key when empty key is added', () => {
			const obj = { key1: { key2: 'org-value' } };
			const value = 'value';
			_setObjByKey(obj, value, ['']);
			expect(obj).toEqual({ key1: { key2: 'org-value' } });
		});
	});

	describe('_getObjByKey', () => {
		it('should return as it is when key is empty array', () => {
			const obj = { key1: { key2: 'value' } };
			const keysArr = [] as string[];
			expect(_getObjByKey(obj, keysArr)).toEqual(obj);
		});
		it('should get value by key', () => {
			const obj = { key1: { key2: 'value' } };
			const keysArr = ['key1', 'key2'];

			expect(_getObjByKey(obj, keysArr)).toEqual('value');
		});

		it('should get the same reference by key', () => {
			const obj = { key1: { key2: 'value' } };
			const keysArr = ['key1'];
			const ret = _getObjByKey(obj, keysArr);
			expect(ret).toEqual({ key2: 'value' });
			expect(ret).toBe(obj.key1);
		});

		it('should get undefined when key does not exist', () => {
			const obj = { key1: { key3: 'value' } };
			const keysArr = ['key1', 'key2'];

			expect(_getObjByKey(obj, keysArr)).toBeUndefined();
		});

		it('should get undefined when key does not exist', () => {
			const obj = { key1: { key3: 'value' } };
			const keysArr = ['key0', 'key2'];

			expect(_getObjByKey(obj, keysArr)).toBeUndefined();
		});
	});

	describe('syncAndCollectChanged', () => {
		const peekaObj = peeka({ p1: 123, p2: 223 });
		const peekaArr = peeka([1, 2, 3]);
		const arr = [1, 2, 3];
		const initData = { route: { a: 1, b: 2, arr, c: { d: 'a', e: true, parr: peekaArr }, p: peekaObj } };

		// eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in beforeEach
		let orgSnapshot: any;
		beforeEach(() => {
			orgSnapshot = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr.init }, p: peekaObj.init },
			};
		});
		it('should sync when not peekatype', () => {
			const changed = {
				route: { a: 21, b: 22, arr, c: { d: '2a', e: true, parr: peekaArr.init }, p: peekaObj.init },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set(['route', 'route.a', 'route.b', 'route.c', 'route.c.d']));
			expect(ret).toBeTruthy();
		});

		it('should sync when peekatype changed', () => {
			// peekatype reference is changed.
			const changed = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr.init }, p: { p1: 123, p2: 223 } },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set(['route', 'route.p']));
			expect(ret).toBeTruthy();
		});

		it('should sync when array but not peekatype', () => {
			const changed = {
				route: {
					a: 91,
					b: 92,
					arr: [1, 2, 3],
					c: { d: '9a', e: true, parr: peekaArr.init },
					p: peekaObj.init,
				},
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set(['route', 'route.arr']));
			expect(ret).toBeTruthy();
		});

		it('should sync when array is peekatype', () => {
			const changed = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: [1, 2, 3] }, p: peekaObj.init },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set(['route', 'route.c', 'route.c.parr']));
			expect(ret).toBeTruthy();
		});

		it('should sync even though partial data is updated', () => {
			const changed = {
				route: { c: { d: '9b' } },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set(['route', 'route.c', 'route.c.d']));
			expect(ret).toBeTruthy();
		});

		it('should NOT sync even though partial data is given with the same value', () => {
			const changed = {
				route: { c: { d: '9a' } },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set([]));
			expect(ret).toBeFalsy();
		});

		it('should NOT sync when nothing is changed', () => {
			const changed = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr.init }, p: peekaObj.init },
			};
			const changedSet = new Set();
			const onChanged = (keyStack: string[]) => changedSet.add(keyStack.join('.'));
			const ret = syncAndCollectChanged({
				initData,
				updatedObj: changed,
				objToSync: orgSnapshot,
				keyToUpdate: 'route',
				onChanged,
				parentKeysStacks: [],
			});
			expect(changedSet).toStrictEqual(new Set([]));
			expect(ret).toBeFalsy();
		});
	});

	describe('updateValuesInObjByKey', () => {
		const peekaObj = peeka({ p1: 123, p2: 223 });
		const peekaArr = peeka([1, 2, 3]);
		const arr = [1, 2, 3];
		const initData = {
			route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr }, p: peekaObj },
		};

		// eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in beforeEach
		let dstData: any;
		beforeEach(() => {
			dstData = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr.init }, p: peekaObj.init },
			};
		});
		it('should update value only changed', () => {
			updateValuesInObjByKey({
				initData,
				updatedObj: { route: { a: 11, c: { d: '9b' } } },
				objToSync: dstData,
				keyToUpdate: 'route',
			});
			expect(dstData).toStrictEqual({
				route: { a: 11, b: 92, arr, c: { d: '9b', e: true, parr: peekaArr.init }, p: peekaObj.init },
			});
		});
	});

	describe('cloneInitData', () => {
		it('should clone without changing peeka object', () => {
			const peekaObj = peeka({ p1: 123, p2: 223 });
			const data = { route: { a: 1, b: 2, c: peekaObj } };
			const cloned = cloneInitData(data);
			expect(cloned).toStrictEqual(data);
			expect(cloned).not.toBe(data);
			expect(cloned.route).not.toBe(data.route);
			// reference should be the same.
			expect(cloned.route.c).toBe(data.route.c);
			expect(cloned.route.c).toBe(peekaObj);
		});
	});

	describe('sanitizeInitData', () => {
		it('should pick data from peeka object', () => {
			const peekaObj = peeka({ p1: 123, p2: 223 });
			const data = { route: { a: 1, b: 2, c: peekaObj } };
			const cloned = sanitizeInitData(data);
			expect(cloned).toStrictEqual({ route: { a: 1, b: 2, c: { p1: 123, p2: 223 } } });
			expect(peekaObj.init).toBe(cloned.route.c);
		});
	});
});
