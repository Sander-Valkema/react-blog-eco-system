/**
 * Converts unix timestamp to a readable date
 * 
 * @param {number} time - unix time stamp
 * 
 * @returns {string}
 */
export const getDateFromTimestamp = (time: number, locale: string = 'en-US') => {
    const date: Date = new Date(time)

    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}
