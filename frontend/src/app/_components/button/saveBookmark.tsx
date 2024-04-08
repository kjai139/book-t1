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
}

interface SaveBookmarkBtnProps {
    wtGenres:[],
    chNum?: string,
    wtName: string,
    wTstatus: string,
    image: string,
}

export default function SaveBookmarkBtn ({wtGenres, chNum, image, wTstatus, wtName}:SaveBookmarkBtnProps) {
    const { checkLocal, setCheckLocal } = useAuth()
    const [isMarked, setIsMarked] = useState(false)
    const [isDoneLoading, setIsDoneLoading] = useState(false)

    const pathname = usePathname()
    

    useEffect(() => {
        console.log('bookmarkbtn checkstate')
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
            console.log('bookmark found.', bookmarks[existingBm])
            bookmarks = bookmarks.filter((_, index) => index !== existingBm)
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
            setIsMarked(false)
            console.log('bm removed:', localStorage)
        } else {
            if (bookmarks.length < 25) {
                bookmarks.push({ url: pathname, genres:wtGenres.map(node => node.name).join(', '), name:wtName, status: wTstatus, image: image  })
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
                setIsMarked(true)
                console.log('bookmark added:', localStorage)
            } else {
                console.log('Your bookmark is full. limit:25')
            }
           
        }
        
    }




    return (
        <>
        {isDoneLoading && <Button onPress={toggleBm} startContent={<FaBookmark></FaBookmark>} variant="solid" fullWidth className={`ext-md font-semibold`} color={`${isMarked ? 'success' : 'default'}`} aria-label="Add to Bookmark">{isMarked ? 'Bookmarked' : 'Bookmark'}</Button>}
        </>
    )
}