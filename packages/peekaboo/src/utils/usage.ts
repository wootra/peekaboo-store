import { BooNodeType, BooType, PeekabooObj } from '../types';

type UsageData = { __used: boolean; __allUsed: boolean; __everUsed: boolean; __allEverUsed: boolean };

type IncludeType = 'all' | 'used' | 'everUsed' | 'unused' | 'neverUsed';
function getUsageLog<U>(peekaboo: PeekabooObj<U>, nodeType: BooNodeType = 'all', includes: IncludeType = 'unused') {
	return Object.keys(peekaboo.store.booMap).reduce(
		(acc, key) => {
			const boo = peekaboo.store.booMap[key] as BooType<UsageData>;
			const id = boo.__booId;
			if (nodeType === 'all' || nodeType === boo.__booType) {
				const toInclude = {
					__used: boo.__used(),
					__allUsed: boo.__allUsed(),
					__everUsed: boo.__everUsed(),
					__allEverUsed: boo.__allEverUsed(),
				};

				if (includes === 'all') {
					acc[id] = toInclude;
				} else if (includes === 'used' && boo.__used()) {
					acc[id] = toInclude;
				} else if (includes === 'everUsed' && boo.__everUsed()) {
					acc[id] = toInclude;
				} else if (includes === 'unused' && !boo.__used()) {
					acc[id] = toInclude;
				} else if (includes === 'neverUsed' && !boo.__everUsed()) {
					acc[id] = toInclude;
				}
			}
			return acc;
		},
		{} as Record<string, UsageData>
	);
}

export type { BooNodeType, IncludeType };
export { getUsageLog };
