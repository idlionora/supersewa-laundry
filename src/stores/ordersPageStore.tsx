import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import orders from '../../data/orders.json';
import orderDataDummy from '../lib/orderDataDummy';

export type OrderDataType = {
	order_id: number;
	customer_name: string;
	img: string;
	start_date: Date;
	net_price: number;
	order_paid: boolean;
	order_status: string;
	method_payment: string;
};

function parseOrdersData() {
	const data: OrderDataType[] = [...orderDataDummy];
	orders.data.forEach(
		({
			order_id,
			customer_name,
			img,
			start_date,
			net_price,
			order_paid,
			order_status,
			method_payment,
		}) =>
			data.unshift({
				order_id: order_id,
				customer_name: customer_name,
				img: img,
				start_date: new Date(start_date),
				net_price: parseInt(net_price),
				order_paid: order_paid,
				order_status: order_status,
				method_payment: method_payment,
			})
	);
	data.splice(data.length - 1);
	return data;
}

function parseActiveData() {
	const ordersData = parseOrdersData();
	const activeData: OrderDataType[] = [...orderDataDummy];
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

	addToActiveData(unpaidIndexes);
	addToActiveData(inWashIndexes);
	addToActiveData(picklistIndexes);
	activeData.splice(0, 1);

	return activeData;
}

function parseUnpaidOrdersData() {
	const ordersData = parseOrdersData();
	const unpaidData: OrderDataType[] = [...orderDataDummy];
	ordersData.forEach((order) => {
		if (!order.order_paid) {
			unpaidData.push(order);
		}
	});

	unpaidData.splice(0, 1);
	return unpaidData;
}

interface IOrdersPage {
	allOrderDatas: OrderDataType[];
	activeOrderDatas: OrderDataType[];
	unpaidOrderDatas: OrderDataType[];
}

const useOrdersPageStore = create<IOrdersPage>(() => ({
	allOrderDatas: parseOrdersData(),
	activeOrderDatas: parseActiveData(),
	unpaidOrderDatas: parseUnpaidOrdersData(),
}));

const useTrackedOrdersPageStore = createTrackedSelector(useOrdersPageStore);
export default useTrackedOrdersPageStore;
