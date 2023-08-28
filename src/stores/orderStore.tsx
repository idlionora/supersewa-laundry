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

export type FeeType = {
	category: 'discount' | 'additional';
	label: string;
	price: number;
};

export type PaymentType = {
	paydate: Date;
	desc: string;
	price: number;
}

interface IOrder {
	customer: CustomerType;
	services: ServiceType[] | null;
	addFees: FeeType[] | null;
	payments: PaymentType[] | null;
	setCustomer: (newCustomer: CustomerType) => void;
	setServices: (newServices: ServiceType[] | null) => void;
	setAddFees: (newFees: FeeType[] | null) => void;
	setPayments: (newPayment: PaymentType[] | null) => void;
	resetOrderStore: () => void;
}

const defaultStoreState = {
	customer: { id: 0, name: '', phone: '', address: '', img: '' },
	services: null,
	addFees: null,
	payments: null,
};

const useOrderStore = create<IOrder>((set) => ({
	...defaultStoreState,
	setCustomer: (newCustomer: CustomerType) => set({ customer: newCustomer }),
	setServices: (newServices: ServiceType[] | null) => set({ services: newServices }),
	setAddFees: (newFees: FeeType[] | null) => set({ addFees: newFees }),
	setPayments: (newPayment: PaymentType[] | null ) => set({ payments: newPayment }),
	resetOrderStore: () => {
		set({
			...defaultStoreState,
		});
	},
}));

export const useTrackedOrderStore = createTrackedSelector(useOrderStore);

