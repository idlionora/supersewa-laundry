import { useState } from 'react';
function Orders() {
	const [number, setNumber] = useState(0)
	return (
		<>
			<div
				id="fade-screen"
				className="hidden fixed top-0 left-0 z-[7] w-screen h-screen bg-black opacity-30"
			/>
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
		</>
	);
}

export default Orders;
