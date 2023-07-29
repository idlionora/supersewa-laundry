import React from 'react';
import { useEffect, useState } from 'react';
import { ServiceType, FeeType, useTrackedOrderStore } from '../stores/orderStore';
import CustomerSearch from '../components/CustomerSearch';
import ServiceSearch from '../components/ServiceSearch.tsx';
import AddFeeModal from '../components/AddFeeModal.tsx';
import useTrackedModalStore from '../stores/modalStore';
import iconClose from '../assets/icon-x.svg';
import ServiceCardComp from '../components/ServiceCardComp';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select.tsx';

function NewOrder() {
	const store = useTrackedOrderStore();
	const modalState = useTrackedModalStore();
	const [serviceCards, setServiceCards] = useState<ServiceType[] | null>(null);
	const [addFees, setAddFees] = useState<FeeType[] | null>(null);
	const [laundryCost, setLaundryCost] = useState(0);
	const [netPrice, setNetPrice] = useState(0);

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

	function deleteServiceCard(id: number) {
		let servicesCopy: ServiceType[] | null = [
			{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' },
		];
		let targetIndex = 0;

		if (serviceCards) {
			servicesCopy = [...serviceCards];
		}

		serviceCards?.forEach((item, index) => {
			if (item.id === id) {
				targetIndex = index;
			}
		});

		if (servicesCopy.length !== 1) {
			servicesCopy.splice(targetIndex, 1);
		} else {
			servicesCopy = null;
		}

		setServiceCards(servicesCopy);
	}

	useEffect(() => {
		setServiceCards(store.services);
	}, [store.services]);

	useEffect(() => {
		let total = 0;

		serviceCards?.forEach((card) => {
			total += card.price * card.quantity;
		});

		setLaundryCost(total);
	}, [serviceCards]);

	useEffect(() => {
		let total = laundryCost;

		addFees?.forEach(({ category, price }) => {
			if (category === 'discount') {
				total -= price;
			} else {
				total += price;
			}
		});

		setNetPrice(total);
	}, [laundryCost, addFees]);

	useEffect(() => {
		setAddFees(store.addFees);
	}, [store.addFees]);

	/*function putAddFee (type: 'discount' | 'additional', label: string, price: number) {
		let addFeesCopy: FeeType[] = [{ type: 'discount', label: '', price: 0 }];

		if (addFees) {
			addFeesCopy = [...addFees];
			addFeesCopy.push({type, label, price});
		} else {
			addFeesCopy.push({ type, label, price });
			addFeesCopy.splice(0,1)
		}

		setAddFees(addFeesCopy)
	}

	function editAddFees (index: number, type: 'discount' | 'additional', label: string, price: number) {
		let addFeesCopy: FeeType[] = [{ type: 'discount', label: '', price: 0 }];

		if (addFees) {
			addFeesCopy = [...addFees];
		}

		if (addFeesCopy[index]) {
			addFeesCopy.splice(index, 1, {type, label, price})
		}

		setAddFees(addFeesCopy)
	} */

	function deleteAddFee(index: number) {
		let addFeesCopy: FeeType[] = [{ category: 'discount', label: '', price: 0 }];

		if (addFees) {
			addFeesCopy = [...addFees];
		}

		addFeesCopy.splice(index, 1);
		setAddFees(addFeesCopy);
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
								className="mt-2 font-semibold text-green-600"
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
							<div className="col-span-12 min-[360px]:col-span-8">
								<p className="form-label">Tanggal Masuk</p>
								<input type="text" className="form-input w-full" />
							</div>
							<div className="col-span-12 min-[360px]:col-span-4">
								<p className="form-label">Waktu Masuk</p>
								<input
									type="text"
									className="form-input w-full max-w-[7.5rem] min-[360px]:max-w-full"
								/>
							</div>
						</div>
						<div className="w-full grid grid-cols-12 gap-x-4">
							<div className="col-span-12 min-[360px]:col-span-8">
								<p className="form-label">Tanggal Keluar</p>
								<input type="text" className="form-input w-full" />
							</div>
							<div className="col-span-12 min-[360px]:col-span-4">
								<p className="form-label">Waktu Keluar</p>
								<input
									type="text"
									className="form-input w-full max-w-[7.5rem] min-[360px]:max-w-full"
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
								className="mt-2 font-semibold text-green-600"
								onClick={() => {
									store.setServices(serviceCards);
									modalState.openModal(<ServiceSearch />, 'full');
								}}
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
								className={`relative overflow-x-auto overflow-y-hidden w-full ${
									serviceCards ? 'sm:h-[22.5rem]' : ''
								} ${serviceCards?.length === 1 ? 'flex items-center' : ''}`}
							>
								<div
									id="service-slide"
									className={`flex flex-col sm:flex-row flex-nowrap gap-1 items-center min-w-full ${
										serviceCards ? 'p-1 sm:absolute' : 'p-3'
									} ${serviceCards?.length === 1 ? 'justify-center' : ''}`}
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
						<div className="w-full flex flex-col items-center mt-2 mb-7">
							<div className="w-fit grid grid-cols-2 text-sm gap-y-8">
								<div className="max-w-[16rem] min-w-[7.5rem] col-span-1 flex justify-between font-bold">
									<p>Harga Cuci</p>
									<p className="ml-4">:</p>
								</div>
								<div className="max-w-[16rem] col-span-1 font-bold">
									<div className="flex justify-between ml-3 mr-6 border-b border-gray-600">
										<p className="pl-1 pr-2">Rp</p>
										<p className="pr-1">{laundryCost}</p>
									</div>
								</div>
								{addFees?.map(({ category, label, price }, index) => (
									<React.Fragment key={`additional-${index}`}>
										<div
											className={`max-w-[16rem] col-span-1 w-full flex justify-between font-medium ${
												category === 'discount' ? 'text-theme-blue' : ''
											}`}
										>
											<p>{label}</p>
											<p className="ml-4 flex items-center">:</p>
										</div>
										<div className="max-w-[16rem] col-span-1 font-medium flex justify-center items-center relative">
											<div
												className={`flex w-full justify-between ml-3 border-b border-gray-600 mr-6 ${
													category === 'discount' ? 'text-theme-blue' : ''
												}`}
											>
												<p
													className={`absolute translate-x-[-100%] ${
														category === 'discount' ? '' : 'hidden'
													}`}
												>
													–
												</p>
												<p className="pl-1 pr-2">Rp</p>
												<p className="pr-1">{price}</p>
											</div>
											<button
												className="button-gray absolute right-0"
												style={{
													padding: '6px 2px',
													outlineColor: 'var(--color-theme-green)',
												}}
												onClick={() => deleteAddFee(index)}
											>
												<img
													src={iconClose}
													alt="Hapus Harga"
													className="w-3"
												/>
											</button>
										</div>
									</React.Fragment>
								))}
								<div className="max-w-[16rem] col-span-1 max w-full flex flex-col text-[13px] font-semibold text-green-600 relative">
									<div className=" w-full h-10" />
									<button
										className="button-gray absolute top-[-20%] z-[4] left-[-1rem]"
										style={{ outlineColor: 'var(--color-theme-green)'}}
										onClick={() => {
											store.setAddFees(addFees);
											modalState.openModal(<AddFeeModal />, 'fit');
										}}
									>
										+harga lain
									</button>
									<div className="bg-gray-600 h-[2px] absolute w-[210%] bottom-0 translate-x-1/2 right-0" />
								</div>
								<div className="max-w-[16rem] col-span-1" />
								<div className="max-w-[16rem] col-span-1 flex justify-between font-bold">
									<p>Total Harga</p>
									<p className="ml-4">:</p>
								</div>
								<div className="max-w-[16rem] col-span-1 font-bold">
									<div className="flex justify-between ml-3 mr-6 border-b border-gray-600">
										<p className="pl-1 pr-2">Rp</p>
										<p className="pr-1">{netPrice}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Lain-lain
				</h3>
				<div className="card-white px-4 pt-4 pb-5 flex flex-col items-center">
					<div className="w-full max-w-xl">
						<h4>Catatan Internal</h4>
						<textarea
							name="order_notes"
							id="order-notes"
							rows={6}
							className="w-full bg-white form-input"
							style={{ height: 'auto' }}
							placeholder="catatan untuk keperluan internal"
						/>
						<h4>Catatan Tagihan</h4>
						<textarea
							name="order_invoice_notes"
							id="order-invoice-notes"
							rows={6}
							className="w-full bg-white form-input"
							style={{ height: 'auto' }}
							placeholder="catatan yang akan muncul di tagihan"
						/>
						<h4>Metode Pembayaran</h4>
						<Select defaultValue="Transfer">
							<SelectTrigger className="w-full max-w-sm">
								<SelectValue placeholder="Pilih metode pembayaran" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Transfer">Transfer</SelectItem>
								<SelectItem value="COD">COD</SelectItem>
							</SelectContent>
						</Select>
						<h4 className="mt-4">Metode Pengiriman</h4>
						<Select defaultValue="Ambil sendiri">
							<SelectTrigger className="w-full max-w-sm">
								<SelectValue placeholder="Pilih metode pengiriman" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Ambil sendiri">Ambil sendiri</SelectItem>
								<SelectItem value="Kurir rental">Kurir rental</SelectItem>
								<SelectItem value="Kurir pihak ketiga">
									Kurir pihak ketiga
								</SelectItem>
							</SelectContent>
						</Select>
						<h4 className="mt-4">Pembayaran</h4>
						<RadioGroup defaultValue="order-paid-false">
							<div className="w-full max-w-xs flex flex-col sm:flex-row justify-between pt-2 gap-y-6 mb-4">
								<div className="flex gap-2.5">
									<RadioGroupItem
										value="order-paid-false"
										id="order-paid-false"
									/>
									<Label htmlFor="order-paid-false">Belum Lunas</Label>
								</div>
								<div className="flex gap-2.5">
									<RadioGroupItem value="order-paid-true" id="order-paid-true" />
									<Label htmlFor="order-paid-true">Sudah Lunas</Label>
								</div>
							</div>
						</RadioGroup>
					</div>
				</div>
			</section>
			<button className="button-color w-full max-w-xs text-[15px] mt-6 mb-10">
				Bikin Pesanan
			</button>

			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default NewOrder;
