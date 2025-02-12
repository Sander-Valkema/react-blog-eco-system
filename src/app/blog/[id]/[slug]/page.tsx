'use server'

// components
import Blog from '@/components/layouts/blog'

const Page = async ({params}: {
    params: Promise<{
        id: string
        slug: string
    }>
}) => <Blog id={parseInt((await params).id, 10)}/>

export default Page
