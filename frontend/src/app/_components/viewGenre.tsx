'use client'
import SortByRadio from "./radio/sortByRadio";
import { Link, Pagination, Button } from "@nextui-org/react";
import NextImage from "next/image";
import StarsOnly from "./rating/starsDisplayOnly";
import { formatDateDMY } from "../_utils/dates";
import { useEffect, useState } from "react";
import apiUrl from "../_utils/apiEndpoint";

interface ViewGenreWtProps {
    wtsArr: {wts:[{book:any, chapters:[any]}], totalPages:number},
    totalPg: number,
    genreName: string
}

export default function ViewGenreWt ({wtsArr, totalPg, genreName}:ViewGenreWtProps) {

    console.log(wtsArr)
    const [sortBy, setSortBy] = useState('latest')
    const [updates, setUpdates] = useState<any>(wtsArr)
    const [curPg, setCurPg] = useState(1)
    const [totalPages, setTotalPages] = useState(totalPg)
    const [isResultOut, setIsResultOut] = useState(false)
    const [initialPg, setInitialPage] = useState(1)

    const getPage = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/genre/wts/get?slug=${genreName}&page=${curPg}&sort=${sortBy ? sortBy : 'latest'}`, {
                method: 'GET',
                next: {
                    revalidate: 1
                }
            })

            if (response.ok) {
                console.log('Get page ran in client')
                const json = await response.json()
                setIsResultOut(true)
                setInitialPage(0)
                setUpdates(json)
                setTotalPages(json.totalPages)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        
        if (curPg !== initialPg) {
            console.log('trigger from curpg')
            getPage()
        }
    },[curPg])

    useEffect(() => {
        if (sortBy === 'rating' || sortBy === 'latest') {
            console.log('triggered from sorting')
           /*  console.log('sorting by rating...')
            const sortedWts = updates.wts.slice().sort((a,b) => {
                const avgRatingA = a.book?.avgRating || 0
                const avgRatingB = b.book?.avgRating || 0
                return avgRatingB - avgRatingA
            })
            setUpdates((prev) =>  ({
                ...prev,
                wts: sortedWts
            })) */
            getPage()
        }
    }, [sortBy])

    return (
        <div className="flex flex-col gap-6">
            <SortByRadio value={sortBy} setValue={setSortBy}></SortByRadio>
            <div className="cards-cont gap-2 sm:gap-8">
            {updates && updates.wts.map((node, idx) => {
            
            let slug = node.book.slug
            return (
            <div key={node.book._id} className="cg">
            
                <Link href={`/read/${slug}`}>
                <div className="relative w-full min-h-[200px] overflow-hidden">
                
              
                <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} priority={idx <= 4 ? true : false} fill sizes="(max-width:600px) 40vw, (max-width:1200px) 20vw" className="home-c object-cover rounded">

                </NextImage>
                
              
                </div>
                </Link>
                
                
                
                <span className="card-txt">
                <Link href={`/read/${slug}`} color="foreground">
                {node.book.name}
                </Link>
                
                </span>
                <span className="my-[5px]">
                <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
                </span>
                
                
                <div className="ch-btns gap-1">
                {node.chapters.map((node) => {
                    return (
                    <div key={node._id}>
                    <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="flex gap-1 items-center">
                    <span className="text-sm">{`Chapter ${node.chapterNumber}`}</span>
                    
                    {formatDateDMY(node.releasedAt) === 'New' ?

                    <span className={`text-xs text-danger-600 font-bold pulsate flex-1 text-center`}>
                        <span className="bg-danger-600 text-foreground px-2 rounded">
                        {formatDateDMY(node.releasedAt)}
                        </span>
                        </span>:
                    <span className={`text-xs text-default-500 flex-1 text-center date-txt`}>{formatDateDMY(node.releasedAt)}</span>
                    }
                    </Link>
                    
                    </div>
                    )
                })}
                </div>
                
            </div>
            )
        })}
        </div>
        {curPg && totalPages ? 
          <>
          <Pagination total={totalPages} page={curPg} onChange={setCurPg} className="w-full" showControls>

           </Pagination>
           {/* <div className="flex justify-between">
            <Button size="sm" variant="flat" onPress={() => setCurPg((prev) => (prev > 1 ? prev - 1 : prev))} isDisabled={curPg === 1 ? true : false}>
                Prev
            </Button>
            <Button size="sm" variant="flat" onPress={() => setCurPg((prev) => (prev < totalPages ? prev + 1 : prev))} isDisabled={curPg < totalPages ? false : true}>
                Next
            </Button>
           </div> */}
           </> : 
           <></>
           }
           {
            isResultOut && totalPages === 0 &&
            <span>No matching results.</span> 

           }
        </div>
    )
}