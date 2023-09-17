import { ReactNode, useState, useEffect } from 'react';

type CustomPopoverProps = {
	isPopoverOpen: boolean;
	popoverContent: string;
	children: ReactNode | ReactNode[];
};

const CustomPopover = ({ isPopoverOpen, popoverContent, children }: CustomPopoverProps) => {
	const [popoverDisplay, setPopoverDisplay] = useState<boolean>(false);
	const [popoverOpacity, setPopoverOpacity] = useState<boolean>(false);

	useEffect(() => {
		if (isPopoverOpen) {
			setPopoverDisplay(true);
			setTimeout(() => {
				setPopoverOpacity(true);
			}, 10);
		} else {
			setPopoverOpacity(false);
			setTimeout(() => {
				setPopoverDisplay(false);
			}, 210);
		}
	}, [isPopoverOpen]);

	return (
		<div className="relative">
			{children}

			{popoverDisplay ? (
				<div
					className={`absolute top-full translate-x-1/2 right-1/2 pt-1 flex flex-col items-center transition-opacity duration-200 ease-in-out ${
						popoverOpacity ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<div className="border-l-[0.5rem] border-l-transparent border-r-[0.5rem] border-r-transparent border-b-8 border-b-[#191919]" />
					<div className="mt-[-2px] whitespace-nowrap bg-[#191919] px-2 py-1.5 rounded-sm">
						<p className="text-white">{popoverContent}</p>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default CustomPopover;
