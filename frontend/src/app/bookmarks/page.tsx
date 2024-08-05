import { auth } from "@/auth"
import { dbConnect } from "../_utils/db"
import Bookmark from "../_models/bookmark"
import ServerError from "../_components/serverError"
import BookmarkList from "../_components/list/bookmarkList"
import BookmarkListLocal from "../_components/list/bookmarkListLocal"
import Genre from "../_models/genre"



async function getUserBookmarks(userId:string):Promise<any[]> {
    try {
        await dbConnect()
        const userBms = await Bookmark.find({
            userRef: userId
        }).populate({
            path: 'wtRef',
            populate: {
                path: 'genres',
                model: Genre
            }
        })

        return userBms

        /* return JSON.parse(JSON.stringify(userBms)) */

    } catch (err) {
        console.error(err)
        throw err
    }
}



export default async function BookmarksPage() {
    let oauthSess
    let userBookmarks: any[] | null
    try {
        oauthSess = await auth()
        if (oauthSess?.user?.id) {
            console.log('user is logged in via oauth.')
            userBookmarks = await getUserBookmarks(oauthSess.user.id)
            console.log('****BOOKMARKS***', userBookmarks)
        } else {
            console.log('User is not logged into via oauth.')
            userBookmarks = null
        }
    } catch (err) {
        return <ServerError></ServerError>
    }
    
    return (
        <main>
            <div className="w-full p-4 max-w-[1024px]">
                {
                    oauthSess && oauthSess.user ? 
                    <BookmarkList bookmarksCopy={JSON.parse(JSON.stringify(userBookmarks))}></BookmarkList> :
                    <BookmarkListLocal></BookmarkListLocal>
                }
                    
                
            </div>
        </main>
    )
}