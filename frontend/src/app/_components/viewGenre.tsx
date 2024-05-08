'use client'
import SortByRadio from "./radio/sortByRadio";
import { Link, Pagination } from "@nextui-org/react";
import NextImage from "next/image";
import StarsOnly from "./rating/starsDisplayOnly";
import { formatDateDMY } from "../_utils/dates";
import { useEffect, useState } from "react";
import HotIcon from "./icons/hotIcon";


interface ViewGenreWtProps {
    wtsArr: {wts:[{book:any, chapters:[any]}], totalPages:number},
    totalPg: number,
    genreName: string
}

export default function ViewGenreWt ({wtsArr, totalPg, genreName}:ViewGenreWtProps) {

    /* console.log(wtsArr) */
    const [sortBy, setSortBy] = useState('latest')
    const [updates, setUpdates] = useState<any>(wtsArr)
    const [curPg, setCurPg] = useState(1)
    const [totalPages, setTotalPages] = useState(totalPg)
    const [isResultOut, setIsResultOut] = useState(false)
    const [initialPg, setInitialPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const getPage = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/genre/wts/get?slug=${genreName}&page=${curPg}&sort=${sortBy ? sortBy : 'latest'}`, {
                method: 'GET',
                next: {
                    tags: ['updateContent']
                }
            })

            if (response.ok) {
                const json = await response.json()
                console.log('RESULTS:', json)
                setIsResultOut(true)
                setInitialPage(0)
                setUpdates(json)
                setTotalPages(json.totalPages)
                setIsLoading(false)
            }
        } catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        
        if (curPg !== initialPg) {
            /* console.log('trigger from curpg') */
            getPage()
        }
    },[curPg])

    useEffect(() => {
        if (sortBy === 'rating' || sortBy === 'latest') {
            getPage()
        }
    }, [sortBy])

    return (
        <div className="flex flex-col gap-6">
            <SortByRadio value={sortBy} setValue={setSortBy}></SortByRadio>
            <div className="cards-cont gap-4 lg:gap-6 p-2 relative">
            {isLoading && <div className="overlay-g"></div>}
            {updates && updates.wts.map((node:any, idx:number) => {
            
            let slug = node.book.slug
            return (
            <div key={`${node.book._id}-g`} className="cg">
            
                <Link href={`/read/${slug}`}>
                <div className="relative w-full min-h-[200px] overflow-hidden">
                
              
                <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} placeholder="blur" blurDataURL={`${node.book.image}`} unoptimized fill sizes="(max-width:450px) 50vw, (max-width:600px) 40vw, (max-width:1200px) 10vw" className="home-c object-cover rounded">

                </NextImage>
                {
                    node.book.isHot !== 'No' ? 
                    <HotIcon level={node.book.isHot}></HotIcon>
                    : null
                }
                
              
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
                {node.chapters.map((node:any) => {
                    return (
                    <div key={`${node._id}-gch`}>
                    <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} isBlock className="flex gap-1 items-center">
                    <span className="text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                    
                    {formatDateDMY(node.releasedAt) === 'New' ?

                    <span className={`text-xs text-danger-600 font-bold pulsate flex-1 text-center`}>
                        <span className="ml-1 bg-danger-600 text-white px-2 rounded py-[2px]">
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
        {curPg && totalPages && !isLoading ? 
          <>
          <Pagination total={totalPages} page={curPg} onChange={setCurPg} className="w-full" showControls>

           </Pagination>
          
           </> : 
           <></>
           }
           {
            isResultOut && totalPages === 0 && !isLoading &&
            <span>No matching results.</span> 

           }
        </div>
    )
}