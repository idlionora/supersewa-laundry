import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

export type CustomerType = {
	id: number;
	name: string;
	phone: string;
	address: string;
	img: string;	
}

export type ServiceType = {
	id: number;
	name: string;
	priceRange: string;
	img: string;
	quantity: number;
	price: number;
	desc: string;
};

type FeeType = {
	label: string;
	price: number;
};

interface IOrder {
	customer: CustomerType;
	startDate: Date;
	endDate: Date;
	services: ServiceType[] | null;
	addFees: FeeType[] | null;
	netPrice: number;
	notesInternal: string;
	notesInvoice: string;
	setCustomer: (newCustomer: CustomerType) => void;
	setStartDate: (newDate: Date) => void;
	setEndDate: (newDate: Date) => void;
	setServices: (newServices: ServiceType[] | null) => void;
	setAddFees: (newFees: FeeType[] | null) => void;
	setNetPrice: (newPrice: number) => void;
	setNotesInternal: (newNotes: string) => void;
	setNotesInvoice: (newNotes: string) => void;
	resetOrderStore: () => void;
}

const defaultStoreState = {
	customer: { id: 0, name: '', phone: '', address: '', img: '' },
	startDate: new Date(0),
	endDate: new Date(0),
	services: [{ id: 0, name: '', priceRange: '', img: '', quantity: 1, price: 0, desc: '' }],
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
	setServices: (newServices: ServiceType[] | null) => set({ services: newServices }),
	setAddFees: (newFees: FeeType[] | null) => set({ addFees: newFees }),
	setNetPrice: (newPrice: number) => set({ netPrice: newPrice }),
	setNotesInternal: (newNotes: string) => set({ notesInternal: newNotes }),
	setNotesInvoice: (newNotes: string) => set({ notesInvoice: newNotes }),
	resetOrderStore: () => {
		set({
			...defaultStoreState,
		});
	},
}));

export const useTrackedOrderStore = createTrackedSelector(useOrderStore);

