import React, { useEffect, useState, useRef } from 'react';
import { ServiceType, FeeType, useTrackedOrderStore } from '../stores/orderStore.tsx';
import useTrackedModalStore from '../stores/modalStore';
import id from 'date-fns/locale/id';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import CustomerSearchModal from '../components/CustomerSearchModal.tsx';
import ServiceSearchModal from '../components/ServiceSearchModal.tsx';
import AddFeeModal from '../components/AddFeeModal.tsx';
import NewOrderServiceCard from '../components/NewOrderServiceCard.tsx';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import DropdownComp from '../components/DropdownComp.tsx';
import iconClose from '../assets/icon-x.svg';
import iconExclamation from '../assets/icon-exclamation-circle.svg';

function NewOrder() {
	const store = useTrackedOrderStore();
	const modalState = useTrackedModalStore();
	const notesInternalRef = useRef<HTMLTextAreaElement>(null);
	const notesInvoiceRef = useRef<HTMLTextAreaElement>(null);
	const paymentMethodRef = useRef<HTMLDivElement>(null);
	const shippingMethodRef = useRef<HTMLDivElement>(null);
	const [startDate, setStartDate] = useState<Date | undefined>(new Date());
	const [serviceCards, setServiceCards] = useState<ServiceType[] | null>(null);
	const [addFees, setAddFees] = useState<FeeType[] | null>(null);
	const [laundryCost, setLaundryCost] = useState(0);
	const [netPrice, setNetPrice] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState('Transfer');
	const [shippingMethod, setShippingMethod] = useState('Antar sendiri');
	const [activeDropdown, setActiveDropdown] = useState('');
	const [orderPaid, setOrderPaid] = useState('order-paid-false');
	const [invalidCols, setInvalidCols] = useState<string[] | null>(null);

	useEffect(() => {
		store.resetOrderStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		document.addEventListener('mousedown', closeDropdown);

		return () => {
			document.removeEventListener('mousedown', closeDropdown);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeDropdown]);

	function closeDropdown(event: MouseEvent) {
		const clickTarget = event.target as Node;
		const dropdowns = [
			{ ref: paymentMethodRef, activeLabel: 'payment-method' },
			{ ref: shippingMethodRef, activeLabel: 'shipping-method' },
		];

		function deactivateDropdownByClick(
			ref: React.RefObject<HTMLDivElement>,
			activeLabel: string
		) {
			if (ref && activeDropdown === activeLabel && !ref.current?.contains(clickTarget)) {
				setActiveDropdown('');
			}
		}

		dropdowns.forEach(({ ref, activeLabel }) => deactivateDropdownByClick(ref, activeLabel));
	}

	function updateServiceCards(
		id: number,
		category: 'quantity' | 'price' | 'desc',
		value: number | string
	) {
		const servicesCopy = [...serviceCards!];
		const targetIndex = serviceCards!.findIndex((card) => card.id === id);
		const packageCopy = serviceCards![targetIndex];

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
		let servicesCopy: ServiceType[] | null = [...serviceCards!];
		const targetIndex = serviceCards!.findIndex((card) => card.id === id);

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
		setAddFees(store.addFees);
	}, [store.addFees]);

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
			if (category === 'Diskon') {
				total -= price;
			} else {
				total += price;
			}
		});

		setNetPrice(total);
	}, [laundryCost, addFees]);

	function deleteAddFee(index: number) {
		let addFeesCopy: FeeType[] | null = [...addFees!];

		if (addFeesCopy.length !== 1) {
			addFeesCopy.splice(index, 1);
		} else {
			addFeesCopy = null;
		}

		setAddFees(addFeesCopy);
	}

	/* VALIDATION AND ERROR HANDLING */

	function removeInvalidCol(col: string) {
		if (invalidCols?.includes(col)) {
			let newInvalidCols: string[] | null = [...invalidCols];

			if (newInvalidCols.length > 1) {
				newInvalidCols.splice(invalidCols.indexOf(col), 1);
			} else {
				newInvalidCols = null;
			}
			setInvalidCols(newInvalidCols);
		}
	}

	useEffect(() => {
		removeInvalidCol('customer');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.customer]);

	useEffect(() => {
		removeInvalidCol('startDate');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startDate]);

	useEffect(() => {
		removeInvalidCol('serviceCards');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serviceCards]);

	useEffect(() => {
		removeInvalidCol('laundryCost');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [laundryCost]);

	function confirmOrder() {
		const newInvalidCols = ['throwError'];

		if (store.customer.id === 0) {
			newInvalidCols.push('customer');
		}
		if (startDate === null) {
			newInvalidCols.push('startDate');
		}
		if (serviceCards === null) {
			newInvalidCols.push('serviceCards');
		}
		if (laundryCost === 0) {
			newInvalidCols.push('laundryCost');
		}
		if (newInvalidCols.length > 1) {
			newInvalidCols.shift();
			setInvalidCols(newInvalidCols);
			return;
		}
		const confirmedServices = [{ id: 0, name: '', quantity: 1, price: 0, desc: '' }];
		serviceCards?.forEach(({ id, name, quantity, price, desc }) => {
			confirmedServices.push({ id, name, quantity, price, desc });
		});
		confirmedServices.shift();

		let confirmedAddFees: FeeType[] | null = [{ category: 'Diskon', label: '', price: 0 }];
		if (addFees) {
			addFees.forEach(({ category, label, price }) => {
				confirmedAddFees?.push({ category, label, price });
			});
			confirmedAddFees.shift();
		} else {
			confirmedAddFees = null;
		}

		const orderData = {
			customer: { id: store.customer.id, name: store.customer.name },
			start_date: startDate?.toJSON(),
			services: confirmedServices,
			add_fees: confirmedAddFees,
			net_price: netPrice,
			notes_internal: notesInternalRef.current?.value || '',
			notes_invoice: notesInvoiceRef.current?.value || '',
			method_payment: paymentMethod,
			method_shipping: shippingMethod,
			order_paid: orderPaid === 'order-paid-true',
		};

		console.log(orderData);
	}

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Data Umum
				</h3>
				<div className="card-white p-4 flex flex-col items-center">
					<div className="w-full max-w-xl">
						<div className="w-full flex justify-between items-center">
							<h4 className="">
								Pelanggan<span className="required-asterisk">*</span>
							</h4>
							<button
								className="mt-2 font-semibold text-green-600"
								onClick={() =>
									modalState.openModal(<CustomerSearchModal />, 'full')
								}
							>
								{store.customer.id === 0 ? 'Pilih Kontak' : 'Ganti Kontak'}
							</button>
						</div>
						<div
							className={`w-full border bg-neutral-50 rounded p-3 flex gap-3 sm:items-center mb-4 mt-1 ${
								store.customer.id === 0 ? 'border-green-600' : ''
							} ${invalidCols?.includes('customer') ? 'form-invalid' : ''}`}
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
						<h4>
							Tanggal Masuk<span className="required-asterisk">*</span>
						</h4>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-full max-w-[280px] justify-start text-left font-normal text-sm mt-1 border-gray-300 rounded mb-5 h-11 focus:border-green-600 focus:outline-green-600',
										!startDate && 'text-muted-foreground',
										invalidCols?.includes('startDate') && 'form-invalid'
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{startDate ? (
										format(startDate, 'PPP', { locale: id })
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									locale={id}
									mode="single"
									selected={startDate}
									onSelect={setStartDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
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
							<h4>
								Layanan<span className="required-asterisk">*</span>
							</h4>
							<button
								className="mt-2 font-semibold text-green-600"
								onClick={() => {
									store.setServices(serviceCards);
									modalState.openModal(<ServiceSearchModal />, 'full');
								}}
							>
								Tambah Layanan
							</button>
						</div>
						<div
							id="service-container"
							className={`w-full border bg-neutral-50 rounded mb-4 mt-1 sm:overflow-x-hidden ${
								!serviceCards ? 'border-green-600' : ''
							} ${invalidCols?.includes('serviceCards') ? 'form-invalid' : ''}`}
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
											<NewOrderServiceCard
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
								<div
									className={`max-w-[16rem] col-span-1 font-bold ${
										invalidCols?.includes('laundryCost')
											? 'form-invalid rounded'
											: ''
									}`}
								>
									<div className="flex justify-between ml-3 mr-6 border-b border-gray-600">
										<p className="pl-1 pr-2">Rp</p>
										<p className="pr-1">{laundryCost}</p>
									</div>
								</div>
								{addFees?.map(({ category, label, price }, index) => (
									<React.Fragment key={`additional-${index}`}>
										<div
											className={`max-w-[16rem] col-span-1 w-full flex justify-between font-medium ${
												category === 'Diskon' ? 'text-theme-blue' : ''
											}`}
										>
											<p>{label}</p>
											<p className="ml-4 flex items-center">:</p>
										</div>
										<div className="max-w-[16rem] col-span-1 font-medium flex justify-center items-center relative">
											<div
												className={`flex w-full justify-between ml-3 border-b border-gray-600 mr-6 ${
													category === 'Diskon' ? 'text-theme-blue' : ''
												}`}
											>
												<p
													className={`absolute translate-x-[-100%] ${
														category === 'Diskon' ? '' : 'hidden'
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
										style={{ outlineColor: 'var(--color-theme-green)' }}
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
							ref={notesInternalRef}
							name="order_notes"
							id="order-notes"
							rows={6}
							className="w-full bg-white form-input"
							style={{ height: 'auto' }}
							placeholder="catatan untuk keperluan internal"
						/>
						<h4>Catatan Tagihan</h4>
						<textarea
							ref={notesInvoiceRef}
							name="order_invoice_notes"
							id="order-invoice-notes"
							rows={6}
							className="w-full bg-white form-input"
							style={{ height: 'auto' }}
							placeholder="catatan yang akan muncul di tagihan"
						/>
						<h4>Metode Pembayaran</h4>
						<DropdownComp
							title="payment-method"
							dropdownStatus={{
								isOpen: activeDropdown === 'payment-method',
								setStatus: setActiveDropdown,
							}}
							options={{
								values: ['Transfer', 'Tunai'],
								selected: paymentMethod,
								setSelected: setPaymentMethod,
							}}
							styling={{ parentClass: 'wfull max-w-sm', childClass: 'w-full' }}
							ref={paymentMethodRef}
						>
							<button
								className="w-full max-w-sm form-input mb-0 text-left relative"
								onClick={() =>
									activeDropdown === ''
										? setActiveDropdown('payment-method')
										: setActiveDropdown('')
								}
							>
								<p>{paymentMethod}</p>
								<ChevronDown className="h-4 w-4 opacity-50 absolute right-3 bottom-1/2 translate-y-1/2" />
							</button>
						</DropdownComp>
						<h4 className="mt-4">Metode Pengiriman</h4>
						<DropdownComp
							title="shipping-method"
							dropdownStatus={{
								isOpen: activeDropdown === 'shipping-method',
								setStatus: setActiveDropdown,
							}}
							options={{
								values: ['Antar sendiri', 'Kurir rental', 'Kurir pihak ketiga'],
								selected: shippingMethod,
								setSelected: setShippingMethod,
							}}
							styling={{ parentClass: 'w-full max-w-sm', childClass: 'w-full' }}
							ref={shippingMethodRef}
						>
							<button
								className="w-full max-w-sm form-input mb-0 text-left relative"
								onClick={() =>
									activeDropdown === ''
										? setActiveDropdown('shipping-method')
										: setActiveDropdown('')
								}
							>
								<p>{shippingMethod}</p>
								<ChevronDown className="h-4 w-4 opacity-50 absolute right-3 bottom-1/2 translate-y-1/2" />
							</button>
						</DropdownComp>
						<h4 className="mt-4">Pembayaran</h4>
						<RadioGroup value={orderPaid} onValueChange={setOrderPaid}>
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
				<div className="w-full text-theme-orange text-right font-normal text-sm relative translate-y-1 pr-2 min-[575px]:pr-0">
					* kolom harus diisi
				</div>
			</section>

			{invalidCols ? (
				<div className="w-full flex text-red-900 font-medium p-4 border border-red-300 rounded bg-red-100 mb-2">
					<img
						src={iconExclamation}
						alt="Exclamation"
						className="w-5 mr-2"
						style={{
							filter: 'invert(19%) sepia(68%) saturate(6140%) hue-rotate(353deg) brightness(93%) contrast(85%)',
						}}
					/>
					<p>
						Pesanan harus cantumkan
						{invalidCols.length > 1 && invalidCols.includes('customer')
							? ' data pelanggan'
							: invalidCols.includes('customer')
							? ' data pelanggan.'
							: ''}
						{invalidCols.length > 1 &&
						invalidCols.includes('startDate') &&
						(!invalidCols.includes('serviceCards') ||
							!invalidCols.includes('laundryCost'))
							? ', dan tanggal masuk'
							: invalidCols.length > 2 && invalidCols.includes('startDate')
							? ', tanggal masuk'
							: invalidCols.length === 2 && invalidCols.includes('startDate')
							? ' tanggal masuk'
							: invalidCols.includes('startDate')
							? ' tanggal masuk.'
							: ''}
						{invalidCols.length > 1 &&
						invalidCols.includes('serviceCards') &&
						!invalidCols.includes('laundryCost')
							? ', dan paket layanan.'
							: invalidCols.length > 2 && invalidCols.includes('serviceCards')
							? ', paket layanan'
							: invalidCols.length === 2 && invalidCols.includes('serviceCards')
							? ' paket layanan'
							: invalidCols.includes('serviceCards')
							? ' paket layanan.'
							: ''}
						{invalidCols.length > 1 && invalidCols.includes('laundryCost')
							? ', dan harga paket yang dipilih.'
							: invalidCols.includes('laundryCost')
							? ' harga paket yang dipilih.'
							: ''}
					</p>
				</div>
			) : (
				''
			)}
			<button
				className="button-color w-full max-w-xs text-[15px] mt-6 mb-10"
				onClick={() => confirmOrder()}
			>
				Bikin Pesanan
			</button>
			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default NewOrder;
