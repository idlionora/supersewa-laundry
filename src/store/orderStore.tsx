import { create } from 'zustand';

type ProductType = {
	id: number;
	price: number;
	quantity: number;
};

type FeeType = {
	label: string;
	price: number;
};

interface IOrder {
	customerId: number;
	startDate: Date;
	endDate: Date;
	products: ProductType[] | null;
	addFees: FeeType[] | null;
	netPrice: number;
	notesInternal: string;
	notesInvoice: string;
	setCustomerId: (newId: number) => void;
	setStartDate: (newDate: Date) => void;
	setEndDate: (newDate: Date) => void;
	setProducts: (newProducts: ProductType[] | null) => void;
	setAddFees: (newFees: FeeType[] | null) => void;
	setNetPrice: (newPrice: number) => void;
	setNotesInternal: (newNotes: string) => void;
	setNotesInvoice: (newNotes: string) => void;
	resetOrderStore: () => void;
}

export const useOrderStore = create<IOrder>((set) => ({
	customerId: 0,
	startDate: new Date(0),
	endDate: new Date(0),
	products: null,
	addFees: null,
	netPrice: 0,
	notesInternal: '',
	notesInvoice: '',
	setCustomerId: (newId: number) => set({ customerId: newId }),
	setStartDate: (newDate: Date) => set({ startDate: newDate }),
	setEndDate: (newDate: Date) => set({ endDate: newDate }),
	setProducts: (newProducts: ProductType[] | null) => set({ products: newProducts }),
	setAddFees: (newFees: FeeType[] | null) => set({ addFees: newFees }),
	setNetPrice: (newPrice: number) => set({ netPrice: newPrice }),
	setNotesInternal: (newNotes: string) => set({ notesInternal: newNotes }),
	setNotesInvoice: (newNotes: string) => set({ notesInvoice: newNotes }),
	resetOrderStore: () => {
		set({
			customerId: 0,
			startDate: new Date(0),
			endDate: new Date(0),
			products: null,
			addFees: null,
			netPrice: 0,
			notesInternal: '',
			notesInvoice: '',
		});
	},
}));
