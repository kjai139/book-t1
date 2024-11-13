'use client'
import NextImage from "next/image"
import { Button, Link, Pagination, Divider } from "@nextui-org/react"
import { useEffect, useState, useTransition } from "react"
import { removeBmDB } from "@/app/actions"
import ErrorMsgModal from "../modals/errorModal"
import StarsOnly from "../rating/starsDisplayOnly"
import ConfirmModal from "../modals/confirmModal"
import { getHref, randomHash } from "@/app/_utils/version"

interface BookmarkListProps {
    bookmarksCopy: any[] | null | undefined
}

export default function BookmarkList({ bookmarksCopy }: BookmarkListProps) {


    const [isPending, startTransition] = useTransition()
    const [bookmarks, setBookmarks] = useState<any[]>()
    const [errorMsg, setErrorMsg] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isInitiated, setIsInitiated] = useState(false)
    const [ogBm, setOgBm] = useState<any[]>([])
    const limit = 10
    const [confirmMsg, setConfirmMsg] = useState('')
    const [confirmId, setConfirmId] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        })
    }

    useEffect(() => {
        setIsLoading(true)
        if (bookmarksCopy && bookmarksCopy.length > 0) {
            const sortedBm = bookmarksCopy.sort((a, b) => {
                if (a.wtRef.name < b.wtRef.name) {
                    return -1
                } else if (a.wtRef.name > b.wtRef.name) {
                    return 1
                } else {
                    return 0
                }
            })
            const totalpgs = Math.ceil(sortedBm.length / limit)
            const firstPgBm = sortedBm.slice(0, limit)
            setOgBm(sortedBm)
            setBookmarks(firstPgBm)
            setTotalPages(totalpgs)

        } else {
            setBookmarks([])
            setOgBm([])
        }
        setIsLoading(false)


    }, [])



    useEffect(() => {
        if (isInitiated && ogBm.length > 0) {
            console.log('totalpgs', totalPages)
            console.log('curpg', currentPage)
            const start = (currentPage - 1) * limit
            const end = currentPage * limit
            const newPgBm = ogBm?.slice(start, end)

            /* startTransition(() => {
                console.log('setting...', start, end)
                setBookmarks(newPgBm)
            }) */
            console.log('setting...', start, end)
            setBookmarks(newPgBm)
            scrollToTop()
        } else {
            console.log('page not initiated, initiating...')
            setIsInitiated(true)
        }

    }, [currentPage, ogBm])

    const removeBm = async (bmId: string) => {
        startTransition(async () => {
            try {
                const result = await removeBmDB(bmId)
                console.log('Result:', result)
                if (result === 'ok') {
                    console.log(`Bookmark ${bmId} removed`)
                    if (bookmarks && bookmarks.length === 1 && currentPage > 1) {
                        setOgBm((prev) => prev?.filter(bm => bm._id !== bmId))
                        setCurrentPage((prev) => prev - 1)
                        setTotalPages((prev => prev - 1))
                    } else {
                        setOgBm((prev) => prev?.filter(bm => bm._id !== bmId))
                        /* setBookmarks((prev) => prev?.filter(bm => bm._id !== bmId)) */
                        const totalPgs = Math.ceil((ogBm.length - 1) / limit)
                        setTotalPages(totalPgs)
                    }

                } else {
                    setErrorMsg('An error has occured')
                }

            } catch (err) {
                console.error(err)
                setErrorMsg('An error has occured')
            }
        })
    }

    const confirmRemove = (wtId: string, wtName: string) => {
        const msg = `Remove "${wtName}" from your bookmarks?`
        setConfirmMsg(msg)
        setConfirmId(wtId)
        console.log('Remove button pressed for', wtId, wtName)
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
                isLoading ?
                <div className="loader"></div> : null
            }
            {
                bookmarks && bookmarks.length > 0 && totalPages > 0 ?
                    <>
                        <h1 className="font-semibold text-lg">Your bookmarks</h1>
                        <Divider className="mt-2"></Divider>
                        <Pagination className="my-4" total={totalPages} page={currentPage} showControls onChange={setCurrentPage}>

                        </Pagination>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                            {bookmarks.map((bm: any, idx) => {
                                console.log('[User bm]', bm)
                                const hashedHref = getHref(bm.url)
                                return (
                                    <li key={bm._id} className="mt-4">
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <NextImage priority={idx < 3 ? true : false} className="w-[100px] h-auto" unoptimized width={0} height={0} alt={`Cover image of ${bm.wtRef.name}`} src={bm.wtRef.image}></NextImage>
                                                <Button onPress={() => confirmRemove(bm._id, bm.wtRef.name)} isDisabled={isPending} radius="none" className="text-foreground mt-2 font-semibold" variant="ghost" color="warning" size="sm" fullWidth>Remove</Button>
                                            </div>
                                            <div className="flex flex-col">
                                                <Link isDisabled={isPending} href={hashedHref} color="foreground" className="font-semibold">
                                                    {bm.wtRef.name}
                                                </Link>
                                                <div className="my-2">
                                                    <StarsOnly rating={bm.wtRef.avgRating ? bm.wtRef.avgRating : 0}></StarsOnly>
                                                </div>
                                                <span className="text-sm flex gap-2 text-default-500 flex-wrap mt-2">
                                                    {bm.wtRef.genres && bm.wtRef.genres.map((genre: any) => {
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
                        {bookmarks.length >= 4 ?
                            <Pagination showControls className="my-4" total={totalPages} page={currentPage} onChange={setCurrentPage}>

                            </Pagination> : null}
                    </> :
                    null
            }
            {
                totalPages === 0 && isInitiated ?
                <div className="flex-col flex">
                <span className="text-lg">
                    You have no saved bookmarks.
                </span>

                <span className="text-default-500 mt-4">
                    If this is your first time signing in, you have to re-save your bookmarks to have them linked to your email.
                </span>
                </div> : null
            }

        </>
    )
}