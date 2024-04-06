import ViewGenreWt from "@/app/_components/viewGenre"
import apiUrl from "@/app/_utils/apiEndpoint"
import { notFound } from "next/navigation"


async function getWts(params) {
    try {
        const response = await fetch(`${apiUrl}/api/genre/wts/get?name=${params.genreName}&page=${1}&sort=${'latest'}`, {
            method: 'GET',
            next: {
                revalidate: 1
            }
        })

        if (response.ok) {
            const json = await response.json()
            return json
        }

    } catch (err) {
        console.error(err)
    }
}


export default async function Page ({params}) {
    console.log(params)
    const wts = await getWts(params)
    console.log('wts by genre', wts)
    if (!wts) {
        notFound()
    }
    const formattedName = params.genreName.replace(/-/g, ' ').charAt(0).toUpperCase() + params.genreName.slice(1)

    return (
        <main>
        <div className="max-w-[1024px] flex flex-col p-2 w-full">
            <div>
            <h3>{formattedName}</h3>
            </div>
            <ViewGenreWt wtsArr={wts} totalPg={wts.totalPages} genreName={params.genreName}></ViewGenreWt>
        </div>
        </main>
    )
}