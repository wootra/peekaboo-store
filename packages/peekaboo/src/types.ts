type Store = {
	storeId: string;
	initData: { data: Record<string, any> }; // cloned version of init data which was used when creating Peekaboo
	snapshot: { data: Record<string, any> }; // data that will be used for the comparison
	data: Record<string, any>; // data that will be used
	booMap: Record<string, BooType<unknown>>;
	triggerDispatch: (_idSet: Set<string>, _setOptions?: BooSetOptions) => void;
};

type PeekaType<K> = {
	peekabooType: 'peeka';
	init: K;
};

type PeekabooMap<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? PeekaType<T>
		: K[Key] extends null | undefined
			? unknown
			: K[Key];
};
type PartialType<T> = T extends { [Key in keyof T]: T[Key] }
	? { [Key in keyof T]?: PartialType<T[Key]> }
	: T extends undefined | null
		? unknown
		: T;
type Setter<T> = (_value: T | PartialType<T>, _setOptions?: BooSetOptions) => void;
type UsageInfo = {
	isUsed: boolean;
	isEverUsed: boolean;
	isDirty: boolean;
};
type BooType<T> = Readonly<{
	__booType: BooNodeType;
	__store?: Store;
	__booId: string;
	__booUId: string;
	init: () => T | undefined;
	__initialize: (_newVal?: T | PartialType<T>) => void;
	__usageInfo: (_info?: Partial<UsageInfo>) => UsageInfo;
	__resetUsage: () => void;
	reset: () => void;
	isTransformed: () => boolean;
	transform: (_func: ((_orgValue: T) => T) | null) => void;
	get: () => T;
	set: Setter<T>;
	__layerKeys: string[];
	__parentBoo: BooType<unknown> | null;
	__waterFallRefs: Set<BooType<unknown>>;
}>;

type UpdateDetail = Readonly<{
	idSet?: Set<string>;
	// storeId: string;
	forceRender?: boolean;
}>;

type BooDataType<T> = T extends BooType<infer X> ? X : never;

type PeekabooParsed<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? { _boo: BooType<T> }
		: K[Key] extends string | number | boolean
			? { _boo: BooType<K[Key]> }
			: K[Key] extends null | undefined
				? { _boo: BooType<unknown> }
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
	[Key in keyof K]: K[Key] extends PeekaType<infer T>
		? T
		: K[Key] extends null | undefined
			? unknown
			: OrgTypes<K[Key]>;
};

type PartialOrgTypes<K> = {
	[Key in keyof K]?: K[Key] extends PeekaType<infer T>
		? T
		: K[Key] extends null | undefined
			? unknown
			: PartialOrgTypes<K[Key]>;
};

type PeekabooObjSourceData<U> = U extends PeekabooObj<infer T> ? OrgTypes<T> : U;
type PeekabooObjPartialSourceData<U> = U extends PeekabooObj<infer T> ? PartialOrgTypes<T> : U;

type BooNodeType = 'leaf' | 'branch' | 'derived';

type PeekabooOptions = {
	/**
	 * for server side rendering, to prevent hydrate mismatch issue.
	 */
	staticId?: string;
};

type PeekabooUpdateOptions = {
	/**
	 * @default 100
	 */
	eventOptimizeInMs: number;
};

type BooSetOptions = Partial<{
	instantDispatch: boolean;
}>;

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
	UsageInfo,
	OrgTypes,
	PartialOrgTypes,
	BooSetOptions,
	PartialType,
	PeekabooOptions,
	PeekabooUpdateOptions,
};
