import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select.tsx';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [contentNum, setContentNum] = useState<string>('15')
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});
	console.log(table.options.state.pagination?.pageIndex, table.getPageCount());

	useEffect(()=> {
		table.setPageSize(parseInt(contentNum))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentNum])

	

	return (
		<>
			<div className="w-full mb-4 px-4 min-[575px]:px-0">
				<div className="w-full flex justify-between items-center">
					<div className="flex items-center">
						<Select
							value={contentNum}
							onValueChange={setContentNum}
						>
							<SelectTrigger className="w-16 bg-white h-[2.344rem] text-[0.8125rem] focus:ring-0 focus:outline-offset-0 focus:outline-amber-500">
								<SelectValue />
							</SelectTrigger>
							<SelectContent >
								<SelectItem value="15">15</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
							</SelectContent>
						</Select>
						<p className='ml-2'>pesanan per halaman</p>
					</div>
					<div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-200 gap-px">
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
						table.options.state.pagination?.pageIndex == 0 ? (
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
			</div>

			<div className="card-white py-4 sm:px-4 flex flex-col items-center w-full overflow-x-auto">
				<div className="rounded-md border w-full">
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
		</>
	);
}
