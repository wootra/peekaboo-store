export type Store = {
	storeId: `peekabooStore-${number}`;
	valueIdBase: number;
	data: Record<string, unknown>;
};

export type PeekabooMap<T> =
	T extends Readonly<
		Record<
			infer Key,
			{
				value: infer ValueType;
				children?: Record<
					infer Key2,
					{
						value: infer ValueType2;
						children?: Record<
							infer Key3,
							{
								value: infer ValueType3;
								children?: Record<
									infer Key4,
									{
										value: infer ValueType4;
										children?: Record<
											infer Key5,
											{
												value: infer ValueType5;
												children?: Record<
													infer Key6,
													{
														value: infer ValueType6;
														children?: Record<
															infer Key7,
															{
																value: infer ValueType7;
															}
														>;
													}
												>;
											}
										>;
									}
								>;
							}
						>;
					}
				>;
			}
		>
	>
		? Readonly<
				Record<
					Key,
					{
						value: ValueType;
						children?: Record<
							Key2,
							{
								value: ValueType2;
								children?: Record<
									Key3,
									{
										value: ValueType3;
										children?: Record<
											Key4,
											{
												value: ValueType4;
												children?: Record<
													Key5,
													{
														value: ValueType5;
														children?: Record<
															Key6,
															{
																value: ValueType6;
																children?: Record<
																	Key7,
																	{
																		value: ValueType7;
																	}
																>;
															}
														>;
													}
												>;
											}
										>;
									}
								>;
							}
						>;
					}
				>
			>
		: Readonly<
				Record<
					string,
					{
						value: unknown;
						children?: Record<
							string,
							{
								value: unknown;
								children?: Record<
									string,
									{
										value: unknown;
										children?: Record<
											string,
											{
												value: unknown;
												children?: Record<
													string,
													{
														value: unknown;
														children?: Record<
															string,
															{
																value: unknown;
																children?: Record<
																	string,
																	{
																		value: unknown;
																	}
																>;
															}
														>;
													}
												>;
											}
										>;
									}
								>;
							}
						>;
					}
				>
			>;

// eslint-disable-next-line no-unused-vars
export type Setter<T> = (_value: T) => void;

export type PeekabooValue<T> = {
	valueId: string;
	init: T;
	get: () => T;
	set: Setter<T>;
};

export type PeekabooObj<T> =
	T extends Readonly<
		Record<
			infer Key,
			{
				value: infer ValueType;
				children?: Record<
					infer Key2,
					{
						value: infer ValueType2;
						children?: Record<
							infer Key3,
							{
								value: infer ValueType3;
								children?: Record<
									infer Key4,
									{
										value: infer ValueType4;
										children?: Record<
											infer Key5,
											{
												value: infer ValueType5;
												children?: Record<
													infer Key6,
													{
														value: infer ValueType6;
														children?: Record<
															infer Key7,
															{
																value: infer ValueType7;
															}
														>;
													}
												>;
											}
										>;
									}
								>;
							}
						>;
					}
				>;
			}
		>
	>
		? {
				store: Store;
				data: Readonly<
					Record<
						Key,
						{
							value: PeekabooValue<ValueType>;
							children?: Record<
								Key2,
								{
									value: PeekabooValue<ValueType2>;
									children?: Record<
										Key3,
										{
											value: PeekabooValue<ValueType3>;
											children?: Record<
												Key4,
												{
													value: PeekabooValue<ValueType4>;
													children?: Record<
														Key5,
														{
															value: PeekabooValue<ValueType5>;
															children?: Record<
																Key6,
																{
																	value: PeekabooValue<ValueType6>;
																	children?: Record<
																		Key7,
																		{
																			value: PeekabooValue<ValueType7>;
																		}
																	>;
																}
															>;
														}
													>;
												}
											>;
										}
									>;
								}
							>;
						}
					>
				>;
			}
		: never;
