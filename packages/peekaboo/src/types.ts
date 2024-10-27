type Store = {
	storeId: `peekabooStore-${number}`;
	data: Record<string, unknown>;
	booMap: Record<string, BooType<unknown>>;
};

type PeekaType<K> = {
	peekabooType: 'peeka';
	init: K;
};

type PeekabooMap<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? PeekaType<T> : K[Key];
};

type Setter<T> = (_value: T) => void;

type BooType<T> = Readonly<{
	store: Store;
	booId: string;
	init: () => T;
	__initialize: (_newVal?: T) => void;
	get: () => T;
	set: Setter<T>;
	used: () => boolean;
	childrenSet: Set<string>;
	everUsed: () => boolean;
}>;

type UpdateDetail<T> = Readonly<{
	idSet: Set<string>;
	storeId: string;
	current: T;
}>;

type BooDataType<T> = T extends BooType<infer X> ? X : never;

type PeekabooParsed<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? BooType<T>
		: K[Key] extends string | number | boolean | null | undefined
			? BooType<K[Key]>
			: PeekabooParsed<K[Key]>;
};

type CreateSliceType<
	U extends { [Key in keyof U & `_${string}`]: U[Key] },
	T extends { [Key in keyof T & `_${string}`]: T[Key] },
	K extends PeekabooParsed<T>,
> = (_sliceFunc: (_peekabooData: PeekabooParsed<U>) => K) => K;

type PeekabooObj<U> = {
	store: Store;
	data: PeekabooParsed<U>;
};

type OrgTypes<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? T : OrgTypes<K[Key]>;
};

type PeekabooObjSourceData<U> = U extends PeekabooObj<infer T> ? OrgTypes<T> : U;

export type {
	Store,
	BooType,
	PeekabooParsed,
	PeekabooObj,
	Setter,
	PeekabooMap,
	PeekaType,
	CreateSliceType,
	BooDataType,
	PeekabooObjSourceData,
	UpdateDetail,
};
