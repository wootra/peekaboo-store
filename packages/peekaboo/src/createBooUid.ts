import type { Store } from './types';

export const createBooUid = (store: Store, booId: string) => `${store.storeId}-${booId}`;

export const createBooUidFromLayer = (store: Store, layer: string[]) => `${store.storeId}-${layer.join('.')}`;
