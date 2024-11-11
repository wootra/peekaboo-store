const isDataTypeSame = (src: any, cmp: any) => {
	if (typeof src !== typeof cmp) return false;
	if (src === null || cmp === null) return src === cmp;
	if (typeof src === 'object' && typeof cmp === 'object') {
		const keysB = Object.keys(cmp as object);
		const keysA = new Set(Object.keys(src as object));
		for (let keyInB of keysB) {
			if (!keysA.has(keyInB)) continue; // partial object
			if (!isDataTypeSame(src[keyInB], cmp[keyInB])) return false;
		}
	}
	return true;
};

export { isDataTypeSame };
