import React, { ReactNode, forwardRef, useEffect, useState } from "react";
import { Check } from "lucide-react";

type DropdownCompProps = {
	title: string;
	isOpen: boolean;
	setOpenedDropdown: React.Dispatch<React.SetStateAction<string>> | ((input: string) => void);
	options: string[];
	selectedOption: string;
	setSelectedOption: React.Dispatch<React.SetStateAction<string>> | ((input: string) => void);
	parentClass: string;
	childClass: string;
	children: ReactNode[];
};

const DropdownComp = forwardRef<HTMLDivElement, DropdownCompProps>(({title, isOpen, setOpenedDropdown, options, selectedOption, setSelectedOption, parentClass = '', childClass = '', children}, ref) => {
    const [dropdownDisplay, setDropdownDisplay] = useState<boolean>(false);
    const [dropdownOpacity, setDropdownOpacity] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setDropdownDisplay(true);
            setTimeout(() => {
                setDropdownOpacity(true);
            }, 10)
        } else {
            setDropdownOpacity(false);
            setTimeout(() => {
                setDropdownDisplay(false)
            }, 210)
        }
    }, [isOpen])

    function selectDropdown(input: string) {
        setSelectedOption(input)
        setOpenedDropdown('')
    }
    return (
		<div ref={ref} className={`relative ${parentClass}`}>
			{children}
			{dropdownDisplay ? (
				<ul
					className={`absolute top-full translate-y-1 z-50 bg-white p-1 rounded border border-[#d1d5db] drop-shadow-md transition-opacity duration-200 ease-in-out flex flex-col ${
						dropdownOpacity ? 'opacity-100' : 'opacity-0'
					} ${childClass}`}
					onClick={(e) => e.stopPropagation()}
				>
					{options.map((option, index) => {
						return (
							<li key={`${title}-${index}`}>
								<button
									className={`flex items-center gap-x-2.5 py-4 px-2 text-sm rounded-sm outline-none outline-0 ring-0 hover:bg-slate-100 focus:bg-slate-100 w-full`}
									onClick={() => selectDropdown(option)}
								>
									<Check
										className={`h-4 w-4 ${
											selectedOption === option ? '' : 'opacity-0'
										}`}
									/>
									<p className="text-left">{option}</p>
								</button>
							</li>
						);
					})}
				</ul>
			) : (
				''
			)}
		</div>
	);
})

export default DropdownComp;
