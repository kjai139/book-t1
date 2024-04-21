'use client'

import { useEffect, useState } from "react"
import SelectGenres from "./checkboxes/selectGenres"
import SelectStatusCheckbox from "./checkboxes/selectStatus"
import { Button, Divider, Link, Pagination } from "@nextui-org/react"
import apiUrl from "../_utils/apiEndpoint"
import { formatDateDMY } from "../_utils/dates"
import NextImage from "next/image"
import StarsOnly from "./rating/starsDisplayOnly"
import SortByRadio from "./radio/sortByRadio"


export default function ViewallWt () {

    const [genres, setGenres] = useState([])
    const [status, setStatus] = useState<String[]>([])

    const [curPg, setCurPg] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const [updates, setUpdates] = useState<any>()
    const [totalWt, setTotalWt] = useState<any>()

    const [sortBy, setSortBy] = useState('latest')
    const [isResultOut, setIsResultOut] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    //for errors


    const getWts = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/wt/query/get?genres=${encodeURIComponent(JSON.stringify(genres))}&status=${status}&order=${sortBy}&page=${curPg}`, {
                next: {
                    revalidate: 900,
                    tags: ['updateContent']
                }
            })

            if (response.ok) {
                const data = await response.json()
                /* console.log(data) */
                setUpdates(data)
                setTotalPages(data.totalPages)
                setTotalWt(data.totalWt)
                setIsResultOut(true)
                setIsLoading(false)
                
            }

        } catch (err) {
            setTotalWt(0)
            setIsResultOut(true)
            setIsLoading(false)
            console.error(err)
        }
    }

    useEffect(() => {
        if (curPg) {
            getWts()
        }
    }, [curPg])

    return (
        <div className="p-2 flex flex-col gap-6 relative">
            <div className="flex flex-col gap-4 p-2">
            <SelectGenres value={genres} setValue={setGenres}></SelectGenres>
            <SelectStatusCheckbox value={status} setValue={setStatus}></SelectStatusCheckbox>
            <SortByRadio value={sortBy} setValue={setSortBy}></SortByRadio>
            <div className="justify-end flex">
            <Button  color="primary" size="sm" onPress={getWts} isLoading={isLoading}>Filter</Button>
            </div>
            <Divider className="mt-4"></Divider>
            <div className="justify-start flex items-center">
                {totalWt && isResultOut && !isLoading ?
                <span className="font-semibold">
                    Results: ( {totalWt} )
                </span> : null
                }
                {
                    !totalWt && isResultOut && !isLoading ?
                    <span className="font-semibold">No matching results.</span> : 
                    null
                }
                
            </div>
            </div>
            <div className="cards-cont gap-4 sm:gap-6">
      
        {!isLoading && updates && updates.wts.map((node:any, idx:number) => {
            
            let slug = node.book.slug
            return (
            <div key={`${node.book._id}-qry`} className="cg">
            
                <Link href={`/read/${slug}`}>
                <div className="relative w-full min-h-[200px] overflow-hidden">
                
                <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} unoptimized blurDataURL={node.book.image} placeholder="blur" fill sizes="(max-width:600px) 40vw, (max-width:1200px) 20vw" className="home-c object-cover rounded">

                </NextImage>
                
                </div>
                </Link>
                
                
                
                <span className="card-txt">
                <Link href={`/read/${slug}`} color="foreground">
                {node.book.name}
                </Link>
                
                </span>
                <span className="my-[5px] flex gap-2">
                <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
                <span className="text-foreground font-semibold text-xs">
                {node.book.avgRating ? node.book.avgRating : ''}
                </span>
                </span>
                
                
                <div className="ch-btns gap-1">
                {node.chapters.map((node:any) => {
                    return (
                    <div key={`${node._id}-qry`}>
                   <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="flex gap-1 items-center" isBlock>
                  <span className="text-sm sm:text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                  
                  {formatDateDMY(node.releasedAt) === 'New' ?

                  <span className={`text-xs text-danger-600 font-bold flex-1 text-center`}>
                    <span className="bg-danger-600 text-foreground px-2 rounded">
                      <span className="pulsate">
                    {formatDateDMY(node.releasedAt)}
                    </span>
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
          {curPg && totalPages && !isLoading && isResultOut ? 
          <>
          <Pagination total={totalPages} showControls page={curPg} onChange={setCurPg} className="w-full">

           </Pagination>
          
           </> : 
           <></>
           }
           

        </div>
    )
}