import apiUrl from "@/app/_utils/apiEndpoint"


export async function generateStaticParams() {
    try {
        const response = await fetch(`${apiUrl}/api/genres/all/getParams`)

        if (!response.ok) {
            throw new Error(`error in generate genre names: ${response}`)
        }

        const genres = await response.json()
        console.log('genres', genres)

        return genres.allGenres.map((genre) => {
            let slug = genre.lcname.replace(/ /g, "-")
            return (
                {
                    genreName: slug,
                }
            )
        })
    } catch (err) {
        console.error(err)
    }
}


export default function Layout({children, params}) {
    return (
        <>
        {children}
        </>
    )
}