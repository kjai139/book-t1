import { dbConnect } from "@/app/_utils/db"
import Wt from "@/app/_models/wt"
import { randomHash } from "@/app/_utils/version"


export async function generateStaticParams() {
    try {
        await dbConnect()
        const allWt = await Wt.find().sort({name: 1})
        if (!allWt) {
            console.log('No wt found in generate static wt params')
            return null
        }
       

    
        return allWt.map((wt:any) => {
            
            return (
                {
                    wtName: `${wt.slug}${randomHash}`,
                }
            )
        })

    } catch (err) {
        console.error(err)
        return []
    }
   
}



export default function Layout({children, params}:any) {
    return (
        <>
        {children}
        </>
    )
}