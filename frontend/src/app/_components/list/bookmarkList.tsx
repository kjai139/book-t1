'use client'
import NextImage from "next/image"
import { Button, Link, Pagination } from "@nextui-org/react"
import { useEffect, useState, useTransition } from "react"
import { removeBmDB } from "@/app/actions"
import ErrorMsgModal from "../modals/errorModal"
import StarsOnly from "../rating/starsDisplayOnly"

interface BookmarkListProps {
    bookmarksCopy: any[] | null | undefined
}

export default function BookmarkList ({bookmarksCopy}:BookmarkListProps) {

    const sortedBm = bookmarksCopy?.sort((a,b) => {
        if (a.wtRef.name < b.wtRef.name) {
            return -1
        } else if (a.wtRef.name > b.wtRef.name) {
            return 1
        } else {
            return 0
        }
    })

    const limit = 10
    let totalPgs = 0
    let firstPgBm 
    if (sortedBm) {
        totalPgs = Math.ceil(sortedBm.length / limit)
        firstPgBm = sortedBm.slice(0, limit)
    }

    


    const [isPending, startTransition] = useTransition()
    const [bookmarks, setBookmarks] = useState(firstPgBm)
    const [errorMsg, setErrorMsg] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(totalPgs)
    const [isInitiated, setIsInitiated] = useState(false)

    const scrollToTop = () => {
        window.scrollTo({
            top:0,
            behavior:'instant'
        })
    }

    useEffect(() => {
        if (isInitiated) {
            console.log('totalpgs', totalPages)
            const start = (currentPage - 1) * limit
            const end = currentPage * limit
            const newPgBm = sortedBm?.slice(start, end)
            startTransition(() => {
                console.log('setting...', start, end)
                setBookmarks(newPgBm)
            })
            scrollToTop()
        } else {
            console.log('page not initiated, initiating...')
            setIsInitiated(true)
        }
        
    }, [currentPage])

    const removeBm = async (bmId:string) => {
        startTransition(async () => {
            try {
                const result = await removeBmDB(bmId)
                console.log('Result:', result)
                if (result === 'ok') {
                    console.log(`Bookmark ${bmId} removed`)
                    setBookmarks((prev) => prev?.filter(bm => bm._id !== bmId))
                } else {
                    setErrorMsg('An error has occured')
                }

            } catch (err) {
                console.error(err)
                setErrorMsg('An error has occured')
            }
        })
    }

    return (
        <>
        {
            errorMsg ?
            <ErrorMsgModal message={errorMsg} setErrorMsg={setErrorMsg}></ErrorMsgModal> : null
        }
        <Pagination className="my-4" total={totalPages} page={currentPage} showControls onChange={setCurrentPage}>

        </Pagination>
        <ul>
            {bookmarks && bookmarks.map((bm:any, idx) => {
                /* console.log('***GENRES***', bm.wtRef.genres) */
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
    )
}