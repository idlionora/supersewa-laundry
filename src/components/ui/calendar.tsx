import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@lib/utils"
import { buttonVariants } from "./button"
import iconArrowLeft from '@assets/icon-arrow-left.svg'
import iconArrowRight from '@assets/icon-arrow-right.svg'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3 pb-4 w-screen max-w-md md:w-full overflow-y-auto', className)}
			classNames={{
				months: 'flex flex-col md:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4 ',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-base font-medium',
				nav: 'space-x-1 flex items-center',
				nav_button: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				),
				nav_button_previous: 'absolute left-1',
				nav_button_next: 'absolute right-1',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex justify-between',
				head_cell:
					'w-12 text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400' /*day names*/,
				row: 'flex w-full mt-2 justify-between',
				cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected])]:bg-slate-800',
				day: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-12 w-12 p-0 font-normal aria-selected:opacity-100'
				),
				day_selected:
					'bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900',
				day_today: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
				day_outside: 'text-slate-500 opacity-50 dark:text-slate-400',
				day_disabled: 'text-slate-500 opacity-50 dark:text-slate-400',
				day_range_middle:
					'aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				IconLeft: () => <img src={iconArrowLeft} alt="" className="h-4 w-4" />,
				IconRight: () => <img src={iconArrowRight} alt="" className="h-4 w-4" />,
			}}
			{...props}
		/>
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
