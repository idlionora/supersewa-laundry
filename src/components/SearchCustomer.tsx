import useTrackedModalStore from '../store/modalStore';
import iconClose from '../assets/icon-x.svg';
import iconSearch from '../assets/icon-search.svg';
import { useEffect, useRef } from 'react';

const SearchCustomer = () => {
    const state = useTrackedModalStore();
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    },[state.modalDisplay])
	return (
		<div
			className="bg-neutral-100 w-full max-w-md h-full max-h-[85%] sm:max-h-[33.75rem] rounded-md overflow-hidden relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="bg-white w-full px-4 pt-4 pb-3 shadow-md absolute top-0 left-0">
				<div className="relative w-full flex items-center mb-2">
					<p className="font-semibold text-sm">Cari Pelanggan</p>
					<img
						src={iconClose}
						alt="Tutup Halaman"
						className="w-5 absolute right-[-.25rem]"
						onClick={() => state.closeModal()}
					/>
				</div>
				<div className="relative flex items-center">
					<input ref={inputRef} type="text" className="form-input w-full pl-9" />
					<img
						src={iconSearch}
						alt=""
						className="absolute w-5 left-2 invert contrast-[20%]"
					/>
				</div>
			</div>
			<div className="w-full h-full pt-[6.5rem]">{/*Insert Cards Here */}</div>
			<button className="absolute text-theme-blue px-4 py-5 w-full bottom-0 bg-white text-center font-medium text-sm shadow-[0_-2px_4px_3px_rgba(108,114,124,0.1)]">
				Pilih Pelanggan
			</button>
			{/* <button className='absolute text-white bg-theme-blue rounded p-3 w-full max-w-[80%] text-center font-medium text-sm bottom-4 translate-x-1/2 right-1/2 shadow-sm '>Pilih Pelanggan</button> */}
			<div><img src="" alt="" /></div>
		</div>
	);
};

export default SearchCustomer;
