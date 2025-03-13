import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";


/**
 * Represents the properties for a table component.
 *
 * @typedef {Object} TableProps
 * @property {string[]} headers - An array of strings specifying the column headers for the table.
 * @property {(string | React.ReactElement)[][]} rows - A two-dimensional array representing the rows of the table.
 * Each element in the sub-array corresponds to a cell in the row and can either be a string or a React element.
 */
type TableProps = {
    headers: string[];
    rows: (string | React.ReactElement)[][];
};


/**
 * A GenericTable component that renders a dynamic table using provided headers and rows.
 *
 * @typedef {Object} TableProps
 * @property {string[]} headers - An array of strings representing the header content of the table.
 * @property {Array<Array<any>>} rows - A 2D array where each sub-array represents a row of data for the table.
 *
 * @type {React.FC<TableProps>}
 */
export const GenericTable: React.FC<TableProps> = ({headers, rows}) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {headers.map((header, index) => (
                        <TableCell
                            key={index}
                            align="left"
                            sx={{fontWeight: "bold", backgroundColor: "#f0f0f0"}}
                        >
                            {header}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} align="left">
                                {cell}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
