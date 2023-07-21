import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

export type CustomerType = {
	id: number;
	name: string;
	phone: string;
	address: string;
	img: string;	
}

type ProductType = {
	id: number;
	priceRange: string;
	price: number;
	quantity: number;
};

type FeeType = {
	label: string;
	price: number;
};

interface IOrder {
	customer: CustomerType;
	startDate: Date;
	endDate: Date;
	products: ProductType[] | null;
	addFees: FeeType[] | null;
	netPrice: number;
	notesInternal: string;
	notesInvoice: string;
	setCustomer: (newCustomer: CustomerType) => void;
	setStartDate: (newDate: Date) => void;
	setEndDate: (newDate: Date) => void;
	setProducts: (newProducts: ProductType[] | null) => void;
	setAddFees: (newFees: FeeType[] | null) => void;
	setNetPrice: (newPrice: number) => void;
	setNotesInternal: (newNotes: string) => void;
	setNotesInvoice: (newNotes: string) => void;
	resetOrderStore: () => void;
}

const defaultStoreState = {
	customer: { id: 0, name: '', phone: '', address: '', img:'' },
	startDate: new Date(0),
	endDate: new Date(0),
	products: null,
	addFees: null,
	netPrice: 0,
	notesInternal: '',
	notesInvoice: '',
};

const useOrderStore = create<IOrder>((set) => ({
	...defaultStoreState,
	setCustomer: (newCustomer: CustomerType) => set({ customer: newCustomer }),
	setStartDate: (newDate: Date) => set({ startDate: newDate }),
	setEndDate: (newDate: Date) => set({ endDate: newDate }),
	setProducts: (newProducts: ProductType[] | null) => set({ products: newProducts }),
	setAddFees: (newFees: FeeType[] | null) => set({ addFees: newFees }),
	setNetPrice: (newPrice: number) => set({ netPrice: newPrice }),
	setNotesInternal: (newNotes: string) => set({ notesInternal: newNotes }),
	setNotesInvoice: (newNotes: string) => set({ notesInvoice: newNotes }),
	resetOrderStore: () => {
		set({
			...defaultStoreState
		});
	},
}));

export const useTrackedOrderStore = createTrackedSelector(useOrderStore);

