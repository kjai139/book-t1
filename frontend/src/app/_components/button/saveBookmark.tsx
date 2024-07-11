'use client'
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@nextui-org/react"
import { FaBookmark } from "react-icons/fa"
import { useEffect, useState, useTransition } from "react"
import { useAuth } from "@/app/_contexts/authContext"
import { useSession } from "next-auth/react"
import { toggleBookmark } from "@/app/actions"


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
    const [ isPending, startTransition] = useTransition()
    const [shouldFetch, setShouldFetch] = useState(true)

    const pathname = usePathname()
    const session = useSession()

    const checkBmStatus = async () => {
        try {
            const response = await fetch(`/api/bookmarks/checkStatus?wtId=${wtId}`, {
                method: 'GET',

            })

            if (response.ok) {
                const data = await response.json()
                console.log('Response to check Bmstatus ok, ', data)
                if (data.isBookmarked) {
                    setIsMarked(true)
                } else {
                    setIsMarked(false)
                }
                setShouldFetch(false)
                setIsDoneLoading(true)
            } else {
                setIsMarked(false)
                console.error('Error getting status on bookmark')
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (shouldFetch && session.status === 'authenticated') {
            console.log('User is logged in, checking bm status...')
            checkBmStatus()
        } else if (session.status === 'unauthenticated') {
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
            setShouldFetch(false)
            
        } 
    }, [session.status])
    

    useEffect(() => {
        if (session.status === 'unauthenticated') {
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
            
        } 
        
    }, [checkLocal])

    const toggleBm = () => {
        if (session.status === 'unauthenticated') {
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
        } else if (session.status === 'authenticated') {
            console.log('BM: User is signed in')
            const userId = session.data.user!.id!
            startTransition(async () => {
                const result = await toggleBookmark(userId, wtId!, pathname)
                if (result === 'added') {
                    setIsMarked(true)
                } else if (result === 'deleted') {
                    setIsMarked(false)
                } else {
                    console.log(result)
                    setErrorMsg('An error has occured.')
                }
            })
        }
        
        
    }




    return (
        <>
        <Button isDisabled={isPending || !isDoneLoading} onPress={toggleBm} startContent={<FaBookmark></FaBookmark>} variant="solid" fullWidth className={`ext-md font-semibold max-w-[350px]`} color={`${isMarked ? 'success' : 'default'}`} aria-label="Add to Bookmark">{isMarked ? 'Bookmarked' : 'Bookmark'}</Button>
        {errorMsg &&
        <span className="text-xs text-danger">{errorMsg}</span> 
        }
        </>
    )
}