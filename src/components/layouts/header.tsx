'use client'

// vendor
import React, { useState, useLayoutEffect } from 'react'
import Link from 'next/link'

// styling
import styles from './header.module.scss'

// assets
import PaintBrushLineIcon from '#/icons/paint-brush-line.svg'
import ArticleLineIcon from '#/icons/article-line.svg'

// store
import { useThemeContext, ThemeEnum } from '@/store/themeProvider'

const Header: React.FC = () => {
    const themeProvider = useThemeContext()

    const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        themeProvider.setTheme(event.target.value as ThemeEnum)
    }

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href="/">
                    <h2>React Demo</h2>
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
                    value={themeProvider.theme}
                    onChange={onChangeHandler}
                >
                    {([ThemeEnum.DARK, ThemeEnum.LIGHT]).map((th: ThemeEnum) => (
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
