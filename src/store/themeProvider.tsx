'use client'

// vendor
import React, { createContext, useCallback, useContext, useState, useLayoutEffect, SetStateAction, Dispatch } from 'react'

// hooks
import { setCookie, getCookie } from '@/hooks/use-cookie'

// models
export type RootType = 'light' | 'dark'
export type ThemeType = RootType | 'system'
export interface ThemeInterface {
    theme: ThemeType
    colorScheme: RootType
    setTheme: Dispatch<SetStateAction<ThemeType>>
    isLoaded: boolean
}

export const ThemeContext: React.Context<ThemeInterface | undefined> = createContext<ThemeInterface | undefined>(undefined as any)

export const useThemeContext = (): ThemeInterface => {
    const context: ThemeInterface | undefined = useContext(ThemeContext)
    if (!context) throw new Error('[ThemeProvider] parameters for ThemeContext are undefined.')

    return context
}

/**
 * Store website theme data
 * 
 * @param {children: React.ReactNode} props 
 * 
 * @returns 
 */
const ThemeProvider: React.FC<{
    children: React.ReactNode
}> = props => {
    const [theme, setTheme] = useState<ThemeType>('system')
    const [colorScheme, setColorScheme] = useState<RootType>('dark')
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    /**
     * Get color scheme
     *
     * @param {ThemeType} tt - theme options
     */
    const getColorScheme = useCallback((tt: ThemeType): RootType => {
        const isSystemDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        if (tt === 'system') return isSystemDarkMode ? 'dark' : 'light'

        return tt
    }, [])

    /**
     * Set theme during initialization
     */
    useLayoutEffect(() => {
        setTheme((getCookie('theme') as ThemeType) ?? 'system')
    }, [])

    /**
     * Execute necessary actions when theme has changed
     */
    useLayoutEffect(() => {
        const clScheme = getColorScheme(theme)
        setColorScheme(clScheme)
        document.body.className = `theme theme--${clScheme}`
        setCookie({
            name: 'theme',
            value: theme,
        })
        setIsLoaded(true)
    }, [theme, getColorScheme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colorScheme,
                setTheme,
                isLoaded,
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
