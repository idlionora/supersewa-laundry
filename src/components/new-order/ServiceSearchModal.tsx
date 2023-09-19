import React, { useState, useRef, useEffect } from 'react';
import useTrackedModalStore from '@stores/modalStore';
import { ServiceType, useTrackedOrderStore } from '@stores/orderStore';
import servicePackages from '@/data/service_packages.json';
import { ServicePackageSpec } from '@lib/typesForComponents';
import iconClose from '@assets/icon-x.svg';
import iconSearch from '@assets/icon-search.svg';
import imgList from '@lib/imgList';

const ServiceSearchModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
	const [servicesList, setServicesList] = useState<ServicePackageSpec[] | null>(null)
	const [nameFilter, setNameFilter] = useState<string>('');
	const [filteredList, setFilteredList] = useState<ServicePackageSpec[] | null>(null);
	const [activeCols, setActiveCols] = useState<number[] | null>(null);

	const ServiceCard = ({ serviceDesc }: { serviceDesc: ServicePackageSpec }) => {
		const { id, name, priceRange, img } = serviceDesc;
		return (
			<button
				className={`w-full px-4 py-2 flex gap-4 items-center hover:bg-white ease-in-out border border-transparent cursor-pointer text-left ${
					activeCols?.includes(id) ? 'col-active' : ''
				}`}
				onClick={() => selectPackage(id)}
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
		const idArray: number[] = [0];

		if (orderStore.services) {
			orderStore.services.forEach((service) => {
				idArray.push(service.id);
			});
			idArray.shift();
			setActiveCols(idArray);
		} else {
			setActiveCols(null);
		}
		setServicesList(servicePackages.data);
		inputRef.current?.focus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.modalDisplay]);

	useEffect(() => {
		clearInterval(timeoutId.current);
		timeoutId.current = setTimeout(() => {
			filterServicesByName(nameFilter);
		}, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nameFilter]);

	function filterServicesByName(nameFilter: string) {
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

	function selectPackage(selectedId: number) {
		let newActiveCols: number[] | null = [0];

		if (activeCols) {
			newActiveCols = [...activeCols];
		}

		if (!newActiveCols.includes(selectedId)) {
			newActiveCols.push(selectedId);
			if (newActiveCols[0] === 0) {
				newActiveCols.shift();
			}
		} else if (newActiveCols.length === 1 && newActiveCols.includes(selectedId)) {
			newActiveCols = null;
		} else {
			const index = newActiveCols.indexOf(selectedId);
			newActiveCols.splice(index, 1);
		}
		setActiveCols(newActiveCols);
	}

	function updateService() {
		if (!activeCols) {
			orderStore.setServices(null);
			return;
		}
		if (!servicesList) return;
		let processCols: number[] | null = [...activeCols];
		const newStoreService = [
			{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' },
		];

		orderStore.services?.forEach((service) => {
			if (processCols?.includes(service.id)) {
				newStoreService.push(service);
				if (processCols.length > 1) {
					processCols.splice(processCols.indexOf(service.id), 1);
				} else {
					newStoreService.shift();
					processCols = null;
				}
			}
		});

		if (!processCols) {
			orderStore.setServices(newStoreService);
			return;
		}

		for (let i = 0; i < servicesList.length; i++) {
			if (processCols.includes(servicesList[i].id)) {
				const newService: ServiceType = {
					id: servicesList[i].id,
					name: servicesList[i].name,
					priceRange: servicesList[i].priceRange,
					img: servicesList[i].img,
					quantity: 1,
					price: 0,
					desc: '',
				};

				newStoreService.push(newService);
				if (processCols.length > 1) {
					processCols.splice(processCols.indexOf(servicesList[i].id), 1);
				} else {
					newStoreService.shift();
					processCols = null;
					break;
				}
			}
		}

		if (processCols) {
			/* Please fetch individual data if servicesList does not contain selected service */
			console.error(
				`data for ${processCols.join(', ')} ${
					processCols.length === 1 ? 'is' : 'are'
				} not available!`
			);
			return;
		}
		orderStore.setServices(newStoreService);
	}

	return (
		<div
			className="bg-neutral-50 w-full max-w-md h-full min-[448px]:max-h-[85%] sm:max-h-[33.75rem] min-[448px]:rounded-md overflow-hidden relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-white w-full px-4 pt-6 min-[448px]:pt-4 pb-3 shadow-md absolute top-0 left-0 z-10">
				<div className="relative w-full flex items-center mb-2">
					<p className="font-semibold text-sm w-full">Cari Paket Layanan</p>
					<button
						className=" absolute right-[-.25rem]"
						onClick={() => state.closeModal()}
					>
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
				<div className="w-full h-[4.5rem]" />
			</div>
			<button
				className="absolute text-theme-blue p-4 w-full h-16 bottom-0 bg-white text-center font-medium text-sm shadow-[0_-2px_4px_3px_rgba(108,114,124,0.1)]"
				onClick={() => {
					updateService();
					state.closeModal();
				}}
			>
				Pilih Layanan
			</button>
		</div>
	);
	('');
};

export default ServiceSearchModal;
