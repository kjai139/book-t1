'use client'

import { Button, Link } from "@nextui-org/react"
import NextImage from "next/image"
import HotIcon from "../icons/hotIcon"
import NewIcon from "../icons/newIcon"
import StarsOnly from "../rating/starsDisplayOnly"
import { useEffect, useState } from "react"
import { FcNext, FcPrevious } from "react-icons/fc"
import { useInView } from "../observer/useInView"

interface RecentlyDisplayedProps {
    updatesArr: any
}

export default function RecentlyDisplayed({updatesArr}:RecentlyDisplayedProps){

    const wtPerPage = 24
    const totalPages = Math.ceil(updatesArr.updates.length / wtPerPage)
    const startIndex = 0 * wtPerPage
    const endIndex = startIndex + wtPerPage
    const initialPgArr = updatesArr.updates.slice(startIndex, endIndex)
    const [curPage, setCurPage] = useState(1)
    const [displayingContent, setDisplayingContent] = useState<any>(initialPgArr)
    const [isInView, ref] = useInView()
    const [isNotInitialLoad, setIsNotInitialLoad] = useState(false)

    const [isClickDisabled, setIsClickDisabled] = useState(false)

    const getPage = () => {
        const startIndex = (curPage - 1 ) * wtPerPage
        const endIndex = startIndex + wtPerPage
        console.log('idx', startIndex, endIndex)
        setDisplayingContent(updatesArr.updates.slice(startIndex, endIndex)) 
        
    }

    const getNext = () => {
        setIsNotInitialLoad(true)
        setCurPage((prev) => prev + 1)
    }

    const getPrev = () => {
        setIsNotInitialLoad(true)
        setCurPage((prev) => prev - 1)
    }

    useEffect(() => {
        if (isNotInitialLoad) {
            getPage()
            if (!isInView && ref.current) {
                console.log('ref not in view')
                setIsClickDisabled(true)
                ref.current.scrollIntoView({
                    behavior:'instant',
                    block:'center'
                })
                setTimeout(() => {
                  setIsClickDisabled(false)
                }, 750)
            }
            
        }
        
       
    }, [curPage])

    

    return (
        <>
        <div ref={ref}></div>
        <div className="cards-cont gap-4 lg:gap-6 p-2">
      
        {displayingContent && displayingContent.map((node:any, idx:any) => {
          
          let slug = node.book.slug
          return (
            <div key={node.book._id} className="cg">
             
              <Link href={`/read/${node.book.slug}`} isDisabled={isClickDisabled}>
              <div className="relative w-full min-h-[200px] overflow-hidden">
                
               
                <NextImage src={node.book.image} alt={`Cover image of ${node.book.name}`} priority={idx <= 1 ? true : false} fill sizes="(max-width:420px) 50vw,(max-width:600px) 33vw, (max-width:800px) 25vw, (max-width:1060px) 20vw, 10vw" className="home-c object-cover rounded">
  
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
              <Link href={`/read/${node.book.slug}`} isDisabled={isClickDisabled} color="foreground">
              {node.book.name}
              </Link>
              
              </span>
              <span className={`my-[5px] flex gap-2 items-center ${isClickDisabled ? 'brightness-50' : ''}`}>
                <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
                <span className="text-foreground font-semibold text-xs">
                  {node.book.avgRating ? node.book.avgRating : ''}
                </span>
              </span>
              
                
                <div className="ch-btns mt-2">
                {node.chapters.map((node:any) => {
                  return (
                    <div key={node._id}>
                    <Link color="foreground" isDisabled={isClickDisabled} href={`/read/${slug}/${node.chapterNumber}`} className="ch-links flex gap-1 items-center" isBlock>
                    <span className="text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                    
                    {node.releasedAt === 'New' ?
  
                    <span className={`text-xs sm:text-sm text-danger-600 font-bold flex-1 text-center`}>
                      <span className="ml-1 bg-danger-600 text-foreground px-2 py-[2px] rounded">
                        <span className="pulsate">
                      {node.releasedAt}
                      </span>
                      </span>
                      </span>:
                    <span className={`text-xs text-default-500 flex-1 text-center date-txt`}>{node.releasedAt}</span>
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
        {totalPages > 1 ?
                <div className="flex justify-end p-2">
                 
                 <Button aria-label="Previous button for recently updated" radius="none" onPress={getPrev} isDisabled={curPage === 1} className="flex-1 sm:max-w-[60px]"><FcPrevious color="#4098D7" /></Button>
                 <Button aria-label="Next button for recently updated" className="flex-1 sm:max-w-[60px]" radius="none" onPress={getNext} isDisabled={curPage === totalPages}><FcNext color="#4098D7"></FcNext></Button>
                 
                 
                 </div> : null
            }
        </>
    )

}