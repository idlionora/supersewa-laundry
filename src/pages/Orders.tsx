import { useState, useEffect, useMemo } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select.tsx';
import orders from '../../data/orders.json';
import iconSearch from '../assets/icon-search.svg';

type OrdersDataType = {
	order_id: number;
	customer_name: string;
	img: string;
	start_date: Date;
	net_price: number;
	order_paid: boolean;
	order_status: string;
};

function parseOrdersData() {
	const data: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	orders.data.forEach(
		({ order_id, customer_name, img, start_date, net_price, order_paid, order_status }) =>
			data.unshift({
				order_id: order_id,
				customer_name: customer_name,
				img: img,
				start_date: new Date(start_date),
				net_price: parseInt(net_price),
				order_paid: order_paid,
				order_status: order_status,
			})
	);
	data.splice(data.length - 1);
	return data;
}

function parseActiveData(ordersData: OrdersDataType[]) {
	const activeData: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	const inWashIndexes = [99999];
	const picklistIndexes = [99999];
	const unpaidIndexes = [99999];

	ordersData.forEach(({ order_paid, order_status }, index) => {
		if (order_status === 'Sedang cuci') {
			inWashIndexes.push(index);
			return;
		}

		if (order_status === 'Tunggu jemput') {
			picklistIndexes.push(index);
			return;
		}

		if (!order_paid) {
			unpaidIndexes.push(index);
		}
	});

	function addToActiveData(indexArray: number[]) {
		indexArray.splice(0, 1);
		indexArray.forEach((index) => {
			activeData.push(ordersData[index]);
		});
	}

	addToActiveData(inWashIndexes);
	addToActiveData(picklistIndexes);
	addToActiveData(unpaidIndexes);
	activeData.splice(0, 1);

	return activeData;
}

function parseUnpaidOrdersData(ordersData: OrdersDataType[]) {
	const unpaidData: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	ordersData.forEach((order) => {
		if (!order.order_paid) {
			unpaidData.push(order);
		}
	});
	unpaidData.splice(0, 1);
	return unpaidData;
}

function Orders() {
	const allOrdersData: OrdersDataType[] = useMemo(() => parseOrdersData(), []);
	const activeOrdersData: OrdersDataType[] = useMemo(
		() => parseActiveData(allOrdersData),
		[allOrdersData]
	);
	const unpaidOrdersData: OrdersDataType[] = useMemo(
		() => parseUnpaidOrdersData(allOrdersData),
		[allOrdersData]
	);

	const [currentActiveData, setCurrentActiveData] = useState<OrdersDataType[]>(activeOrdersData);
	const [globalFilter, setGlobalFilter] = useState('');
	const [dataCategory, setDataCategory] = useState('Masih Proses');
	const [contentNum, setContentNum] = useState<string>('10');
	const [maxPageNum, setMaxPageNum] = useState<number>(Math.ceil(activeOrdersData.length / 10));
	const [pageNum, setPageNum] = useState<number>(1);

	useEffect(() => {
		function setDataStates(ordersData: OrdersDataType[]) {
			setCurrentActiveData(ordersData);
			setMaxPageNum(Math.ceil(ordersData.length / parseInt(contentNum)));
		}

		if (dataCategory === 'Semua Data') setDataStates(allOrdersData);

		if (dataCategory === 'Masih Proses') setDataStates(activeOrdersData);

		if (dataCategory === 'Belum Bayar') setDataStates(unpaidOrdersData);

        setPageNum(1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataCategory, contentNum]);
	console.log(maxPageNum);

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<div className="card-white px-4 pt-2 pb-3 w-full mb-4">
					<label htmlFor="orders-name-filter" className="text-sm block mb-2 font-medium">
						Filter Pesanan
					</label>
					<div className="w-full flex flex-col min-[500px]:flex-row items-center gap-3.5">
						<div className="w-full relative">
							<input
								type="text"
								id="orders-filter"
								name="orders-filter"
								value={globalFilter}
								className="form-input mb-0 w-full pl-9"
								onChange={(e) => setGlobalFilter(e.target.value)}
								placeholder="cari pelanggan, total harga, atau status"
							/>
							<div className="absolute top-0 left-0 h-[2.75rem] flex items-center">
								<img
									src={iconSearch}
									alt=""
									className="w-5 ml-2 invert contrast-[20%]"
								/>
							</div>
						</div>
						<div className="flex items-center">
							<Select value={dataCategory} onValueChange={setDataCategory}>
								<SelectTrigger className="bg-white whitespace-nowrap gap-2.5 px-2.5 text-[0.875rem] focus:ring-0 focus:outline-offset-[-1px] focus:outline-green-600 hover:bg-slate-50">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Semua Data">Semua Data</SelectItem>
									<SelectItem value="Masih Proses">Masih Proses</SelectItem>
									<SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<div className="w-full mb-4 px-2.5 min-[575px]:px-0 flex flex-col min-[365px]:flex-row gap-y-4 justify-between items-center">
					<div className="flex items-center min-[365px]:justify-end mt-0">
						<Select value={contentNum} onValueChange={setContentNum}>
							<SelectTrigger className="w-16 gap-1.5 px-2.5 bg-white h-[2.344rem] text-[0.8125rem] focus:ring-0 focus:outline-offset-0 focus:outline-amber-500">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
							</SelectContent>
						</Select>
						<p className="ml-1 text-left min-[575px]:max-w-none">pesanan per halaman</p>
					</div>
					<div className="shrink-0 flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
						<button
							className="button-pagination rounded-l"
							onClick={() => setPageNum((prevNum) => prevNum - 1)}
							disabled={pageNum === 1}
						>
							←
						</button>
						{pageNum > 1 ? (
							<button
								className="button-pagination"
								onClick={() => {
									setPageNum(1);
								}}
							>
								1
							</button>
						) : (
							''
						)}
						{pageNum > 2 ? (
							<div className="px-3 py-2 bg-white border border-transparent font-semibold">
								...
							</div>
						) : (
							''
						)}
						<div className="px-3 py-2 bg-theme-blue text-white border border-transparent font-semibold">
							{pageNum}
						</div>
						{pageNum < maxPageNum - 1 && maxPageNum > 2 ? (
							<div className="px-3 py-2 bg-white border border-transparent font-semibold">
								...
							</div>
						) : (
							''
						)}
						{pageNum < maxPageNum ? (
							<button
								className="button-pagination"
								onClick={() => setPageNum(maxPageNum)}
							>
								{maxPageNum}
							</button>
						) : (
							''
						)}
						<button
							className="button-pagination rounded-r"
							onClick={() => setPageNum((prevNum) => prevNum + 1)}
							disabled={pageNum == maxPageNum}
						>
							→
						</button>
					</div>
				</div>
			</section>
			<div className="w-full h-20 xl-h-16" />
		</main>
	);
}

export default Orders;
