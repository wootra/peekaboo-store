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
