import { ServiceType } from '../stores/orderStore';
import imgList from '../lib/imgList';

type OrderServiceCardType = {
	data: ServiceType;
	childNum: 'first' | 'last' | number;
};

const OrderServiceCard = ({ data, childNum }: OrderServiceCardType) => {
	const { id, name,img, quantity, price, desc } = data;
	const formattedPrice = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
	}).format(price);
	return (
		<div
			className={`bg-white w-full p-4 flex items-center gap-3 focus:outline-yellow-500 focus:bg-slate-50 hover:bg-slate-50 ${
				childNum === 'first' ? 'rounded-t' : childNum === 'last' ? 'rounded-b' : ''
			}`}
		>
			<div className="w-20 h-20 min-[355px]:w-24 min-[355px]:h-24 rounded overflow-hidden flex items-center">
				<img src={imgList[img as keyof typeof imgList]} alt={name} className="w-full shrink-0" />
			</div>

			<div className="flex">
				<div></div>
				<button></button>
			</div>
		</div>
	);
};

export default OrderServiceCard;
