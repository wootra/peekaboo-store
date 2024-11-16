import type { Store } from './types';

export const createBooUid = (store: Store | undefined, booId: string) => `${store?.storeId ?? 'no-store'}-${booId}`;

export const createBooUidFromLayer = (store: Store | undefined, layer: string[]) =>
	`${store?.storeId ?? 'no-store'}-${layer.join('.')}`;
