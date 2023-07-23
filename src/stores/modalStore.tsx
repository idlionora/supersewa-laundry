import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';
import DefaultModalContent from '../components/DefaultModalContent';

interface IModal {
	modalContent: JSX.Element | string;
	modalWidth: 'fit' | 'full';
	screenDisplay: boolean;
	screenOpacity: boolean;
	modalDisplay: boolean;
	modalInPosition: boolean;
	openModal: (newContent: JSX.Element, newWidth?: 'fit' | 'full') => void;
	closeModal: () => void;
}

const useModalStore = create<IModal>((set) => ({
	modalContent: <DefaultModalContent />,
	modalWidth: 'fit',
	screenDisplay: false,
	screenOpacity: false,
	modalDisplay: false,
	modalInPosition: false,
	openModal: (newContent: JSX.Element, newWidth?: 'fit' | 'full') => {
		if (newWidth) set({ modalWidth: newWidth });
		set({ modalContent: newContent });
		set({ screenDisplay: true, modalDisplay: true });
		setTimeout(() => {
			set({ screenOpacity: true, modalInPosition: true });
		}, 10);
	},
	closeModal: () => {
		set({ screenOpacity: false, modalInPosition: false });
		setTimeout(() => {
			set({ screenDisplay: false });
		}, 260);
		setTimeout(() => {
			set({ modalDisplay: false });
		}, 310);
	},
}));

const useTrackedModalStore = createTrackedSelector(useModalStore);

export default useTrackedModalStore;
