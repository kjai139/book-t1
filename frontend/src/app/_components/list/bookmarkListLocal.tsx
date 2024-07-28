'use client'

import { useEffect, useState, useTransition } from "react"
import ErrorMsgModal from "../modals/errorModal"
import { Pagination, Button, Link, Divider } from "@nextui-org/react"
import NextImage from "next/image"
import { useAuth } from "@/app/_contexts/authContext"
import StarsOnly from "../rating/starsDisplayOnly"

export default function BookmarkListLocal () {

    const limit = 10
    
    const { setCheckLocal } = useAuth()
    const [bookmarks, setBookmarks] = useState<any[]>()
    const [errorMsg, setErrorMsg] = useState('')
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isPending, startTransition] = useTransition()
    const [isInitiated, setIsInitiated] = useState(false)
    const [ogBm, setogBm] = useState([])
    

    useEffect(() => {
        const localBookmarks = localStorage.getItem('bookmarks')
        if (localBookmarks) {
            const bmArr = JSON.parse(localBookmarks)
            setBookmarks(bmArr)
            setogBm(bmArr)
            console.log('LOCAL BMS:', bmArr)
            const totalpgs = Math.ceil(bmArr.length / limit)
            setTotalPages(totalpgs)
        }
        setIsInitiated(true)
        
    }, [])

    useEffect(() => {
        if (isInitiated) {
            const start = (currentPage - 1) * limit
            const end = currentPage * limit
            startTransition(() => {
                setBookmarks(ogBm.slice(start, end))
            })
        }
    }, [currentPage])

    const removeBm = (key:any) => {
        let storedBookmarks = localStorage.getItem('bookmarks')
        if (storedBookmarks) {
            const parsedBookmarks:any[] = JSON.parse(storedBookmarks)
            const existingBm = parsedBookmarks.findIndex(bm => bm.url === key)

            if (existingBm !== -1) {
                const updatedBm = parsedBookmarks.filter((_:any, index:any) => index !== existingBm)
                localStorage.setItem('bookmarks', JSON.stringify(updatedBm))
                console.log('bm removed:', localStorage)
                setBookmarks(prevArr => prevArr!.filter(item => item.url !== key))
                setCheckLocal((prev) => !prev)
            }
        }
    }

    return (
        <>
        {
            errorMsg ?
            <ErrorMsgModal message={errorMsg} setErrorMsg={setErrorMsg}></ErrorMsgModal> : null
        }
        {
            bookmarks && totalPages > 0 ?
            <>
            <h1 className="font-semibold text-lg">Your bookmarks</h1>
            <Divider className="mt-2"></Divider>
            <Pagination className="my-4" total={totalPages} page={currentPage} showControls onChange={setCurrentPage}>

            </Pagination>
            <ul>
                {bookmarks && bookmarks.map((bm:any, idx) => {
                    console.log('li keys', bm.url)
                    return (
                        <li key={`bmlocal-${bm.url}`} className="mt-4">
                            <div className="flex">
                                <div className="mr-4 flex-shrink-0">
                                <NextImage priority={idx < 3 ? true : false} className="w-[100px] h-auto" unoptimized width={0} height={0} alt={`Cover image of ${bm.name}`} src={bm.image}></NextImage>
                                <Button onPress={() => removeBm(bm.url)} isDisabled={isPending} radius="none" className="text-foreground mt-2 font-semibold" variant="ghost" color="warning" size="sm" fullWidth>Remove</Button>
                                </div>
                                <div className="flex flex-col">
                                    <Link isDisabled={isPending} href={bm.url} color="foreground" className="font-semibold">
                                        {bm.name}
                                    </Link>
                                    <div className="my-2">
                                    {/* <StarsOnly rating={bm.wtRef.avgRating ? bm.wtRef.avgRating : 0}></StarsOnly> */}
                                    </div>
                                    <span className="text-sm flex gap-2 text-default-500 flex-wrap mt-2">
                                        {bm.genres}

                                    </span>
                                
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <Pagination showControls className="my-4" total={totalPages} page={currentPage} onChange={setCurrentPage}>

            </Pagination> 
            </>
        : null

        }
        
        </>
    )   
}