'use client'

// vendor
import React, { useState, useCallback, useEffect, useRef, useLayoutEffect, useContext } from 'react'
import Link from 'next/link'

// styling
import styles from './header.module.scss'

// assets
import PaintBrushLineIcon from '#/icons/paint-brush-line.svg'
import ArticleLineIcon from '#/icons/article-line.svg'

// store
import { useThemeContext, type ThemeType } from '@/store/themeProvider'

const Header: React.FC = () => {
    const [theme, setTheme] = useState<ThemeType>('system')
    const themeProvider = useThemeContext()

    const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        themeProvider.setTheme(event.target.value as ThemeType)
    }

    useLayoutEffect(() => {
        setTheme(themeProvider.theme)
    }, [themeProvider.theme])

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/">
                    <h2>Vue Demo</h2>
                    <h4>Blog Eco System</h4>
                </Link>
            </div>
            <fieldset>
                <PaintBrushLineIcon
                    alt="paint brush"
                    width="16"
                    height="16"
                />
                <select
                    className={styles.themeSelect}
                    value={theme}
                    onChange={onChangeHandler}
                >
                    {(['light', 'dark', 'system'] as ThemeType[]).map((th: ThemeType) => (
                        <option
                            key={th}
                            value={th}
                        >
                            {th}
                        </option>
                    ))}
                </select>
            </fieldset>
            <ArticleLineIcon
                className={styles.headerLogo}
                alt="article"
            />
        </header>
    )
}

export default Header
