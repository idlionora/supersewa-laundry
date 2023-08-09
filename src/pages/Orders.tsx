import { OrdersDataType, columns } from "../components/order-table/columns";
import { DataTable } from "../components/order-table/data-table";
import orders from "../../data/orders.json"
import { useMemo } from "react";

function parseOrdersData () {
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
	orders.data.forEach(({order_id, customer_name, img, start_date, net_price, order_paid, order_status}) => data.unshift({
		order_id: order_id,
		customer_name: customer_name,
		img: img,
		start_date: new Date(start_date),
		net_price: parseInt(net_price),
		order_paid: order_paid,
		order_status: order_status
	}))
	data.splice(data.length - 1);
	return data
}

function Orders() {
	const ordersData: OrdersDataType[] = useMemo(() => parseOrdersData(), [])

	return (
		<main className="page-container pt-4">
			<section className="page-section my-4">
					<DataTable columns={columns} data={ordersData} />
			</section>
			<div className="w-full h-20 xl:h-16" />
		</main>
	);
}

export default Orders;
