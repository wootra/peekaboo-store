import { peekaboo } from './const';

const PeekabooTrigger = () => {
	const onChangeUp = () => {
		peekaboo.data.routes.page1.value._boo.set(peekaboo.data.routes.page1.value._boo.get() + 1);
	};
	const onChangeDown = () => {
		peekaboo.data.routes.page1.value._boo.set(peekaboo.data.routes.page1.value._boo.get() - 1);
	};
	return (
		<div>
			<button onClick={onChangeUp}> + </button>
			<button onClick={onChangeDown}> - </button>
		</div>
	);
};

export default PeekabooTrigger;
