import { OrderDataType } from "../stores/ordersPageStore";
import { Link } from 'react-router-dom';
import id from 'date-fns/locale/id';
import { format } from 'date-fns';
import iconPaid from '../assets/icon-badgecheck.svg'

type OrdersCardType = {
    data: OrderDataType
    childNum: string
}

const OrdersCardComp = ({data, childNum}:OrdersCardType) => {
    const {order_id, customer_name, img, start_date, net_price, order_paid, order_status, method_payment} = data;
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(net_price)
    return (
		<Link
			to={`/orders/${order_id}`}
			className={`bg-white w-full p-4 flex items-center gap-4 focus:outline-yellow-500 focus:bg-slate-50 hover:bg-slate-50 ${childNum === 'first' ? 'rounded-t' : childNum === 'last' ? 'rounded-b' : ''}`}
		>
			<div
				className={`flex items-center justify-center shrink-0 rounded-full w-9 h-9 ${img} text-white font-medium text-sm`}
			>
				{customer_name[0]}
			</div>
			<div className="flex flex-col gap-y-2 text-[0.8125rem] leading-normal font-normal">
				<p className="font-semibold">{customer_name}</p>
				<p>
					{start_date.getFullYear() === new Date().getFullYear()
						? format(start_date, 'EEEE, d MMM', { locale: id })
						: format(start_date, 'PPP', { locale: id })}
				</p>
				<p
					className={`${
						order_status === 'Sedang cuci'
							? 'text-theme-blue'
							: order_status === 'Tunggu jemput'
							? 'text-orange-500'
							: ''
					} font-medium`}
				>
					{order_status}
				</p>
				<div className="flex gap-x-2.5 items-center">
					<p>{formattedPrice}</p>
					{order_paid ? (
						<div className="flex items-center gap-x-0.5">
							<img
								src={iconPaid}
								alt=""
								className="w-4 h-4"
								style={{
									filter: 'invert(39%) sepia(89%) saturate(3630%) hue-rotate(127deg) brightness(102%) contrast(83%)',
								}}
							/>
							<p className="text-green-600 font-medium">{method_payment}</p>
						</div>
					) : null}
				</div>
			</div>
		</Link>
	);
}

export default OrdersCardComp;
