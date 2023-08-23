import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import iconArrowLeft from '../assets/icon-arrowleft.svg';
import { ServiceType, FeeType, CustomerType } from '../stores/orderStore';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import iconPencil from '../assets/icon-pencil.svg'
import iconCreditCard from '../assets/icon-creditcard.svg'
import iconBanknotes from '../assets/icon-banknotes.svg'
import iconPaid from '../assets/icon-badgecheck.svg';
import iconUnpaid from '../assets/icon-xcircle.svg'
import iconStorefront from '../assets/icon-storefront.svg'
import iconTruck from '../assets/icon-truck.svg'
import OrderServiceCard from '../components/OrderServiceCard';

type DetailDataType = {
	order_id: number;
	customer: CustomerType;
	start_date: Date;
	user_email: string;
	services: ServiceType[] | null;
	add_fees: FeeType[] | null;
	net_price: number;
	notes_internal: string;
	method_payment: string;
	method_shipping: string;
	order_paid: boolean;
	order_status: string;
};

const detailData: DetailDataType = {
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
		{ id: 9, name: 'Carseat Kecil', priceRange: '99-129k', img: 'imgCarseatSm', quantity: 1, price: 100000, desc: '' },
	],
	add_fees: [
		{ category: 'additional', label: 'Pewangi tambahan', price: 5000 },
		{ category: 'additional', label: 'Biaya transportasi', price: 10000 },
		{ category: 'discount', label: 'Diskon awal bulan', price: 15000 },
	],
	net_price: 160000,
	notes_internal: '',
	method_payment: 'Transfer',
	method_shipping: 'Kurir pihak ketiga',
	order_paid: false,
	order_status: 'Sedang cuci',
};

function OrderDetail() {
	const { id: paramId } = useParams();
	const navigate = useNavigate()
	const {
		order_id: orderId,
		customer,
		start_date: startDate,
		user_email: userEmail,
		notes_internal: notes,
		method_payment: paymentMethod,
		method_shipping: shippingMethod,
		order_paid: orderPaid,
		order_status: orderStatus,
	} = detailData;
	const [services, setServices] = useState(detailData.services);
	const [addFees, setAddFees] = useState(detailData.add_fees);
	const [netPrice, setNetPrice] = useState(detailData.net_price);
	const [orderInfo, setOrderInfo] = useState({
		notes,
		paymentMethod,
		shippingMethod,
		orderPaid,
		orderStatus,
	});

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
							<div className="w-full sm:w-3/4">{customer.name}</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Telepon</div>
							<div className="w-full sm:w-3/4">{customer.phone}</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Alamat</div>
							<div className="w-full sm:w-3/4">{customer.address}</div>
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
							<div className="w-full sm:w-3/4 flex items-center">
								{orderInfo.notes.length > 1 ? orderInfo.notes : '–'}
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Metode Bayar</div>
							<div className="w-full sm:w-3/4 flex items-center font-medium">
								<img
									src={
										orderInfo.paymentMethod === 'Transfer'
											? iconCreditCard
											: iconBanknotes
									}
									alt=""
									className="w-5 h-5 ml-[-2px] filter-green-600 mr-1.5"
								/>
								<p className="text-green-600">{orderInfo.paymentMethod}</p>
								<button>
									<img
										src={iconPencil}
										alt="Ubah"
										className="w-4 h-4 filter-orange-600 ml-3"
									/>
								</button>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Status Bayar</div>
							<div className="w-full sm:w-3/4 flex items-center font-medium">
								<img
									src={orderInfo.orderPaid ? iconPaid : iconUnpaid}
									alt=""
									className={`w-5 h-5 ml-[-2px] mr-1.5 ${
										orderInfo.orderPaid
											? 'filter-green-600'
											: 'filter-orange-600'
									}`}
								/>
								{orderInfo.orderPaid ? (
									<p className="text-green-600">Lunas</p>
								) : (
									<p className="text-orange-600">Belum lunas</p>
								)}
								<button>
									<img
										src={iconPencil}
										alt="Ubah"
										className="w-4 h-4 filter-orange-600 ml-3"
									/>
								</button>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Metode Kirim</div>
							<div className="w-full sm:w-3/4 flex items-center font-medium">
								<img
									src={
										orderInfo.shippingMethod === 'Antar sendiri'
											? iconStorefront
											: iconTruck
									}
									alt=""
									className="w-5 h-5 ml-[-2px] mr-1.5 filter-green-600"
								/>
								<p className="text-green-600">{orderInfo.shippingMethod}</p>
								<button>
									<img
										src={iconPencil}
										alt="Ubah"
										className="w-4 h-4 filter-orange-600 ml-3"
									/>
								</button>
							</div>
						</li>
						<li className="detail-col-grid">
							<div className="detail-left-grid">Status Pesanan</div>
							<div
								className={`w-full sm:w-3/4 flex items-center font-medium ${
									orderInfo.orderStatus === 'Sedang cuci'
										? 'text-theme-blue'
										: orderInfo.orderStatus === 'Tunggu jemput'
										? 'text-orange-500'
										: 'text-green-600'
								}`}
							>
								<p>{orderInfo.orderStatus}</p>
								<button>
									<img
										src={iconPencil}
										alt="Ubah"
										className="w-4 h-4 filter-orange-600 ml-3"
									/>
								</button>
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
							<OrderServiceCard
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
				<button className="button-gray text-sm mt-4">+ Tambah Layanan</button>
			</section>
			<section className="page-section my-4">
				<h3>
					<span className="hashtag-bullet">#</span> Pembayaran
				</h3>
				<div className="card-white w-full bg-gray-300 flex flex-col gap-y-0.5"></div>
			</section>
			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default OrderDetail;
