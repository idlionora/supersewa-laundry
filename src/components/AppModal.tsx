import useTrackedModalStore from '../stores/modalStore';
// Modal handler uses global state management

const AppModal = () => {
	const state = useTrackedModalStore();

	return (
		<>
			<div
				id="fade-screen"
				className={`fixed top-0 left-0 z-[15] w-screen h-screen bg-black transition-opacity duration-200 ${
					state.screenDisplay ? 'block' : 'hidden'
				} ${state.screenOpacity ? 'opacity-40' : 'opacity-0'}`}
			/>
			<div
				className={`fixed top-0 left-0 z-[16] w-full h-screen flex justify-center items-center sm:px-5 md:px-6 ${
					state.modalDisplay ? 'block' : 'hidden'
				} ${
					state.modalInPosition
						? 'translate-y-0 opacity-100'
						: 'translate-y-[-3rem] opacity-0'
				} ${state.modalWidth === 'fit' ? 'px-4' : ''}`}
				style={{ transition: 'opacity 250ms ease-in-out, transform 300ms ease-in-out' }}
				onClick={state.closeModal}
			>
				{state.modalContent}
			</div>
		</>
	);
};

export default AppModal;
