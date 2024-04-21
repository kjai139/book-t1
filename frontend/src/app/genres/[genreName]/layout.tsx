
import { dbConnect } from '@/app/_utils/db'
import Genre from '@/app/_models/genre'

export async function generateStaticParams() {
    try {
        await dbConnect()
        const allGenres = await Genre.find()
       
        

        /* const genres = await allGenres.json() */
        /* console.log('genres in static layout', genres) */
        /* console.log('Genres from generating genre params', allGenres) */
        return allGenres.map((gen:{slug:string}) => {
           
            return (
                {
                    genreName: gen.slug,
                }
            )
        })
    } catch (err) {
        console.error(err)
    }
}


export default function Layout({children, params}:any) {
    return (
        <>
        {children}
        </>
    )
}