import React from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

const Datatable = ({data, column}) => {
    const table = useReactTable({
        data,
        columns: column || [],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-4 overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            <th>Serial.No</th>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id} className="border whitespace-nowrap px-4 py-2 text-left bg-gray-100">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>    
                <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                        <tr key={row.id} className="border-t border-gray-300">
                            <td className="border whitespace-nowrap px-4 py-2 text-left">{index + 1}</td>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border whitespace-nowrap px-4 py-2 text-left">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="h-4"/>
        </div>
    )
};

export default Datatable;