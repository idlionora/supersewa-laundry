import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import orders from '../../data/orders.json';

export type OrdersDataType = {
	order_id: number;
	customer_name: string;
	img: string;
	start_date: Date;
	net_price: number;
	order_paid: boolean;
	order_status: string;
};

function parseOrdersData() {
	const data: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	orders.data.forEach(
		({ order_id, customer_name, img, start_date, net_price, order_paid, order_status }) =>
			data.unshift({
				order_id: order_id,
				customer_name: customer_name,
				img: img,
				start_date: new Date(start_date),
				net_price: parseInt(net_price),
				order_paid: order_paid,
				order_status: order_status,
			})
	);
	data.splice(data.length - 1);
	return data;
}

function parseActiveData() {
	const ordersData = parseOrdersData();
	const activeData: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	const inWashIndexes = [99999];
	const picklistIndexes = [99999];
	const unpaidIndexes = [99999];

	ordersData.forEach(({ order_paid, order_status }, index) => {
		if (order_status === 'Sedang cuci') {
			inWashIndexes.push(index);
			return;
		}

		if (order_status === 'Tunggu jemput') {
			picklistIndexes.push(index);
			return;
		}

		if (!order_paid) {
			unpaidIndexes.push(index);
		}
	});

	function addToActiveData(indexArray: number[]) {
		indexArray.splice(0, 1);
		indexArray.forEach((index) => {
			activeData.push(ordersData[index]);
		});
	}

	addToActiveData(inWashIndexes);
	addToActiveData(picklistIndexes);
	addToActiveData(unpaidIndexes);
	activeData.splice(0, 1);

	return activeData;
}

function parseUnpaidOrdersData() {
	const ordersData = parseOrdersData()
	const unpaidData: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'sedang cuci',
		},
	];
	ordersData.forEach((order) => {
		if (!order.order_paid) {
			unpaidData.push(order);
		}
	});
	
	unpaidData.splice(0, 1);
	return unpaidData;
}

interface IOrdersPage {
	allOrdersData: OrdersDataType[];
	activeOrdersData: OrdersDataType[];
	unpaidOrdersData: OrdersDataType[];
	contentNum: string;
	setContentNum: (pages: string) => void;
}

const useOrdersPageStore = create<IOrdersPage>((set) => ({
	allOrdersData: parseOrdersData(),
	activeOrdersData: parseActiveData(),
	unpaidOrdersData: parseUnpaidOrdersData(),
	contentNum: '10',
	setContentNum: (pages: string) => {
		set({ contentNum: pages });
	},
}));

const useTrackedOrdersPageStore = createTrackedSelector(useOrdersPageStore);
export default useTrackedOrdersPageStore;
