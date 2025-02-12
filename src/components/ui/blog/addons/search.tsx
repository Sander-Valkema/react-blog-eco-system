// vendor
import { useRef, useState, useCallback, useLayoutEffect } from 'react'

// icons/images
import CloseLineIcon from '#/icons/close-line.svg'
import SearchLineIcon from '#/icons/search-line.svg'

// models
import { SearchParams as SearchParamsInterface } from '@/models/blog'

// style
import styles from './search.module.scss'

const Search = ({ onChange, debounceTime, searchValue }: React.PropsWithChildren<SearchParamsInterface & { searchValue: string }>) => {
    const [searchText, setSearchText] = useState<string>(searchValue)
    const timeOutFunction = useRef<NodeJS.Timeout>(null)

    /**
     * Debouncer. Prevents request overload when searchText is entered in the search field
     *
     * @param {function} func - the triggered function when debounce has ended
     * @param {number} time     - debounce delay time
     */
    const debounce = useCallback((func: () => void, time: number = 150): void => {
        if (timeOutFunction.current) window.clearTimeout(timeOutFunction.current)
        timeOutFunction.current = window.setTimeout(() => {
            func()
        }, time) as any
    }, [])

    /**
     * Event handler when search input field is updated
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - event
     */
    const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        if (onChange) debounce(() => onChange(event.target.value), debounceTime)
    }, [debounce, onChange, debounceTime])

    /**
     * Event handler when search input field is cleared of text
     */
    const onClickHandler = useCallback(() => {
        setSearchText('')
        if (onChange) onChange('')
    }, [onChange])

    useLayoutEffect(() => {
        setSearchText(searchValue)
    }, [searchValue])

    return (
        <div className={styles.search}>
            <SearchLineIcon
                className={styles.searchIcon}
                width="16"
                height="16"
                alt="magnifier"
            />
            <input
                placeholder="Search"
                type="searchText"
                value={searchText}
                onChange={onChangeHandler}
            />
            {searchText && searchText !== '' && (
                <button
                    type="button"
                    onClick={onClickHandler}
                >
                    <CloseLineIcon
                        width="18"
                        height="18"
                        alt="X"
                    />
                </button>
            )}
        </div>
    )
}

export default Search
