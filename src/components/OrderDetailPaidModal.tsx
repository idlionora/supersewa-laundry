import useTrackedModalStore from '../stores/modalStore';
import { useTrackedOrderStore, PaymentType} from '../stores/orderStore';
import { id as localeId } from 'date-fns/locale';
import { format } from 'date-fns';
import formatPrice from '../lib/formatPrice';
import iconClose from '../assets/icon-x.svg';

type PaidModalType = {
	index: number
}
const OrderDetailPaidModal = ({index} : PaidModalType) => {
	const orderStore = useTrackedOrderStore();
	const state = useTrackedModalStore();
    const payment : PaymentType = orderStore.payments![index]
    
	return (
		<div
			className="bg-white w-full max-w-sm p-4 pb-5 rounded-md relative"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="w-full relative flex items-center">
				<h4 className="py-0 m-0">{`Pembayaran - ${format(payment.paydate, 'd MMMM', {
					locale: localeId,
				})}`}</h4>
				<button className="absolute right-0" onClick={() => state.closeModal()}>
					<img src={iconClose} alt="Tutup Panel" className="w-5" />
				</button>
			</div>
			<div className="w-full flex mt-4">
				<p className="w-[4rem] min-[355px]:w-3/12 font-semibold shrink-0">Jumlah</p>
				<p className="w-full min-[355px]:w-9/12">{formatPrice(payment.price)}</p>
			</div>
			<div className="w-full flex mt-4">
				<p className="w-[4rem] min-[355px]:w-3/12 font-semibold shrink-0">Catatan</p>
				<p className="w-full min-[355px]:w-9/12">
					{payment.desc.length > 0 ? payment.desc : '–'}
				</p>
			</div>
		</div>
	);
};

export default OrderDetailPaidModal;
