
import { unstable_noStore } from "next/cache"
import Wt from "../_models/wt"
import Wtc from "../_models/wtChapter"
import { dbConnect } from "./db"

export async function getChList (params:any) {
    unstable_noStore()
    try {
        await dbConnect()
        const wt = await Wt.findOne({slug: params.wtName })
        
        const allWtc = await Wtc.find({wtRef: wt._id}).sort({
            chapterNumber: -1
        })
        
        console.log(params)
        console.log('wt:', wt)
        console.log('allWtc', allWtc)

        const json = {
            chList:allWtc
        }
        console.log('CHLIST From func:', json)
        return JSON.parse(JSON.stringify(json))
    } catch (err) {
        console.error(err)
    }
    
    
}

export const getPrev = (num:string) => {
    const prevNum = Number(num) - 1
    return prevNum.toString()
}

export const getNext =(num:string) => {
    const nextNum = Number(num) + 1
    return nextNum.toString()
}