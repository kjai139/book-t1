import apiUrl from "@/app/_utils/apiEndpoint";


export async function generateStaticParams({
    params: { wtName }
}:{
    params:{wtName:string}
}) {
    try {
        const response = await fetch(`${apiUrl}/api/wtpage/get?name=${wtName}`)

        if (!response.ok) {
            throw new Error(`error in generating pg num, ${wtName}`)
        }
        const nums = await response.json()
        

        return nums.allCh.map((ch) => ({
            chNum: ch.chapterNumber.toString()
        }))
    } catch (err) {
        console.error(err)
        return []
    }
   

}


export default function Page({params}:{params: {wtName: string; chNum: string}}) {

    console.log('PARAMS FROM PG', params)



    return (
        <div>
            PAGE PAGE

        </div>
    )
}