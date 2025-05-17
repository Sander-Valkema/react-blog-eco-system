'use client'

// vendor
import Image, { type ImageProps } from 'next/image'
import React, { Suspense } from 'react'

// data
import { BlogData } from '@/data/blog.ts'

// components
import Blogs from '@/components/ui/blog/blogs'

// hooks
import { getDateFromTimestamp } from '@/hooks/use-conversion'

// styles
import styles from './page.module.scss'

// icons/images
import HashtagIcon from '#/icons/hashtag.svg'
import CalendarLineIcon from '#/icons/calendar-line.svg'

// models
import { BlogItem } from '@/models/blog'
export interface CustomBlog {
	image?: ImageProps
	intro?: string
	description?: string
}

/**
 * Blog list
 *
 * @constructor
 */
const Page = () => (
	<main>
		<div className="container">
			<Suspense>
				<Blogs<CustomBlog>
					blogData={BlogData}
					blogElement={(blog: BlogItem<CustomBlog>) => (
						<article className={`${styles.blogElement} blogElement`}>
							{blog.image && (
								<Image
									{...blog.image}
									alt={blog.image?.alt ?? 'blog image'}
								/>
							)}
							<div className={styles.content}>
								<h3>{blog.title}</h3>
								<ul className={`${styles.meta} meta`}>
									{blog.tags && blog.tags.length > 0 && (
										<li>
											<HashtagIcon
												width="10"
												height="10"
												alt="tag"
											/>
											<p className={styles.tags}>{blog.tags.join(', ').toLocaleLowerCase()}</p>
										</li>
									)}
									{blog.date && (
										<li>
											<CalendarLineIcon
												width="10"
												height="10"
												alt="calendar"
											/>
											<p className={styles.date}>{getDateFromTimestamp(blog.date)}</p>
										</li>
									)}
								</ul>
								{blog.intro && <p className={styles.intro}>{blog.intro}</p>}
							</div>
						</article>
					)}
				/>
			</Suspense>
		</div>
	</main>
)

export default Page
