type Store = {
	storeId: `peekabooStore-${number}`;
	initData: { data: Record<string, any> }; // cloned version of init data which was used when creating Peekaboo
	snapshot: { data: Record<string, any> }; // data that will be used for the comparison
	data: Record<string, any>; // data that will be used
	booMap: Record<string, BooType<unknown>>;
	hookRegisteredCount: (_id: string) => number; // key: booUId, value: count of register
	registerHook: (_boo: BooType<any>) => void;
	unregisterHook: (_boo: BooType<any>) => void;
};

type PeekaType<K> = {
	peekabooType: 'peeka';
	init: K;
};

type PeekabooMap<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? PeekaType<T> : K[Key];
};
type PartialType<T> = T extends { [Key in keyof T]: T[Key] } ? { [Key in keyof T]?: PartialType<T[Key]> } : T;
type Setter<T> = (_value: T | PartialType<T>) => void;

type BooType<T> = Readonly<{
	__booType: BooNodeType;
	__store: Store;
	__booId: string;
	__booUId: string;
	init: () => T;
	__initialize: (_newVal?: T | PartialType<T>) => void;
	__resetUsage: () => void;
	reset: () => void;
	isDerived: () => boolean;
	get: () => T;
	set: Setter<T>;
	__layerKeys: string[];
	__parentBoo: BooType<any> | null;
	__used: () => boolean;
	__everUsed: () => boolean;
	__allUsed: () => boolean;
	__allEverUsed: () => boolean;
	__waterFallRefs: Set<BooType<any>>;
	__appendWaterFallSet: (_boo: BooType<any>) => void;
}>;

type UpdateDetail<T> = Readonly<{
	idSet?: Set<string>;
	storeId: string;
	current?: T;
	forceRender?: boolean;
}>;

type BooDataType<T> = T extends BooType<infer X> ? X : never;

type PeekabooParsed<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? { _boo: BooType<T> }
		: K[Key] extends string | number | boolean | null | undefined
			? { _boo: BooType<K[Key]> }
			: PeekabooParsed<K[Key]> & { _boo: BooType<K[Key]> };
} & { _boo: BooType<K> };

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

type PartialOrgTypes<K> = {
	[Key in keyof K]?: K[Key] extends PeekaType<infer T> ? T : PartialOrgTypes<K[Key]>;
};

type PeekabooObjSourceData<U> = U extends PeekabooObj<infer T> ? OrgTypes<T> : U;
type PeekabooObjPartialSourceData<U> = U extends PeekabooObj<infer T> ? PartialOrgTypes<T> : U;

type BooNodeType = 'leaf' | 'branch';

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
	PeekabooObjPartialSourceData,
	UpdateDetail,
	BooNodeType,
	OrgTypes,
	PartialOrgTypes,
	PartialType,
};
