'use client'

import { useEffect, useState } from "react"
import ErrorMsgModal from "../modals/errorModal"
import { Pagination } from "@nextui-org/react"


export default function BookmarkListLocal () {

    const limit = 10
    

    const [bookmarks, setBookmarks] = useState()
    const [errorMsg, setErrorMsg] = useState('')
    const [totalPages, setTotalPages] = useState<number | null>()
    const [currentPage, setCurrentPage] = useState(1)
    

    useEffect(() => {
        const localBookmarks = localStorage.getItem('bookmarks')
        if (localBookmarks) {
            const bmArr = JSON.parse(localBookmarks)
            setBookmarks(bmArr)
            console.log('LOCAL BMS:', bmArr)
            const totalpgs = Math.ceil(bmArr.length / limit)
            setTotalPages(totalpgs)
        }
        
    }, [])

    return (
        <>
        {
            errorMsg ?
            <ErrorMsgModal message={errorMsg} setErrorMsg={setErrorMsg}></ErrorMsgModal> : null
        }
        {/* {
            bookmarks ?
            <>
            <Pagination className="my-4" total={totalPages} page={currentPage} showControls onChange={setCurrentPage}>

            </Pagination>
            <ul>
                {bookmarks && bookmarks.map((bm:any, idx) => {
        
                    return (
                        <li key={bm._id} className="mt-4">
                            <div className="flex">
                                <div className="mr-4 flex-shrink-0">
                                <NextImage priority={idx < 3 ? true : false} className="w-[100px] h-auto" unoptimized width={0} height={0} alt={`Cover image of ${bm.wtRef.name}`} src={bm.wtRef.image}></NextImage>
                                <Button onPress={() => removeBm(bm._id)} isDisabled={isPending} radius="none" className="text-foreground mt-2 font-semibold" variant="ghost" color="warning" size="sm" fullWidth>Remove</Button>
                                </div>
                                <div className="flex flex-col">
                                    <Link isDisabled={isPending} href={bm.url} color="foreground" className="font-semibold">
                                        {bm.wtRef.name}
                                    </Link>
                                    <div className="my-2">
                                    <StarsOnly rating={bm.wtRef.avgRating ? bm.wtRef.avgRating : 0}></StarsOnly>
                                    </div>
                                    <span className="text-sm flex gap-2 text-default-500 flex-wrap mt-2">
                                        {bm.wtRef.genres && bm.wtRef.genres.map((genre:any) => {
                                            return (
                                                <span key={`${bm._id}-${genre._id}`} className="text-xs sm:text-sm flex">
                                                    {genre.name}
                                                </span>
                                            )
                                        })}

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

        } */}
        
        </>
    )   
}