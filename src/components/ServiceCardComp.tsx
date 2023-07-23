import { useState } from 'react';
import { ServiceType } from '../stores/orderStore';

type ServiceCardType = {
	serviceData: ServiceType;
	updateServiceCards: (
		id: number,
		category: 'quantity' | 'price' | 'desc',
		value: number | string
	) => void;
	deleteServiceCard: (id: number) => void;
};

const ServiceCardComp = ({ serviceData, updateServiceCards, deleteServiceCard }: ServiceCardType) => {
	const { id, name, priceRange, img, quantity, price, desc } = serviceData;
	// const [compQuantity, setCompQuantity] = useState(quantity);
	const [compPrice, setCompPrice] = useState(price.toString());
	// const [compDesc, setcompDesc] = useState(desc)

	return (
		<div
			key={`service-${id}`}
			className="w-full max-w-xs sm:w-[20rem] bg-white border shadow-sm p-3"
		>
			<div className="w-full flex items-center gap-4 mb-5">
				<div className="w-16 min-[355px]:w-20  rounded overflow-hidden">
					<img src={img} alt={name} />
				</div>
				<div>
					<p className="font-semibold mb-0.5">{name}</p>
					<p>{priceRange}</p>
				</div>
			</div>
			<p className="form-label">Harga</p>
			<div className="w-full relative">
				<input
					type="number"
					className="form-input w-full"
					value={compPrice}
					onChange={(e) => {
						setCompPrice(e.target.value);
						if (e.target.value.length > 0)
							updateServiceCards(id, 'price', parseInt(e.target.value));
					}}
				/>
				<div className="absolute mb-4 top-0 right-0 h-[2.75rem] flex items-center">
					<p className="mr-3 bg-white">x {quantity}</p>
				</div>
			</div>
			<p className="form-label">Keterangan</p>
			<input
				type="text"
				className="form-input w-full"
				value={desc}
				placeholder="tulis keterangan barang"
				onChange={(e) => updateServiceCards(id, 'desc', e.target.value)}
			/>
			<div className="flex items-center justify-evenly mt-4 mb-1">
				{quantity === 1 ? (
					<button className="text-theme-orange font-semibold" onClick={() => deleteServiceCard(id)}>Hapus Paket</button>
				) : (
					<button
						className="text-theme-orange"
						onClick={() => {
							updateServiceCards(id, 'quantity', quantity - 1)
						}}
					>
						Kurangi Paket
					</button>
				)}
				<button
					className="text-green-600"
					onClick={() =>
						updateServiceCards(id, 'quantity', quantity + 1)}
				>
					Tambah Paket
				</button>
			</div>
		</div>
	);
};

export default ServiceCardComp;
