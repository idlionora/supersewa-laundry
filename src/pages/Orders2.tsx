import { OrdersDataType, columns } from '../components/order-table/columns';
import { DataTable } from '../components/order-table/data-table';
import orders2 from '../../data/orders2.json';
import { useState, useEffect, useMemo } from 'react';
import useTrackedOrdersFilterStore2 from '../stores/ordersFilterStore2';

function parseOrdersData() {
	const data: OrdersDataType[] = [
		{
			order_id: 0,
			customer_name: '',
			img: '',
			start_date: new Date(),
			net_price: 0,
			order_paid: false,
			order_status: 'mengantri',
		},
	];
	orders2.data.forEach(
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

function Orders() {
	const filterStore = useTrackedOrdersFilterStore2();
	const ordersData: OrdersDataType[] = useMemo(() => parseOrdersData(), []);
	const [dataDisplayed, setDataDisplayed] = useState(ordersData);

	useEffect(() => {
		const newOrdersData: OrdersDataType[] = [
			{
				order_id: 0,
				customer_name: '',
				img: '',
				start_date: new Date(),
				net_price: 0,
				order_paid: false,
				order_status: 'mengantri',
			},
		];
		const laundryArray = [999];

		if (filterStore.laundryListOnly) {
			const queueIndexes = [999];
			const inWashIndexes = [999];
			const picklistIndexes = [999];

			ordersData.forEach(({ order_status }, index) => {
				if (order_status === 'mengantri') {
					queueIndexes.push(index);
				}
				if (order_status === 'sedang cuci') {
					inWashIndexes.push(index);
				}
				if (order_status === 'tunggu jemput') {
					picklistIndexes.push(index);
				}
			});

			if (queueIndexes.length > 1) {
				queueIndexes.splice(0, 1);
				laundryArray.push(...queueIndexes);
			}
			if (inWashIndexes.length > 1) {
				inWashIndexes.splice(0, 1);
				inWashIndexes.forEach((index) => {
					if (!laundryArray.includes(index)) {
						laundryArray.push(index);
					}
				});
			}
			if (picklistIndexes.length > 1) {
				picklistIndexes.splice(0, 1);
				picklistIndexes.forEach((index) => {
					if (!laundryArray.includes(index)) {
						laundryArray.push(index);
					}
				});
			}

			if (laundryArray.length > 1) {
				laundryArray.splice(0, 1);
			}
		}

		if (filterStore.unpaidListOnly) {
			const unpaidIndexes = [999];

			ordersData.forEach(({ order_paid }, index) => {
				if (!order_paid) {
					unpaidIndexes.unshift(index);
				}
			});

			if (unpaidIndexes.length > 1) {
				unpaidIndexes.splice(unpaidIndexes.length - 1, 1);
			}

			unpaidIndexes.forEach((indexNum) => {
				if (!laundryArray.includes(indexNum)) {
					laundryArray.push(indexNum);
				}
			});
			if (laundryArray[0] === 999) {
				laundryArray.splice(0, 1);
			}
		}

		if (laundryArray[0] !== 999) {
			laundryArray.forEach((laundryIndex) => {
				newOrdersData.push(ordersData[laundryIndex]);
			});

			newOrdersData.splice(0, 1);
			setDataDisplayed(newOrdersData);
		}

		if (!filterStore.laundryListOnly && !filterStore.unpaidListOnly) {
			setDataDisplayed(ordersData);
		}
	}, [filterStore.laundryListOnly, filterStore.unpaidListOnly, ordersData]);

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
				<DataTable columns={columns} data={dataDisplayed} />
			</section>
			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default Orders;
