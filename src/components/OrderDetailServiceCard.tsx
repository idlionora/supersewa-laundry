import { DataInsertAndMarkPosition } from '../lib/typesForComponents';
import { ServiceType } from '../stores/orderStore';
import imgList from '../lib/imgList';
import ServiceEditModal from './ServiceEditModal';
import useTrackedModalStore from '../stores/modalStore';

const OrderDetailServiceCard = ({ data, childNum }: DataInsertAndMarkPosition<ServiceType>) => {
	const modalState = useTrackedModalStore()
	const { name, img, quantity, price, desc } = data;
	const formattedPrice = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
	}).format(price);
	return (
		<div
			className={`bg-white w-full p-4 flex flex-col min-[355px]:flex-row gap-y-4 gap-x-2 items-center focus:outline-yellow-500 focus:bg-slate-50 ${
				childNum === 'first'
					? 'min-[575px]:rounded-t'
					: childNum === 'last'
					? 'min-[575px]:rounded-b'
					: ''
			}`}
		>
			<div className="w-full flex items-center gap-3.5">
				<div className="w-20 h-20 min-[355px]:w-24 min-[355px]:h-24 rounded overflow-hidden flex items-center shrink-0">
					<img src={imgList[img as keyof typeof imgList]} alt={name} className="w-full" />
				</div>
				<div className="w-full">
					<div className="flex flex-col gap-2">
						<p className="font-semibold">{name}</p>
						<p>
							{quantity} x {formattedPrice}
						</p>
						<p>{desc.length > 0 ? desc : '-'}</p>
					</div>
				</div>
			</div>
			<div className="flex justify-center w-full min-[355px]:w-fit">
				<button
					className="button-gray py-1.5 min-[448px]:py-2"
					onClick={() => modalState.openModal(<ServiceEditModal data={data} childNum={childNum}/>, 'full')}
				>
					Ubah
				</button>
			</div>
		</div>
	);
};

export default OrderDetailServiceCard;
