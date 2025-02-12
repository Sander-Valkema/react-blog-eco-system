'use client'

// vendor
import { use, useRef, useMemo } from 'react'
import Parser from 'html-react-parser'
import Link from 'next/link'
import Image from 'next/image'

// styling
import styles from './blog.module.scss'

// store
import { useThemeContext, type RootType } from '@/store/themeProvider'

// models
import { BlogItem as BlogItemInterface } from '@/models/blog'
import { CustomBlog as CustomBlogInterface } from '@/app/blog/page'
type Blog = BlogItemInterface<CustomBlogInterface>

// hooks
import { getDateFromTimestamp } from '@/hooks/use-conversion'

// icons/images
import HashtagIcon from '#/icons/hashtag.svg'
import CalendarLineIcon from '#/icons/calendar-line.svg'

// data
import { BlogData } from '@/data/blog.ts'

const Blog: React.FC<{ id: number }> = ({ id }) => {
    const themeProvider = useThemeContext()
    const colorScheme = useMemo<RootType>(() => themeProvider.colorScheme, [themeProvider.colorScheme])

    const blog = useRef<Blog | undefined>((() => (BlogData as Blog[]).find((blog: Blog) => blog.id === id))())

    if (!blog.current) return <h3 className={styles.missingBlog}>Sorry, this blog does not exist.</h3>

    return (
        <main className={`container ${styles.blog} ${styles['blog--' + colorScheme]}`}>
            <ul className={styles.breadcrumbs}>
                <li><Link href="/blog">blog</Link></li>
                <li>{blog.current.title.toLowerCase()}</li>
            </ul>
            <article>
                {blog.current.image && (
                    <Image
                        className={styles.bannerImage}
                        {...blog.current.image}
                        alt={blog.current.image?.alt ?? 'blog image'}
                    />
                )}
                <ul className={styles.meta}>
                    {blog.current.date && (
                        <li>
                            <CalendarLineIcon
                                width="10"
                                height="10"
                                alt="calendar"
                            />
                            <p className={styles.date}>{getDateFromTimestamp(blog.current.date)}</p>
                        </li>
                    )}
                    {blog.current.tags && blog.current.tags.length > 0 && (
                        <li>
                            <HashtagIcon
                                width="10"
                                height="10"
                                alt="tag"
                            />
                            <p className={styles.tags}>{blog.current.tags.join(', ').toLocaleLowerCase()}</p>
                        </li>
                    )}
                </ul>
                <div className={styles.content}>
                    <h1>{blog.current.title}</h1>
                    {blog.current.description && <div className={styles.description}>{Parser(blog.current.description)}</div>}
                </div>
            </article>
        </main>
    )
}

export default Blog
