'use client'
import NextImage from "next/image"
import { Button, Link } from "@nextui-org/react"
import { useState, useTransition } from "react"
import { removeBmDB } from "@/app/actions"

interface BookmarkListProps {
    bookmarksCopy: any[] | null | undefined
}

export default function BookmarkList ({bookmarksCopy}:BookmarkListProps) {


    const [isPending, startTransition] = useTransition()
    const [bookmarks, setBookmarks] = useState(bookmarksCopy)
    const [errorMsg, setErrorMsg] = useState('')

    const removeBm = async (wtId:string) => {
        startTransition(async () => {
            try {
                const result = await removeBmDB(wtId)
                if (result === 'ok') {
                    setBookmarks((prev) => prev?.filter(bm => bm.wtRef._id !== wtId))
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
        <ul>
            {bookmarks && bookmarks.map((bm:any, idx) => {
                /* console.log('***GENRES***', bm.wtRef.genres) */
                return (
                    <li key={bm._id} className="mt-4">
                        <div className="flex">
                            <div className="mr-4 flex-shrink-0">
                            <NextImage priority={idx < 3 ? true : false} className="w-[100px] h-auto" unoptimized width={0} height={0} alt={`Cover image of ${bm.wtRef.name}`} src={bm.wtRef.image}></NextImage>
                            <Button radius="none" className="text-foreground mt-2 font-semibold" variant="ghost" color="warning" size="sm" fullWidth>Remove</Button>
                            </div>
                            <div className="flex flex-col">
                                <Link href={bm.url} color="foreground" className="font-semibold">
                                    {bm.wtRef.name}
                                </Link>
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
    )
}