import { Navigate, Outlet, useLocation } from 'react-router-dom';
import iconHome from './assets/icon-home.svg';
import iconAnnounce from './assets/icon-speakerphone.svg';
import './App.css';
import { useState } from 'react';

function App() {
	const location = useLocation();
	const [pageName, setPageName] = useState('Daftar Pesanan');
	const pageNameList = {
		orders: 'Daftar Pesanan',
		to_be_sent: 'Daftar Kirim',
		sent: 'Penjemputan'
	};

	if (location.pathname === '/') {
		return <Navigate to="/orders" />;
	}
	const pathnames : string[] = location.pathname.split('/').filter((path) => path !== '').filter((path) => !path.match(/\d+/));
	const pathNameKey : string = pathnames[pathnames.length - 1] 
	const nameFromList = pageNameList[pathNameKey as keyof typeof pageNameList];
	if (nameFromList && pageName !== nameFromList) {
		setPageName(nameFromList);
	}

	console.log(pathNameKey)

	return (
		<div className="w-full min-h-screen pt-[3.75rem] min-[1200px]:pt-8 xl:pt-[4.75rem]">
			<header className="fixed top-0 left-0 w-full shadow">
				<div className="w-full h-[3.75rem] bg-white px-[16px] py-[10px] min-[1200px]:h-8 min-[1200px]:py-0 xl:hidden">
					<div className="w-full h-full px-4 flex justify-between items-center">
						<img src={iconHome} alt="Home" className="h-6 w-6" />
						<p className="px-4 font-semibold text-sm">{pageName}</p>
						<img src={iconAnnounce} alt="Announcement" className="h-6 w-6" />
					</div>
				</div>
				<div className="hidden xl-block w-full h-8 "></div>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}

export default App;
