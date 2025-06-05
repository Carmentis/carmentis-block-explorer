'use client';
import {ReactNode} from 'react';
import {DynamicTableComponent} from './dynamic-table.component';

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
    let content = (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 font-medium">No entries found</p>
            <p className="text-gray-500 text-sm mt-1">There are no items to display at this time.</p>
        </div>
    );
    if (data.length !== 0) {
        const heads = extractor(data[0], 0).map(d => d.head);
        content = (
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {heads.map((head) => (
                                <th
                                    key={head}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 hover:scale-[1.01] transition-all duration-150 ease-in-out cursor-pointer`}
                                onClick={() => onRowClicked && onRowClicked(row)}
                            >
                                {
                                    extractor(row, index).map((result, index) => (
                                        <td key={index} className="px-6 py-6 whitespace-nowrap text-sm text-gray-700 text-center">
                                            {result.value}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return <>{content}</>;
}

// Re-export DynamicTableComponent for backward compatibility
export {DynamicTableComponent};