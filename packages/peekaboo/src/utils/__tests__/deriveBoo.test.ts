import { createPeekaboo } from 'src/Peekaboo';
import { deriveBoo } from '../deriveBoo';
import { peeka } from 'src/peeka';

describe('deriveBoo', () => {
	describe('from branch boo', () => {
		const defaultData = {
			key1: 'value',
			key2: 123,
			key3: {
				key31: 'value331',
				key32: 332,
				arr: [1, 2, 3],
				peeka: peeka({ a: 1 }),
			},
			key4: {
				key31: 'value431',
				key32: 432,
				arr: [1, 2, 3],
				peeka: peeka({ a: 1 }),
			},
		};
		it('should create derivedBoo', () => {
			const peekaboo = createPeekaboo(defaultData);
			const branch1 = peekaboo.data.key3;
			const branch2 = peekaboo.data.key4;

			const derivedBoo = deriveBoo(derive => {
				const ret1 = derive(branch1._boo);
				const ret2 = derive(branch2._boo);
				return {
					newRet: ret1.key31 + ret1.key32,
					newRet2: ret2.key31 + ret2.key32,
				};
			});

			expect(derivedBoo.get()).toStrictEqual({
				newRet: 'value331332',
				newRet2: 'value431432',
			});

			branch1._boo.set({ key31: 'new1', key32: 99 });

			expect(derivedBoo.get()).toStrictEqual({
				newRet: 'new199',
				newRet2: 'value431432',
			});

			branch2._boo.set({ key31: 'new2', key32: 88 });

			expect(derivedBoo.get()).toStrictEqual({
				newRet: 'new199',
				newRet2: 'new288',
			});
		});
	});

	describe('from leaf boo', () => {
		const defaultData = {
			key1: 'value',
			key2: 123,
			key3: {
				key31: 'value331',
				key32: 332,
				arr: [1, 2, 3],
				peeka: peeka({ a: 1 }),
			},
			key4: {
				key31: 'value431',
				key32: 432,
				arr: [1, 2, 3],
				peeka: peeka({ a: 1 }),
			},
		};
		it('should create derivedBoo', () => {
			const peekaboo = createPeekaboo(defaultData);
			const leaf1 = peekaboo.data.key1;
			const leaf2 = peekaboo.data.key2;

			const derivedBoo = deriveBoo(derive => {
				const ret1 = derive(leaf1._boo);
				const ret2 = derive(leaf2._boo);
				return {
					newRet: ret1 + ret2,
				};
			});

			expect(derivedBoo.get()).toStrictEqual({
				newRet: 'value123',
			});

			leaf1._boo.set('new1');
			leaf2._boo.set(99);
			expect(derivedBoo.get()).toStrictEqual({
				newRet: 'new199',
			});
		});
	});
});
