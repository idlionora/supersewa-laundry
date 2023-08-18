import { useState, useEffect } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select.tsx';
import iconSearch from '../assets/icon-search.svg';
import useTrackedOrdersPageStore from '../stores/ordersPageStore.tsx';
import { OrdersDataType } from '../stores/ordersPageStore.tsx';
import { useNavigate } from 'react-router-dom';

type OrderPageType = {
	cardsCategory: string;
};

function Orders({ cardsCategory }: OrderPageType) {
	const store = useTrackedOrdersPageStore();
	const navigate = useNavigate();

	const [currentActiveData, setCurrentActiveData] = useState<OrdersDataType[]>(store.activeOrdersData);
	const [currentDataMarker, setCurrentDataMarker] = useState('Masih Proses')
	const [globalFilter, setGlobalFilter] = useState('');
	const [maxPageNum, setMaxPageNum] = useState(1);
	const [pageNum, setPageNum] = useState<number>(1);

	if (currentDataMarker !== cardsCategory && cardsCategory === 'Semua Data') {
		setCurrentActiveData(store.allOrdersData)
		setCurrentDataMarker('Semua Data')
		setMaxPageNum(Math.ceil(store.allOrdersData.length / parseInt(store.contentNum)));
	}
	if (currentDataMarker !== cardsCategory && cardsCategory === 'Masih Proses') {
		setCurrentActiveData(store.activeOrdersData)
		setCurrentDataMarker('Masih Proses')
		setMaxPageNum(Math.ceil(store.activeOrdersData.length / parseInt(store.contentNum)));
	}
	if (currentDataMarker !== cardsCategory && cardsCategory === 'Belum Bayar') {
		setCurrentActiveData(store.unpaidOrdersData)
		setCurrentDataMarker('Belum Bayar')
		setMaxPageNum(Math.ceil(store.unpaidOrdersData.length / parseInt(store.contentNum)));
	}

	useEffect(() => {
		const latestMaxPageNum = Math.ceil(currentActiveData.length/ parseInt(store.contentNum))
		if (maxPageNum !== latestMaxPageNum) {
			setMaxPageNum(latestMaxPageNum)
		}
	}, [store.contentNum])

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
							<Select
								value={cardsCategory}
								onValueChange={(category) => {
									if (category === 'Semua Data') {
										navigate('/orders/all');
									} else if (category === 'Masih Proses') {
										navigate('/orders/ongoing');
									} else {
										navigate('/orders/unpaid');
									}
								}}
							>
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
						<Select
							value={store.contentNum}
							onValueChange={store.setContentNum}
						>
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
