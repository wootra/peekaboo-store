import { BooType } from './types';

export const validateBoo = (boo: BooType<any>) => {
	if (!boo.booId) throw new Error('booId is required');
	if (!boo.get) throw new Error('get is required');
	if (!boo.set) throw new Error('set is required');
	if (!boo.init) throw new Error('init is required');
};
