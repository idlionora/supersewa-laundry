import React, { useEffect, useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { ServiceType, useTrackedOrderStore } from '../stores/orderStore';
import servicePackages from '../../data/service_packages.json';
import { ServicePackageSpec } from '../lib/typesForComponents';
import imgList from '../lib/imgList';
import iconClose from '../assets/icon-x.svg';
import iconSearch from '../assets/icon-search.svg';
import ServiceEditModal from './ServiceEditModal';

const ServiceAddModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
	const [servicesList, setServicesList] = useState<ServicePackageSpec[] | null>(null);
	const [nameFilter, setNameFilter] = useState<string>('');
	const [filteredList, setFilteredList] = useState<ServicePackageSpec[] | null>(null);
	const [activeCol, setActiveCol] = useState<ServicePackageSpec | null>(null);

	const ServiceCard = ({ serviceDesc }: { serviceDesc: ServicePackageSpec }) => {
		const { id, name, priceRange, img } = serviceDesc;
		return (
			<button
				className={`w-full px-4 py-2 flex gap-4 items-center hover:bg-white ease-in-out border border-transparent cursor-pointer text-left ${
					activeCol?.id === id ? 'col-active' : ''
				}`}
				onClick={() => selectService(serviceDesc)}
			>
				<div className="w-16 h-16 rounded overflow-hidden flex items-center">
					<img
						src={imgList[img as keyof typeof imgList]}
						alt=""
						className="w-full shrink-0"
					/>
				</div>
				<div>
					<p className="font-semibold mb-0.5">{name}</p>
					<p>{priceRange}</p>
				</div>
			</button>
		);
	};

	useEffect(() => {
		if (!state.modalDisplay) return;
		inputRef.current?.focus();
		setActiveCol(null);
		setServicesList(loadPackagesWithoutSelectedServices());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.modalDisplay]);

	function loadPackagesWithoutSelectedServices() {
		const newServicePackages = [...servicePackages.data];
		const selectedIds = orderStore.services
			? Array.from(orderStore.services, (service) => service.id)
			: null;

		selectedIds?.forEach((id) => {
			const selectedIndex = newServicePackages.findIndex((service) => service.id === id);
			newServicePackages.splice(selectedIndex, 1);
		});

		return newServicePackages;
	}

	useEffect(() => {
		clearInterval(timeoutId.current);
		timeoutId.current = setTimeout(() => {
			filterServicesWithoutSelected(nameFilter);
		}, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nameFilter]);

	function filterServicesWithoutSelected(nameFilter: string) {
		let newFilteredServices: ServicePackageSpec[] | null = null;

		if (nameFilter.length < 1 || !servicesList) {
			setFilteredList(null);
			return;
		}

		newFilteredServices = servicesList.filter((service) =>
			service.name.toLowerCase().includes(nameFilter.toLowerCase())
		);
		setFilteredList(newFilteredServices);
	}

	function selectService(selectedData: ServicePackageSpec) {
		setActiveCol(selectedData);

		if (inputRef.current && inputRef.current.clientWidth >= 414) {
			confirmService(selectedData);
		}
	}

	function confirmService(selectedData: ServicePackageSpec) {
		const addedService: ServiceType = { ...selectedData, quantity: 1, price: 0, desc: '' };
		let newServices: ServiceType[] | null = null;

		if (orderStore.services) {
			newServices = [...orderStore.services];
			newServices.push(addedService);
		} else {
			newServices = [addedService];
		}

		orderStore.setServices(newServices);
		state.switchModal(<ServiceEditModal data={addedService} childNum="last" />, 'full');
	}

	return (
		<div
			className="bg-neutral-50 w-full max-w-md h-full min-[448px]:max-h-[85%] sm:max-h-[33.75rem] min-[448px]:rounded-md overflow-hidden relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-white w-full px-4 pt-6 min-[448px]:pt-4 pb-3 shadow-md absolute top-0 left-0 z-10">
				<div className="relative w-full flex items-center mb-2">
					<p className="font-semibold text-sm w-full">Cari Paket Layanan</p>
					<button className="absolute right-[-.25rem]" onClick={() => state.closeModal()}>
						<img src={iconClose} alt="Tutup Panel" className="w-5" />
					</button>
				</div>
				<div className="relative">
					<input
						id="input-servicesearch"
						name="input-servicesearch"
						ref={inputRef}
						type="text"
						onChange={(e) => setNameFilter(e.target.value)}
						className="form-input w-full pl-9"
					/>
					<div className="absolute top-0 left-0 h-[2.75rem] flex items-center">
						<img src={iconSearch} alt="" className="w-5 ml-2 invert contrast-[20%]" />
					</div>
				</div>
			</div>
			<div className="w-full h-full pt-[8rem] overflow-y-auto">
				{filteredList ? (
					filteredList.map((servicePackage) => (
						<React.Fragment key={`list-service-${servicePackage.id}`}>
							<ServiceCard serviceDesc={servicePackage} />
						</React.Fragment>
					))
				) : servicesList ? (
					servicesList.map((servicePackage) => (
						<React.Fragment key={`list-service-${servicePackage.id}`}>
							<ServiceCard serviceDesc={servicePackage} />
						</React.Fragment>
					))
				) : (
					<p className="w-full text-center p-4">Data tidak ditemukan</p>
				)}
				<div className="min-[448px]:hidden w-full h-[4.5rem]" />
			</div>
			<button
				className="min-[448px]:hidden absolute text-theme-blue p-4 w-full h-16 bottom-0 bg-white text-center font-medium text-sm shadow-[0_-2px_4px_3px_rgba(108,114,124,0.1)]"
				onClick={() => {
					if (activeCol) confirmService(activeCol);
				}}
			>
				Pilih Layanan
			</button>
		</div>
	);
};

export default ServiceAddModal;
