// vendor
import { useLayoutEffect, useRef, useCallback, useMemo, useState } from 'react'

// icons/images
import CloseLineIcon from '#/icons/close-line.svg'

// models
import { BlogItem as BlogItemInterface, TagsParams as TagsParamsInterface } from '@/models/blog'
type counterType = { tag: string; occurence: number }

// styling
import styles from './tags.module.scss'

const Tags = <T,>({ blogData, onChange, tagsValue, max }: React.PropsWithChildren<TagsParamsInterface & { tagsValue: string[], blogData: BlogItemInterface<T>[] }>) => {

    /**
     * @type {const} activeTags - selected active tags
     */
    const [activeTags, setActiveTags] = useState<string[]>(tagsValue)

    /**
     * @type {const} tags - generates a list of clickable tags
     */
    const tags = useRef<string[]>((() => {
        const counter: counterType[] = []
        blogData.forEach((blog: BlogItemInterface<T>) => {
            if (!blog.tags || blog.tags.length === 0) return
            blog.tags.forEach((tag: string) => {
                const index: number = counter.findIndex((count: counterType) => count.tag === tag)
                if (index !== -1) {
                    counter[index].occurence++

                    return
                }

                counter.push({
                    tag,
                    occurence: 1,
                })
            })
        })

        const sortedTags: string[] = counter.sort((a: counterType, b: counterType) => b.occurence - a.occurence).map((count: counterType) => count.tag)

        return max ? sortedTags.slice(0, max) : sortedTags
    })())

    /**
     * Event toggle handler to activate tags
     *
     * @param {string} tag - name of tag
     */
    const onClickAddHandler = useCallback((tag: string) => () => {
        setActiveTags((prev: string[]) => prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag])
        
    }, [])

    /**
     * Event handler for removing all active tags
     */
    const onClickRemoveHandler = useCallback(() => {
        setActiveTags([])
    }, [])

    useLayoutEffect(() => {
        if (onChange) onChange(activeTags)
    }, [activeTags, onChange])

    return (
        <ul className={`${styles.tags} tags`}>
            <li className={styles.title}>
                <p>Tags</p>
            </li>
            {tags.current.map((tag: string) => (
                <li
                    key={tag}
                    className={`${styles.tag} tag ${activeTags && activeTags.includes(tag) ? styles['tag--active'] : ''}`}
                    onClick={onClickAddHandler(tag)}
                >
                    <p>{tag.toLocaleLowerCase()}</p>
                </li>
            ))}
            {activeTags && activeTags.length > 0 && (
                <li
                    className={styles.remove}
                    onClick={onClickRemoveHandler}
                >
                    <CloseLineIcon
                        width="18"
                        height="18"
                        alt="X"
                    />
                </li>
            )}
        </ul>
    )
}

export default Tags
