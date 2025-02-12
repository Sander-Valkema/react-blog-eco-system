type valueTypes = object | string | number | boolean

export interface cookieInterface {
    name: string,
    value: valueTypes | valueTypes[],
    expires?: number
}

/**
 * Convert value to cookie string
 * 
 * @param {cookieInterface['value']} value - converted value
 * @returns {string} 
 */
const convertValue = (value: cookieInterface['value']): string => {
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return JSON.stringify(value);

    return value;
}

/**
 * Convert cookie string to value with proper type
 * 
 * @param {string} value 
 * 
 * @returns {cookieInterface['value']}
 */
const readValue = (value: string): cookieInterface['value'] => {
    if (!isNaN(Number(value))) return Number(value);
    if (value === 'true') return true;
    if (value === 'false') return false;

    try {
        return JSON.parse(value)
    } catch {
        return value;
    }
}

/**
 * Save cookie object as cookie
 * 
 * @param {cookieInterface} cookie - cookie object
 */
export const setCookie = (cookie: cookieInterface) => {
    const expires: string | null = cookie.expires ? (new Date(+new Date + cookie.expires * 864e+5)).toString() : null;
    document.cookie = `${cookie.name}=${encodeURIComponent(convertValue(cookie.value))}${expires ? ';' + expires : ''};path=/`;
}

/**
 * Get cookie
 * 
 * @param {string} name - cookie name
 * 
 * @returns {cookieInterface['value'] | undefined}
 */
export const getCookie = (name: string): cookieInterface['value'] | undefined => {
    const regex: RegExp = new RegExp(`(?<=${name}\=).*?(?=;|$)`);
    const value: string | undefined = document.cookie.match(regex)?.[0]?.trim();

    return value ? readValue(decodeURIComponent(value)) : undefined;
}

/**
 * Check if cookie exist
 * 
 * @param {string} name - cookie name
 * 
 * @returns {boolean}
 */
export const hasCookie = (name: string): boolean => {
    const regex: RegExp = new RegExp(`(?<=${name}\=).*?(?=;|$)`);
    const value: string | undefined = document.cookie.match(regex)?.[0];

    return value !== undefined;
}

/**
 * Remove cookie with given name
 * 
 * @param {string} name - cookie name
 */
export const removeCookie = (name: string) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}