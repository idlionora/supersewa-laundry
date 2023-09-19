import { useState } from 'react';
import { ServiceType } from '@stores/orderStore';
import imgList from '@lib/imgList';

type NewOrderServiceCardType = {
	serviceData: ServiceType;
	updateServiceCards: (
		id: number,
		category: 'quantity' | 'price' | 'desc',
		value: number | string
	) => void;
	deleteServiceCard: (id: number) => void;
};

const NewOrderServiceCard = ({
	serviceData,
	updateServiceCards,
	deleteServiceCard,
}: NewOrderServiceCardType) => {
	const { id, name, priceRange, img, quantity, price, desc } = serviceData;
	const [compPrice, setCompPrice] = useState(price.toString());

	function setCompPriceWithoutZeroAtFront(priceInString: string) {
		if (priceInString.length > 1 && priceInString.startsWith('0')) {
			setCompPrice(priceInString.slice(1));
		} else {
			setCompPrice(priceInString);
		}
	}

	function setParentPriceInNumber (priceInString: string) {
		if (priceInString.length > 0) {
			updateServiceCards(id, 'price', parseInt(priceInString));
		} else if (priceInString === '') {
			updateServiceCards(id, 'price', 0);
		}
	}

	return (
		<div
			key={`service-${id}`}
			className="w-full max-w-xs sm:w-[20rem] bg-white border shadow-sm p-3"
		>
			<div className="w-full flex items-center gap-4 mb-5">
				<div className="w-16 h-16 min-[355px]:w-20 min-[355px]:h-20 rounded overflow-hidden flex items-center">
					<img
						src={imgList[img as keyof typeof imgList]}
						alt={name}
						className="w-full shrink-0"
					/>
				</div>
				<div>
					<p className="font-semibold mb-0.5">{name}</p>
					<p>{priceRange}</p>
				</div>
			</div>
			<p className="form-label">Harga</p>
			<div className="w-full relative">
				<input
					id={`price-service-${id}`}
					name={`price-service-${id}`}
					type="number"
					className="form-input w-full"
					value={compPrice}
					onChange={(e) => {
						setCompPriceWithoutZeroAtFront(e.target.value)						
						setParentPriceInNumber(e.target.value)
					}}
				/>
				<div className="absolute mb-4 top-0 right-0 h-[2.75rem] flex items-center">
					<p className="pl-0.5 mr-3 bg-white">x {quantity}</p>
				</div>
			</div>
			<p className="form-label">Keterangan</p>
			<input
				id={`desc-service-${id}`}
				name={`desc-service-${id}`}
				type="text"
				className="form-input w-full"
				value={desc}
				placeholder="tulis keterangan barang"
				onChange={(e) => updateServiceCards(id, 'desc', e.target.value)}
			/>
			<div className="flex items-center justify-evenly mt-4 mb-1">
				{quantity === 1 ? (
					<button
						className="text-theme-orange font-semibold"
						onClick={() => deleteServiceCard(id)}
					>
						Hapus Paket
					</button>
				) : (
					<button
						className="text-theme-orange"
						onClick={() => {
							updateServiceCards(id, 'quantity', quantity - 1);
						}}
					>
						Kurangi Paket
					</button>
				)}
				<button
					className="text-green-600"
					onClick={() => updateServiceCards(id, 'quantity', quantity + 1)}
				>
					Tambah Paket
				</button>
			</div>
		</div>
	);
};

export default NewOrderServiceCard;
