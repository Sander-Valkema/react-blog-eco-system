import Link from 'next/link'

import styles from './not-found.module.scss'

/**
 * 404 page
 *
 * @constructor
 */
const NotFound = () => (
    <main className={`container ${styles.notFound}`}>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
    </main>
)

export default NotFound
