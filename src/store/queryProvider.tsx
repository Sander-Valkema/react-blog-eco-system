'use client'

// vendor
import React, { createContext, useCallback, useContext, useMemo, useState, useLayoutEffect, SetStateAction, Dispatch, useRef } from 'react'
import { usePathname } from 'next/navigation'

// models
export interface QueryParams {
    setQuery: (query: string) => void
    getQuery: string | undefined
}

export const QueryContext: React.Context<QueryParams | undefined> = createContext<QueryParams | undefined>(undefined as any)

export const useQueryContext = (): QueryParams => {
    const context: QueryParams | undefined = useContext(QueryContext)
    if (!context) throw new Error('[QueryProvider] parameters for QueryContext are undefined.')

    return context
}

/**
 * Stores url query parameters.
 * Queries are remembered even when user switches between pages.
 *
 * @param props
 * @returns
 */
const QueryProvider: React.FC<{
    children: React.ReactNode
}> = props => {
    const pathname = usePathname()
    const slug = useRef<string>(pathname)
    const [queryData, setQueryData] = useState<Record<string, string>>({})

    /**
     * Set a query in store
     * 
     * @param {string} query - query string
     */
    const setQuery = useCallback((query: string): void => {
        if (slug.current in queryData && queryData[slug.current] === query) return

        setQueryData((prev: Record<string, string>) => {
            return { ...prev, [slug.current]: query }
        })
    }, [queryData])

    /**
     * Get stored query
     * 
     * @type {const}
     */
    const getQuery = useMemo<string | undefined>(() => queryData?.[slug.current], [slug, queryData])

    return (
        <QueryContext.Provider
            value={{
                setQuery,
                getQuery,
            }}
        >
            {props.children}
        </QueryContext.Provider>
    )
}

export default QueryProvider
