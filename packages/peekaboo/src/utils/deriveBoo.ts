import { createBooObj } from 'src/createBooObj';
import { createBooUid } from 'src/createBooUid';
import type { BooType, PeekabooObj } from 'src/types';
type DeriveCallback = <K>(_boo: BooType<K>) => BooType<K>;

let deriveBooIdBase = 0;

function deriveBoo<T, NEW_RESULT>(
	peekaboo: PeekabooObj<T>,
	deriveLogic: (_derive: DeriveCallback) => NEW_RESULT
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

	const deriveFunc: DeriveCallback = boo => {
		derivedBooRef.curr && boo.__waterFallRefs.add(derivedBooRef.curr);
		return boo;
	};

	deriveLogic(deriveFunc);
	const actualVal: DeriveCallback = v => v; // it does not do anything in real callback.

	derivedBooRef.curr.transform(() => deriveLogic(actualVal));

	return derivedBooRef.curr;
}

export { deriveBoo };
