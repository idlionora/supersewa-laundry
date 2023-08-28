import { useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { useTrackedOrderStore } from '../stores/orderStore';
import iconExclamation from '../assets/icon-exclamation-circle.svg';
import iconClose from '../assets/icon-x.svg';

const NewCustomerModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const zipcodeRef = useRef<HTMLInputElement>(null);
	const cityRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [invalidCols, setInvalidCols] = useState<string[] | null>(null);

	function confirmNewCustomer(event: React.FormEvent) {
		event.preventDefault();
		const newInvalidCols = ['throwError'];

		if (name.length === 0) {
			newInvalidCols.push('name');
		}
		if (phone.length < 7) {
			newInvalidCols.push('phone');
		}
		if (address.length === 0) {
			newInvalidCols.push('address');
		}
		if (newInvalidCols.length > 1) {
			newInvalidCols.splice(0, 1);
			setInvalidCols(newInvalidCols);
			return;
		}
		const newCustomer = { id: 6, name, phone, address, img: 'bg-red-500' };

		console.log({
			...newCustomer,
			email: emailRef.current?.value,
			zipcode: zipcodeRef.current?.value,
			city: cityRef.current?.value,
		});

		orderStore.setCustomer(newCustomer);
		state.closeModal();
	}

	return (
		<div
			className="bg-white w-full max-w-lg h-fit min-[448px]:max-h-[85%] min-[448px]:rounded-md overflow-y-auto overflow-x-hidden px-4 py-5 pt-6 min-[448px]:pt-5"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="relative w-full flex items-center mb-4">
				<h3 style={{ marginBottom: 0 }}>
					<span className="hashtag-bullet">#</span> Data Pelanggan
				</h3>
				<button className="absolute right-[-.25rem]" onClick={() => state.closeModal()}>
					<img src={iconClose} alt="Tutup Panel" className="w-5" />
				</button>
			</div>
			<form className="font-semibold text-sm" onSubmit={(e) => confirmNewCustomer(e)}>
				<label htmlFor="customer-name" className="block">
					Nama<span className="required-asterisk">*</span>
				</label>
				<input
					id="customer-name"
					name="customer-name"
					type="text"
					value={name}
					className={`form-input w-full mt-2 ${
						invalidCols?.includes('name') ? 'form-invalid' : ''
					}`}
					onChange={(e) => setName(e.target.value)}
				/>
				<label htmlFor="customer-phone" className="block mt-1">
					Telepon<span className="required-asterisk">*</span>
				</label>
				<input
					id="customer-phone"
					name="customer-phone"
					type="tel"
					value={phone}
					className={`form-input w-full mt-2 ${
						invalidCols?.includes('phone') ? 'form-invalid' : ''
					}`}
					onChange={(e) => setPhone(e.target.value)}
				/>
				<label htmlFor="customer-address" className="block mt-1">
					Email
				</label>
				<input
					ref={emailRef}
					id="customer-address"
					name="customer-address"
					type="email"
					className="form-input w-full mt-2"
				/>
				<label htmlFor="customer-address" className="block mt-1">
					Alamat<span className="required-asterisk">*</span>
				</label>
				<textarea
					id="customer-address"
					name="customer-address"
					rows={3}
					value={address}
					className={`form-input w-full mt-2 ${
						invalidCols?.includes('address') ? 'form-invalid' : ''
					}`}
					style={{ height: 'auto' }}
					onChange={(e) => setAddress(e.target.value)}
				/>
				<div className="grid grid-cols-2 gap-4 mt-[-2px]">
					<div className="col-span-1 flex flex-col justify-end">
						<label htmlFor="customer-zipcode">Kode Pos</label>
						<input
							ref={zipcodeRef}
							id="customer-zipcode"
							name="customer-zipcode"
							type="number"
							className="form-input w-full mt-2"
						/>
					</div>
					<div className="col-span-1">
						<label htmlFor="customer-city">Kota/ Kabupaten</label>
						<input
							ref={cityRef}
							id="customer-city"
							name="customer-city"
							type="text"
							className="form-input w-full mt-2"
						/>
					</div>
				</div>
				{invalidCols ? (
					<div className="w-full flex text-red-900 font-medium p-4 border border-red-300 rounded bg-red-100">
						<img
							src={iconExclamation}
							alt="Exclamation"
							className="w-5 mr-2"
							style={{
								filter: 'invert(19%) sepia(68%) saturate(6140%) hue-rotate(353deg) brightness(93%) contrast(85%)',
							}}
						/>
						<p>Lengkapilah formulir terlebih dahulu</p>
					</div>
				) : (
					''
				)}
				<div className="w-full flex justify-center mt-3">
					<button type="submit" className="button-color bg-theme-blue">
						Simpan Data
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewCustomerModal;
