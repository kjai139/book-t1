import { auth } from "@/auth"
import { dbConnect } from "../_utils/db"
import Bookmark from "../_models/bookmark"


async function getUserBookmarks (userId:string) {
    try {
        await dbConnect()
        const userBms = await Bookmark.find({
            userRef: userId
        }).populate('wtRef')

        return userBms

        /* return JSON.parse(JSON.stringify(userBms)) */

    } catch (err) {
        console.error(err)
        return err
    }
}


export default async function BookmarksPage() {
    const oauthSess = await auth()
    if (oauthSess?.user?.id) {
        console.log('user is logged in via oauth.')
    } else {
        console.log('User is not logged into via oauth.')
    }
    return (
        <main>
            Bookmarks Page
        </main>
    )
}