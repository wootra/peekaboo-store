import { createBooObj } from '../createBooObj';
import { createBooUid } from '../createBooUid';
import type { BooType, PeekabooObj } from '../types';

let deriveBooIdBase = 0;

function deriveBoo<T, NEW_RESULT>(
	peekaboo: PeekabooObj<T>,
	deriveLogic: (_derive: <K>(_boo: BooType<K>) => K) => NEW_RESULT
): BooType<NEW_RESULT> {
	const booCount = ++deriveBooIdBase;
	const booId = `deriveBoo-${booCount}`;

	const dependencies = new Set<BooType<any>>();
	const derivedBooRef: { curr: BooType<NEW_RESULT> | null } = { curr: null };
	const unsub = () => {
		for (const dep of dependencies) {
			derivedBooRef.curr && dep.__waterFallRefs.delete(derivedBooRef.curr);
		}
	};
	derivedBooRef.curr = createBooObj(peekaboo.store, {
		booKey: createBooUid(peekaboo.store, booId),
		booType: 'derived',
		unsub,
	});

	const deriveFunc: <K>(_boo: BooType<K>) => K = boo => {
		derivedBooRef.curr && boo.__waterFallRefs.add(derivedBooRef.curr);
		return boo.get();
	};

	deriveLogic(deriveFunc);
	const actualVal: <K>(_boo: BooType<K>) => K = v => v.get(); // it does not do anything in real callback.

	derivedBooRef.curr.transform(() => deriveLogic(actualVal));

	return derivedBooRef.curr;
}

export { deriveBoo };
