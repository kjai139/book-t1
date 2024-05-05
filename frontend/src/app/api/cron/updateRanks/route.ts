import { NextResponse } from "next/server";
import { dbConnect } from "@/app/_utils/db";
import Wt from "@/app/_models/wt";
import SiteData from "@/app/_models/siteData";


export async function POST() {
    try {
        await dbConnect()
        const monthlyRanking = await Wt.find({}).sort({monthlyViews: -1, name: -1}).limit(10)
        let index = 0

        for (const node of monthlyRanking) {
            if (index <= 2) {
                node.isHot = 'Red'
                await node.save()
            } else if (index > 2 && index < 7) {
                node.isHot = 'Orange'  
                await node.save()
            } else if (index >= 7) {
                node.isHot = 'Yellow'   
                await node.save()
            }
            index += 1
        }

        const rankingIdArr = monthlyRanking.map((node:any) => {
            return node._id
        })

        const siteData = await SiteData.findOne()
        siteData.monthlyRanking = rankingIdArr
        await siteData.save()

        const result = await siteData.monthlyRanking
        console.log('Monthly ranking updated.')
        return NextResponse.json({
            message: 'Monthly ranking updated.'
        })

       
    } catch (err:any) {
        return NextResponse.json({
            message: err
        }, {
            status: 500
        })
    }
}