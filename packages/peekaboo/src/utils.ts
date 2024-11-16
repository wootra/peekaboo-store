/* eslint-disable @typescript-eslint/no-unnecessary-condition -- validation code. */
import type { BooType } from './types';

export const validateBoo = (boo: BooType<any>) => {
	if (!boo.__booId) throw new Error('__booId is required');
	if (!boo.get) throw new Error('get is required');
	if (!boo.set) throw new Error('set is required');
	if (!boo.init) throw new Error('init is required');
};
