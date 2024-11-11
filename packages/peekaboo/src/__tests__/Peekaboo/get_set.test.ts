import { peeka } from 'src/peeka';
import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('set/get', () => {
		describe('single layer', () => {
			const defaultVal = { key1: 'value', key2: 123, key3: true };
			let store: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
			beforeEach(() => {
				store = createPeekaboo(defaultVal);
			});
			it('should set value', () => {
				expect(store.data.key1._boo.get()).toBe('value');
				store.data.key1._boo.set('value2');
				expect(store.data.key1._boo.get()).toBe('value2');
			});

			it('should get init value', () => {
				store.data.key1._boo.set('value2');
				expect(store.data.key1._boo.init()).toBe('value');
			});
		});

		describe('peeka and array', () => {
			const peekaObj = peeka({ p1: 123, p2: 223 });
			const peekaArr = peeka([1, 2, 3]);
			const arr = [1, 2, 3];
			const initData = {
				route: { a: 91, b: 92, arr, c: { d: '9a', e: true, parr: peekaArr }, p: peekaObj },
			};
			let store = createPeekaboo(initData);
			beforeEach(() => {
				store = createPeekaboo(initData);
			});

			it('should get array as it is', () => {
				expect(store.data.route.arr._boo.get()).toEqual([1, 2, 3]);
			});

			it('should set array with given data, update reference', () => {
				const arr2 = [3, 4, 5];
				store.data.route.arr._boo.set(arr2);
				expect(store.data.route.arr._boo.get()).toEqual(arr2);
				expect(store.data.route.arr._boo.get()).toStrictEqual(arr2);
				expect(store.data.route.arr._boo.get()).not.toStrictEqual(arr);
			});

			it('should set array with given data even though the same values, update reference', () => {
				const arr2 = [1, 2, 3];
				store.data.route.arr._boo.set(arr2);
				expect(store.data.route.arr._boo.get()).toEqual(arr2);
				expect(store.data.route.arr._boo.get()).toStrictEqual(arr2);
				expect(store.data.route.arr._boo.get()).toStrictEqual(arr);
				expect(store.data.route.arr._boo.get()).not.toBe(arr);
			});
		});

		describe('multi layers', () => {
			const defaultVal = {
				route1: { key1: 'value', key2: 123, key3: true },
				route2: { key1: 'value', key2: 123, key3: true },
				threeLayer: {
					twoLayer: { key1: 'value', key2: 123, key3: true },
				},
			};
			let store: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
			beforeEach(() => {
				store = createPeekaboo(defaultVal);
			});

			it('should get value from parent', () => {
				expect(store.data.route1._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
				expect(store.data.route2._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
			});
			it('should set value, should only affect to proper node', () => {
				expect(store.data.route1.key1._boo.get()).toBe('value');
				store.data.route1.key1._boo.set('value2');
				expect(store.data.route1.key1._boo.get()).toBe('value2');
				expect(store.data.route2.key1._boo.get()).toBe('value');
			});

			it('should set type matching value when update value is mixed with wrong type', () => {
				expect(store.data.route1._boo.get()).toStrictEqual({ key1: 'value', key2: 123, key3: true });
				// @ts-ignore
				store.data.route1._boo.set({ key1: 'changed', key2: 'wrong-type', key3: true });
				expect(store.data.route1._boo.get()).toStrictEqual({ key1: 'changed', key2: 123, key3: true });
			});

			it('should set value in parent', () => {
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value', key2: 123, key3: true },
				});
				store.data.threeLayer.twoLayer.key1._boo.set('value2');
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value2');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value2', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});
			});

			it('should set value in child', () => {
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value', key2: 123, key3: true },
				});
				store.data.threeLayer._boo.set({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value2');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value2', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});
			});

			it('should get init value from parent', () => {
				store.data.route1.key1._boo.set('value2');
				expect(store.data.route1._boo.init()).toEqual({ key1: 'value', key2: 123, key3: true });
			});

			it('should get changed value in parent', () => {
				store.data.route1.key1._boo.set('value2');

				expect(store.data.route1.key1._boo.init()).toBe('value');
			});
		});
	});
});
