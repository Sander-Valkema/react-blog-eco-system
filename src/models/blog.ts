import { ThemeEnum } from "@/store/themeProvider"
import { type ImageProps } from 'next/image'

export enum Sort {
    DESC = 'descending',
    ASC = 'ascending'
}

/**
 * Blog item data
 * 
 * id           - id of blog
 * title        - title of blog
 * tags         - tags of blog. These tags are used for the tags component
 * date         - date of blog. Only accepts unix timestamps
 */
export type BlogItem<T> = T & {
    id: number,
    title: string,
    tags?: string[],
    date?: number
}

/**
 * Bloglist main configuration
 * 
 * blogData         - array of blogs
 * blogElement      - create a custom blog article
 * className        - name of class in root html tag of blog item
 * colMobile        - total columns in mobile view. Default is 1
 * colTablet        - total columns in tablet view. Default is 2
 * colDesktop       - total columns in desktop view. Default is 3
 * showResults      - show total results banner. Default is true
 * pagination       - configuration for pagination component
 * sort             - configuration for sort component
 * tags             - configuration for tags component
 * search           - configuration for search component
 */
export interface BlogList<T> {
    blogData: (BlogItem<T>)[],
    blogElement: (blog: BlogItem<T>) => React.JSX.Element
    className?: string,
    colorScheme?: ThemeEnum,
    colMobile?: 1 | 2 | 3,
    colTablet?: 1 | 2 | 3,
    colDesktop?: 1 | 2 | 3,
    showResults?: boolean,
    pagination?: PaginationParams,
    sort?: SortParams<T>
    tags?: TagsParams
    search?: SearchParams
}

/**
 * Pagination component configuration
 * 
 * maxItemsPerPage   - maximum visible items per page.
 * show              - show pagination component.
 * maxPageNumbers    - maximum of page numbers in pagination.
 * showNextPrev      - show next and previous buttons in pagination.
 * showFirstLast     - show first and last buttons in pagination.
 * onChange          - Function to return updated page number
 */
export interface PaginationParams {
    maxItemsPerPage: number,
    show: boolean,
    maxPageNumbers: 3 | 5 | 7 | 9,
    showNextPrev: boolean,
    showFirstLast: boolean,
    onChange?: (page: number) => void
}

/**
 * Pagination component helper interface.
 * 
 * pageRange        - range of pagination page numbers
 * pos              - position of pagination
 */
export interface paginationData {
    pageRange: number[],
    pos: 'at start' | 'at end' | 'middle' | 'none' | 'first' | 'last'
}

/**
 * Sort component configuration
 * 
 * show     - show sort component. Default is true
 * keys     - keys from BlogItem interface you want to make sortable.
 * onChange - function to return updated sort selection
 */
export interface SortParams<T> {
    show: boolean,
    keys: Extract<keyof BlogItem<T>, string>[],
    onChange?: (active: SortKeyDirection) => void
}

/**
 * Sort keys data
 * 
 * SortKey          - name of key
 * SortDirection    - direction of sorting
 */
export type SortKeyDirection = [
    sortKey: string,
    sortDirection: Sort
]

/**
 * Tags component configuration
 * 
 * show     - show tags component.
 * max      - set a maximum for the amount of visible tags.
 * onChange - function to return updated activated tags 
 */
export interface TagsParams {
    show: boolean,
    max: number,
    onChange?: (active: string[]) => void
}

/**
 * Search component configuration
 * 
 * show         - show search component.
 * debounceTime - time to debounce the search results. In milliseconds
 * onChange     - function to return updated search text
 */
export interface SearchParams {
    show: boolean,
    debounceTime: number,
    onChange?: (search: string) => void
}

/**
 * Item filters. These parameter are used to filter the items from the blog components
 * 
 * sort     - current sort key data
 * page     - current page number
 * search   - search word
 * tags     - list of active tags 
 */
export interface Filters {
    sort?: SortKeyDirection,
    page?: string,
    search?: string,
    tags?: string[]
}