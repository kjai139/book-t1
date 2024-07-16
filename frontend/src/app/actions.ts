'use server'

import Wt from "./_models/wt"
import User from "./_models/users"
import Bookmark from './_models/bookmark'
import { dbConnect } from "./_utils/db"
import { verifySession } from "./_lib/dal"
import { deleteSession } from "./_lib/session"
import { generateRandomName } from "./_utils/generateName"
const bcrypt = require('bcrypt')


export async function AddViews (wtName:string) {
    
    try {
        await dbConnect()
        await Wt.findOneAndUpdate({slug:wtName}, {
            $inc: {
                monthlyViews: 1
            }
        })
        console.log('Monthly view updated')
        
        

    } catch (err:any) {
        console.log('Error in inc views serv action', err)
        
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


export async function toggleBookmark(userId:string, wtId: string, url:string) {
    try {
        await dbConnect()
        if (!userId) {
            throw new Error('Error finding account, please try relogging.')
        }
        const exisitingBM = await Bookmark.findOne({
            userRef: userId,
            wtRef: wtId
        })

        if (!exisitingBM) {
            const newBookmark = new Bookmark({
                url: url,
                wtRef: wtId,
                userRef: userId
            })

            await newBookmark.save()
            return 'added'
        } else {
            await Bookmark.deleteOne({
                _id: exisitingBM._id
            })
            return 'deleted'

        }

    } catch (err:any) {
        console.error(err)
        throw new Error('An error has occured, please try relogging')
    }
}


export async function removeBmDB(wtId:string) {
    try {
        await dbConnect()
        const result = await Bookmark.deleteOne({
            wtRef: wtId
        })
        if (result.deletedCount === 0) {
            throw new Error('Bookmark ID does not exist.')
        } else {
            return 'ok'
        }

    } catch (err:any) {
        console.error(err)
        throw new Error('An error has occured, please refresh and try again.')
    }
}



