import { useState } from 'react';
function Orders() {
	const [number, setNumber] = useState(0)
	return (
		<main>
			
			<h1 className="text-3xl">path: orders</h1>
			<h1>{number}</h1>
			<button
				className="button-color"
				onClick={() => setNumber((prevNumber) => prevNumber + 1)}
			>
				Click to add numbers
			</button>
			<button
				className="button-grey ml-5"
				onClick={() => setNumber((prevNumber) => prevNumber - 1)}
			>
				Click to decrease numbers
			</button>
		</main>
	);
}

export default Orders;
