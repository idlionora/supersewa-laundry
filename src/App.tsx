import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

import iconHome from './assets/icon-home.svg';
import iconAnnounce from './assets/icon-speakerphone.svg';
import logoSupersewa from './assets/logo-supersewa.png';
import iconCalendar from './assets/icon-calendar.svg';
import iconPlus from './assets/icon-plus.svg';
import iconShopBag from './assets/icon-shoppingbag.svg';
import iconArchive from './assets/icon-archive.svg';
import iconUser from './assets/icon-user.svg';
import iconCog from './assets/icon-cog.svg';
import iconChart from './assets/icon-presentchart.svg';
import iconQuestion from './assets/icon-questionmark-outline.svg';
import iconWhatsApp from './assets/icon-brand-whatsapp.svg';
import iconDots from './assets/icon-dotsvertical.svg';
import './App.css';
import ModalWindow from './components/ModalWindow';


function App() {
	const location = useLocation();
	const [username, setUsername] = useState('Guest');
	const [email, setEmail] = useState('guest@somewhere.com');
	const [pageName, setPageName] = useState('Daftar Pesanan');
	const pageNameList = {
		orders: 'Daftar Pesanan',
		to_be_sent: 'Daftar Kirim',
		sent: 'Penjemputan',
		new_order: 'Bikin Pesanan',
	};
	const signIn = true;
	// check if signed in, redirect to sign in form if not
	if (signIn && username === 'Guest') {
		setUsername('TauRentoo');
		setEmail('taufiqm@outlook.com');
	}

	if (location.pathname === '/') {
		return <Navigate to="orders" />;
	}
	const pathnames: string[] = location.pathname
		.split('/')
		.filter((path) => path !== '')
		.filter((path) => !path.match(/^\d+/));
	const pathNameKey: string = pathnames[pathnames.length - 1].replace(/-/g, '_');
	const nameFromList = pageNameList[pathNameKey as keyof typeof pageNameList];
	if (nameFromList && pageName !== nameFromList) {
		setPageName(nameFromList);
	}
	console.log(pathNameKey);

	return (
		<div className="w-full min-h-screen bg-[#e5e7eb] flex flex-col items-center pt-[3.75rem] min-[1200px]:pt-8 xl:pt-[4.75rem] relative">
			<header className="fixed z-[5] top-0 left-0 w-full shadow bg-white">
				<div className="w-full h-[3.75rem] px-[16px] py-[10px] min-[1200px]:h-8 min-[1200px]:py-0 xl:hidden">
					<div className="w-full h-full px-4 flex justify-between items-center">
						<NavLink to="/orders">
							<img src={iconHome} alt="Home" className="h-6 w-6 cursor-pointer" />
						</NavLink>
						<p className="px-4 font-semibold text-sm">{pageName}</p>
						<img
							src={iconAnnounce}
							alt="Announcement"
							className="h-6 w-6 cursor-pointer"
						/>
					</div>
				</div>
				<div className="hidden xl:block w-full">
					<div className="w-full h-8 bg-theme-blue flex justify-center px-4 py-1">
						<div className="w-full max-w-[1100px] flex justify-between items-center text-white">
							<NavLink to="/orders">
								<img src={logoSupersewa} alt="Supersewa Laundry" className="h-6" />
							</NavLink>
							<p>
								<span className="font-semibold mr-2 text-xs">{username}</span>|
								<span className="font-medium ml-2 text-xs">{email}</span>
							</p>
						</div>
					</div>
					<nav className="w-full px-4 flex justify-center h-[2.75rem]">
						<div className="w-full max-w-[1100px] flex justify-stretch">
							<NavLink to="items" className="navlink-top nav-action">
								<img src={iconCalendar} className="navicon-top" />
								<p>Cek Stok</p>
							</NavLink>
							<NavLink to="new-order" className="navlink-top nav-action">
								<img src={iconPlus} className="navicon-top" />
								<p>Bikin Pesanan</p>
							</NavLink>
							<NavLink to="orders" className="navlink-top nav-action">
								<img src={iconShopBag} className="navicon-top" />
								<p>Daftar Pesanan</p>
							</NavLink>
							<NavLink to="products" className="navlink-top nav-action">
								<img src={iconArchive} className="navicon-top" />
								<p>Inventaris</p>
							</NavLink>
							<NavLink to="customers" className="navlink-top nav-action">
								<img src={iconUser} className="navicon-top" />
								<p>Pelanggan</p>
							</NavLink>
							<NavLink to="settings" className="navlink-top nav-action">
								<img src={iconCog} className="navicon-top" />
								<p>Administrasi</p>
							</NavLink>
							<NavLink to="analytics" className="navlink-top nav-action">
								<img src={iconChart} className="navicon-top" />
								<p>Analitik</p>
							</NavLink>
							<NavLink to="guides" className="navlink-top nav-action">
								<img src={iconQuestion} className="navicon-top" />
								<p>Panduan</p>
							</NavLink>
							<NavLink to="announcement" className="nav-announce nav-action">
								<img
									src={iconAnnounce}
									alt="Announcement"
									className="navicon-top"
								/>
							</NavLink>
						</div>
					</nav>
				</div>
			</header>
			<nav className="fixed z-[6] bottom-0 left-0 xl:hidden w-full flex justify-center">
				<div className="w-full max-w-[48rem] h-[4.375rem] bg-white shadow-[0_-2px_4px_0_rgba(108,114,124,0.16)] flex text-center">
					<NavLink to="orders" className="navlink-bottom">
						<img src={iconShopBag} className="navicon-bottom" />
						<div>
							<p>Daftar Pesanan</p>
							<div className="active-bar" />
						</div>
					</NavLink>
					<NavLink to="items" className="navlink-bottom">
						<img src={iconCalendar} className="navicon-bottom" />
						<div>
							<p>Cek Stok</p>
							<div className="active-bar" />
						</div>
					</NavLink>
					<NavLink to="new-order" className="navlink-bottom">
						<img src={iconPlus} className="navicon-bottom" />
						<div className="flex flex-col items-center">
							<p className="w-[50px]">Bikin Pesanan</p>
							<div className="active-bar" />
						</div>
					</NavLink>
					<a href="#" className="navlink-bottom">
						<img src={iconWhatsApp} className="navicon-bottom" />
						<div>
							<p>WhatsApp CS</p>
							<div className="active-bar" />
						</div>
					</a>
					<button className="navlink-bottom">
						<img src={iconDots} className="navicon-bottom" />
						<div>
							<p>Lain-lain</p>
							<div className="active-bar" />
						</div>
					</button>
				</div>
			</nav>
			<ModalWindow />
			<Outlet />
		</div>
	);
}

export default App;
