import { createPeekaboo } from 'src/Peekaboo';

describe('Peekaboo', () => {
	describe('set/get', () => {
		describe('single layer', () => {
			const defaultVal = { key1: 'value', key2: 123, key3: true };

			// eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in beforeEach
			let store: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
			beforeEach(() => {
				store = createPeekaboo(defaultVal);
			});

			it('should initialize value with init value', () => {
				store.data.key1._boo.set('value2');
				store.data.key1._boo.__initialize();
				expect(store.data.key1._boo.get()).toBe('value');
			});

			it('should initialize value with new value', () => {
				store.data.key1._boo.set('value2');
				store.data.key1._boo.__initialize('value3');
				expect(store.data.key1._boo.get()).toBe('value3');
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
			// eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in beforeEach
			let store: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
			beforeEach(() => {
				store = createPeekaboo(defaultVal);
			});
			it('should set value in child', () => {
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value', key2: 123, key3: true },
				});

				// check used status
				expect(store.data.threeLayer.twoLayer.key1._boo.__used()).toEqual(true);
				expect(store.data.threeLayer.twoLayer._boo.__everUsed()).toEqual(true);

				store.data.threeLayer._boo.__initialize({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});

				// check used status unset
				expect(store.data.threeLayer.twoLayer.key1._boo.__used()).toEqual(false);
				expect(store.data.threeLayer.twoLayer.key1._boo.__everUsed()).toEqual(true);
				expect(store.data.threeLayer.twoLayer._boo.__used()).toEqual(false);
				expect(store.data.threeLayer.twoLayer._boo.__everUsed()).toEqual(true);

				// check if value is set
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value2');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value2', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});
			});

			it('should set value in parent', () => {
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value', key2: 123, key3: true },
				});
				store.data.threeLayer.twoLayer.key1._boo.__initialize('value2');
				expect(store.data.threeLayer.twoLayer.key1._boo.get()).toEqual('value2');
				expect(store.data.threeLayer.twoLayer._boo.get()).toEqual({ key1: 'value2', key2: 123, key3: true });
				expect(store.data.threeLayer._boo.get()).toEqual({
					twoLayer: { key1: 'value2', key2: 123, key3: true },
				});
			});
		});
	});
});
