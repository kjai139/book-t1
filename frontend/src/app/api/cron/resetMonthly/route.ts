

import { startOfDay, endOfMonth, isSameDay } from "date-fns"
import SiteData from "@/app/_models/siteData"
import { dbConnect } from "@/app/_utils/db"
import { NextResponse } from "next/server"
import Wt from "@/app/_models/wt"


export async function POST () {
    const today = startOfDay(new Date())
    
    const newExpire = endOfMonth(today)
    try {
        await dbConnect()

        const siteData = await SiteData.findOne()
        if (!siteData) {
            console.error('Error finding siteData')
        }
        const doesExpireMatch = isSameDay(siteData.monthlyExpire, newExpire)
        if (!doesExpireMatch) {
            siteData.monthlyExpire = newExpire
            await siteData.save()
            console.log(`New expire date for views updated to ${newExpire}`)
            
        }

        await Wt.updateMany({}, {
            $set: {isHot: 'No'}
        })

        console.log('Hot status reset for all')
        
        return NextResponse.json({
            message: `New expire date for views updated to ${newExpire}`
        })
        

    } catch (err:any) {
        console.log('Error in resetting monthly views', err)
        
    }
        

   
}
