'use client'

// vendor
import React, { createContext, useCallback, useContext, useState, useLayoutEffect, SetStateAction, Dispatch } from 'react'

// hooks
import { setCookie, getCookie } from '@/hooks/use-cookie'

// models
export enum ThemeEnum {
	LIGHT = 'light',
	DARK = 'dark',
	SYSTEM = 'system',
}

export interface ThemeInterface {
	theme?: ThemeEnum
	setTheme: Dispatch<SetStateAction<ThemeEnum | undefined>>
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
	const [theme, setTheme] = useState<ThemeEnum>()

	/**
	 * Get color scheme
	 *
	 * @param {ThemeType} t - theme options
	 */
	const getColorScheme = useCallback((t: ThemeEnum): ThemeEnum => {
		const isSystemDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		if (t === ThemeEnum.SYSTEM) return isSystemDarkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT

		return t
	}, [])

    /**
	 * Initialize theme 
	 */
	useLayoutEffect(() => {
		setTheme(getCookie('theme') as ThemeEnum ?? getColorScheme(ThemeEnum.SYSTEM))
	}, [getColorScheme])

	/**
	 * Execute necessary actions when theme has changed
	 */
	useLayoutEffect(() => {
		if (!theme) return
		document.body.className = `theme theme--${theme}`
		setCookie({
			name: 'theme',
			value: theme,
		})
	}, [theme, getColorScheme])

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	)
}

export default ThemeProvider
