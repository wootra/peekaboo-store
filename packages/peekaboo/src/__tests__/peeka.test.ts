import { peeka } from 'src/peeka';

describe('peeka', () => {
	it('should create peeka object', () => {
		const obj = peeka({ p1: 123, p2: 223 });
		expect(obj).toEqual({
			peekabooType: 'peeka',
			init: { p1: 123, p2: 223 },
		});
	});

	it('should be a frozen object', () => {
		const obj = peeka({ p1: 123, p2: 223 });
		try {
			obj.init.p1 = 888;
		} catch (e) {
			expect((e as Error).message).toBe("Cannot assign to read only property 'p1' of object '#<Object>'");
		}
		expect(obj.init.p1).toBe(123);
	});
});
