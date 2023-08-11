import { useEffect, useState } from 'react';
import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.tsx';
import useTrackedOrdersFilterStore from '../../stores/ordersFilterStore.tsx';
import iconAdjust from '../../assets/icon-adjustment.svg'
import iconSearch from '../../assets/icon-search.svg'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const filterStore = useTrackedOrdersFilterStore()
	const [sorting, setSorting] = useState<SortingState>([]);
	const [contentNum, setContentNum] = useState<string>('15');
	const [globalFilter, setGlobalFilter] = useState('')
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter
		},
		onGlobalFilterChange: setGlobalFilter
	});

	useEffect(() => {
		table.setPageSize(parseInt(contentNum));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentNum]);

	return (
		<>
			<div className="card-white px-4 pt-2 pb-3 w-full mb-4">
				<label htmlFor="orders-name-filter" className="text-sm block mb-2 font-medium">
					Filter Pesanan
				</label>
				<div className="w-full flex items-center gap-3.5">
					<div className="w-full relative">
						<input
							type="text"
							id="orders-name-filter"
							name="orders-name-filter"
							value={globalFilter}
							className="form-input mb-0 w-full pl-9"
							onChange={(e) => setGlobalFilter(e.target.value)}
							placeholder="cari pelanggan, total harga, atau status"
						/>
						<div className='absolute top-0 left-0 h-[2.75rem] flex items-center'>
							<img src={iconSearch} alt="" className='w-5 ml-2 invert contrast-[20%]'/>
						</div>
					</div>
					<Popover>
						<PopoverTrigger asChild>
							<button className="button-gray flex justify-center text-[13px] px-5 gap-1">
								<img src={iconAdjust} alt="" className="w-5 h-5 opacity-80" />
								<p className="pr-1.5">Kategori</p>
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-36 py-1.5 px-2 flex flex-col gap-2.5">
							<button className={`button-gray py-3 w-full ${filterStore.laundryListOnly? 'ring-2 ring-green-500': ''}`} onClick={() => filterStore.setLaundryListOnly(!filterStore.laundryListOnly) }>Masih Proses</button>
							<button className={`button-gray py-3 w-full ${filterStore.unpaidListOnly? 'ring-2 ring-green-500' : ''}`} onClick={() => filterStore.setUnpaidListOnly(!filterStore.unpaidListOnly)}>Belum Lunas</button>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<div className="w-full mb-4 px-2.5 min-[575px]:px-0 flex flex-col min-[365px]:flex-row gap-y-4 justify-between items-center">
				<div className="flex items-center min-[365px]:justify-end mt-0">
					<Select value={contentNum} onValueChange={setContentNum}>
						<SelectTrigger className="w-16 gap-1.5 px-2.5 bg-white h-[2.344rem] text-[0.8125rem] focus:ring-0 focus:outline-offset-0 focus:outline-amber-500">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="15">15</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="30">30</SelectItem>
						</SelectContent>
					</Select>
					<p className="ml-1 text-left min-[575px]:max-w-none">pesanan per halaman</p>
				</div>
				<div className="shrink-0 flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
					<button
						className="button-pagination rounded-l"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						←
					</button>
					{table.options.state.pagination?.pageIndex &&
					table.options.state.pagination.pageIndex > 0 ? (
						<button
							className="button-pagination"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							1
						</button>
					) : (
						''
					)}
					{table.options.state.pagination?.pageIndex &&
					table.options.state.pagination.pageIndex > 1 ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					<div className="px-3 py-2 bg-theme-blue text-white border border-transparent font-semibold">
						{table.options.state.pagination!.pageIndex + 1}
					</div>
					{(table.options.state.pagination?.pageIndex &&
						table.options.state.pagination.pageIndex < table.getPageCount() - 2) ||
					(table.options.state.pagination?.pageIndex == 0 && table.getPageCount() > 2) ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					{table.options.state.pagination?.pageIndex !== table.getPageCount() - 1 ? (
						<button
							className="button-pagination"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							{table.getPageCount()}
						</button>
					) : (
						''
					)}
					<button
						className="button-pagination rounded-r"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						→
					</button>
				</div>
			</div>

			<div className="card-white py-4 sm:px-4 flex flex-col items-center w-full overflow-x-auto">
				<div className="min-[365px]:rounded-md border w-full">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="w-full mt-[1.125rem] px-2.5 min-[575px]:px-0 flex flex-col min-[365px]:flex-row justify-between items-center">
				<div className="shrink-0 flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
					<button
						className="button-pagination rounded-l"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						←
					</button>
					{table.options.state.pagination?.pageIndex &&
					table.options.state.pagination.pageIndex > 0 ? (
						<button
							className="button-pagination"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							1
						</button>
					) : (
						''
					)}
					{table.options.state.pagination?.pageIndex &&
					table.options.state.pagination.pageIndex > 1 ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					<div className="px-3 py-2 bg-theme-blue text-white border border-transparent font-semibold">
						{table.options.state.pagination!.pageIndex + 1}
					</div>
					{(table.options.state.pagination?.pageIndex &&
						table.options.state.pagination.pageIndex < table.getPageCount() - 2) ||
					(table.options.state.pagination?.pageIndex == 0 && table.getPageCount() > 2) ? (
						<div className="px-3 py-2 bg-white border border-transparent font-semibold">
							...
						</div>
					) : (
						''
					)}
					{table.options.state.pagination?.pageIndex !== table.getPageCount() - 1 ? (
						<button
							className="button-pagination"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							{table.getPageCount()}
						</button>
					) : (
						''
					)}
					<button
						className="button-pagination rounded-r"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						→
					</button>
				</div>
			</div>
		</>
	);
}
