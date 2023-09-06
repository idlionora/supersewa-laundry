import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
	OrderBasicSpec,
	parseOrdersData,
	parseActiveData,
	parseUnpaidOrdersData,
} from '../lib/ordersDataParse.tsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import orderDataDummy from '../lib/orderDataDummy.tsx';
import OrdersDataCard from '../components/OrdersDataCard.tsx';
import iconSearch from '../assets/icon-search.svg';
import { ChevronDown } from 'lucide-react';
import DropdownComp from '../components/DropdownComp.tsx';

type OrderPageType = {
	cardsCategory: string;
};

function Orders({ cardsCategory }: OrderPageType) {
	const allOrderDatas = useMemo(() => parseOrdersData(), []);
	const activeOrderDatas = useMemo(() => parseActiveData(), []);
	const unpaidOrderDatas = useMemo(() => parseUnpaidOrdersData(), []);

	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
	const categoryRef = useRef<HTMLDivElement>(null)

	const [currentActiveDatas, setCurrentActiveDatas] =
		useState<OrderBasicSpec[]>(activeOrderDatas);
	const [currentDataMarker, setCurrentDataMarker] = useState('Masih Proses');
	const [filteredActiveDatas, setFilteredActiveDatas] = useState<OrderBasicSpec[] | null>(null);
	const [globalFilter, setGlobalFilter] = useState('');
	const [isDropdownActive, setIsDropdownActive] = useState(false)
	const [maxPageNum, setMaxPageNum] = useState(1);
	const contentPerPage = 25;
	const currentPage =
		parseInt(searchParams.get('page') ?? '1') > 0
			? parseInt(searchParams.get('page') ?? '1')
			: 1;

	if (currentDataMarker !== cardsCategory && cardsCategory === 'Semua Data') {
		setCurrentActiveDatas(allOrderDatas);
		setCurrentDataMarker('Semua Data');
		setMaxPageNum(Math.ceil(allOrderDatas.length / contentPerPage));
	}
	if (currentDataMarker !== cardsCategory && cardsCategory === 'Masih Proses') {
		setCurrentActiveDatas(activeOrderDatas);
		setCurrentDataMarker('Masih Proses');
		setMaxPageNum(Math.ceil(activeOrderDatas.length / contentPerPage));
	}
	if (currentDataMarker !== cardsCategory && cardsCategory === 'Belum Bayar') {
		setCurrentActiveDatas(unpaidOrderDatas);
		setCurrentDataMarker('Belum Bayar');
		setMaxPageNum(Math.ceil(unpaidOrderDatas.length / contentPerPage));
	}

	useEffect(() => {
		document.addEventListener('mousedown', closeCategoryDropdown)

		return () => {
			document.removeEventListener('mousedown', closeCategoryDropdown)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDropdownActive])

	function closeCategoryDropdown(event: MouseEvent) {
		if (categoryRef && isDropdownActive && !categoryRef.current?.contains(event.target as Node)){
			setIsDropdownActive(false)
		}
	}

	function spliceActiveDatas(datas: OrderBasicSpec[]) {
		const splicedCurrentDatas: OrderBasicSpec[] = [...datas];

		if (currentPage > 1) {
			splicedCurrentDatas.splice(0, contentPerPage * (currentPage - 1));
		}

		if (splicedCurrentDatas.length > contentPerPage) {
			splicedCurrentDatas.splice(contentPerPage);
		}

		return splicedCurrentDatas;
	}

	function filterActiveDatas(filter: string) {
		const filteredDatas: OrderBasicSpec[] = [...orderDataDummy];

		if (filter.length < 1) {
			setFilteredActiveDatas(null);
			updatePageCount(currentActiveDatas);
			return;
		}

		currentActiveDatas.forEach((data) => {
			if (data.customer_name.toLowerCase().includes(filter.toLowerCase())) {
				filteredDatas.push(data);
				return;
			}

			if (data.net_price.toString().includes(filter)) {
				filteredDatas.push(data);
				return;
			}

			if (data.order_status.toLowerCase().includes(filter.toLowerCase())) {
				filteredDatas.push(data);
				return;
			}
		});

		if (filteredDatas.length > 1) {
			filteredDatas.shift();
			setFilteredActiveDatas(filteredDatas);

			updatePageCount(filteredDatas);
		}
	}

	function updatePageCount(activeDatas: OrderBasicSpec[]) {
		const latestMaxPageNum = Math.ceil(activeDatas.length / contentPerPage);
		if (maxPageNum !== latestMaxPageNum) {
			setMaxPageNum(latestMaxPageNum);
		}
		if (currentPage !== 1) {
			setSearchParams({ page: '1' });
		}
	}

	useEffect(() => {
		clearInterval(timeoutId.current);
		timeoutId.current = setTimeout(() => {
			filterActiveDatas(globalFilter);
		}, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalFilter]);

	function navigateFromDropdown(option: string) {
		if (option === 'Semua Data') {
			navigate('/orders/all');
		} else if (option === 'Belum Bayar') {
			navigate('/orders/unpaid');
		} else {
			navigate('/orders/ongoing');
		}
	}

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<div className="card-white px-4 pt-2 pb-3 w-full mb-4">
					<label htmlFor="orders-filter" className="text-sm block mb-2 font-medium">
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
						<DropdownComp title='cards-category' isDropdownActive={isDropdownActive} setActiveDropdown={() => setIsDropdownActive(false)} options={['Semua Data', 'Masih Proses', 'Belum Bayar']} selectedOption={cardsCategory} setSelectedOption={(input:string) => navigateFromDropdown(input)} parentClass='' childClass='w-36 translate-x-1/2 right-1/2' ref={categoryRef}>
							<button className="form-input mb-0 flex items-center gap-x-2" onClick={() => setIsDropdownActive(!isDropdownActive)}>
								<p>{cardsCategory}</p>
								<ChevronDown className="h-4 w-4 opacity-50" />
							</button>
						</DropdownComp>
					</div>
				</div>
				<div className="w-full mb-4 px-2.5 min-[575px]:px-0 flex justify-center sm:justify-start items-center">
					<div className="shrink-0 flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
						<button
							className="button-pagination rounded-l"
							onClick={() => {
								setSearchParams({
									page: (currentPage - 1).toString(),
								});
							}}
							disabled={currentPage === 1}
						>
							←
						</button>
						{currentPage > 1 ? (
							<button
								className="button-pagination"
								onClick={() => setSearchParams({ page: '1' })}
							>
								1
							</button>
						) : (
							''
						)}
						{currentPage > 2 ? (
							<div className="px-3 py-2 bg-white border border-transparent font-semibold">
								...
							</div>
						) : (
							''
						)}
						<div className="px-3 py-2 bg-theme-blue text-white border border-transparent font-semibold">
							{currentPage}
						</div>
						{currentPage < maxPageNum - 1 && maxPageNum > 2 ? (
							<div className="px-3 py-2 bg-white border border-transparent font-semibold">
								...
							</div>
						) : (
							''
						)}
						{currentPage < maxPageNum ? (
							<button
								className="button-pagination"
								onClick={() => setSearchParams({ page: maxPageNum.toString() })}
							>
								{maxPageNum}
							</button>
						) : (
							''
						)}
						<button
							className="button-pagination rounded-r"
							onClick={() => setSearchParams({ page: (currentPage + 1).toString() })}
							disabled={currentPage >= maxPageNum}
						>
							→
						</button>
					</div>
				</div>
				<div className="card-white w-full bg-gray-300 flex flex-col gap-y-0.5">
					{filteredActiveDatas ? (
						spliceActiveDatas(filteredActiveDatas).map((data, index) => (
							<React.Fragment key={`ordercard-${index}`}>
								<OrdersDataCard
									data={data}
									childNum={
										index === 0
											? 'first'
											: index ===
											spliceActiveDatas(filteredActiveDatas).length - 1
											? 'last'
											: index
									}
								/>
							</React.Fragment>
						))
					) : currentActiveDatas[0].order_id === 0 ? (
						<p className="w-full text-center p-4">Data tidak ditemukan</p>
					) : (
						spliceActiveDatas(currentActiveDatas).map((data, index) => (
							<React.Fragment key={`ordercard-${index}`}>
								<OrdersDataCard
									data={data}
									childNum={
										index === 0
											? 'first'
											: index ===
											spliceActiveDatas(currentActiveDatas).length - 1
											? 'last'
											: index
									}
								/>
							</React.Fragment>
						))
					)}
				</div>
			</section>
			<div className="w-full mb-4 px-2.5 min-[575px]:px-0 flex justify-center sm:justify-start items-center">
				<div className="shrink-0 flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
					<button
						className="button-pagination rounded-l"
						onClick={() => {
							setSearchParams({
								page: (currentPage - 1).toString(),
							});
						}}
						disabled={currentPage === 1}
					>
						←
					</button>
					{currentPage > 1 ? (
						<button
							className="button-pagination"
							onClick={() => setSearchParams({ page: '1' })}
						>
							1
						</button>
					) : (
						''
					)}
					{currentPage > 2 ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					<div className="px-3 py-2 bg-theme-blue text-white border border-transparent font-semibold">
						{currentPage}
					</div>
					{currentPage < maxPageNum - 1 && maxPageNum > 2 ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					{currentPage < maxPageNum ? (
						<button
							className="button-pagination"
							onClick={() => setSearchParams({ page: maxPageNum.toString() })}
						>
							{maxPageNum}
						</button>
					) : (
						''
					)}
					<button
						className="button-pagination rounded-r"
						onClick={() => setSearchParams({ page: (currentPage + 1).toString() })}
						disabled={currentPage >= maxPageNum}
					>
						→
					</button>
				</div>
			</div>
			<div className="w-full h-20 xl-h-16" />
		</main>
	);
}

export default Orders;
