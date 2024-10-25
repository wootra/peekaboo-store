import { PeekabooObj, PeekabooParsed } from '../types';

type MapOrBoolean = Record<string, boolean> | boolean;
type RecurrsiveLogMap = Record<string, MapOrBoolean | Record<string, MapOrBoolean>>;

function getUsageLog(peekaboo: PeekabooObj<Record<string, any>>) {
	const logs = {} as RecurrsiveLogMap;
	const recurrsiveLogging = (data: Record<string, PeekabooParsed<any>>, child: RecurrsiveLogMap) => {
		Object.keys(data).forEach(key => {
			if (data[key] && typeof data[key] === 'object') {
				if ('used' in data[key] && typeof data[key].used === 'function') {
					child[key] = (data[key].used as () => boolean)() as boolean;
				} else {
					child[key] = {};
					recurrsiveLogging(data[key] as Record<string, PeekabooParsed<any>>, child[key]);
				}
			}
		});
	};
	recurrsiveLogging(peekaboo.data as Record<string, PeekabooParsed<any>>, logs);
	return logs;
}

export { getUsageLog };
