import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	ServiceType,
	FeeType,
	CustomerType,
	PaymentType,
	useTrackedOrderStore,
} from '../stores/orderStore';
import useTrackedModalStore from '../stores/modalStore';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import OrderDetailServiceCard from '../components/OrderDetailServiceCard';
import AddFeeModal from '../components/AddFeeModal';
import NewPaymentModal from '../components/NewPaymentModal';
import PaidDescModal from '../components/PaidDescModal';
import ServiceAddModal from '../components/ServiceAddModal';
import formatPrice from '../lib/formatPrice';
import iconArrowLeft from '../assets/icon-arrowleft.svg';
import iconWhatsApp from '../assets/icon-brand-whatsapp.svg';
import iconPencil from '../assets/icon-pencil.svg';
import iconCreditCard from '../assets/icon-creditcard.svg';
import iconBanknotes from '../assets/icon-banknotes.svg';
import iconPaid from '../assets/icon-badgecheck.svg';
import iconUnpaid from '../assets/icon-xcircle.svg';
import iconStorefront from '../assets/icon-storefront.svg';
import iconTruck from '../assets/icon-truck.svg';
import iconClose from '../assets/icon-x.svg';
import iconPlus from '../assets/icon-plus.svg';
import DropdownComp from '../components/DropdownComp';

type OrderDetailSpec = {
	order_id: number;
	customer: CustomerType;
	start_date: Date;
	user_email: string;
	services: ServiceType[] | null;
	add_fees: FeeType[] | null;
	net_price: number;
	payments: PaymentType[] | null;
	current_bill: number;
	notes_internal: string;
	method_payment: string;
	method_shipping: string;
	order_paid: boolean;
	order_status: string;
};

const orderDetailDummy: OrderDetailSpec = {
	order_id: 30,
	customer: {
		id: 4,
		name: 'Firda Ayu',
		phone: '085712341234',
		address: 'Jl. Tebet Barat VIIC, Jakarta Selatan',
		img: 'bg-fuchsia-500',
	},
	start_date: new Date('2023-08-05T17:00:00.000Z'),
	user_email: 'taufiqm@outlook.com',
	services: [
		{
			id: 8,
			name: 'Set Bumper+Sprei',
			priceRange: '59-79k',
			img: 'imgBumper',
			quantity: 1,
			price: 60000,
			desc: 'warna biru, +downy lavender',
		},
		{
			id: 9,
			name: 'Carseat Kecil',
			priceRange: '99-129k',
			img: 'imgCarseatSm',
			quantity: 1,
			price: 100000,
			desc: '',
		},
	],
	add_fees: [
		{ category: 'additional', label: 'Pewangi tambahan', price: 5000 },
		{ category: 'additional', label: 'Biaya transportasi', price: 10000 },
		{ category: 'discount', label: 'Diskon awal bulan', price: 15000 },
	],
	net_price: 160000,
	payments: null,
	current_bill: 160000,
	notes_internal: '',
	method_payment: 'Transfer',
	method_shipping: 'Kurir pihak ketiga',
	order_paid: false,
	order_status: 'Sedang cuci',
};

const paymentsDummy = [
	{ paydate: new Date('2023-08-05T17:00:00.000Z'), desc: 'DP', price: 60000 },
	{ paydate: new Date('2023-08-06T17:00:00.000Z'), desc: 'Tambah transfer', price: 40000 },
];

function OrderDetail() {
	const { id: paramId } = useParams();
	const navigate = useNavigate();
	const store = useTrackedOrderStore();
	const modalState = useTrackedModalStore();
	const {
		order_id: orderId,
		customer,
		start_date: startDate,
		user_email: userEmail,
	} = orderDetailDummy;

	const notesRef = useRef<HTMLTextAreaElement>(null);
	const paymentMethodRef = useRef<HTMLDivElement>(null);
	const orderPaidRef = useRef<HTMLDivElement>(null);
	const shippingMethodRef = useRef<HTMLDivElement>(null);
	const orderStatusRef = useRef<HTMLDivElement>(null);

	const [notes, setNotes] = useState<string>(orderDetailDummy.notes_internal);
	const [paymentMethod, setPaymentMethod] = useState<string>(orderDetailDummy.method_payment);
	const [shippingMethod, setShippingMethod] = useState<string>(orderDetailDummy.method_shipping);
	const [orderPaid, setOrderPaid] = useState<boolean>(orderDetailDummy.order_paid);
	const [orderStatus, setOrderStatus] = useState<string>(orderDetailDummy.order_status);
	const [activeDropdown, setActiveDropdown] = useState<string>('');

	const [services, setServices] = useState<ServiceType[] | null>(orderDetailDummy.services);
	const [servicesPrice, setServicesPrice] = useState(0);
	const [addFees, setAddFees] = useState<FeeType[] | null>(orderDetailDummy.add_fees);
	const [netPrice, setNetPrice] = useState<number>(orderDetailDummy.net_price);
	const [payments, setPayments] = useState<PaymentType[] | null>(paymentsDummy);
	const [currentBill, setCurrentBill] = useState<number>(orderDetailDummy.current_bill);

	function deleteItemInArray<T>(
		array: T[] | null,
		index: number,
		setter: React.Dispatch<React.SetStateAction<T[] | null>>
	) {
		let newArray: T[] | null = [...array!];

		if (newArray.length > 1 && newArray[index]) {
			newArray.splice(index, 1);
		} else {
			newArray = null;
		}
		setter(newArray);
	}

	function setOrderPaidFromDropDown(input: string) {
		if (input === 'Lunas') {
			setOrderPaid(true);
		} else {
			setOrderPaid(false);
		}
	}

	function setActiveMenuByString(value: string) {
		activeDropdown === value ? setActiveDropdown('') : setActiveDropdown(value) 
	}

	useEffect(() => {
		store.resetOrderStore();
		store.setServices(orderDetailDummy.services);
		store.setAddFees(orderDetailDummy.add_fees);
		store.setPayments(paymentsDummy);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (activeDropdown === 'notes' && notesRef.current) {
			notesRef.current.value = notes;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeDropdown]);

	useEffect(() => {
		document.addEventListener('mousedown', closeDropdown);

		return () => {
			document.removeEventListener('mousedown', closeDropdown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeDropdown]);

	function closeDropdown(event: MouseEvent) {
		const clickTarget = event.target as Node;
		const dropdowns = [{ ref: paymentMethodRef, activeLabel: 'payment-method' }, {ref: orderPaidRef, activeLabel: 'order-paid'}, {ref: shippingMethodRef, activeLabel: 'shipping-method'}, {ref: orderStatusRef, activeLabel: 'order-status'}];

		function deactivateDropdownByClick(
			ref: React.RefObject<HTMLDivElement>,
			activeLabel: string
		) {
			if (ref && activeDropdown === activeLabel && !ref.current?.contains(clickTarget)) {
				setActiveDropdown('');
			}
		}

		dropdowns.forEach(({ref, activeLabel}) => deactivateDropdownByClick(ref, activeLabel))
	}

	useEffect(() => {
		setServices(store.services);
	}, [store.services]);

	useEffect(() => {
		setAddFees(store.addFees);
	}, [store.addFees]);

	useEffect(() => {
		setPayments(store.payments);
	}, [store.payments]);

	useEffect(() => {
		let newServicesPrice = 0;

		services?.forEach((service) => {
			newServicesPrice += service.quantity * service.price;
		});

		setServicesPrice(newServicesPrice);
	}, [services]);

	useEffect(() => {
		let newNetPrice = servicesPrice;

		addFees?.forEach((addFee) => {
			if (addFee.category === 'discount') {
				newNetPrice -= addFee.price;
			} else {
				newNetPrice += addFee.price;
			}
		});

		setNetPrice(newNetPrice);
	}, [servicesPrice, addFees]);

	useEffect(() => {
		let newBill = netPrice;

		payments?.forEach((payment) => {
			newBill -= payment.price;
		});

		setCurrentBill(newBill);
	}, [payments, netPrice]);

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<div className="w-full flex items-center gap-x-4 mb-6 px-2 min-[575px]:px-0">
					<button className="button-gray p-[0.375rem]" onClick={() => navigate(-1)}>
						<img src={iconArrowLeft} alt="Tombol Kembali" className="w-5 h-5" />
					</button>
					<h3 className="mb-0">Pesanan - {paramId}</h3>
				</div>
				<div className="card-white p-4 w-full">
					<ul className="flex flex-col gap-y-6">
						<li className="detail-col-grid">
							<div className="detail-left-grid">ID Pesanan</div>
							<div className="w-full sm:w-3/4">{orderId}</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Pemesan</div>
							<div className="w-full sm:w-3/4 font-medium text-theme-blue cursor-pointer">
								{customer.name}
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Telepon</div>
							<div className="w-full sm:w-3/4 flex flex-col gap-y-1">
								<p>{customer.phone}</p>
								<a
									href={`https://wa.me/62${customer.phone}?text=`}
									target="_blank"
									className="badge-pill-lightgreen"
								>
									<img
										src={iconWhatsApp}
										alt=""
										className="w-3 filter-emerald-600"
									/>
									Buka WA
								</a>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Alamat</div>
							<div className="w-full sm:w-3/4 flex flex-col gap-y-1">
								<p>{customer.address}</p>
								<a
									href={`https://www.google.com/maps/search/?api=1&query=${customer.address}`}
									target="_blank"
									className="badge-pill-lightgreen"
								>
									Cari di Maps
								</a>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Tanggal Pesan</div>
							<div className="w-full sm:w-3/4">
								{format(startDate, 'PPP', { locale: localeId })}
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Pencatat</div>
							<div className="w-full sm:w-3/4">{userEmail}</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Catatan</div>
							{activeDropdown === 'notes' ? (
								<form
									className="w-full sm:w-3/4 "
									onSubmit={(e) => {
										e.preventDefault();
										setNotes(notesRef.current?.value || '');
										setActiveDropdown('');
									}}
								>
									<textarea
										ref={notesRef}
										name="order_notes"
										id="order-notes"
										rows={3}
										className="w-full bg-white form-input mb-2"
										style={{ height: 'auto' }}
										placeholder="catatan untuk keperluan internal"
									/>
									<div className="flex gap-2">
										<button
											className="button-color bg-theme-blue"
											type="submit"
										>
											Simpan
										</button>
										<button
											className="button-gray"
											onClick={() => setActiveDropdown('')}
										>
											Batalkan
										</button>
									</div>
								</form>
							) : (
								<div className="w-full sm:w-3/4 flex items-center">
									<p>{notes.length > 1 ? notes : '–'}</p>
									<button
										className="ml-3"
										onClick={() => setActiveDropdown('notes')}
									>
										<img
											src={iconPencil}
											alt="Ubah"
											className="w-4 h-4 filter-orange-600"
										/>
									</button>
								</div>
							)}
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Metode Bayar</div>
							<div className="w-full sm:w-3/4 font-medium">
								<DropdownComp
									title="payment-method"
									isDropdownActive={activeDropdown === 'payment-method'}
									setActiveDropdown={setActiveDropdown}
									options={['Transfer', 'Tunai']}
									selectedOption={paymentMethod}
									setSelectedOption={setPaymentMethod}
									parentClass="flex items-center w-fit"
									childClass=""
									ref={paymentMethodRef}
								>
									<img
										src={
											paymentMethod === 'Transfer'
												? iconCreditCard
												: iconBanknotes
										}
										alt=""
										className="w-5 h-5 ml-[-2px] filter-green-600 mr-1.5"
									/>
									<p className="text-green-600">{paymentMethod}</p>
									<button
										className="ml-3"
										onClick={() => setActiveMenuByString('payment-method')}
									>
										<img
											src={iconPencil}
											alt="Ubah"
											className="w-4 h-4 filter-orange-600"
										/>
									</button>
								</DropdownComp>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Status Bayar</div>
							<div className="w-full sm:w-3/4 font-medium">
								<DropdownComp
									title="order-paid"
									isDropdownActive={activeDropdown === 'order-paid'}
									setActiveDropdown={setActiveDropdown}
									options={['Lunas', 'Belum lunas']}
									selectedOption={orderPaid ? 'Lunas' : 'Belum lunas'}
									setSelectedOption={setOrderPaidFromDropDown}
									parentClass="flex items-center w-fit"
									childClass=""
									ref={orderPaidRef}
								>
									<img
										src={orderPaid ? iconPaid : iconUnpaid}
										alt=""
										className={`w-5 h-5 ml-[-2px] mr-1.5 ${
											orderPaid ? 'filter-green-600' : 'filter-orange-600'
										}`}
									/>
									{orderPaid ? (
										<p className="text-green-600">Lunas</p>
									) : (
										<p className="text-orange-600">Belum lunas</p>
									)}
									<button
										className="ml-3"
										onClick={() => setActiveMenuByString('order-paid')}
									>
										<img
											src={iconPencil}
											alt="Ubah"
											className="w-4 h-4 filter-orange-600"
										/>
									</button>
								</DropdownComp>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Metode Kirim</div>
							<div className="w-full sm:w-3/4 font-medium">
								<DropdownComp
									title="shipping-method"
									isDropdownActive={activeDropdown === 'shipping-method'}
									setActiveDropdown={setActiveDropdown}
									options={[
										'Antar sendiri',
										'Kurir rental',
										'Kurir pihak ketiga',
									]}
									selectedOption={shippingMethod}
									setSelectedOption={setShippingMethod}
									parentClass="flex items-center w-fit"
									childClass=""
									ref={shippingMethodRef}
								>
									<img
										src={
											shippingMethod === 'Antar sendiri'
												? iconStorefront
												: iconTruck
										}
										alt=""
										className="w-5 h-5 ml-[-2px] mr-1.5 filter-green-600"
									/>
									<p className="text-green-600">{shippingMethod}</p>
									<button
										className="ml-3"
										onClick={() => setActiveMenuByString('shipping-method')}
									>
										<img
											src={iconPencil}
											alt="Ubah"
											className="w-4 h-4 filter-orange-600"
										/>
									</button>
								</DropdownComp>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Status Pesanan</div>
							<div className="w-full sm:w-3/4 flex items-center font-medium">
								<DropdownComp
									title="order-status"
									isDropdownActive={activeDropdown === 'order-status'}
									setActiveDropdown={setActiveDropdown}
									options={['Sedang cuci', 'Tunggu jemput', 'Pesanan selesai']}
									selectedOption={orderStatus}
									setSelectedOption={setOrderStatus}
									parentClass="flex items-center w-fit"
									childClass=""
									ref={orderStatusRef}
								>
									<p
										className={
											orderStatus === 'Sedang cuci'
												? 'text-theme-blue'
												: orderStatus === 'Tunggu jemput'
												? 'text-orange-500'
												: 'text-green-600'
										}
									>
										{orderStatus}
									</p>
									<button className="ml-3" onClick={() => setActiveMenuByString('order-status')}>
										<img
											src={iconPencil}
											alt="Ubah"
											className="w-4 h-4 filter-orange-600"
										/>
									</button>
								</DropdownComp>
							</div>
						</li>
					</ul>
				</div>
			</section>
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Paket Layanan
				</h3>
				<div className="card-white w-full bg-gray-300 flex flex-col gap-y-0.5">
					{services?.map((service, index) => (
						<React.Fragment key={`service-${index}`}>
							<OrderDetailServiceCard
								data={service}
								childNum={
									index === 0
										? 'first'
										: index === services.length - 1
										? 'last'
										: index
								}
							/>
						</React.Fragment>
					))}
				</div>
				<button
					className="button-gray text-sm mt-4 flex items-center gap-2 ml-2 min-[575px]:ml-0"
					onClick={() => modalState.openModal(<ServiceAddModal />, 'full')}
				>
					<img src={iconPlus} alt="" className="h-4 w-4" /> Tambah Layanan
				</button>
			</section>
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Pembayaran
				</h3>
				<div className="card-white w-full p-4">
					<h5 className="font-semibold w-full pb-3">Tagihan</h5>
					<div className="w-full bg-gray-300 pt-[1px] flex flex-col gap-[1px]">
						<div className="w-full bg-white flex items-center py-3">
							<p className="w-full">Layanan cuci</p>
							<div className="flex shrink-0 items-center">
								<p className="w-fit whitespace-nowrap">
									{formatPrice(servicesPrice)}
								</p>
								<button
									className="button-gray px-0.5 py-1.5 ml-2 opacity-0"
									disabled
								>
									<img src={iconClose} alt="" className="w-3" />
								</button>
							</div>
						</div>
						{addFees?.map((addFee, index) => {
							return (
								<div
									className="w-full bg-white flex items-center py-3"
									key={`addfee-${index}`}
								>
									<p className="w-full">{addFee.label}</p>
									<div
										className={`flex shrink-0 items-center ${
											addFee.category === 'discount' ? 'text-theme-blue' : ''
										}`}
									>
										<p className="w-fit whitespace-nowrap">{`${
											addFee.category === 'discount' ? '–' : ''
										} ${formatPrice(addFee.price)}`}</p>
										<button
											className="button-gray px-0.5 py-1.5 ml-2"
											onClick={() =>
												deleteItemInArray<FeeType>(
													addFees,
													index,
													setAddFees
												)
											}
										>
											<img src={iconClose} alt="" className="w-3" />
										</button>
									</div>
								</div>
							);
						})}
						<div className="w-full bg-white flex items-center py-3 font-semibold">
							<p className="w-full">Total</p>
							<div className="flex shrink-0 items-center">
								<p className="w-fit whitespace-nowrap">{formatPrice(netPrice)}</p>
								<button
									className="button-gray px-0.5 py-1.5 ml-2 opacity-0"
									disabled
								>
									<img src={iconClose} alt="" className="w-3" />
								</button>
							</div>
						</div>
					</div>
					<button
						className="button-gray mb-4 text-sm flex items-center gap-2"
						onClick={() => {
							store.setAddFees(addFees);
							modalState.openModal(<AddFeeModal />, 'fit');
						}}
					>
						<img src={iconPlus} alt="" className="h-4 w-4" /> Biaya Tambahan Baru
					</button>
					<h5 className="font-semibold w-full pt-4 pb-3">Pembayaran</h5>
					<div className="w-full bg-gray-300 pt-[1px] flex flex-col gap-[1px]">
						{payments ? (
							payments.map((payment, index) => {
								return (
									<div
										className="w-full bg-white flex items-center py-3"
										key={`payment-${index}`}
									>
										<p className="w-full">
											{format(payment.paydate, 'd LLL', {
												locale: localeId,
											})}
										</p>
										<div className="flex shrink-0 items-center">
											<p
												className="w-fit whitespace-nowrap text-theme-blue font-semibold cursor-pointer"
												onClick={() => {
													store.setPayments(payments);
													modalState.openModal(
														<PaidDescModal index={index} />,
														'fit'
													);
												}}
											>
												{formatPrice(payment.price)}
											</p>
											<button
												className="button-gray px-0.5 py-1.5 ml-2"
												onClick={() =>
													deleteItemInArray<PaymentType>(
														payments,
														index,
														setPayments
													)
												}
											>
												<img src={iconClose} alt="" className="w-3" />
											</button>
										</div>
									</div>
								);
							})
						) : (
							<div className="w-full bg-white py-3">Belum ada pembayaran</div>
						)}
						<div className="w-full bg-white flex items-center py-3 font-semibold">
							<p className="w-full">Sisa Tagihan</p>
							<div className="flex shrink-0 items-center">
								<p className="w-fit whitespace-nowrap">
									{formatPrice(currentBill)}
								</p>
								<button
									className="button-gray px-0.5 py-1.5 ml-2 opacity-0"
									disabled
								>
									<img src={iconClose} alt="" className="w-3" />
								</button>
							</div>
						</div>
					</div>
					<div className="flex gap-4">
						{currentBill === 0 ? (
							''
						) : (
							<button
								className="button-color text-sm flex items-center gap-2"
								onClick={() => {
									store.setPayments(payments);
									modalState.openModal(<NewPaymentModal />, 'fit');
								}}
							>
								<img src={iconPlus} alt="" className="h-4 w-4" /> Pembayaran Baru
							</button>
						)}
						<button className="button-gray text-sm">Nota Tagihan</button>
					</div>
				</div>
			</section>
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Hapus Pesanan
				</h3>
				<div className="card-white w-full p-4">
					<button
						className="button-color bg-theme-orange border-red-500"
						onClick={() => console.log(typeof setAddFees)}
					>
						Hapus Pesanan
					</button>
				</div>
			</section>
			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default OrderDetail;
