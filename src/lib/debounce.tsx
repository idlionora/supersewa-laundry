// const debounceUpdateCards = (
// 	category: 'quantity' | 'price' | 'desc',
// 	value: number | string,
// 	countdown: number
// ) => {
// 	console.log('debounce runs!!')
// 	let timeout: NodeJS.Timeout;

// 	return () => {
// 		clearTimeout(timeout);
// 		timeout = setTimeout(() => updateServiceCards(id, category, value), countdown);
// 	};
// };

function debounce<A = unknown, R = void>(
	fn: (args: A) => R,
	ms: number
): [(args: A) => Promise<R>, () => void] {
	let timer: NodeJS.Timeout;

	const debouncedFunc = (args: A): Promise<R> =>
		new Promise((resolve) => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				resolve(fn(args));
			}, ms);
		});
	const teardown = () => clearTimeout(timer);
	return [debouncedFunc, teardown];
}

export default debounce;
