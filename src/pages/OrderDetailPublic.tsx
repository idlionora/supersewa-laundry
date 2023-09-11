import React from 'react';
import { useParams } from 'react-router-dom';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import { OrderDetailSpec } from './OrderDetail';
import iconPaid from '../assets/icon-badgecheck.svg';
import iconUnpaid from '../assets/icon-xcircle.svg';
import iconCreditCard from '../assets/icon-creditcard.svg';
import iconBanknotes from '../assets/icon-banknotes.svg';
import iconStorefront from '../assets/icon-storefront.svg';
import iconTruck from '../assets/icon-truck.svg';
import OrderDetailServiceCard from '../components/OrderDetailServiceCard';
import formatPrice from '../lib/formatPrice';

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

function OrderDetailPublic() {
	const { id: paramId } = useParams();
	const invoiceStartMessage = invoiceConfig.message_start;
	const invoiceEndMessage = invoiceConfig.message_end;

	const {
		order_id: orderId,
		customer,
		start_date: startDate,
		user_email: userEmail,
		services,
		add_fees: addFees,
		net_price: netPrice,
		payments,
		current_bill: currentBill,
		notes_invoice: notes,
		method_payment: paymentMethod,
		method_shipping: shippingMethod,
		order_paid: orderPaid,
	} = orderPublicDummy;
	return (
		<div className="w-full min-h-screen bg-[#e5e7eb] flex flex-col items-center relative pt-10">
			<main className="page-container">
				<section className="page-section py-6">
					<div className="card-white p-4 w-full whitespace-pre-wrap">
						{invoiceStartMessage}
					</div>
				</section>
				<section className="page-section py-6">
					<div className="card-white p-4 w-full">Menunggu Pembayaran</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Detail Pesanan
					</h3>
					<div className="card-white p-4 w-full">
						<ul className="flex flex-col gap-y-6">
							<li className="detail-col-grid">
								<div className="detail-left-grid">Nomor Pesanan</div>
								<div className="w-full sm:w-3/4">{orderId}</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Dibuat</div>
								<div className="w-full sm:w-3/4">
									{format(startDate, 'd/M/yy', { locale: localeId })}
								</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Pemesan</div>
								<div className="w-full sm:w-3/4">{customer.name}</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Telepon</div>
								<div className="w-full sm:w-3/4">{customer.phone}</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Alamat</div>
								<div className="w-full sm:w-3/4 whitespace-pre-wrap">
									{customer.address}
								</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Status Pesanan</div>
								<div className="w-full sm:w-3/4 flex items-center font-medium">
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
										<p className="text-red-500">Belum lunas</p>
									)}
								</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Pembayaran</div>
								<div className="w-full sm:w-3/4 flex items-center font-medium">
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
								</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Pengiriman</div>
								<div className="w-full sm:w-3/4 flex items-center font-medium">
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
								</div>
							</li>
							<li className="detail-col-grid">
								<div className="detail-left-grid">Catatan</div>
								<div className="w-full sm:w-3/4 whitespace-pre-wrap">{notes}</div>
							</li>
						</ul>
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
						<span className="hashtag-bullet">#</span> Link Pembayaran
					</h3>
					<div className="card-white p-4 w-full">
						<a href="#">
							{`http://laundry.supersewa.id/unrestricted/orders/${
								paramId ? paramId : '0'
							}/xendit`}
						</a>
					</div>
				</section>
				<section className="page-section py-6">
					<h3 className="leading-[1.2]">
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
			</main>
		</div>
	);
}

export default OrderDetailPublic;
