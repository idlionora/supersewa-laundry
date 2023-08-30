import { useEffect, useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { CustomerType, useTrackedOrderStore } from '../stores/orderStore';
import customers from '../../data/customers.json';
import iconClose from '../assets/icon-x.svg';
import iconSearch from '../assets/icon-search.svg';
import iconPlus from '../assets/icon-plus.svg';
import NewCustomerModal from './NewCustomerModal';

const CustomerSearchModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const [list, setList] = useState<CustomerType[] | null>(null);
	const [activeCol, setActiveCol] = useState<CustomerType | null>(null);

	useEffect(() => {
		inputRef.current?.focus();
		setList(customers.data);
	}, [state.modalDisplay]);

	const selectCustomer = (selectedData: CustomerType) => {
		setActiveCol(selectedData);

		if (inputRef.current && inputRef.current.clientWidth >= 414) {
			orderStore.setCustomer(selectedData);
			state.closeModal();
		}
	};
	const confirmCustomer = () => {
		if (activeCol) {
			orderStore.setCustomer(activeCol);
			state.closeModal();
		}
	};
	return (
		<div
			className="bg-neutral-50 w-full max-w-md h-full min-[448px]:max-h-[85%] sm:max-h-[33.75rem] min-[448px]:rounded-md overflow-hidden relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-white w-full px-4 pt-6 min-[448px]:pt-4 pb-3 shadow-md absolute top-0 left-0 z-10">
				<div className="relative w-full flex items-center mb-2">
					<p className="font-semibold text-sm w-full">Cari Pelanggan</p>
					<button className="absolute right-[-.25rem]" onClick={() => state.closeModal()}>
						<img src={iconClose} alt="Tutup Panel" className="w-5" />
					</button>
				</div>
				<div className="relative">
					<input
						id="input-customersearch"
						name="input-customersearch"
						ref={inputRef}
						type="text"
						className="form-input w-full pl-9"
					/>
					<div className="absolute top-0 left-0 h-[2.75rem] flex items-center">
						<img src={iconSearch} alt="" className="w-5 ml-2 invert contrast-[20%]" />
					</div>
				</div>
			</div>
			<div className="w-full h-full pt-[8rem] overflow-y-auto">
				{list?.map((customer) => {
					return (
						<button
							key={`list-customer-${customer.id}`}
							className={`w-full p-4 flex gap-4 hover:bg-white ease-in-out border border-transparent cursor-pointer text-left ${
								activeCol?.id === customer.id ? 'col-active' : ''
							}`}
							onClick={() => selectCustomer(customer)}
						>
							<div
								className={`relative top-1 rounded-full shrink-0 ${customer.img} text-white w-10 h-10 font-medium text-sm flex justify-center items-center`}
							>
								{customer.name[0]}
							</div>
							<div>
								<p className="font-semibold mb-0.5">{customer.name}</p>
								<p className="mb-0.5">{customer.phone}</p>
								<p>{customer.address}</p>
							</div>
						</button>
					);
				})}
				<div className="min-[448px]:hidden w-full h-[4rem]" />
			</div>
			<button
				className="absolute bg-theme-blue w-14 h-14 min-[300px]:w-16 min-[300px]:h-16 min-[448px]:w-14 min-[448px]:h-14 bottom-20 right-2 min-[448px]:bottom-6 min-[448px]:right-4 rounded-full flex justify-center items-center"
				onClick={() => state.switchModal(<NewCustomerModal />, 'full')}
			>
				<img src={iconPlus} alt="Tambah Pelanggan" className="invert w-9 min-[448px]:w-7" />
			</button>
			<button
				className="min-[448px]:hidden absolute text-theme-blue p-4 w-full h-16 bottom-0 bg-white text-center font-medium text-sm shadow-[0_-2px_4px_3px_rgba(108,114,124,0.1)]"
				onClick={() => confirmCustomer()}
			>
				Pilih Pelanggan
			</button>
		</div>
	);
};

export default CustomerSearchModal;
