'use client'

// javascript
import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react'

// store
// import { useThemeContext, type RootType } from '@/store/themeProvider'

// hooks
import { getArrayRange } from '@/hooks/use-generic'

// styling
import styles from './pagination.module.scss'

// icons
import ArrowLeftDoubleLineIcon from '#/icons/arrow-left-double-line.svg'
import ArrowRightDoubleLineIcon from '#/icons/arrow-right-double-line.svg'
import ArrowLeftSLineIcon from '#/icons/arrow-left-s-line.svg'
import ArrowRightSLineIcon from '#/icons/arrow-right-s-line.svg'

// models
import { PaginationParams as PaginationParamsInterface, paginationData as PaginationDataInterface } from '@/models/blog'

/**
 * Create a list viewer with pagination
 *
 * @param {{ totalItems: number } & PaginationParamsInterface} props
 * @constructor
 */
const Pagination = ({
    totalItems,
    maxItemsPerPage,
    onChange,
    pageValue,
    maxPageNumbers,
    showNextPrev,
    showFirstLast,
}: React.PropsWithChildren<PaginationParamsInterface & { pageValue: number, totalItems: number }>) => {
    const [pageNr, setPageNr] = useState<number>(pageValue)
    const totalPages = useMemo<number>(() => Math.ceil(totalItems / maxItemsPerPage), [totalItems, maxItemsPerPage])

    /**
     * @type {const} pagination Data - Calculate the pagination position and range when new page is selected
     */
    const paginationData = useMemo<PaginationDataInterface>(() => {
        // when max pages does not exceed the allowed max page numbers
        if (maxPageNumbers >= totalPages) {
            return {
                pageRange: getArrayRange(1, totalPages),
                pos: 'none',
            }
        }

        // at the start of the pagination
        if (pageNr - Math.ceil(maxPageNumbers / 2) <= 0) {
            return {
                pageRange: getArrayRange(1, maxPageNumbers),
                pos: pageNr === 1 ? 'first' : 'at start',
            }
        }

        // at the end of the pagination
        if (pageNr + Math.floor(maxPageNumbers / 2) >= totalPages) {
            return {
                pageRange: getArrayRange(totalPages - maxPageNumbers + 1, totalPages),
                pos: pageNr === totalPages ? 'last' : 'at end',
            }
        }

        return {
            pageRange: getArrayRange(pageNr - Math.floor(maxPageNumbers / 2), pageNr + Math.floor(maxPageNumbers / 2)),
            pos: 'middle',
        }
    }, [totalPages, maxPageNumbers, pageNr])

    /**
     * Event handler when page buttons are clicked
     *
     * @param {number} pg - page number
     */
    const onClickPageHandler = useCallback((pg: number) => (event: React.MouseEvent) => {
        setPageNr(pg)
    }, [])

    useLayoutEffect(() => {
        if (onChange) onChange(pageNr)
    }, [pageNr, onChange])

    useLayoutEffect(() => {
        setPageNr(pageValue)
    }, [pageValue])

    if (totalPages === 1 || !paginationData) return <></>

    return (
        <ul className={`${styles.pagination} pagination`}>
            {showFirstLast && (
                <li
                    className={`${styles.firstLast} firstLast ${['first', 'at start', 'none'].includes(paginationData?.pos) ? [styles.hidden] : ''}`}
                    onClick={onClickPageHandler(1)}
                >
                    <ArrowLeftDoubleLineIcon
                        alt="double left arrows"
                        height="18"
                        width="18"
                    />
                </li>
            )}
            {showNextPrev && (
                <li
                    className={`${styles.nextPrev} nextPrev ${['first', 'none'].includes(paginationData?.pos) ? [styles.hidden] : ''}`}
                    onClick={onClickPageHandler(pageValue - 1)}
                >
                    <ArrowLeftSLineIcon
                        alt="single left arrow"
                        height="18"
                        width="18"
                    />
                </li>
            )}
            {(paginationData?.pageRange ?? []).map((pg: number) => (
                <li
                    key={pg}
                    className={`${styles.page} page ${pg === pageValue ? styles['page--active'] : ''} ${pg === pageValue ? 'page--active' : ''}`}
                    onClick={onClickPageHandler(pg)}
                >
                    {pg}
                </li>
            ))}
            {showNextPrev && (
                <li
                    className={`${styles.nextPrev} nextPrev ${['last', 'none'].includes(paginationData?.pos) ? styles.hidden : ''}`}
                    onClick={onClickPageHandler(pageValue + 1)}
                >
                    <ArrowRightSLineIcon
                        alt="single right arrow"
                        height="18"
                        width="18"
                    />
                </li>
            )}
            {showFirstLast && (
                <li
                    className={`${styles.firstLast} firstLast ${['last', 'at end', 'none'].includes(paginationData?.pos) ? styles.hidden : ''}`}
                    onClick={onClickPageHandler(totalPages)}
                >
                    <ArrowRightDoubleLineIcon
                        alt="double right arrows"
                        height="18"
                        width="18"
                    />
                </li>
            )}
        </ul>
    )
}

export default Pagination
