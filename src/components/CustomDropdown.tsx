import Icon from '@components/ui/Icon';
import { ReactNode, forwardRef, useEffect, useState } from 'react';

// type DropdownRefProps = {
//     ref: React.RefObject<HTMLDivElement>,
//     activeLabel : string
// }

// type CloseDropdownRequirements = {
//     event: MouseEvent,
//     dropdowns: DropdownRefProps[],
//     activeDropdown: string,
//     setActiveDropdown: React.Dispatch<React.SetStateAction<string>>
// }

// export function closeDropdownEvent({event, dropdowns, activeDropdown, setActiveDropdown} : CloseDropdownRequirements) {
//     const clickTarget = event.target as Node;
    
//     function deactivateDropdownByClick(dropdown : DropdownRefProps) {
//         const {ref, activeLabel} = dropdown

//         if (ref && activeDropdown === activeLabel && !ref.current?.contains(clickTarget)) {
//             setActiveDropdown('')
//         }
//     }

//     dropdowns.forEach((dropdown) => deactivateDropdownByClick(dropdown))
// }

type CustomDropdownProps = {
	title: string;
	dropdownStatus: {
		isOpen: boolean;
		setStatus: React.Dispatch<React.SetStateAction<string>> | (() => void);
	};
	options: {
		values: string[];
		selected: string;
		setSelected: React.Dispatch<React.SetStateAction<string>> | ((input: string) => void);
	};
	styling: { parentClass: string; childClass: string };
	children: ReactNode | ReactNode[];
};

const CustomDropdown = forwardRef<HTMLDivElement, CustomDropdownProps>(
	({ title, dropdownStatus, options, styling, children }, ref) => {
		const [dropdownDisplay, setDropdownDisplay] = useState<boolean>(false);
		const [dropdownOpacity, setDropdownOpacity] = useState<boolean>(false);

        useEffect(() => {
			if (dropdownStatus.isOpen) {
				setDropdownDisplay(true);
				setTimeout(() => {
					setDropdownOpacity(true);
				}, 10);
			} else {
				setDropdownOpacity(false);
				setTimeout(() => {
					setDropdownDisplay(false);
				}, 210);
			}
		}, [dropdownStatus.isOpen]);

        function selectDropdown(input: string) {
            options.setSelected(input);
            dropdownStatus.setStatus('')
        }
        return (
			<div ref={ref} className={`relative ${styling.parentClass}`}>
				{children}
				{dropdownDisplay ? (
					<ul
						className={`absolute top-full translate-y-1 z-50 bg-white p-1 rounded border border-[#d1d5db] drop-shadow-md transition-opacity duration-200 ease-in-out flex flex-col ${
							dropdownOpacity ? 'opacity-100' : 'opacity-0'
						} ${styling.childClass}`}
						onClick={(e) => e.stopPropagation()}
					>
						{options.values.map((optionValue, index) => {
							return (
								<li key={`${title}-${index}`}>
									<button
										className={`flex items-center gap-x-2.5 py-4 px-2 text-sm rounded-sm outline-none outline-0 ring-0 hover:bg-slate-100 focus:bg-slate-100 w-full`}
										onClick={() => selectDropdown(optionValue)}
									>
										<Icon name='check' className={`h-4 w-4 ${
												options.selected === optionValue ? '' : 'opacity-0'
											}`} />
										<p className="text-left">{optionValue}</p>
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
	}
);

export default CustomDropdown
