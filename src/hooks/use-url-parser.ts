/**
 * Convert query string with specified query keys to an object
 * 
 * @param {string} currentParams - current query string
 * @param {string[]} keys        - array of keys in the query string
 * @returns 
 */
export const decodeUrlRequestToObject = <T extends { [key: string]: any }>(currentParams: string, keys?: string[]): T | undefined => {

    const convertToType = (value: any): any => {
        const val = decodeURIComponent(value)
        if (!isNaN(Number(value))) return Number(val) // is not a number
        if (val === 'true') return true // is string boolean true
        if (val === 'false') return false // is string boolean false
        if (val.match(/^~.*~$/)) return val.slice(1, -1).split('-').map((v: any) => convertToType(v)) // is array
        if (val.match(/_/)) { // is object
            return (value?.split('-') ?? []).reduce((acc: object, pair: string) => {
                const pairSplit = pair.split('_')
                if (pairSplit.length !== 2) return acc

                return { ...acc, [pairSplit[0]]: convertToType(pairSplit[1]) }
            }, {})
        }

        return val
    }

    const objectData: T = Object.entries(Object.fromEntries(new URLSearchParams(currentParams)))
        .filter(([key, value]) => (keys && keys.includes(key)))
        .reduce((acc: T, [key, value]: [string, any]) => {
            const updatedValue = convertToType(value)
            if (updatedValue === null || updatedValue === undefined) return acc

            return { ...acc, [key]: updatedValue }
        }, {} as T)

    return Object.keys(objectData).length === 0 ? undefined : objectData
}

/**
 * Encode object into a query string
 * 
 * @param {string} currentParams - current query string
 * @param {object} object        - the object used for the conversion
 * @returns 
 */
export const encodeObjectToUrlRequest = (currentParams: string, object: object): string => {
    const convertToString = (value: any): string | null => {
        if (typeof value === 'number') return value.toString()
        if (typeof value === 'string') return (value === '' ? null : encodeURIComponent(value))
        if (typeof value === 'boolean') return value ? 'true' : 'false'
        if (Array.isArray(value)) { // is array
            return (value.length === 0 ? null : `~${value.map((val: any) => convertToString(val)).join('-')}~`)
        }
        if (typeof value === 'object' && value !== null) { // is object
            if (Object.values(value).some(val => val === null || val === undefined)) return null

            return Object.entries(value).reduce((acc: string, [key, entry]) => {
                const objVal: string | null = convertToString(entry)
                return objVal ? `${acc}-${objVal}` : acc
            }, '')
        }

        return null
    }

    const paramsObj: URLSearchParams = new URLSearchParams(currentParams)

    Object
        .entries(object)
        .forEach(([name, item]: [string, any]) => {
            const updatedValue: string | null = convertToString(item)
            if (!updatedValue) {
                paramsObj.delete(name)
            } else {
                paramsObj.set(name, updatedValue)
            }
        })

    return paramsObj.toString()
}

/**
 * Encodes text to a readable and valid url string
 * 
 * @param {string} text - text
 * 
 * @returns {string}
 */
export const encodeStringToUrl = (text: string): string => encodeURI(text.toLocaleLowerCase().replaceAll(' ', '-'))

/**
 * Decodes a url string to normal text
 * 
 * @param {string} urlString - url string
 * 
 * @returns {string}
 */
export const decodeUrlToString = (urlString: string): string => decodeURI(urlString).replaceAll('-', ' ')
