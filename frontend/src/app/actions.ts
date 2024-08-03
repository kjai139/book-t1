'use server'

import Wt from "./_models/wt"
import User from "./_models/users"
import Bookmark from './_models/bookmark'
import { dbConnect } from "./_utils/db"
import { verifySession } from "./_lib/dal"
import { deleteSession } from "./_lib/session"
import { generateRandomName } from "./_utils/generateName"
import { revalidatePath } from "next/cache"
const bcrypt = require('bcrypt')


export async function AddViews (wtName:string) {
    
    try {
        await dbConnect()
        await Wt.findOneAndUpdate({slug:wtName}, {
            $inc: {
                monthlyViews: 1,
                totalViews: 1
            }
        })
        console.log('Monthly views + total views updated')
        
        

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
            const totalBookmarks = await Bookmark.countDocuments({
                userRef:userId
            })
            if (totalBookmarks === 15) {
                throw new Error('Reached the bookmark limit, please delete one before trying again.')
            }
            const newBookmark = new Bookmark({
                url: url,
                wtRef: wtId,
                userRef: userId
            })

            await newBookmark.save()
            revalidatePath('/bookmarks')
            return 'added'
        } else {
            await Bookmark.deleteOne({
                _id: exisitingBM._id
            })
            revalidatePath('/bookmarks')
            return 'deleted'

        }
        

    } catch (err:any) {
        console.error(err)
        throw err
    }
}


export async function removeBmDB(bmId:string) {
    try {
        await dbConnect()
        const result = await Bookmark.deleteOne({
            _id: bmId
        })
        if (result.deletedCount === 0) {
            throw new Error('Bookmark ID does not exist.')
        } else {
            console.log(`BM ${bmId} deleted`)
            revalidatePath('/bookmarks')
            return 'ok'
        }

    } catch (err:any) {
        console.error(err)
        throw new Error('An error has occured, please refresh and try again.')
    }
}


export async function checkUserPriv(userId:string) {
    try {
        await dbConnect()
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            throw new Error('User does not exist')
        } else {
            if (existingUser.role !== 'Admin') {
                return 'User'
            } else if (existingUser.role === 'Admin') {
                return 'Admin'
            }
        }
    } catch (err:any) {
        console.error(err)
        throw err
    }
}


