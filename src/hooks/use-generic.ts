/**
 * Create an array of numbers that start with 'start' and end with 'end'
 * 
 * @param {number} start - start number of array
 * @param {number} end   - end number of array
 * 
 * @returns {number[]}
 */
export const getArrayRange = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => i + start)