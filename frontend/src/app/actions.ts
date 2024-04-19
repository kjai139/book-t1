'use server'

import { startOfDay, isToday, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import SiteData from "@/app/_models/siteData"
import Wt from "./_models/wt"
import { dbConnect } from "./_utils/db"
import { cookies } from "next/headers"
import { verifySession } from "./_lib/dal"
import { deleteSession } from "./_lib/session"
const jwt = require('jsonwebtoken')


export async function AddViews (wtName:string) {
    const today = startOfDay(new Date())
    const result = isToday(startOfMonth(today))
    //if today is the 1st day of the month
    if (result) {
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
                
            } else if (doesExpireMatch) {
                await Wt.findOneAndUpdate({slug: wtName}, {
                    $inc: {
                        monthlyViews: 1
                    }
                })
                console.log('Monthly view updated')
            }
            

        } catch (err:any) {
            console.log('Error in inc views serv action', err)
            
        }
        //if it's any other day
    } else {
        await Wt.findOneAndUpdate({slug:wtName}, {
            $inc: {
                monthlyViews: 1
            }
        })
       console.log('Monthly view updated')
    }
   
}


export async function serverVerifyJwt () {
    try {
        const session = await verifySession()
        if (!session) {
            return null
        }

        console.log('JWT REFRESHED')

        return session

    } catch (err:any) {
        console.log('SERV ACTION:JWT unauthorized.')
        return null
    }
}

export async function serverLogUserOut () {
    try {
        deleteSession()
        return {
            message: 'You have logged out successfully.'
        }
    } catch(err:any) {
        console.error(err)
        return null
    }
}