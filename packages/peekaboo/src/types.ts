type Store = {
	storeId: `peekabooStore-${number}`;
	savedData: any;
	data: Record<string, any>; // {[booUID: string]: unknow} - this is partial reference to initData
	booMap: Record<string, BooType<unknown>>;
	parentMap: Record<string, string>;
};

type PeekaType<K> = {
	peekabooType: 'peeka';
	init: K;
};

type PeekabooMap<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? PeekaType<T> : K[Key];
};

type Setter<T> = (_value: T, _eventBubling?: boolean, _ignoreUpdate?: boolean) => void;

type BooTypeBase<T> = Readonly<{
	__store: Store;
	__booId: string;
	__booUId: string;
	init: () => T;
	__initialize: (_newVal?: T) => void;

	get: () => T;
	set: Setter<T>;
	__used: () => boolean;
	__everUsed: () => boolean;
	__allUsed: () => boolean;
	__allEverUsed: () => boolean;
}>;

type BooKeyTypes<T> = keyof BooTypeBase<T> | '__booType' | '__childrenSet';

type BranchBooType<T> =
	T extends Omit<T, BooKeyTypes<T>>
		? Readonly<
				BooTypeBase<T> & {
					__booType: 'branch';
					__childrenBoo: Map<keyof T, BooType<T[keyof T]>>;
				}
			>
		: never;

type LeafBooType<T> = Readonly<
	BooTypeBase<T> & {
		__booType: 'leaf';
	}
>;

type BooType<T> = LeafBooType<T> | BranchBooType<T>;

type UpdateDetail<T> = Readonly<{
	idSet?: Set<string>;
	storeId: string;
	current?: T;
	forceRender?: boolean;
}>;

type BooDataType<T> = T extends BooType<infer X> ? X : never;

type PeekabooParsed<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? BooType<T>
		: K[Key] extends string | number | boolean | null | undefined
			? BooType<K[Key]>
			: PeekabooParsed<K[Key]> & BooType<K[Key]>;
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
	BooTypeBase,
	LeafBooType,
	BranchBooType,
	PeekabooParsed,
	PeekabooObj,
	Setter,
	PeekabooMap,
	PeekaType,
	CreateSliceType,
	BooDataType,
	PeekabooObjSourceData,
	UpdateDetail,
	BooKeyTypes,
};
