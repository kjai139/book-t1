import ViewGenreWt from "@/app/_components/viewGenre"
import apiUrl from "@/app/_utils/apiEndpoint"
import { notFound } from "next/navigation"


async function getWts(params) {
    try {
        const response = await fetch(`${apiUrl}/api/genre/wts/get?slug=${params.genreName}&page=${1}&sort=${'latest'}`, {
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
    console.log('PARAMS FROM PAGE GENRE', params)
    const wts = await getWts(params)
    console.log('wts by genre', wts)
    if (!wts) {
        notFound()
    }
    

    return (
        <main>
        <div className="max-w-[1024px] flex flex-col p-2 w-full gap-4">
            <div>
                <div className="flex gap-2 items-center">
            <h3 className="text-lg font-bold">{wts.genre[0].name}</h3>
            <span className="text-md">
            {`( ${wts.totalWt} )`}
            </span>
            </div>
            <span>
                {wts.genre[0].description}
            </span>
            </div>
            <ViewGenreWt wtsArr={wts} totalPg={wts.totalPages} genreName={params.genreName}></ViewGenreWt>
        </div>
        </main>
    )
}