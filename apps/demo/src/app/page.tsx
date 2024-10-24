'use client';

import React, { PropsWithChildren } from 'react';
import Updated from '../components/Updated';
import { peekaboo } from '../const';
import Trigger from '../components/Trigger';
import Link from 'next/link';

export default function Page({ children }: PropsWithChildren) {
	// const dropDownIndex = useAtomValue(peeks.atoms.page1.dropDownIndex.init());

	return <div>{children}</div>;
}
