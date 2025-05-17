// vendor
import { useRef, useState, useCallback, useLayoutEffect } from 'react'

// styling
import styles from './sort.module.scss'

// models
import { Sort as SortEnum, SortParams as SortParamsInterface, SortKeyDirection as SortKeyDirectionType } from '@/models/blog'

const Sort = <T,>({ keys, sortValue, onChange }: React.PropsWithChildren<SortParamsInterface<T> & {sortValue: SortKeyDirectionType}>) => {
    /**
     * @type {const} sorts - generates a list of selectable sort options
     */
    const sorts = useRef<SortKeyDirectionType[]>((() => {
        return (
            keys?.reduce((acc: SortKeyDirectionType[], sortKey: string): SortKeyDirectionType[] => {
                return [...(acc ?? []), [sortKey, SortEnum.DESC], [sortKey, SortEnum.ASC]]
            }, []) ?? []
        )
    })())
    
    /**
     * @type {const} activeValue - currently selected sort option
     */
    const [activeValue, setActiveValue] = useState<SortKeyDirectionType>(sortValue ?? sorts.current[0] ?? [])

    const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value.split('#') as SortKeyDirectionType
        setActiveValue(value)
    }, [])

    useLayoutEffect(() => {
        setActiveValue(sortValue)
    }, [sortValue])

    useLayoutEffect(() => {
        if (onChange) onChange(activeValue)
    }, [activeValue, onChange])

    return (
        <div className={styles.sort}>
            <p className={styles.title}>Sort</p>
            <select
                value={activeValue.join('#')}
                onChange={onChangeHandler}
            >
                {sorts.current.map((sort: SortKeyDirectionType) => (
                    <option
                        key={sort.join('#')}
                        value={sort.join('#')}
                    >
                        {sort.join(' - ')}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Sort
