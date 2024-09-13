'use client'

import { useEffect, useState, useTransition } from "react"
import ErrorMsgModal from "../modals/errorModal"
import { Pagination, Button, Link, Divider } from "@nextui-org/react"
import NextImage from "next/image"
import { useAuth } from "@/app/_contexts/authContext"
import ConfirmModal from "../modals/confirmModal"
import { randomHash } from "@/app/_utils/version"

export default function BookmarkListLocal () {

    const limit = 10
    
    const { setCheckLocal } = useAuth()
    const [bookmarks, setBookmarks] = useState<any[]>()
    const [errorMsg, setErrorMsg] = useState('')
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isPending, startTransition] = useTransition()
    const [isInitiated, setIsInitiated] = useState(false)
    const [ogBm, setogBm] = useState<any[]>([])
    const [confirmId, setConfirmId] = useState('')
    const [confirmMsg, setConfirmMsg] = useState('')
    

    useEffect(() => {
        
        const localBookmarks = localStorage.getItem('bookmarks')
        if (localBookmarks) {
            const bmArr = JSON.parse(localBookmarks)
            const sortedBm = bmArr.sort((a:any,b:any) => {
                if (a.name < b.name) {
                    return -1
                } else if (a.name > b.name) {
                    return 1
                } else {
                    return 0
                }
            })
            
            setogBm(sortedBm)
            console.log('LOCAL sortedOgBm:', sortedBm)
            const firstPgBm = sortedBm.slice(0, limit)
            setBookmarks(firstPgBm)
            const totalpgs = Math.ceil(bmArr.length / limit)
            setTotalPages(totalpgs)
        } else {
            setBookmarks([])
        }
        setIsInitiated(true)
        
        
    }, [])

    useEffect(() => {
        if (isInitiated && ogBm.length > 0) {
            const start = (currentPage - 1) * limit
            const end = currentPage * limit
            startTransition(() => {
                setBookmarks(ogBm.slice(start, end))
            })
            window.scrollTo({
                top:0,
                behavior:'instant'
            })
        }
    }, [currentPage, ogBm])

    const removeBm = (key:any) => {
        let storedBookmarks = localStorage.getItem('bookmarks')
        if (storedBookmarks) {
            const parsedBookmarks:any[] = JSON.parse(storedBookmarks)
            const existingBm = parsedBookmarks.findIndex(bm => bm.url === key)

            if (existingBm !== -1) {
                const updatedBm = parsedBookmarks.filter((_:any, index:any) => index !== existingBm)
                localStorage.setItem('bookmarks', JSON.stringify(updatedBm))
                console.log('bm removed:', localStorage)
                if (bookmarks && bookmarks.length === 1 && currentPage > 1) {
                    setogBm(prevArr => prevArr!.filter(item => item.url !== key))
                    setCurrentPage((prev) => prev - 1)
                    setTotalPages((prev => prev - 1))
                } else {
                    /* setBookmarks(prevArr => prevArr!.filter(item => item.url !== key)) */
                    setogBm(prevArr => prevArr!.filter(item => item.url !== key))
                    const totalpgs = Math.ceil((ogBm.length - 1) / limit)
                    console.log('new total pg', totalpgs)
                    setTotalPages(totalpgs)
                }
                
                setCheckLocal((prev) => !prev)
            }
        }
    }

    const confirmRemove = (wtUrl:string, wtName:string) => {
        const msg = `Remove "${wtName}" from your bookmarks?`
        setConfirmMsg(msg)
        setConfirmId(wtUrl)
        console.log('Remove button pressed for', wtUrl, wtName)
    }

    return (
        <>
        {
            confirmMsg ? 
            <ConfirmModal msg={confirmMsg} setMsg={setConfirmMsg} func={() => removeBm(confirmId)}></ConfirmModal> : null
        }
        {
            errorMsg ?
            <ErrorMsgModal message={errorMsg} setErrorMsg={setErrorMsg}></ErrorMsgModal> : null
        }
        {
            bookmarks && bookmarks.length > 0 && totalPages > 0 ?
            <>
            <h1 className="font-semibold text-lg">
            Your bookmarks
            </h1>
            <Divider className="mt-2"></Divider>
            <Pagination className="my-4" total={totalPages} page={currentPage} showControls onChange={setCurrentPage}>

            </Pagination>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bookmarks && bookmarks.map((bm:any, idx) => {
                    console.log('li keys', bm.url)
                    return (
                        <li key={`bmlocal-${bm.url}`} className="mt-4">
                            <div className="flex">
                                <div className="mr-4 flex-shrink-0">
                                <NextImage priority={idx < 3 ? true : false} className="w-[100px] h-auto" unoptimized width={0} height={0} alt={`Cover image of ${bm.name}`} src={bm.image}></NextImage>
                                <Button onPress={() => confirmRemove(bm.url, bm.name)} isDisabled={isPending} radius="none" className="text-foreground mt-2 font-semibold" variant="ghost" color="warning" size="sm" fullWidth>Remove</Button>
                                </div>
                                <div className="flex flex-col">
                                    <Link isDisabled={isPending} href={`${bm.url}${randomHash}`} color="foreground" className="font-semibold">
                                        {bm.name}
                                    </Link>
                                    {/* <div className="my-2">
                                    <StarsOnly rating={bm.wtRef.avgRating ? bm.wtRef.avgRating : 0}></StarsOnly>
                                    </div> */}
                                    <span className="text-xs sm:text-sm flex gap-2 text-default-500 flex-wrap mt-2">
                                        {bm.genres}

                                    </span>
                                
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            {
                bookmarks && bookmarks.length >= 4 ?
                <Pagination showControls className="my-4" total={totalPages} page={currentPage} onChange={setCurrentPage}>

            </Pagination>: null }
            </>
        : null
        }
        { bookmarks && bookmarks.length === 0 ?
        <div className="flex-col flex">
            <span className="text-lg">
                    You have no saved bookmarks. 
            </span>
        </div>
        : null

        }
        
        </>
    )   
}