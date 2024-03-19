import apiUrl from "@/app/_utils/apiEndpoint"

export async function generateStaticParams() {
    const response = await fetch(`${apiUrl}/api/wt/all/getParams`)

    const wts = await response.json()

    return wts.allWt.map((wt) => {
        let slug = wt.name.replace(/ /g, "-")
        return (
            {
                wtName: slug,
            }
        )
    })
}


export default function Layout({children, params}) {
    return (
        <>
        {children}
        </>
    )
}