'use server'

import Wt from "./_models/wt"
import User from "./_models/users"
import Bookmark from './_models/bookmark'
import { dbConnect } from "./_utils/db"
import { verifySession } from "./_lib/dal"
import { deleteSession } from "./_lib/session"
import { generateRandomName } from "./_utils/generateName"


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


export async function addBookmark(email:string, wtId: string, url:string) {
    try {
        await dbConnect()
        const normalizedEmail = email.toLowerCase()
        let user = await User.findOne({
            email: normalizedEmail
        })
        if (!user) {
            console.log('Could not find user from database, creating account...')
            let userName 
            let isUnique = false
            while (!isUnique) {
                userName = generateRandomName()
                let lcUsername = userName.toLowerCase()
                let isNameTaken = await User.findOne({
                    lcname: lcUsername
                })
                if (!isNameTaken) {
                    isUnique = true
                }
            }
            const newUser = new User({
                name: userName,
                lcname: userName!.toLowerCase()
            })

            await newUser.save()
            user = newUser
        }
        const exisitingBM = await Bookmark.findOne({
            userRef: user._id,
            wtRef: wtId
        })

        if (!exisitingBM) {
            const newBookmark = new Bookmark({
                url: url,
                wtRef: wtId,
                userRef: user._id
            })

            await newBookmark.save()
            return 'success'
        } else {
            const response = {
                message: 'Bookmark already exists'
            }
            return JSON.stringify(response)
        }

    } catch (err) {
        console.error(err)
        return err
    }
}

