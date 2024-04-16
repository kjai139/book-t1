import apiUrl from "@/app/_utils/apiEndpoint"


export async function generateStaticParams() {
    try {
        const response = await fetch(`${apiUrl}/api/genres/all/getParams`, {
            method:'GET',
            next: {
                revalidate: 60 * 60 * 24 * 7,
            }
        })

        if (!response.ok) {
            throw new Error(`error in generate genre names: ${response.status}, ${response.statusText}`)
        }

        const genres = await response.json()
        /* console.log('genres in static layout', genres) */

        return genres.allGenres.map((gen:any) => {
           
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