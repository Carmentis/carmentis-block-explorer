'use client';
import {ReactNode, useEffect, useState} from 'react';
import Skeleton from "react-loading-skeleton";

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
export type DynamicTableComponentProps<T> = {
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
    {header, data, renderRow, onRowClicked, noWrapCell}: DynamicTableComponentProps<T>
) {
    noWrapCell = typeof noWrapCell === "undefined" ? false : noWrapCell;

    if (data.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No entries found</h3>
                <p className="text-gray-500 max-w-md mx-auto">There are no items to display at this time. Please check back later or try a different search.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded shadow-md border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
            <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        {header.map((head) => (
                            <th
                                key={head}
                                className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                            >
                                <div className="flex items-center space-x-1">
                                    <span>{head}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/20'} 
                                hover:bg-blue-50  transition-all duration-200 
                                ease-in-out cursor-pointer  border-transparent hover:border-blue-400`}
                            onClick={() => onRowClicked && onRowClicked(row, index)}
                        >
                            <DynamicRow 
                                row={row} 
                                index={index} 
                                renderRow={renderRow} 
                                numberOfCols={header.length} 
                                noWrap={noWrapCell} 
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
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
function DynamicRow<T>({numberOfCols, row, index, renderRow, noWrap}: {
    numberOfCols: number, 
    row: T, 
    index: number, 
    renderRow: (row: T, index: number) => Promise<ReactNode[]>, 
    noWrap: boolean
}) {
    const [renderedRow, setRenderedRow] = useState<ReactNode[] | undefined>();
    const [error, setError] = useState<Error|undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        renderRow(row, index)
            .then(data => {
                if (isMounted) {
                    setRenderedRow(data);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                if (isMounted) {
                    setError(error);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [row, index, renderRow]);

    if (error) {
        console.error(error);
        return (
            <td colSpan={numberOfCols} className="w-full h-full text-center">
                <div className="bg-red-50 p-4 w-full flex flex-col md:flex-row items-center justify-center text-red-600 transition-all duration-300 hover:bg-red-100 shadow-sm mx-auto ">
                    <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
                        <svg className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-red-700 text-sm md:text-base">Data Loading Failed</h3>
                        {error.message && (
                            <p className="text-xs md:text-sm text-red-600 mt-1 max-w-md">{error.message.substring(0, 100)}{error.message.length > 100 ? '...' : ''}</p>
                        )}
                        <p className="text-xs text-red-500 mt-2">Please try again or contact support if the issue persists.</p>
                    </div>
                </div>
            </td>
        );
    }

    if (isLoading || !renderedRow) {
        return (
            <td colSpan={numberOfCols} className="px-2 py-2">
                <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
                    <div className="flex justify-center mt-2">
                        <span className="text-xs text-blue-500 animate-pulse">Loading data...</span>
                    </div>
                </div>
            </td>
        );
    }

    return renderedRow.map((r, i) => 
        noWrap ? <>{r}</> : (
            <td key={i} className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-700 group">
                <div className="transition-all duration-200 group-hover:text-blue-700">
                    {r}
                </div>
            </td>
        )
    );
}
