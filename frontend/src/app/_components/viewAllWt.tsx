'use client'

import { useEffect, useState } from "react"
import SelectGenres from "./checkboxes/selectGenres"
import SelectStatusCheckbox from "./checkboxes/selectStatus"
import { Button, Link, Pagination } from "@nextui-org/react"
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
    const [updates, setUpdates] = useState()

    const [sortBy, setSortBy] = useState('latest')
    const [isResultOut, setIsResultOut] = useState(false)
    //for errors


    const getWts = async () => {
        setIsResultOut(false)
        try {
            const response = await fetch(`${apiUrl}/api/wts/all/get?genres=${encodeURIComponent(JSON.stringify(genres))}&status=${status}&order=${sortBy}&page=${curPg}`, {
                cache: "no-cache"
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setUpdates(data)
                setTotalPages(data.totalPages)
                setIsResultOut(true)
                
            }

        } catch (err) {
            setIsResultOut(true)
            console.error(err)
        }
    }

    useEffect(() => {
        if (curPg) {
            getWts()
        }
    }, [curPg])

    return (
        <div className="p-2 flex flex-col gap-6">
            <SelectGenres value={genres} setValue={setGenres}></SelectGenres>
            <SelectStatusCheckbox value={status} setValue={setStatus}></SelectStatusCheckbox>
            <SortByRadio value={sortBy} setValue={setSortBy}></SortByRadio>
            <div className="justify-end flex">
                <Button  color="primary" size="sm" onPress={getWts}>Filter</Button>
            </div>
            <div className="cards-cont gap-2 sm:gap-6">
      
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
                <span className="my-[5px] flex gap-2">
                <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
                <span className="text-foreground font-semibold text-xs">
                {node.book.avgRating ? node.book.avgRating : ''}
                </span>
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
          <Pagination total={totalPages} page={curPg} onChange={setCurPg}>

           </Pagination>
           <div className="flex justify-between">
            <Button size="sm" variant="flat" onPress={() => setCurPg((prev) => (prev > 1 ? prev - 1 : prev))} isDisabled={curPg === 1 ? true : false}>
                Prev
            </Button>
            <Button size="sm" variant="flat" onPress={() => setCurPg((prev) => (prev < totalPages ? prev + 1 : prev))} isDisabled={curPg < totalPages ? false : true}>
                Next
            </Button>
           </div>
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