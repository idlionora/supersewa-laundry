/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { FeeType, useTrackedOrderStore } from '../stores/orderStore.tsx';
import { ChevronDown } from 'lucide-react';
import iconClose from '../assets/icon-x.svg';
import iconExclamation from '../assets/icon-exclamation-circle.svg';
import CustomDropdown from './CustomDropdown.tsx';

const AddFeeModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const categoryRef = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState('Diskon');
	const [activeDropdown, setActiveDropdown] = useState('');
	const [label, setLabel] = useState('');
	const [price, setPrice] = useState('0');
	const [invalidCols, setInvalidCols] = useState<string[] | null>(null);

	useEffect(() => {
		if (!state.modalDisplay) return;
		setLabel('');
		setPrice('0');
		(categoryRef.current?.children[0] as HTMLElement).focus();
	}, [state.modalDisplay]);

	useEffect(() => {
		document.addEventListener('mousedown', closeDropdown);
		return () => {
			document.removeEventListener('mousedown', closeDropdown);
		};
	}, [activeDropdown]);

	function closeDropdown(event: MouseEvent) {
		const clickTarget = event.target as Node;

		if (
			categoryRef &&
			activeDropdown === 'addfee-category' &&
			!categoryRef.current?.contains(clickTarget)
		) {
			setActiveDropdown('');
		}
	}

	function setPriceWithoutZeroAtFront(priceInString: string) {
		if (priceInString.length > 1 && priceInString.startsWith('0')) {
			setPrice(priceInString.slice(1));
		} else {
			setPrice(priceInString);
		}
	}

	useEffect(() => {
		removeInvalidCols('label');
	}, [label]);

	useEffect(() => {
		removeInvalidCols('price');
	}, [price]);

	function removeInvalidCols(invalidLabel: string) {
		if (invalidCols?.includes(invalidLabel)) {
			let newInvalidCols: string[] | null = [...invalidCols];

			if (newInvalidCols.length > 1) {
				newInvalidCols.splice(invalidCols.indexOf(invalidLabel), 1);
			} else {
				newInvalidCols = null;
			}
			setInvalidCols(newInvalidCols);
		}
	}

	function confirmFee(event: React.FormEvent) {
		event.preventDefault();
		const newInvalidCols = ['throwError'];
		let newAddFees: FeeType[] = [{ category: 'Diskon', label: 'dummy', price: 0 }];
		let addedFee: FeeType;

		if (label.length < 1) {
			newInvalidCols.push('label');
		}
		if (price.length < 1 || price === '0') {
			newInvalidCols.push('price');
		}
		if (newInvalidCols.includes('label') || newInvalidCols.includes('price')) {
			newInvalidCols.shift();
			setInvalidCols(newInvalidCols);
			return;
		}

		if (orderStore.addFees) {
			newAddFees = [...orderStore.addFees];
		}

		if (category === 'Diskon' || category === 'Biaya Tambahan') {
			addedFee = {
				category,
				label,
				price: parseInt(price),
			};

			newAddFees.push(addedFee);
			if (newAddFees[0].label === 'dummy') {
				newAddFees.shift();
			}
			orderStore.setAddFees(newAddFees);
		}
		state.closeModal();
	}

	return (
		<div
			className="bg-white w-full max-w-sm p-4 rounded-md"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="relative w-full flex items-center mb-2">
				<p className="font-semibold text-sm w-full">Kategori </p>
				<button className="absolute right-[-.25rem]" onClick={() => state.closeModal()}>
					<img src={iconClose} alt="Tutup Panel" className="w-5" />
				</button>
			</div>
			<CustomDropdown
				title="addfee-category"
				dropdownStatus={{
					isOpen: activeDropdown === 'addfee-category',
					setStatus: setActiveDropdown,
				}}
				options={{
					values: ['Diskon', 'Biaya Tambahan'],
					selected: category,
					setSelected: setCategory,
				}}
				styling={{ parentClass: 'w-full', childClass: 'w-full' }}
				ref={categoryRef}
			>
				<button
					className="w-full form-input mb-0 text-left relative"
					onClick={() =>
						activeDropdown === ''
							? setActiveDropdown('addfee-category')
							: setActiveDropdown('')
					}
				>
					<p>{category}</p>
					<ChevronDown className="h-4 w-4 opacity-50 absolute right-3 bottom-1/2 translate-y-1/2" />
				</button>
			</CustomDropdown>
			<form onSubmit={(e) => confirmFee(e)}>
				<label htmlFor="addfee-label" className="block font-semibold text-sm w-full mt-4">
					Label
				</label>
				<input
					id="addfee-label"
					name="addfee-label"
					type="text"
					value={label}
					className={`form-input w-full mt-2 ${
						invalidCols?.includes('label') ? 'form-invalid' : ''
					}`}
					placeholder={`label ${category === 'Diskon' ? 'diskon' : 'biaya tambahan'}`}
					onChange={(e) => setLabel(e.target.value)}
				/>
				<label htmlFor="addfee-price" className="block font-semibold text-sm w-full">
					Jumlah
				</label>
				<div className="relative flex items-center">
					<div className="mt-2 mb-4 absolute font-medium pl-3">Rp</div>
					<input
						id="addfee-price"
						name="addfee-price"
						type="number"
						value={price}
						className={`form-input w-full mt-2 pl-10 pr-2 ${
							invalidCols?.includes('price') ? 'form-invalid' : ''
						}`}
						onChange={(e) => setPriceWithoutZeroAtFront(e.target.value)}
					/>
				</div>
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
						<p>lengkapilah formulir terlebih dahulu</p>
					</div>
				) : (
					''
				)}
				<div className="w-full flex justify-center">
					<button type="submit" className="button-color bg-theme-blue">
						Tambah ke Daftar
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddFeeModal;
