/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { FeeType, useTrackedOrderStore } from '../stores/orderStore.tsx';
import iconClose from '../assets/icon-x.svg';
import iconExclamation from '../assets/icon-exclamation-circle.svg';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select.tsx';

const AddFeeModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const selectRef = useRef<HTMLButtonElement>(null);
	const [category, setCategory] = useState('discount');
	const [label, setLabel] = useState('');
	const [price, setPrice] = useState('0');
	const [invalidCols, setInvalidCols] = useState<string[] | null>(null);

	useEffect(() => {
		if (!state.modalDisplay) return;
		setLabel('');
		setPrice('0');
		selectRef.current?.focus();
	}, [state.modalDisplay]);

	useEffect(() => {
		if (invalidCols?.includes('label')) {
			let newInvalidCols: string[] | null = [...invalidCols];

			if (newInvalidCols.length > 1) {
				newInvalidCols.splice(invalidCols.indexOf('label'), 1);
			} else {
				newInvalidCols = null;
			}
			setInvalidCols(newInvalidCols);
		}
	}, [label]);

	useEffect(() => {
		if (invalidCols?.includes('price')) {
			let newInvalidCols: string[] | null = [...invalidCols];

			if (newInvalidCols.length > 1) {
				newInvalidCols.splice(invalidCols.indexOf('price'), 1);
			} else {
				newInvalidCols = null;
			}
			setInvalidCols(newInvalidCols);
		}
	}, [price]);

	function confirmFee(event: React.FormEvent) {
		event.preventDefault();
		const newInvalidCols = ['throwError'];
		let newAddFees: FeeType[] = [{ category: 'discount', label: 'dummy', price: 0 }];
		let addedFee: FeeType;

		if (label.length < 1) {
			newInvalidCols.push('label');
		}
		if (price.length < 1 || price === '0') {
			newInvalidCols.push('price');
		}
		if (newInvalidCols.includes('label') || newInvalidCols.includes('price')) {
			newInvalidCols.shift()
			setInvalidCols(newInvalidCols);
			return;
		}

		if (orderStore.addFees) {
			newAddFees = [...orderStore.addFees];
		}

		if (category === 'discount' || category === 'additional') {
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
			<Select onValueChange={setCategory} value={category}>
				<SelectTrigger ref={selectRef} className="w-full">
					<SelectValue placeholder="Pilih kategori harga" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="discount">Diskon</SelectItem>
					<SelectItem value="additional">Biaya Tambahan</SelectItem>
				</SelectContent>
			</Select>
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
					placeholder={`label ${category === 'discount' ? 'diskon' : 'biaya tambahan'}`}
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
						onChange={(e) => setPrice(e.target.value)}
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
