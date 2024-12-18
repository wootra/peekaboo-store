/* eslint-disable @typescript-eslint/max-params -- wrapper */
import { peeka } from 'src/peeka';
import { createPeekaboo } from 'src/Peekaboo';
import { reinitialize } from 'src/reinitialize';

const reinitializeWrapper = (
	store: any,
	initData: any,
	updatedObj: any,
	keyToUpdate: string,
	parentKeysStacks: string[]
) => {
	reinitialize({ store, initData, updatedObj, keyToUpdate, parentKeysStacks });
};

describe('reinitialize', () => {
	const peekaObj = { a: 1 };
	const arr = [1, 2, 3];
	let defaultVal = { route1: { sub: { key1: 'value', key2: 123, peeka: peeka(peekaObj), arr } } };
	let defaultPureVal = { route1: { sub: { key1: 'value', key2: 123, peeka: peekaObj, arr } } };
	let peekaboo = createPeekaboo(defaultVal);
	beforeEach(() => {
		defaultVal = { route1: { sub: { key1: 'value', key2: 123, peeka: peeka(peekaObj), arr } } };
		defaultPureVal = { route1: { sub: { key1: 'value', key2: 123, peeka: peekaObj, arr } } };
		peekaboo = createPeekaboo(defaultVal);
	});
	it('should re-initializ when new value is given', () => {
		const boo = peekaboo.data.route1.sub.key1._boo;
		expect(boo.__usageInfo().isUsed).toBe(false);
		expect(boo.get()).toBe('value'); // when reading, __used() is set to true
		expect(boo.init()).toBe('value'); // when reading, __used() is set to true
		expect(boo.__usageInfo().isUsed).toBe(true);

		reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1, { key1: 'value2' }, 'sub', [
			'data',
			'route1',
		]);
		expect(boo.__usageInfo().isUsed).toBe(false);
		expect(boo.get()).toBe('value'); // value stays as it is. should use set to update value.
		expect(boo.init()).toBe('value2'); // only init is updated
		expect(boo.__usageInfo().isUsed).toBe(true);
	});

	it('should re-initializ with full structure', () => {
		const boo = peekaboo.data._boo;

		expect(boo.__usageInfo().isUsed).toBe(false);
		expect(boo.get()).toStrictEqual(defaultPureVal); // when reading, __used() is set to true
		expect(boo.init()).toStrictEqual(defaultPureVal); // when reading, __used() is set to true
		expect(boo.__usageInfo().isUsed).toBe(true);
		const changed = { route1: { sub: { key1: 'value1', key2: 999, peeka: peekaObj, arr } } };
		reinitializeWrapper(peekaboo.store, peekaboo.store.initData, changed, 'data', []);
		expect(boo.__usageInfo().isUsed).toBe(false);
		expect(boo.get()).toStrictEqual(defaultPureVal); // value stays as it is. should use set to update value.
		expect(boo.init()).toStrictEqual(changed); // only init is updated
		expect(boo.__usageInfo().isUsed).toBe(true);
	});
	it('should throw Error when object is not given', () => {
		expect(() => {
			reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.key1, 1, 'key1', [
				'data',
				'route1',
				'sub',
				'key1',
			]);
		}).toThrow('wrong usage. should be used only for object type since its reference should be updated.');
	});

	it('should throw Error when key or array is not valid', () => {
		expect(() => {
			reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.sub, 1, 'key1', ['data']);
		}).toThrow();
	});

	it('should update peeka object when value is different', () => {
		expect(peekaboo.data.route1.sub.peeka._boo.init()).toStrictEqual({ a: 1 });
		reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.sub, { a: 3 }, 'peeka', [
			'data',
			'route1',
			'sub',
		]);
		expect(peekaboo.data.route1.sub.peeka._boo.init()).toStrictEqual({ a: 3 });
		expect(peekaboo.data.route1.sub.peeka._boo.get()).toStrictEqual({ a: 1 });
	});

	it('should NOT update peeka object when value type is different', () => {
		expect(peekaboo.data.route1.sub.peeka._boo.init()).toStrictEqual({ a: 1 });
		reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.sub, { a: '3' }, 'peeka', [
			'data',
			'route1',
			'sub',
		]);
		expect(peekaboo.data.route1.sub.peeka._boo.init()).toStrictEqual({ a: 1 });
		expect(peekaboo.data.route1.sub.peeka._boo.get()).toStrictEqual({ a: 1 });
	});

	it('should update array when value is different', () => {
		expect(peekaboo.data.route1.sub.arr._boo.init()).toStrictEqual([1, 2, 3]);
		reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.sub, [1, 2, 4], 'arr', [
			'data',
			'route1',
			'sub',
		]);
		expect(peekaboo.data.route1.sub.arr._boo.init()).toStrictEqual([1, 2, 4]);
		expect(peekaboo.data.route1.sub.arr._boo.get()).toStrictEqual([1, 2, 3]);
		expect(peekaboo.data.route1.sub.arr._boo.init()).not.toBe(defaultVal.route1.sub.arr);
	});

	it('should NOT update array when value is same', () => {
		expect(peekaboo.data.route1.sub.arr._boo.init()).toStrictEqual([1, 2, 3]);
		reinitializeWrapper(peekaboo.store, peekaboo.store.initData.data.route1.sub, defaultVal.route1.sub.arr, 'arr', [
			'data',
			'route1',
			'sub',
		]);
		expect(peekaboo.data.route1.sub.arr._boo.init()).toStrictEqual([1, 2, 3]);
		expect(peekaboo.data.route1.sub.arr._boo.get()).toStrictEqual([1, 2, 3]);
		expect(peekaboo.data.route1.sub.arr._boo.init()).toBe(defaultVal.route1.sub.arr);
	});
});
