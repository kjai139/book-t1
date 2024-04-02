import ViewGenreWt from "@/app/_components/viewGenre"
import apiUrl from "@/app/_utils/apiEndpoint"
import { notFound } from "next/navigation"


async function getWts(params) {
    try {
        const response = await fetch(`${apiUrl}/api/genre/wts/get?name=${params.genreName}`, {
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

    return (
        <div className="max-w-[1024px] flex flex-col">
            <div>
            <h3>{params.genreName.replace(/-/g, ' ')}</h3>
            </div>
            <ViewGenreWt wtsArr={wts}></ViewGenreWt>
        </div>
    )
}