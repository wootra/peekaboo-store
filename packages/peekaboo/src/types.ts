type Store = {
	storeId: `peekabooStore-${number}`;
	data: Record<string, unknown>;
};

type PeekaType<K> = {
	peekabooType: 'peeka';
	init: K;
};

type PeekabooMap<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? PeekaType<T> : K[Key];
};

// eslint-disable-next-line no-unused-vars
type Setter<T> = (_value: T) => void;

type BooType<T> = Readonly<{
	booId: string;
	init: T;
	get: () => T;
	set: Setter<T>;
}>;

type PeekabooParsed<K> = {
	[Key in keyof K]: K[Key] extends PeekaType<infer T> ? BooType<T> : PeekabooParsed<K[Key]>;
};

type PeekabooObj<K> = {
	store: Store;
	data: PeekabooParsed<K>;
};

export type { Store, BooType, PeekabooParsed, PeekabooObj, Setter, PeekabooMap, PeekaType };
