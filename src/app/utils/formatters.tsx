import {Hash} from "node:crypto";
import {Raw} from "@/app/interfaces/raw";
import {Id} from "@/app/interfaces/id";

/**
 * Utility class for formatting various data types such as timestamps, hashes, byte sizes, and object types.
 */
export class Formatters {

    /**
     * Converts a Unix timestamp to a human-readable local date string.
     * @param {number} timestamp - The Unix timestamp in seconds.
     * @returns {string} A string representation of the local date and time.
     */
    public static formatTimestampToLocalDate(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleString();
    }

    /**
     * Formats a [hash] object into a hexadecimal string representation.
     * @param {Hash | Raw | Id} hash - The [hash] object to be formatted.
     * @returns {string} The hexadecimal string representation of the [hash].
     */
    public static formatHash(hash: Hash | Raw | Id): string {
        const bytesArray = new Uint8Array(Object.values(hash));
        const hexString = Array.from(bytesArray)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');

        return hexString;
    }

    /**
     * Reduces the size of a [hash] string by slicing it and adding ellipsis.
     * @param {string} str - The [hash] string to be reduced.
     * @returns {string} A shortened version of the [hash] string.
     */
    static reduceHashSize(str: string): string {
        return str.slice(1, 10) + "...";
    }

    /**
     * Formats a size in bytes into a human-readable string with appropriate units (B, KB, MB).
     * @param {number} size - The size in bytes.
     * @returns {string} A string representation of the size in appropriate units.
     */
    static formatByteSize(size: number): string {
        if (size < 1000) { // Smaller than 1 KB
            return `${size} B`;
        } else if (size < 1000000) { // Smaller than 1 MB
            return `${size / 1000} KB`;
        } else {
            return `${size / 1000000} MB`;
        }
    }

    /**
     * Formats a numeric object type as a string.
     * @param {number} type - The numeric object type to be formatted.
     * @returns {string} A string representation of the object type.
     */
    static formatObjectType(type: number): string {
        return type.toString();
    }
}
