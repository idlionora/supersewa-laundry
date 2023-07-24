import { ServiceType } from '../stores/orderStore';

export function updateServices(
	initialServices: ServiceType[] | null,
	servicesSetter: (newServices: ServiceType[] | null) => void,
	id: number,
	category: 'quantity' | 'price' | 'desc',
	value: number | string
) {
	let servicesCopy = [
		{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' },
	];
	let packageCopy = { id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' };
	let targetIndex = 0;

	if (initialServices) {
		servicesCopy = [...initialServices];
	}

	initialServices?.forEach((item, index) => {
		if (item.id === id) {
			targetIndex = index;
		}
	});

	if (initialServices !== null) {
		packageCopy = initialServices[targetIndex];
	}

	if (category === 'quantity' && typeof value === 'number') {
		packageCopy.quantity = value;
	} else if (category === 'price' && typeof value === 'number') {
		packageCopy.price = value;
	} else if (category === 'desc' && typeof value === 'string') {
		packageCopy.desc = value;
	}

	servicesCopy.splice(targetIndex, 1, packageCopy);
	servicesSetter(servicesCopy);
}
