'use client'

// vendor
import React, { useState, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'

// hooks
import { encodeObjectToUrlRequest, decodeUrlRequestToObject, encodeStringToUrl } from '@/hooks/use-url-parser'

// store
import { useQueryContext } from '@/store/queryProvider'

// components
import Pagination from '@/components/ui/blog/addons/pagination'
import Sort from '@/components/ui/blog/addons/sort'
import Tags from '@/components/ui/blog/addons/tags'
import Search from '@/components/ui/blog/addons/search'

// styling
import styles from './blogs.module.scss'

// icons/images
import ErrorWarningLineIcon from '#/icons/error-warning-line.svg'

// models
import {
	Sort as SortEnum,
	BlogItem as BlogItemInterface,
	BlogList as BlogListInterface,
	Filters as FiltersInterface,
	SortKeyDirection as SortKeyDirectionType,
} from '@/models/blog'

/**
 * Create a list viewer with pagination
 *
 * @param {BlogListInterface<T>} props
 * @constructor
 */
const Blogs = <T,>({
	blogData,
	blogElement,
	className,
	colMobile = 1,
	colTablet = 2,
	colDesktop = 3,
	tags = {
		show: true,
		max: 7,
	},
	search = {
		show: true,
		debounceTime: 150,
	},
	pagination = {
		show: true,
		showNextPrev: true,
		showFirstLast: true,
		maxItemsPerPage: 6,
		maxPageNumbers: 3,
	},
	sort = {
		show: true,
		keys: ['date', 'title'],
	},
	showResults = true,
}: React.PropsWithChildren<BlogListInterface<T>>) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const queryProvider = useQueryContext()

	/**
	 * page, tags, sort and search filter initialization and declaration
	 */
	const decodedQuery = useRef<FiltersInterface>(
		(() => {
			return decodeUrlRequestToObject(queryProvider.getQuery ?? searchParams.toString(), ['sort', 'page', 'search', 'tags'])
		})()
	)
	const [pageValue, setPageValue] = useState<number>(parseInt((decodedQuery.current?.page ?? '1') as string, 10))
	const [sortValue, setSortValue] = useState<SortKeyDirectionType>((decodedQuery.current?.sort ?? ['title', SortEnum.DESC]) as SortKeyDirectionType)
	const [searchValue, setSearchValue] = useState<string>((decodedQuery.current?.search ?? '') as string)
	const [tagsValue, setTagsValue] = useState<string[]>((decodedQuery.current?.tags ?? []) as string[])

	/**
	 * @type {const} filteredBlogs - blogs filtered by tags, sort and search component
	 */
	const filteredBlogs = useMemo<BlogItemInterface<T>[]>(() => {
		let fBlogs: BlogItemInterface<T>[] = [...blogData]

		// tags filter
		if (tagsValue.length > 0) {
			fBlogs = fBlogs.filter((blog: BlogItemInterface<T>) => (blog?.tags ?? []).some((tag: string) => tagsValue.includes(tag)))
		}

		// sort filter
		if (sort.keys.length > 0) {
			const [sKeys, sDirection]: SortKeyDirectionType = sortValue

			fBlogs = fBlogs.sort((a: BlogItemInterface<T>, b: BlogItemInterface<T>) => {
				const firstItem: any = a[sKeys as keyof BlogItemInterface<T>]
				const secondItem: any = b[sKeys as keyof BlogItemInterface<T>]

				if (isNaN(firstItem) && isNaN(secondItem)) {
					return sDirection === SortEnum.ASC ? firstItem.localeCompare(secondItem) : secondItem.localeCompare(firstItem)
				}

				return sDirection === SortEnum.ASC ? firstItem - secondItem : secondItem - firstItem
			})
		}

		// search filter
		if (searchValue !== '') {
			fBlogs = fBlogs.filter((blog: BlogItemInterface<T>) => {
				return Object.values(blog).some((blogValue: any) => {
					if (!isNaN(blogValue)) return false

					return blogValue.toString().toLowerCase().includes(searchValue)
				})
			})
		}

		return fBlogs
	}, [blogData, searchValue, tagsValue, sortValue, sort])

	/**
	 * @type {const} totalFilteredBlogs - total filtered blogs
	 */
	const totalFilteredBlogs = useMemo((): number => filteredBlogs.length, [filteredBlogs])

	/**
	 * @type {const} paginatedBlogs - blogs filtered by selected page
	 */
	const paginatedBlogs = useMemo<BlogItemInterface<T>[]>(() => {
		if (!pagination.show) return filteredBlogs

		const max: number = pageValue * pagination.maxItemsPerPage
		const min: number = max - pagination.maxItemsPerPage

		return filteredBlogs.filter((blog: BlogItemInterface<T>, index: number) => index >= min && index < max)
	}, [filteredBlogs, pageValue, pagination])

	/**
	 * Event handler when tags are clicked
	 *
	 * @param {string[]} value - tags
	 */
	const onTagsHandler = useCallback((value: string[]): void => {
		setTagsValue(value)
		setPageValue(1)
	}, [])

	/**
	 * Event handler when pagination buttons are clicked
	 *
	 * @param {number} value - clicked page number
	 */
	const onPaginationHandler = useCallback((value: number): void => {
		setPageValue(value)
	}, [])

	/**
	 * Event handler when search field is updated
	 *
	 * @param {string} value - search word
	 */
	const onSearchHandler = useCallback((value: string): void => {
		setSearchValue(value)
		setPageValue(1)
	}, [])

	/**
	 * Event handler when sort option is selected
	 *
	 * @param {SortKeyDirectionType} value - sort object
	 */
	const onSortHandler = useCallback((value: SortKeyDirectionType): void => {
		setSortValue(value)
		setPageValue(1)
	}, [])

	/**
	 * Update the url query parameters when the filters have updated
	 */
	useLayoutEffect(() => {
		const query: string = encodeObjectToUrlRequest(searchParams.toString(), {
			sort: sortValue,
			search: searchValue,
			tags: tagsValue,
			page: pageValue,
		})
		queryProvider.setQuery(query)
		router.replace(`${pathname}?${query}`, { scroll: false })
	}, [sortValue, searchValue, tagsValue, pageValue, pathname, queryProvider, router, searchParams])

	return (
		<div
			className={`\n
                ${styles.blog}\n
                ${styles['blog--col-mobile-' + colMobile]}\n
                ${styles['blog--col-tablet-' + colTablet]}\n
                ${styles['blog--col-desktop-' + colDesktop]}\n                
                ${className ?? ''}`}
		>
			<div className={styles.topFilters}>
				{search.show && (
					<Search
						{...search}
						searchValue={searchValue}
						onChange={onSearchHandler}
					/>
				)}
				{sort.show && (
					<Sort<T>
						{...sort}
						sortValue={sortValue}
						onChange={onSortHandler}
					/>
				)}
			</div>
			{tags.show && (
				<Tags
					blogData={blogData}
					{...tags}
					tagsValue={tagsValue}
					onChange={onTagsHandler}
				/>
			)}
			{totalFilteredBlogs !== 0 && (
				<div className={styles.list}>
					{paginatedBlogs.map((blog: BlogItemInterface<T>) => (
						<Link
							key={blog.id}
							href={`/blog/${blog.id}/${encodeStringToUrl(blog.title)}`}
						>
							{blogElement(blog)}
						</Link>
					))}
				</div>
			)}
			{totalFilteredBlogs === 0 && (
				<div className={styles.noBlogsFound}>
					<ErrorWarningLineIcon
						alt="exclamation mark"
						width="22"
						height="22"
					/>
					<p>Sorry, no blogs where found.</p>
				</div>
			)}
			{showResults && <p className={styles.results}> results: {totalFilteredBlogs}</p>}
			{pagination.show && (
				<Pagination
					totalItems={totalFilteredBlogs}
					{...pagination}
					pageValue={pageValue}
					onChange={onPaginationHandler}
				></Pagination>
			)}
		</div>
	)
}

export default Blogs
