const isDataTypeSame = (dst: any, cmp: any, logKeyLevel: string[] = []) => {
	if (dst === null || dst === undefined) return true;
	if (typeof dst !== typeof cmp) {
		console.warn(
			`[${logKeyLevel.join('.')}] type is different. dst: ${typeof dst}(${dst}), cmp: ${typeof cmp}(${cmp})`
		);
		return false;
	}

	if (typeof dst === 'object' && typeof cmp === 'object') {
		if (Array.isArray(dst) && Array.isArray(cmp)) {
			const dstArr = dst as unknown[];
			const cmpArr = cmp as unknown[];
			if (dstArr.length === 0 || cmpArr.length === 0) return true;
			return isDataTypeSame(dstArr[0], cmpArr[0], [...logKeyLevel, '0']);
		} else if (Array.isArray(dst) || Array.isArray(cmp)) {
			return false; // one is array, the other is not
		}
		const keysB = Object.keys(cmp as object);
		const keysA = new Set(Object.keys(dst as object));
		for (const keyInB of keysB) {
			if (!keysA.has(keyInB)) continue; // partial object
			if (!isDataTypeSame(dst[keyInB], cmp[keyInB], [...logKeyLevel, keyInB])) {
				return false;
			}
		}
	}
	return true;
};

export { isDataTypeSame };
