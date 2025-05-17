// vendor
import type { Metadata } from 'next'

// styling
import '@/styling/main.scss' // global styling
import styles from './layout.module.scss'

// icons/images
import ArticleLineIcon from '#/icons/article-line.svg'
import favicon from '#/favicon-96x96.png'

// hooks
import { poppins } from '@/hooks/use-fonts'

// store
import ThemeProvider from '@/store/themeProvider'
import FilterProvider from '@/store/queryProvider'

// layouts
import Header from '@/components/layouts/header'

export const metadata: Metadata = {
    title: 'React blog eco system',
    description: 'Blog eco system build with React',
    icons: favicon.src,
}

const RootLayout: React.FC<{ children: React.ReactNode }> = props => (
    <html
        lang="en"
        className={poppins.className}
    >
        <body>
            <ThemeProvider>
                <FilterProvider>
                    <Header />
                    <ArticleLineIcon
                        className={styles.backgroundLogo}
                        alt="article"
                    />
                    {props.children}
                    <footer className={styles.author}>developed by Sander Valkema</footer>
                </FilterProvider>
            </ThemeProvider>
        </body>
    </html>
)

export default RootLayout
