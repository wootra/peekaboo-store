import { usePeekaboo } from 'peekaboo-store/react';
import { peekaboo } from './const';

const PeekabooVal = () => {
	const val = usePeekaboo(peekaboo.data.routes.page1.value._boo);
	return <div>value: {val}</div>;
};

export default PeekabooVal;
