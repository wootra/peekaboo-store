import { BooType, PeekabooObj } from 'peekaboo-store';

function convertArrayToBoo<T>(peekaboo: PeekabooObj<T>, arr: readonly string[]) {
	let booSrc: any = peekaboo.data as any;
	for (const key of arr) {
		booSrc = booSrc[key];
	}
	return booSrc._boo as BooType<unknown>;
}

export { convertArrayToBoo };
