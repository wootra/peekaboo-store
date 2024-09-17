import {Peekaboo} from 'peekaboo';
import type {PeekabooMap} from 'peekaboo';
const obj = Object.freeze({
  test1: {
    value: 1
  },
  test2: {
    value: 2,
  }
});

const peekaboo = Peekaboo(obj);


export default function Page() {
	return (
		<>
			<h1>Web</h1>
			<Button>Boop</Button>
		</>
	);
}
