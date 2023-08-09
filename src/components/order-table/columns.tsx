import {ColumnDef} from "@tanstack/react-table"
import id from 'date-fns/locale/id';
import { format } from 'date-fns';
import iconCheck from "../../assets/icon-checklist.png"
import { ArrowUpDown } from "lucide-react";

export type OrdersDataType = {
    order_id: number,
    customer_name: string,
    img: string,
    start_date: Date,
    net_price: number,
    order_paid: boolean,
    order_status: string
}

export const columns: ColumnDef<OrdersDataType>[] = [
	{
		accessorKey: 'customer_name',
		header: 'Pelanggan',
        cell: ({row}) => {
            return (
                <div className="flex items-center">
                    <div className={`rounded-full shrink-0 ${row.original.img} text-white w-6 h-6 text-sm font-medium flex justify-center items-center m-0 mr-2`}>
                        {row.original.customer_name[0]}
                    </div>
                    {row.getValue('customer_name')}
                </div>
            )
        }
	},
	{
		accessorKey: 'start_date',
		header: ({column}) => {
			return <button onClick={()=> column.toggleSorting(column.getIsSorted() === "asc")} className="w-full flex items-center justify-center">Tanggal Masuk<ArrowUpDown className="ml-2 h-3.5 w-3.5"/></button>;
		},
        cell: ({row}) => {
            return (
				<div className="w-full text-center">
					{row.original.start_date.getFullYear() === new Date().getFullYear()
						? format(row.getValue('start_date'), 'd MMM', { locale: id })
						: format(row.getValue('start_date'), 'PPP', { locale: id })}
				</div>
			);
        }
	},
	{
		accessorKey: "net_price",
        header: 'Total',
		cell: ({ row }) => {
			const formattedDate = new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
			}).format(row.getValue("net_price")).replace(',00', '');
			return (
				<div className="w-full flex items-center justify-end">
					{formattedDate}
					{row.original.order_paid === true ? <img
						src={iconCheck}
						alt="Sudah Lunas"
						className="w-3.5 h-3.5 ml-1"
						style={{
							filter: 'invert(48%) sepia(22%) saturate(2336%) hue-rotate(97deg) brightness(95%) contrast(83%)',
						}}
					/> : <div className="w-3.5 h-3.5 ml-1"/>}
				</div>
			);
		},
	},
	{
		accessorKey: 'order_status',
		header: 'Status',
        cell: ({row}) => {
            return (
                <div className="w-full text-center">
                    {row.getValue('order_status')}
                </div>
            )
        }
	},
];
