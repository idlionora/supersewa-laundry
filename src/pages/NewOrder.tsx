import SearchCustomer from "../components/SearchCustomer";
import useTrackedModalStore from "../store/modalStore";

function NewOrder() {
	const modalState = useTrackedModalStore();
	return (
		<div>
			<h1 className="text-3xl mb-20">path: new_order</h1>
			<button className="button-color" onClick={()=> modalState.openModal(<SearchCustomer/>)}>Open Modal</button>
		</div>
	);
}

export default NewOrder;
