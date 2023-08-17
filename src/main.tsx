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

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route path="orders" element={<Home />}>
				<Route index element={<Orders2 />} />
			</Route>
			<Route path='orders2' element={<Orders/>}/>
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
