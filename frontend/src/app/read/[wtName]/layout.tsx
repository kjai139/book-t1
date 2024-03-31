import apiUrl from "@/app/_utils/apiEndpoint"

export async function generateStaticParams() {
    try {
        const response = await fetch(`${apiUrl}/api/wt/all/getParams`)

        if (!response.ok) {
            throw new Error(`error in generate wt name: ${response}`)
        }

        const wts = await response.json()

        return wts.allWt.map((wt) => {
            let slug = wt.name.replace(/ /g, "-")
            return (
                {
                    wtName: slug,
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