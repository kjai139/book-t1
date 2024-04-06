import apiUrl from "@/app/_utils/apiEndpoint"

export async function generateStaticParams() {
    try {
        const response = await fetch(`${apiUrl}/api/wt/all/getParams`, {
            method: 'GET',
        })

        if (!response.ok) {
            throw new Error(`error in generate wt name: ${response}`)
        }

        const wts = await response.json()

        return wts.allWt.map((wt) => {
            
            return (
                {
                    wtName: wt.slug,
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