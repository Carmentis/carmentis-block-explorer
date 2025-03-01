'use client';
import {ReactNode, useEffect, useState} from 'react';
import {Typography} from "@mui/material";
import Skeleton from "react-loading-skeleton";

/**
 * Represents the properties required for the TableComponent.
 *
 * @template T The type of the data used in the table.
 *
 * @property {T[]} data The array of data objects to be displayed in the table.
 * @property {(row: T, index: number) => {head: string, value?: ReactNode }[]} extractor
 * A function that takes a row and its index, and returns an array of objects.
 * Each object represents a column where 'head' is the header name and 'value' is the content of the cell.
 * @property {(row: T) => void} [onRowClicked] Optional. Callback function triggered when a row is clicked. Receives the clicked row as an argument.
 */
export type TableComponentProps<T> = {
    data: T[],
    extractor: (row: T, index: number) => {head: string, value?: ReactNode }[],
    onRowClicked?: (row: T) => void,
}
/**
 * TableComponent displays a table with data extracted using the provided extractor function.
 * If the data is empty, it displays a fallback message: "No entry found".
 *
 * @param {Object} props - The properties passed to the TableComponent.
 * @param {Array<T>} props.data - The array of data used to populate the table rows.
 * @param {function(T, number): Array<{head: string, value: React.ReactNode}>} props.extractor - A function that extracts an array of objects from each data item.
 *        Each object must contain a `head` (for the table header) and `value` (for the cell).
 * @param {function(T): void} [props.onRowClicked] - An optional callback function triggered when a row is clicked.
 *
 * @return {JSX.Element} A JSX element representing the table display, or a fallback message if no data is provided.
 */
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
                        className="border-b border-blue-gray-100 py-2"
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
                        extractor(row, index).map((result, index) => <td key={index}>{result.value}</td>)
                    }
                </tr>
            ))}

            </tbody>
        </table>
    }

    return <>{content}</>
}

/**
 * Represents a dynamic table component structure with customizable headers, data, and functionalities.
 *
 * @template T - The type of data for each row of the table.
 * @typedef {Object} DynamicTableComponent
 * @property {string[]} header - An array of strings representing the table headers.
 * @property {T[]} data - An array of data of type T representing the rows of the table.
 * @property {boolean} [noWrap] - An optional property specifying whether to prevent text wrapping in table cells.
 * @property {(row: T, index: number) => Promise<ReactNode[]>} renderRow - A function to render the content of a row. Receives the row data and its index, and returns a Promise resolving to an array of React nodes.
 * @property {(row: T, index: number) => void} onRowClicked - A function called when a row is clicked. Receives the row data and its index as arguments.
 */
export type DynamicTableComponent<T> = {
    header: string[],
    data: T[],
    noWrapCell?: boolean,
    renderRow: (row: T, index: number) => Promise<ReactNode[]>,
    onRowClicked: (row: T, index: number) => void
};
/**
 * Renders a dynamic table component with customizable headers, rows, and behavior.
 *
 * @param {Object} params - Parameters for the DynamicTableComponent.
 * @param {Array<string>} params.header - The headers for the table columns.
 * @param {Array<T>} params.data - The data to populate the table rows.
 * @param {Function} params.renderRow - A function to render a single row of the table. It should return the expected JSX structure for the row.
 * @param {Function} [params.onRowClicked] - A callback function that is invoked when a row is clicked. It receives the row data and the row index as arguments.
 * @param {boolean} [params.noWrap] - Determines whether the cell content should wrap. Defaults to false if not provided.
 * @return {JSX.Element} The rendered table or an empty state message if no data is provided.
 */
export function DynamicTableComponent<T>(
    {header, data, renderRow, onRowClicked, noWrapCell}: DynamicTableComponent<T>
) {
    noWrapCell = typeof noWrapCell === "undefined" ? false : noWrapCell;
    let content = <Typography>No entry found</Typography>;
    if (data.length !== 0) {
        content = <table className="w-full min-w-max table-auto text-left">
            <thead>
            <tr>
                {header.map((head) => (
                    <th
                        key={head}
                        className="border-b border-blue-gray-100 py-2"
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
                    className={"cursor-pointer hover:bg-gray-50 [&>td]:py-2"}
                    onClick={() => onRowClicked && onRowClicked(row, index)}
                >
                    <DynamicRow row={row} index={index} renderRow={renderRow} numberOfCols={header.length} noWrap={noWrapCell} />
                </tr>
            ))}

            </tbody>
        </table>
    }

    return <>{content}</>
}

/**
 * Renders a dynamic row in a table using the provided data and rendering function.
 *
 * @param {Object} options - Configuration for rendering the row.
 * @param {number} options.numberOfCols - The total number of columns the row spans.
 * @param {T} options.row - The data object for the current row.
 * @param {number} options.index - The index of the current row.
 * @param {function} options.renderRow - A function that takes the row data and index,
 *    and returns a Promise resolving to an array of React nodes to be rendered.
 * @param {boolean} options.noWrap - Determines whether the React nodes should be wrapped in `<td>` elements.
 * @return {ReactNode} The rendered dynamic row based on the provided data and configuration.
 */
function DynamicRow<T>( {numberOfCols, row, index, renderRow, noWrap}: {numberOfCols: number, row: T, index: number, renderRow: (row: T, index: number) => Promise<ReactNode[]>, noWrap: boolean }  ) {
    const [renderedRow, setRenderedRow] = useState<ReactNode[] | undefined>();

    useEffect(() => {
        async function loadRow() {
            const data = await renderRow(row, index);
            setRenderedRow(data);
        }

        loadRow()
    }, [])

    if (!renderedRow) return <td colSpan={numberOfCols}><Skeleton/></td>
    return renderedRow.map((r,i) => noWrap ? <>{r}</> : <td key={i}>{r}</td>);
}