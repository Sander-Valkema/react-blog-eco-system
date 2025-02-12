'use client'

// vendor
import React, { useState, useEffect } from 'react'

// icons/images
import Loader2LineIcon from '#/icons/loader-2-line.svg'

// store
import { RootType, useThemeContext, type ThemeType } from '@/store/themeProvider'

// style
import styles from './loader.module.scss'

/**
 * Loader/spinner
 *
 * @param props
 * @constructor
 */
const Loader: React.FC<{
    children?: React.ReactNode
    colorScheme?: RootType
}> = ({ children, colorScheme = 'dark' }) => {
    const [ready, setReady] = useState<boolean>(false)
    const themeProvider = useThemeContext()

    useEffect(() => {
        setReady(true)
    }, [themeProvider.isLoaded])

    if (ready && children) return children
    if (ready) return <></>

    return (
        <div className={`${styles.loader} ${styles['loader--' + colorScheme]}`}>
            <Loader2LineIcon
                className={styles.spinner}
                alt="spinner"
                width="70"
                height="70"
            />
        </div>
    )
}

export default Loader
