'use server'

import Wt from "./_models/wt"
import User from "./_models/users"
import Bookmark from './_models/bookmark'
import Rating from './_models/rating'
import { dbConnect } from "./_utils/db"
import { verifySession } from "./_lib/dal"
import { deleteSession } from "./_lib/session"
import { generateRandomName } from "./_utils/generateName"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { randomHash } from "./_utils/version"
import { RateWtUserDetails } from "./_components/rating/starRating"
const bcrypt = require('bcrypt')


export async function AddViews(wtName: string) {

    try {

        const slug = wtName.split(randomHash)[0]
        await dbConnect()
        await Wt.findOneAndUpdate({ slug: slug }, {
            $inc: {
                monthlyViews: 1,
                totalViews: 1
            }
        })
        console.log('Monthly views + total views updated')



    } catch (err: any) {
        console.log('Error in inc views serv action', err)

    }

}


export async function serverVerifyJwt() {
    try {
        const session = await verifySession()
        if (!session) {
            return null
        }

        console.log('JWT REFRESHED')

        return session

    } catch (err: any) {
        console.log('SERV ACTION:JWT unauthorized.')
        return null
    }
}

export async function serverLogUserOut() {
    try {
        deleteSession()
        return {
            message: 'You have logged out successfully.'
        }
    } catch (err: any) {
        console.error(err)
        return null
    }
}


export async function toggleBookmark(userId: string, wtId: string, url: string) {
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
                userRef: userId
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


    } catch (err: any) {
        console.error(err)
        throw err
    }
}


export async function removeBmDB(bmId: string) {
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

    } catch (err: any) {
        console.error(err)
        throw new Error('An error has occured, please refresh and try again.')
    }
}

export async function checkUserPrivId(userId: string) {
    try {
        await dbConnect()
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            throw new Error('User does not exist')
        } else {
            if (existingUser.role !== 'Admin') {
                const response = {
                    userId: existingUser._id,
                    role: 'User'
                }
                return JSON.parse(JSON.stringify(response))
                // doing this ensure that there's no fucntions or non immutable properties are not present
            } else if (existingUser.role === 'Admin') {
                const response = {
                    userId: existingUser._id,
                    role: 'Admin'
                }
                return JSON.parse(JSON.stringify(response))
            }
        }
    } catch (err: any) {
        console.error(err)
        throw err
    }
}


export async function checkUserPriv(userEmail: string) {
    try {
        await dbConnect()
        /* const session = await auth() */
        const existingUser = await User.findOne({
            email: userEmail
        })
        if (!existingUser) {
            console.log('Could not find user email from database, creating account...')
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
            const randomPw = generateRandomName() + 'temp'
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPw = await bcrypt.hash(randomPw, salt)
            const newUser = new User({
                name: userName,
                lcname: userName!.toLowerCase(),
                email: userEmail,
                password: hashedPw
            })

            await newUser.save()
            const response = {
                userId: newUser._id,
                role: 'User'
            }
            return JSON.parse(JSON.stringify(response))
        } else {
            if (existingUser.role !== 'Admin') {
                /* console.log('SESSION FROM SA', session) */
                const response = {
                    userId: existingUser._id,
                    role: 'User'
                }
                return JSON.parse(JSON.stringify(response))
                // doing this ensure that there's no fucntions or non immutable properties are not present
            } else if (existingUser.role === 'Admin') {
                const response = {
                    userId: existingUser._id,
                    role: 'Admin'
                }
                return JSON.parse(JSON.stringify(response))
            }
        }
    } catch (err: any) {
        console.error(err)
        throw err
    }
}


export async function serverGetUserId(email: string) {
    try {
        await dbConnect()
        const normalizedEmail = email.toLowerCase()
        const existingUser = await User.findOne({
            email: normalizedEmail
        })


        if (existingUser) {
            return existingUser._id
        } else {
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
            const randomPw = generateRandomName() + 'temp'
            const saltRounds = 10
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedPw = await bcrypt.hash(randomPw, salt)
            const newUser = new User({
                name: userName,
                lcname: userName!.toLowerCase(),
                email: email,
                password: hashedPw
            })

            await newUser.save()
            return newUser._id
        }
    } catch (err) {
        console.error(err)
        return false
    }
}


export async function rateWtSa(userDetails: RateWtUserDetails) {
    try {
        const session = await auth()
        const wtId = userDetails.wtId
        const rating = userDetails.rating
        const tempId = userDetails.tempId
        await dbConnect()

        if (session?.user.id) {
            const hasUserRated = await Rating.findOne({
                wtRef: wtId,
                userRef: session.user.id
            })

            if (hasUserRated) {
                return 'alreadyVoted'
            } else {
                const newRating = new Rating({
                    wtRef: wtId,
                    userRef: session.user.id,
                    rating: Number(rating),
                    ratedBy: session.user.id
                })

                await newRating.save()
                console.log('[rateWt SA] New rating saved by userId', session.user.id)
                return 'success'

            }
        } else {
            //user is on tempId
            const hasUserRated = await Rating.findOne({ wtRef: wtId, ratedBy: tempId })

            if (hasUserRated) {
                return 'alreadyVoted'
            } else {
                const newRating = new Rating({
                    wtRef: wtId,
                    ratedBy: tempId,
                    rating: Number(rating)
                })

                await newRating.save()
                console.log('[rateWt SA] New rating saved by tempId', tempId)
                return 'success'
            }
        }


    } catch (err: any) {
        console.error(err)
        return false
    }



}
