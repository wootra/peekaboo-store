import { BooType, PeekabooObj } from '../types';

type UsageData = { __used: boolean; __allUsed: boolean; __everUsed: boolean; __allEverUsed: boolean };

function getUsageLog<U>(peekaboo: PeekabooObj<U>, nodeType: 'leaf' | 'all' | 'branch') {
	return Object.keys(peekaboo.store.booMap).reduce(
		(acc, key) => {
			const boo = peekaboo.store.booMap[key] as BooType<UsageData>;
			const id = boo.__booId;
			if (nodeType === 'all' || nodeType === boo.__booType) {
				acc[id] = {
					__used: boo.__used(),
					__allUsed: boo.__allUsed(),
					__everUsed: boo.__everUsed(),
					__allEverUsed: boo.__allEverUsed(),
				};
			}
			return acc;
		},
		{} as Record<string, UsageData>
	);
}

export { getUsageLog };
