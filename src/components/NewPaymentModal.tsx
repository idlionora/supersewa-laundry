import { useEffect, useRef, useState } from 'react';
import useTrackedModalStore from '../stores/modalStore';
import { useTrackedOrderStore, PaymentType } from '../stores/orderStore';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import iconClose from '../assets/icon-x.svg';
import iconDownArrow from '../assets/icon-downarrow.svg';
import iconExclamation from '../assets/icon-exclamation-circle.svg';

const NewPaymentModal = () => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
	const paydateRef = useRef<HTMLButtonElement>(null)
	const [paydate, setPaydate] = useState<Date | undefined>(new Date());
	const [desc, setDesc] = useState('');
	const [price, setPrice] = useState('0');
	const [invalidCols, setinvalidCols] = useState<string[] | null>(null);
	
	useEffect(() => {
		paydateRef.current?.focus()
	}, [state.modalDisplay])

	function confirmPayment(event: React.FormEvent) {
		event.preventDefault();
		const newInvalidCols = ['throwError'];
		let newPayments: PaymentType[] = [{ paydate: new Date(), desc: 'dummy', price: 0 }];
		let paymentToAdd: PaymentType | null = null;

		if (!paydate) {
			newInvalidCols.push('paydate');
		}
		if (price.length < 1 || price === '0') {
			newInvalidCols.push('price');
		}
		if (newInvalidCols.includes('paydate') || newInvalidCols.includes('price')) {
			newInvalidCols.shift();
			setinvalidCols(newInvalidCols);
			console.log('newInvalidCols is set!!');
			return;
		}

		if (orderStore.payments) {
			newPayments = [...orderStore.payments];
		}

		paymentToAdd = { paydate: paydate!, desc, price: parseInt(price) };

		newPayments.push(paymentToAdd);
		if (newPayments[0].desc === 'dummy') {
			newPayments.shift();
		}
		orderStore.setPayments(newPayments);
		state.closeModal();
	}

	return (
		<div
			className="bg-white w-full max-w-sm p-4 rounded-md relative"
			onClick={(e) => e.stopPropagation()}
		>
			<button className="absolute right-3" onClick={() => state.closeModal()}>
				<img src={iconClose} alt="Tutup Panel" className="w-5" />
			</button>
			<p className="font-semibold text-sm w-full">Tanggal Pembayaran</p>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						ref={paydateRef}
						variant={'outline'}
						className={cn(
							'w-full justify-start text-left px-3 font-normal text-sm mt-1 border-gray-300 rounded mb-5 h-11 focus:border-green-600 focus:outline-green-600 relative',
							!paydate && 'text-muted-foreground',
							invalidCols?.includes('paydate') && 'form-invalid'
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{paydate ? (
							format(paydate, 'PPP', { locale: localeId })
						) : (
							<span>Pick a date</span>
						)}
						<img
							src={iconDownArrow}
							alt=""
							className="absolute h-4 w-4 opacity-50 right-3"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						locale={localeId}
						mode="single"
						selected={paydate}
						onSelect={setPaydate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<form onSubmit={(e) => confirmPayment(e)}>
				<label htmlFor="payment-price" className="block font-semibold text-sm w-full">
					Jumlah
				</label>
				<div className="relative flex items-center">
					<div className="mt-2 mb-4 absolute font-medium pl-3">Rp</div>
					<input
						id="payment-price"
						name="payment-price"
						type="number"
						value={price}
						className={`form-input w-full mt-2 pl-10 pr-2 ${
							invalidCols?.includes('price') ? 'form-invalid' : ''
						}`}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>
				<label htmlFor="payment-desc" className="block font-semibold text-sm w-full">
					Keterangan
				</label>
				<textarea
					id="payment-desc"
					name="payment-desc"
					rows={3}
					value={desc}
					className="form-input w-full mt-2"
					style={{ height: 'auto' }}
					placeholder="DP, cicilan, bayar lunas, lainnya"
					onChange={(e) => setDesc(e.target.value)}
				/>
				<div className="w-full flex flex-col items-center mt-[-.35rem]">
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
					<button type="submit" className="button-color bg-theme-blue">
						Tambah ke Daftar
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewPaymentModal;
