import { Poppins } from 'next/font/google'
import { type NextFont } from 'next/dist/compiled/@next/font'

export const poppins: NextFont = Poppins({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})
