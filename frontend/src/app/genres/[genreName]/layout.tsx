
import { dbConnect } from '@/app/_utils/db'
import Genre from '@/app/_models/genre'

export async function generateStaticParams() {
    try {
        await dbConnect()
        const allGenres = await Genre.find()
       
        
        return allGenres.map((gen) => ({
            genreName: gen.slug
        }))
    } catch (err) {
        console.error(err)
        return []
    }
}


export default function Layout({children, params}:{children:any, params: {genreName:string}}) {
    return (
        <>
        {children}
        </>
    )
}