'use client'
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@nextui-org/react"
import { FaBookmark } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/_contexts/authContext"


interface BookmarkObj {
    url: string,
    name: string,
    genres: string,
    chNum?: string,
    status: string,
    image: string,
    id?:string,
}

interface SaveBookmarkBtnProps {
    wtGenres:[],
    chNum?: string,
    wtName: string,
    wTstatus: string,
    image: string,
    slug?: string,
    wtId?: string,
}

export default function SaveBookmarkBtn ({wtGenres, chNum, image, wTstatus, wtName, wtId}:SaveBookmarkBtnProps) {
    const { checkLocal, setCheckLocal } = useAuth()
    const [isMarked, setIsMarked] = useState(false)
    const [isDoneLoading, setIsDoneLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const pathname = usePathname()
    

    useEffect(() => {
        /* console.log('bookmarkbtn checkstate') */
        const storedBookmarks = localStorage.getItem('bookmarks')
        if ( storedBookmarks) {
            const json:BookmarkObj[] = JSON.parse(storedBookmarks)
            const isBookmarked = json.some(bm => bm.url === pathname)

            if (isBookmarked) {
                setIsMarked(true)
                setIsDoneLoading(true)
            } else {
                setIsMarked(false)
                setIsDoneLoading(true)
            }
        } else {
            setIsDoneLoading(true)
        }
    }, [checkLocal])

    const toggleBm = () => {
        let storedBookmarks = localStorage.getItem('bookmarks')
        let bookmarks:BookmarkObj[] = storedBookmarks ? JSON.parse(storedBookmarks) : []

        
        const existingBm = bookmarks.findIndex(bm => bm.url === pathname)

        if (existingBm !== -1) {
            /* console.log('bookmark found.', bookmarks[existingBm]) */
            bookmarks = bookmarks.filter((_, index) => index !== existingBm)
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
            setIsMarked(false)
            /* console.log('bm removed:', localStorage) */
        } else {
            if (bookmarks.length < 25) {
                bookmarks.push({ url: pathname, genres:wtGenres.map((node:any) => node.name).join(', '), name:wtName, status: wTstatus, image: image, id:wtId  })
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
                setIsMarked(true)
                /* console.log('bookmark added:', localStorage) */
                setErrorMsg('')
            } else {
                setErrorMsg('Your bookmarks are full, delete something and try again.')
            }
           
        }
        
    }




    return (
        <>
        {isDoneLoading && <Button onPress={toggleBm} startContent={<FaBookmark></FaBookmark>} variant="solid" fullWidth className={`ext-md font-semibold max-w-[350px]`} color={`${isMarked ? 'success' : 'default'}`} aria-label="Add to Bookmark">{isMarked ? 'Bookmarked' : 'Bookmark'}</Button>}
        {errorMsg &&
        <span className="text-xs text-danger">{errorMsg}</span> 
        }
        </>
    )
}