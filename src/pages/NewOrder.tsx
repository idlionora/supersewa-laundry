import { useState } from 'react';
import CustomerSearch from '../components/CustomerSearch';
import { ServiceType, useTrackedOrderStore } from '../stores/orderStore';
import useTrackedModalStore from '../stores/modalStore';
import imgDefault from '../assets/image-default.png';
import imgHighChair from '../assets/high-chair.jpeg'
import imgStrollerMd from '../assets/stroller-medium.jpeg'
import ServiceCardComp from '../components/ServiceCardComp';

const serviceTest = [
	{
		id: 2,
		name: 'Stroller Medium',
		priceRange: '129 - 159k',
		img: imgStrollerMd,
		quantity: 1,
		price: 0,
		desc: '',
	},
	{
		id: 12,
		name: 'Gendongan',
		priceRange: '79 - 119k',
		img: imgDefault,
		quantity: 1,
		price: 0,
		desc: '',
	},
	{
		id: 15,
		name: 'High Chair',
		priceRange: '79 - 119k',
		img: imgHighChair,
		quantity: 1,
		price: 0,
		desc: '',
	},
];

function NewOrder() {
	const store = useTrackedOrderStore();
	const modalState = useTrackedModalStore();
	const [serviceCards, setServiceCards] = useState<ServiceType[] | null>(serviceTest);

	function updateServiceCards(
		id: number,
		category: 'quantity' | 'price' | 'desc',
		value: number | string
	) {
		let servicesCopy = [
			{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' },
		];
		let packageCopy = {
			id: 0,
			name: '',
			priceRange: '',
			img: '',
			quantity: 1,
			price: 0,
			desc: '',
		};
		let targetIndex = 0;

		if (serviceCards) {
			servicesCopy = [...serviceCards];
		}

		serviceCards?.forEach((item, index) => {
			if (item.id === id) {
				targetIndex = index;
			}
		});

		if (serviceCards !== null) {
			packageCopy = serviceCards[targetIndex];
		}

		if (category === 'quantity' && typeof value === 'number') {
			packageCopy.quantity = value;
		} else if (category === 'price' && typeof value === 'number') {
			packageCopy.price = value;
		} else if (category === 'desc' && typeof value === 'string') {
			packageCopy.desc = value;
		}

		servicesCopy.splice(targetIndex, 1, packageCopy);
		setServiceCards(servicesCopy);
	}

	function deleteServiceCard (id: number) {
		let servicesCopy = [
			{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' },
		];
		let targetIndex = 0

		if (serviceCards) {
			servicesCopy = [...serviceCards];
		}

		serviceCards?.forEach((item, index) => {
			if (item.id === id) {
				targetIndex = index;
			}
		});

		servicesCopy.splice(targetIndex, 1)
		setServiceCards(servicesCopy)
	}

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Data Umum
				</h3>
				<div className="card-white px-4 pt-4 pb-5 flex flex-col items-center">
					<div className="w-full max-w-xl">
						<div className="w-full flex justify-between items-center">
							<h4 className="">Pelanggan</h4>
							<button
								className="pt-2 font-semibold text-green-600"
								onClick={() => modalState.openModal(<CustomerSearch />, 'full')}
							>
								{store.customer.id === 0 ? 'Pilih Kontak' : 'Ganti Kontak'}
							</button>
						</div>
						<div
							className={`w-full border bg-neutral-50 rounded p-3 flex gap-3 sm:items-center mb-4 mt-1 ${
								store.customer.id === 0 ? 'border-green-600' : ''
							}`}
						>
							{store.customer.id !== 0 ? (
								<>
									<div
										className={`relative top-1.5 sm:top-auto shrink-0  rounded-full ${store.customer.img} text-white w-10 h-10 font-medium text-sm flex justify-center items-center`}
									>
										{store.customer.name[0]}
									</div>
									<div className="w-full">
										<div className="sm:mb-1.5">
											<p className="font-semibold sm:inline mr-2 mb-0.5">
												{store.customer.name}
											</p>
											<span className="mr-2 hidden sm:inline">–</span>
											<p className=" sm:inline mb-0.5">
												{store.customer.phone}
											</p>
										</div>
										<p>{store.customer.address}</p>
									</div>
								</>
							) : (
								<p className="w-full text-center">
									Silakan pilih pelanggan terlebih dahulu.
								</p>
							)}
						</div>
						<h4>Durasi Layanan</h4>
						<div className="w-full grid grid-cols-12 gap-x-4">
							<div className="col-span-12 min-[355px]:col-span-8">
								<p className="form-label">Tanggal Masuk</p>
								<input type="text" className="form-input w-full" />
							</div>
							<div className="col-span-12 min-[355px]:col-span-4">
								<p className="form-label">Waktu Masuk</p>
								<input
									type="text"
									className="form-input w-full max-w-[7.5rem] min-[355px]:max-w-full"
								/>
							</div>
						</div>
						<div className="w-full grid grid-cols-12 gap-x-4">
							<div className="col-span-12 min-[355px]:col-span-8">
								<p className="form-label">Tanggal Keluar</p>
								<input type="text" className="form-input w-full" />
							</div>
							<div className="col-span-12 min-[355px]:col-span-4">
								<p className="form-label">Waktu Keluar</p>
								<input
									type="text"
									className="form-input w-full max-w-[7.5rem] min-[355px]:max-w-full"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Rincian Cuci
				</h3>
				<div className="card-white px-4 pt-4 pb-5 flex flex-col items-center">
					<div className="w-full max-w-xl">
						<div className="w-full flex justify-between items-center">
							<h4>Layanan</h4>
							<button
								className="pt-2 font-semibold text-green-600"
								onClick={() => modalState.openModal(<CustomerSearch />, 'full')}
							>
								Tambah Layanan
							</button>
						</div>
						<div
							id="service-container"
							className={`w-full border bg-neutral-50 rounded mb-4 mt-1 sm:overflow-x-hidden ${
								!serviceCards ? 'border-green-600' : ''
							}`}
						>
							<div
								id="service-frame"
								className="relative overflow-x-auto overflow-y-hidden sm:h-[22.5rem] w-full"
							>
								<div
									id="service-slide"
									className={`flex flex-col sm:flex-row flex-nowrap gap-1 items-center sm:absolute ${
										serviceCards ? 'p-1' : 'p-3'
									}`}
								>
									{serviceCards ? (
										serviceCards.map((serviceData) => (
											<ServiceCardComp
												key={`service-${serviceData.id}`}
												serviceData={serviceData}
												updateServiceCards={updateServiceCards}
												deleteServiceCard={deleteServiceCard}
											/>
										))
									) : (
										<p className="w-full text-center">
											Silakan tambah produk terlebih dahulu.
										</p>
									)}
								</div>
							</div>
						</div>

						<h4>Tagihan</h4>
						<div className="w-full h-60"></div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default NewOrder;
