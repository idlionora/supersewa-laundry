import React from 'react';
import { useParams } from 'react-router-dom';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import { OrderDetailSpec } from './OrderDetail';
import formatPrice from '../lib/formatPrice';
import OrderDetailServiceCard from '../components/OrderDetailServiceCard';
import iconWhatsApp from '../assets/icon-brand-whatsapp.svg';
import iconNotes from '../assets/noun-notes-5752576.svg';
import iconWater from '../assets/noun-water-4923007.svg';
import iconBasket from '../assets/noun-basket-745994.svg';
import iconCheck from '../assets/noun-checkmark-3772773.svg';
import iconPaid from '../assets/icon-badgecheck.svg';
import iconUnpaid from '../assets/icon-xcircle.svg';
import iconCreditCard from '../assets/icon-creditcard.svg';
import iconBanknotes from '../assets/icon-banknotes.svg';
import iconStorefront from '../assets/icon-storefront.svg';
import iconTruck from '../assets/icon-truck.svg';

const orderPublicDummy: OrderDetailSpec = {
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
		{ category: 'Biaya Tambahan', label: 'Pewangi tambahan', price: 5000 },
		{ category: 'Biaya Tambahan', label: 'Biaya transportasi', price: 10000 },
		{ category: 'Diskon', label: 'Diskon awal bulan', price: 15000 },
	],
	net_price: 160000,
	payments: [
		{ paydate: new Date('2023-08-05T17:00:00.000Z'), desc: 'DP', price: 60000 },
		{ paydate: new Date('2023-08-06T17:00:00.000Z'), desc: 'Tambah transfer', price: 40000 },
	],
	current_bill: 60000,
	notes_internal: '',
	notes_invoice: 'Pemilihan pengharum diserahkan pada pihak laundry pada saat pemesanan',
	method_payment: 'Transfer',
	method_shipping: 'Kurir pihak ketiga',
	order_paid: false,
	order_status: 'Sedang cuci',
};

const invoiceConfig = {
	message_start: 'TauRental\nJl. Meroket Bersama 1 Jakarta Pusat',
	message_end: 'Pembayaran ke bank BCA rek 12345678\nTerima kasih atas kepercayaannya.',
};

const StatusCircle = ({ fill }: { fill: boolean }) => {
	return (
		<div
			className={`w-2/5 aspect-square max-w-[1rem] max-h-[1rem] rounded-full flex items-center justify-center border-2 ${
				fill ? 'border-[#1f223c] bg-[#1f223c]' : 'border-[#bdbdbd] bg-white'
			}`}
		>
			<div
				className={`aspect-square rounded-full ${fill ? 'hidden' : 'w-1/2 bg-[#bdbdbd]'}`}
			></div>
		</div>
	);
};

function OrderDetailPublic() {
	const { id: paramId } = useParams();
	const invoiceStartMessage = invoiceConfig.message_start;
	const invoiceEndMessage = invoiceConfig.message_end;
	const {
		order_id: orderId,
		customer,
		start_date: startDate,
		services,
		add_fees: addFees,
		net_price: netPrice,
		payments,
		current_bill: currentBill,
		notes_invoice: notes,
		method_payment: paymentMethod,
		method_shipping: shippingMethod,
		order_paid: orderPaid,
		order_status: orderStatus,
	} = orderPublicDummy;

	let displayedOrderStatus = '';

	let displayedOrderPaid = '';
	if (!orderPaid) {
		displayedOrderPaid = ',\nmenunggu pembayaran';
	}

	if (orderStatus === 'Pesanan selesai' && orderPaid) {
		displayedOrderStatus = 'Transaksi selesai';
	} else if (orderStatus === 'Sedang cuci') {
		displayedOrderStatus = `Barang sedang dicuci${displayedOrderPaid}`;
	} else if (orderStatus === 'Tunggu jemput' && orderPaid) {
		displayedOrderStatus = 'Barang dapat diambil';
	} else {
		displayedOrderStatus = `Barang selesai dicuci${displayedOrderPaid}`;
	}

	return (
		<div className="w-full min-h-screen bg-[#e5e7eb] flex flex-col items-center relative pt-10">
			<main className="page-container">
				<section className="page-section py-6">
					<div className="card-white p-4 w-full whitespace-pre-wrap">
						{invoiceStartMessage}
					</div>
				</section>
				<section className="page-section py-6">
					<div className="card-white p-4 w-full">
						<div className="w-full flex justify-between">
							<div className="order-status-square mb-3.5">
								<img
									src={iconNotes}
									alt=""
									className="w-full relative translate-y-[15%] translate-x-[5%]"
								/>
							</div>
							<div className="order-status-square mb-3.5">
								<img
									src={iconWater}
									alt=""
									className={`w-[90%] relative translate-y-[12%] ${
										orderStatus === 'Sedang cuci' ||
										orderStatus === 'Tunggu jemput' ||
										orderStatus === 'Pesanan selesai'
											? 'filter-icon-dark'
											: 'filter-icon-grey'
									}`}
								/>
							</div>
							<div className="order-status-square mb-3.5">
								<img
									src={iconBasket}
									alt=""
									className={`w-full relative translate-y-[10%] ${
										orderStatus === 'Tunggu jemput' ||
										orderStatus === 'Pesanan selesai'
											? 'filter-icon-dark'
											: 'filter-icon-grey'
									}`}
								/>
							</div>
							<div className="order-status-square mb-3.5">
								<img
									src={iconCheck}
									alt=""
									className={`w-[90%] relative translate-y-[20%] ${
										orderStatus === 'Pesanan selesai' && orderPaid
											? 'filter-icon-dark'
											: 'filter-icon-grey'
									}`}
								/>
							</div>
						</div>
						<div className="w-full flex relative min-h-[1rem] pb-[3%] mb-4">
							<div className="absolute flex items-center w-full bottom-1/2 translate-y-1/2">
								<div className="h-full w-[6.25%] max-w-[1.4rem]"></div>
								<div className="w-full h-[3px] bg-[#bdbdbd]">
									<div
										className={`h-full bg-[#1f223c] ${
											orderStatus === 'Pesanan selesai' && orderPaid
												? 'w-full'
												: orderStatus === 'Tunggu jemput' ||
												orderStatus === 'Pesanan selesai'
												? 'w-2/3'
												: 'w-1/3'
										}`}
									/>
								</div>
								<div className="h-full w-[6.25%] max-w-[1.4rem]"></div>
							</div>
							<div className="absolute w-full flex justify-between bottom-1/2 translate-y-1/2">
								<div className="order-status-square">
									<StatusCircle fill={true} />
								</div>
								<div className="order-status-square">
									<StatusCircle
										fill={
											orderStatus === 'Sedang cuci' ||
											orderStatus === 'Tunggu jemput' ||
											orderStatus === 'Pesanan selesai'
										}
									/>
								</div>
								<div className="order-status-square">
									<StatusCircle
										fill={
											orderStatus === 'Tunggu jemput' ||
											orderStatus === 'Pesanan selesai'
										}
									/>
								</div>
								<div className="order-status-square">
									<StatusCircle
										fill={orderStatus === 'Pesanan selesai' && orderPaid}
									/>
								</div>
							</div>
						</div>
						<p className="w-full text-center whitespace-pre-wrap font-semibold">
							{displayedOrderStatus}
						</p>
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Detail Pesanan
					</h3>
					<div className="card-white p-4 w-full">
						<ul className="flex flex-col gap-y-2 text-[0.8125rem] leading-normal font-normal">
							<li>Nomor {orderId}</li>
							<li>{format(startDate, 'PPP', { locale: localeId })}</li>
							<li className="w-full py-2">
								<div className="bg-gray-300 w-full h-[1px]" />
							</li>
							<li>
								{customer.name} – {customer.phone}
							</li>
							<li className="whitespace-pre-wrap">{customer.address}</li>
							<li className="w-full py-2">
								<div className="bg-gray-300 w-full h-[1px]" />
							</li>
							<li className="flex items-center gap-x-3">
								<p className="w-[7rem]">Pembayaran:</p>
								<div className="flex items-center">
									<img
										src={
											paymentMethod === 'Transfer'
												? iconCreditCard
												: iconBanknotes
										}
										alt=""
										className="w-5 h-5 filter-green-600 mr-1.5"
									/>
									<p className="text-green-600 font-medium">{paymentMethod}</p>
								</div>
							</li>
							<li className="flex items-center gap-x-3">
								<p className="w-[7rem]">Pengiriman:</p>
								<div className="flex items-center">
									<img
										src={
											shippingMethod === 'Antar sendiri'
												? iconStorefront
												: iconTruck
										}
										alt=""
										className="w-5 h-5 mr-1.5 filter-green-600"
									/>
									<p className="text-green-600 font-medium">{shippingMethod}</p>
								</div>
							</li>
							<li className="flex items-center gap-x-3">
								<p className="w-[7rem]">Status pesanan:</p>
								<div className="flex items-center">
									<img
										src={orderPaid ? iconPaid : iconUnpaid}
										alt=""
										className={`w-5 h-5 mr-1.5 ${
											orderPaid ? 'filter-green-600' : 'filter-orange-600'
										}`}
									/>
									{orderPaid ? (
										<p className="text-green-600 font-medium">Lunas</p>
									) : (
										<p className="text-red-500 font-medium">Belum lunas</p>
									)}
								</div>
							</li>
							<li className="w-full py-2">
								<div className="bg-gray-300 w-full h-[1px]" />
							</li>
							<li>
								<p>{notes.length > 0 ? notes : 'Tidak ada catatan'}</p>
							</li>
						</ul>
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Link Pembayaran
					</h3>
					<div className="card-white px-4 w-full">
						<div className="py-4 w-full overflow-x-auto">
							<a href="#" className="text-theme-blue">
								{`http://laundry.supersewa.id/unrestricted/orders/${
									paramId ? paramId : '0'
								}/xendit`}
							</a>
						</div>
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Paket Cuci
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
									cardCategory="forDisplay"
								/>
							</React.Fragment>
						))}
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Detail Tagihan
					</h3>
					<div className="card-white w-full p-4">
						<h5 className="font-semibold mb-4">Tagihan</h5>

						{services?.map((service, index) => {
							return (
								<div
									key={`service-invoice-${index}`}
									className="w-full flex justify-between pb-4"
								>
									<p>{service.name}</p>
									<p>{formatPrice(service.quantity * service.price)}</p>
								</div>
							);
						})}
						{addFees?.map((addFee, index) => {
							return (
								<div
									key={`addfee-invoice-${index}`}
									className="w-full flex justify-between pb-4 gap-x-3"
								>
									<p>{addFee.label}</p>
									<p className="whitespace-nowrap">
										{`${addFee.category === 'Diskon' ? '–' : ''} ${formatPrice(
											addFee.price
										)}`}
									</p>
								</div>
							);
						})}

						<div className="bg-gray-300 w-full h-[1px] mb-4" />
						<div className="w-full flex justify-between font-semibold mb-6">
							<p>Total</p>
							<p className="whitespace-nowrap">{formatPrice(netPrice)}</p>
						</div>
						<h5 className="font-semibold mb-4">Pembayaran</h5>

						{payments ? (
							payments.map((payment, index) => {
								return (
									<div
										key={`payment-${index}`}
										className="bg-white w-full flex justify-between pb-4"
									>
										<p>
											{format(payment.paydate, 'd LLL', {
												locale: localeId,
											})}
										</p>
										<p className="whitespace-nowrap">
											{formatPrice(payment.price)}
										</p>
									</div>
								);
							})
						) : (
							<div className="w-full bg-white pb-4">Belum ada pembayaran</div>
						)}
						<div className="bg-gray-300 w-full h-[1px] mb-4" />
						<div className="w-full flex justify-between font-semibold">
							<p>Sisa Tagihan</p>
							<p className="whitespace-nowrap">{formatPrice(currentBill)}</p>
						</div>
					</div>
				</section>
				<section className="page-section py-6">
					<div className="card-white p-4 w-full whitespace-pre-wrap">
						{invoiceEndMessage}
					</div>
				</section>

				<p className="mb-6">Powered by Supersewa</p>
				<div className="h-[4.625rem] min-[768px]:mb-6" />
			</main>
			<div className="w-full flex flex-col items-center fixed bottom-0 left-0">
				<div className="page-container">
					<section className="page-section">
						<div className="card-white p-4 rounded-b-none min-[768px]:rounded-b">
							<button
								className="button-color h-[2.5rem] font-medium flex items-center justify-center gap-1 w-60 min-[768px]:w-fit"
								style={{
									backgroundColor: '#22c55e',
									borderColor: '#22c55e',
									outlineColor: '#22c55e',
								}}
							>
								<img src={iconWhatsApp} alt="" className="invert w-4" />
								Hubungi rental
							</button>
						</div>
						<div className="pb-6 hidden min-[768px]:block" />
					</section>
				</div>
			</div>
		</div>
	);
}

export default OrderDetailPublic;
