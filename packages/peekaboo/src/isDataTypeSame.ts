const isDataTypeSame = (dst: any, cmp: any, logKeyLevel: string[] = []) => {
	if (typeof dst !== typeof cmp) {
		console.warn(`[${logKeyLevel.join('.')}] type is different. dst: ${typeof dst}, cmp: ${typeof cmp}`);
		return false;
	}
	if (dst === null || cmp === null) return dst === cmp;
	if (typeof dst === 'object' && typeof cmp === 'object') {
		if (Array.isArray(dst)) {
			const dstArr = dst as unknown[];
			const cmpArr = cmp as unknown[];
			if (dstArr.length === 0 || cmpArr.length === 0) return true;
			return isDataTypeSame(dstArr[0], cmpArr[0], [...logKeyLevel, '0']);
		}
		const keysB = Object.keys(cmp as object);
		const keysA = new Set(Object.keys(dst as object));
		for (let keyInB of keysB) {
			if (!keysA.has(keyInB)) continue; // partial object
			if (!isDataTypeSame(dst[keyInB], cmp[keyInB], [...logKeyLevel, keyInB])) {
				return false;
			}
		}
	}
	return true;
};

export { isDataTypeSame };
