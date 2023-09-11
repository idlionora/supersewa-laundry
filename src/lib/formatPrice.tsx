function formatPrice(price: number) {
	const priceInRupiah = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
	})
		.format(price)
		.replace(',00', '');

	return priceInRupiah;
}

export default formatPrice
