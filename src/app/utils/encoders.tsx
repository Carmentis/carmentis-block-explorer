/**
 * Converts a hexadecimal string to a `Uint8Array`.
 *
 * @param {string} hexString - The hexadecimal string to convert. Must have an even length.
 * @throws {Error} If the hex string length is not a multiple of two.
 * @returns {Uint8Array} A `Uint8Array` representing the binary data encoded in the hex string.
 */
export function hexToUint8Array(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
        throw new Error("Invalid hex string: Expecting multiple-of-two strings.");
    }

    const uint8Array = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }

    return uint8Array;
}
