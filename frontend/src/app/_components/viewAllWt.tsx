'use client'

import { useEffect, useState } from "react"
import SelectGenres from "./checkboxes/selectGenres"
import SelectStatusCheckbox from "./checkboxes/selectStatus"
import { Button, Divider, Link, Pagination } from "@nextui-org/react"
import { formatDateDMY } from "../_utils/dates"
import NextImage from "next/image"
import StarsOnly from "./rating/starsDisplayOnly"
import SortByRadio from "./radio/sortByRadio"
import HotIcon from "./icons/hotIcon"
import NewIcon from "./icons/newIcon"
import { useInView } from "./observer/useInView"
import { useRouter } from "next/navigation"
import { randomHash } from "../_utils/version"

interface ViewAllWtProps {
    allGenres: any[]
}


export default function ViewallWt ({allGenres}:ViewAllWtProps) {

    const [genres, setGenres] = useState([])
    const [status, setStatus] = useState<String[]>([])

    const [curPg, setCurPg] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const [updates, setUpdates] = useState<any>()
    const [totalWt, setTotalWt] = useState<any>()

    const [sortBy, setSortBy] = useState('latest')
    const [isResultOut, setIsResultOut] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    
    const [isInView, ref] = useInView()
    const [isDisabled, setIsDisabled] = useState(false)
    const router = useRouter()
    //for errors


    const getWts = async () => {
        setIsLoading(true)
        setIsDisabled(true)
        try {
            const response = await fetch(`/api/wt/query/get?genres=${encodeURIComponent(JSON.stringify(genres))}&status=${encodeURIComponent(JSON.stringify(status))}&order=${sortBy}&page=${curPg}`, {
                next: {
                    revalidate: 900,
                    tags: ['updateContent']
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setUpdates(data)
                setTotalPages(data.totalPages)
                setTotalWt(data.totalWt)
                setIsResultOut(true)
                
                
                
            } else {
                if (response.status === 429) {
                    router.push('/blocked')
                }
                const data = await response.json()
                console.log(data)
            }
            setIsLoading(false)
            setIsDisabled(false)
          

        } catch (err:any) {
            setTotalWt(0)
            setIsResultOut(true)
            setIsLoading(false)
            setIsDisabled(false)
            console.error(err)
        
        }
    }

    const filterSearch = () => {
        if (curPg !== 1) {
            setCurPg(1)
        } else {
            getWts()
        }
        
    }

    useEffect(() => {
        if (curPg) {
            getWts()
        }
    }, [curPg])

    /* useEffect(() => {
        console.log(status)
    }, [status]) */

    useEffect(() => {
        console.log('isINVIEW', isInView)
    }, [isInView])

    useEffect(() => {
        setIsDisabled(true)   
        if (!isLoading && isResultOut && !isInView && ref.current) { 
            /* ref.current.scrollIntoView({
                behavior: 'instant'
            }) */
            
            setTimeout(() => {
                if (ref.current && !isInView) {
                    ref.current.scrollIntoView({
                        behavior: 'instant',
                        block:'end'
                    })
                }
                
                setIsDisabled(false)
            }, 1000)
        
        }

    }, [curPg])

    return (
        <div className="p-2 flex flex-col gap-6 relative">
            
            <div className="flex flex-col gap-4 p-2">
           
            <SelectGenres isDisabled={isDisabled} value={genres} setValue={setGenres} allGenres={allGenres}></SelectGenres>
            <SelectStatusCheckbox isDisabled={isDisabled} value={status} setValue={setStatus}></SelectStatusCheckbox>
            <SortByRadio isDisabled={isDisabled} value={sortBy} setValue={setSortBy}></SortByRadio>
            <div className="justify-end flex">
            <Button  color="primary" size="sm" onPress={filterSearch} isLoading={isLoading}>Filter</Button>
            </div>
            <Divider className="mt-4"></Divider>
            <div className="justify-start flex flex-col" ref={ref}>
                {totalWt && isResultOut && !isLoading ?
                <span className="font-semibold flex justify-between items-center">
                    <span>
                    <h3>
                    Results: ( {totalWt} )
                    </h3>
                    <span className="text-xs text-default-500">
                        Page: {curPg} / {totalPages}
                    </span>
                    </span>
                    
                        <div className="flex">
                        <Button isIconOnly onPress={() => setCurPg((prev) => prev - 1)} className="mr-4" isDisabled={curPg === 1 || isDisabled || isLoading}>{`<`}</Button>
                        <Button isIconOnly onPress={() => setCurPg((prev) => prev + 1)} isDisabled={curPg === totalPages || isDisabled || isLoading}>{`>`}</Button>
                        
                        </div> 
                    
                </span> : <span className="font-semibold flex justify-between items-center">
                    <span>
                    Results: ( ... )
                    </span>
                    <div className="flex">
                        <Button isIconOnly isDisabled className="mr-4">{`<`}</Button>
                        <Button isIconOnly isDisabled>{`>`}</Button>
                        
                        </div> 
                </span>
                }
                {
                    !totalWt && isResultOut && !isLoading ?
                    <span className="font-semibold mt-8">No matching results.</span> : 
                    null
                }
                
            </div>
            </div>
            <div className="cards-cont gap-4 lg:gap-6 p-0 relative">
               
      
        {updates && updates.wts.map((node:any, idx:number) => {
            
            let slug = node.book.slug
            return (
            <div key={`${node.book._id}-qry`} className="cg">
            
                <Link href={`/read/${slug}${randomHash}`} isDisabled={isDisabled || isLoading}>
                <div className="relative w-full min-h-[200px] overflow-hidden">
                
                <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} unoptimized blurDataURL={node.book.image} placeholder="blur" fill sizes="(max-width:600px) 40vw, (max-width:1200px) 20vw" className="home-c object-cover rounded">

                </NextImage>
                <span className="flex absolute top-1 left-1 gap-1 items-center">
                {node.book?.isHot !== 'No' ? 
                <HotIcon level={node.book.isHot}></HotIcon>
                : null
                }
                
                </span>
                {node.book?.isTitleNew !== false ?
                <NewIcon></NewIcon> : null
                }
                
                </div>
                </Link>
                
                
                
                <span className="card-txt">
                <Link href={`/read/${slug}${randomHash}`} isDisabled={isDisabled || isLoading} color="foreground">
                {node.book.name}
                </Link>
                
                </span>
                <span className={`my-[5px] flex gap-2 ${isDisabled || isLoading ? 'brightness-50' : ''}`}>
                <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
                <span className="text-foreground font-semibold text-xs">
                {node.book.avgRating ? node.book.avgRating : ''}
                </span>
                </span>
                
                
                <div className="ch-btns gap-1">
                {node.chapters.map((node:any) => {
                    return (
                    <div key={`${node._id}-qry`}>
                   <Link isDisabled={isDisabled || isLoading} color="foreground" href={`/read/${slug}${randomHash}/${node.chapterNumber}`} className="flex gap-1 items-center" isBlock>
                  <span className="text-sm sm:text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                  
                  {formatDateDMY(node.releasedAt) === 'New' ?

                  <span className={`text-xs text-danger-600 font-bold flex-1 text-center`}>
                    <span className="ml-1 bg-danger-600 text-foreground px-2 rounded py-[2px]">
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
          {curPg && totalPages && isResultOut ? 
          <>
          <Pagination total={totalPages} showControls page={curPg} onChange={setCurPg} className="w-full"  classNames={{
            item:'pg-btns shadow',
            next: 'shadow',
            prev: 'shadow'
          }}>

           </Pagination>
          
           </> : 
           <></>
           }
           

        </div>
    )
}