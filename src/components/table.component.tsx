'use client';
import { ReactNode } from 'react';
import {Card, Typography} from "@mui/material";

export type TableComponentProps<T> = {
    data: T[],
    extractor: (row: T, index: number) => {head: string, value: ReactNode}[],
    onRowClicked?: (row: T) => void,
}
export default function TableComponent<T>(
    {data, extractor, onRowClicked}: TableComponentProps<T>
) {
    let content = <Typography>No entry found</Typography>;
    if (data.length !== 0) {
        const heads = extractor(data[0], 0).map(d => d.head);
        content = <table className="w-full min-w-max table-auto text-left">
            <thead>
            <tr>
                {heads.map((head) => (
                    <th
                        key={head}
                        className="border-b border-blue-gray-100 p-4"
                    >
                        <Typography
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                        >
                            {head}
                        </Typography>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row,index) => (
                <tr
                    key={index}
                    className={"cursor-pointer hover:bg-gray-50 [&>td]:p-2"}
                    onClick={() => onRowClicked && onRowClicked(row)}
                >
                    {
                        extractor(row, index).map((result, index) => {
                            return <td key={index}>
                                {result.value}
                            </td>
                        })
                    }
                </tr>
            ))}

            </tbody>
        </table>
    }

    return <>{content}</>
}