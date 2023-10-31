import { NavLink } from "react-router-dom";

function DummyPage() {
	return (
		<div className="w-full py-12 px-5 flex flex-col items-center">
			<h1 className="text-xl font-medium mb-4 text-center">Maaf, halaman ini belum&nbsp;tersedia.</h1>
			<p className="text-base text-center max-w-2xl">
				Silakan klik{' '}
				<NavLink to="orders" className="underline font-semibold text-theme-blue">
					/orders
				</NavLink>{' '}
				untuk melihat Daftar Pesanan, atau{' '}
				<NavLink
					to="new-order"
					className="underline font-semibold text-theme-blue whitespace-nowrap"
				>
					/new-order
				</NavLink>{' '}
				untuk melihat halaman Bikin&nbsp;Pesanan.
			</p>
		</div>
	);
}

export default DummyPage;
