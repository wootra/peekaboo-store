import { createPeekaboo } from 'src/Peekaboo';
import { updatePeekaboo } from 'src/utils/update';
const defaultVal = {
	test1: 1,
	test2: 2,
	test3: {
		test31: '31',
		test32: '32',
	},
};

describe('update', () => {
	describe('updatePeekaboo', () => {
		let testStore: ReturnType<typeof createPeekaboo<typeof defaultVal>>;
		beforeEach(() => {
			testStore = createPeekaboo(defaultVal);
		});
		it('init', () => {
			expect(testStore.data.test1._boo.get()).toBe(defaultVal.test1);
			expect(testStore.data.test2._boo.get()).toBe(defaultVal.test2);
			expect(testStore.data.test3.test31._boo.get()).toBe(defaultVal.test3.test31);
			expect(testStore.data.test3.test32._boo.get()).toBe(defaultVal.test3.test32);
		});
		it('should update peekaboo', () => {
			const converted = {
				test1: 11,
				test3: {
					test31: '311',
				},
			};
			updatePeekaboo(testStore, converted);

			expect(testStore.data.test1._boo.get()).toBe(converted.test1);
			expect(testStore.data.test2._boo.get()).toBe(defaultVal.test2);
			expect(testStore.data.test3.test31._boo.get()).toBe(converted.test3.test31);
			expect(testStore.data.test3.test32._boo.get()).toBe(defaultVal.test3.test32);
		});
	});
});
