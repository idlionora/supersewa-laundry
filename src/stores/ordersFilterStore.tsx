import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface IOrdersFilter {
    laundryListOnly: boolean;
    unpaidListOnly: boolean;
    setLaundryListOnly: (bool:boolean) => void;
    setUnpaidListOnly: (bool:boolean) => void;
}

const useOrdersFilterStore = create<IOrdersFilter>((set) => ({
    laundryListOnly: false,
    unpaidListOnly: false,
    setLaundryListOnly: (bool: boolean) => {
        set({laundryListOnly: bool})
    },
    setUnpaidListOnly: (bool:boolean) => {
        set({unpaidListOnly: bool})
    }
}))

const useTrackedOrdersFilterStore = createTrackedSelector(useOrdersFilterStore);

export default useTrackedOrdersFilterStore;
