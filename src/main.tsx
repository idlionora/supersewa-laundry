import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import Orders2 from './pages/Orders2.tsx';
import Orders from './pages/Orders.tsx';
import NewOrder from './pages/NewOrder.tsx';
import DummyPage from './pages/DummyPage.tsx';
import './index.css';
import OrderDetail from './pages/OrderDetail.tsx';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route path="orders2" element={<Home />}>
				<Route index element={<Orders2 />} />
			</Route>
			<Route path="orders">
				<Route index element={<Orders cardsCategory="Masih Proses" />} />
				<Route path="all" element={<Orders cardsCategory="Semua Data" />} />
				<Route path="ongoing" element={<Orders cardsCategory="Masih Proses" />} />
				<Route path="unpaid" element={<Orders cardsCategory="Belum Bayar" />} />
				<Route path=':id' element={<OrderDetail/>}/>
			</Route>

			<Route path="new-order" element={<NewOrder />} />

			<Route path="items" element={<DummyPage />} />
			<Route path="products" element={<DummyPage />} />
			<Route path="customers" element={<DummyPage />} />
			<Route path="settings" element={<DummyPage />} />
			<Route path="analytics" element={<DummyPage />} />
			<Route path="guides" element={<DummyPage />} />
			<Route path="announcement" element={<DummyPage />} />
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
