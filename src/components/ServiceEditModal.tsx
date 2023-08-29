import { useEffect, useState } from 'react';
import { DataInsertAndMarkPosition } from '../lib/typesForComponents.tsx';
import useTrackedModalStore from '../stores/modalStore';
import { ServiceType, useTrackedOrderStore } from '../stores/orderStore.tsx';
import imgList from '../lib/imgList.tsx';
import iconClose from '../assets/icon-x.svg';
import iconExclamation from '../assets/icon-exclamation-circle.svg';

const ServiceEditModal = ({ data, childNum }: DataInsertAndMarkPosition<ServiceType>) => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();

	const { id, name, priceRange, img, quantity, price, desc } = data;
	const [formInput, setFormInput] = useState({ quantity, price: price.toString(), desc });
	const [isPriceEmpty, setIsPriceEmpty] = useState(false);
	const index =
		childNum === 'first'
			? 0
			: childNum === 'last'
			? orderStore.services!.length - 1
			: childNum - 1;

	function editService() {
		let editedService: ServiceType = data;
		let newServices: ServiceType[] | null = [...orderStore.services!];

		if (formInput.quantity < 1) {
			if (newServices.length < 2) {
				newServices = null;
			} else {
				newServices.splice(index, 1);
			}
			orderStore.setServices(newServices);
			state.closeModal();
			return;
		}

		if (formInput.price.length < 1 || formInput.price === '0') {
			setIsPriceEmpty(true);
			return;
		}

		editedService = {
			id,
			name,
			priceRange,
			img,
			quantity: formInput.quantity,
			price: parseInt(formInput.price),
			desc: formInput.desc,
		};

		newServices.splice(index, 1, editedService);
		orderStore.setServices(newServices);
		state.closeModal();
		return;
	}

	useEffect(() => {
		if (isPriceEmpty) {
			setIsPriceEmpty(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formInput.price]);

	return (
		<div
			className="bg-white w-full max-w-md h-fit min-[448px]:max-h-[85%] sm:max-h-[33.75rem] min-[448px]:rounded-md overflow-auto relative p-4"
			onClick={(e) => e.stopPropagation()}
		>
			<button className="absolute right-4 top-4" onClick={() => state.closeModal()}>
				<img src={iconClose} alt="Tutup Panel" className="w-5" />
			</button>
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
					id="price-service-edit"
					name="price-service-edit"
					type="number"
					className={`form-input w-full ${isPriceEmpty ? 'form-invalid' : ''}`}
					value={formInput.price}
					onChange={(e) => setFormInput({ ...formInput, price: e.target.value })}
				/>
				<div className="absolute mb-4 top-0 right-0 h-[2.75rem] flex items-center">
					<p className="mr-3 bg-white">x {formInput.quantity}</p>
				</div>
			</div>
			<p className="form-label">Keterangan</p>
			<input
				id="desc-service-edit"
				name="desc-service-edit"
				type="text"
				className="form-input w-full"
				value={formInput.desc}
				placeholder="tulis keterangan barang"
				onChange={(e) => setFormInput({ ...formInput, desc: e.target.value })}
			/>
			<div className="flex items-center justify-around pt-1 pb-2">
				<button
					className={formInput.quantity > 0 ? 'text-theme-orange' : 'text-gray-400'}
					onClick={() => setFormInput({ ...formInput, quantity: formInput.quantity - 1 })}
					disabled={formInput.quantity === 0}
				>
					Kurangi Paket
				</button>
				<button
					className="text-green-600"
					onClick={() => 
						setFormInput({ ...formInput, quantity: formInput.quantity + 1 })}
				>
					Tambah Paket
				</button>
			</div>
			{isPriceEmpty ? (
				<div className="w-full flex text-red-900 font-medium p-4 border border-red-300 rounded bg-red-100 mb-2">
					<img
						src={iconExclamation}
						alt="Exclamation"
						className="w-5 mr-2"
						style={{
							filter: 'invert(19%) sepia(68%) saturate(6140%) hue-rotate(353deg) brightness(93%) contrast(85%)',
						}}
					/>
					<p>isilah kolom harga terlebih dahulu</p>
				</div>
			) : (
				''
			)}
			<div className="w-full flex justify-center mt-2">
				<button
					className={`button-color ${
						formInput.quantity < 1 ? 'bg-theme-orange border-red-500' : ''
					}`}
					onClick={() => editService()}
				>
					{formInput.quantity < 1 ? 'Hapus Pesanan' : 'Simpan Pesanan'}
				</button>
			</div>
		</div>
	);
};

export default ServiceEditModal;
