
import { Divider, Link } from "@nextui-org/react"
import NextImage from "next/image"
import { formatDateDMY } from './_utils/dates'
import StarsOnly from "./_components/rating/starsDisplayOnly"
import MainDynamicSlide from "./_components/slider/mainSlider"

import Wt from "./_models/wt"
import Wtc from "./_models/wtChapter"
import { IoIosAlert } from "react-icons/io"

import { dbConnect } from "./_utils/db"
import { cache } from 'react'
import dynamic from "next/dynamic"
import HotIcon from "./_components/icons/hotIcon"
const RankingDisplay = dynamic(() => import('./_components/footer/ranking'))


export const revalidate = 3600

const GetHomeUpdates = cache(async () => {
    await dbConnect()
    const sevendaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const page = 1
    const limit = 50

    try {
        const updates = await Wt.aggregate([
            {
                $match: {
                    updatedOn: { $gte: sevendaysAgo }
                }
            },
            {
                $sort: { updatedOn: -1}
            },
            {
                $skip: (page - 1) * limit

            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: Wtc.collection.name,
                    localField: '_id',
                    foreignField: 'wtRef',
                    as: 'chapters'
                    //localField(cur collection) matches the foreignfield(from collection)
                }
            },
            {
                $unwind: '$chapters'
            },
            {
                $sort: { 'chapters.chapterNumber': -1 }
            },
            {
                $group: {
                    //grouping by the Book's id
                    _id: '$_id',
                    chapters: { $push: '$chapters' },
                    book: { $first: '$$ROOT'}
                }
            },
            {
                $project: {
                    _id: 0,
                    book: 1,
                    chapters: { $slice: ['$chapters', 2]}
                }
            },
            {
                $unset: "book.chapters"
            },
            {
                $sort: {
                    "book.updatedOn": -1
                }
            }
        ])


        const totalCount = await Wt.countDocuments({
            updatedOn: { $gte: sevendaysAgo }
        })

        const totalPages = Math.ceil(totalCount / limit)

        const slider = await Wt.aggregate([
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genres',
                    foreignField: '_id',
                    as: 'genres'
                }//serves as populate
            }
        ]).sample(6)

        


        const json = {
            updates: updates,
            totalPages: totalPages,
            slider: slider
        }

        return JSON.parse(JSON.stringify(json))

    } catch (err:any) {
        console.error(err)
    }

    
})



export default async function Home() {
  const updates = await GetHomeUpdates()
  

  
  /* console.log('PROPS RECEIVED FROM SSG', updates) */
  
  updates.updates = updates.updates.map((node:any) => {
    const updatedChapters = node.chapters.map((chapter:any) => {
      console.log('chapter', chapter)
      const formattedDate = formatDateDMY(chapter.releasedAt)


      return {
        ...chapter,
        releasedAt: formattedDate
      }
      
    })

    return {
      ...node,
      chapters: updatedChapters
    }
  })
  
  
  
  return (
    <>
    
    <main className="flex flex-col items-center">
      <div className="w-full mw">
        <MainDynamicSlide slideArr={updates.slider}></MainDynamicSlide>
        <div>
                
                <span className='text-xs text-default-500 flex p-4 justify-center gap-1'>
                <IoIosAlert size={16} color="#73737C"></IoIosAlert> Please share the site with your friends if you enjoyed reading here!
                </span>
        </div>
        <div className="pt-4 px-4 flex justify-between">
          <h4 className="font-semibold">Recently Updated</h4>
          <Link href="/read" size="sm">View all</Link>
        </div>
        <Divider className="my-4"></Divider>
        <div className="cards-cont gap-4 lg:gap-6 p-2">
      
      {updates && updates.updates.map((node:any, idx:any) => {
        /* console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters) */
        let slug = node.book.slug
        return (
          <div key={node.book._id} className="cg">
           
            <Link href={`/read/${node.book.slug}`}>
            <div className="relative w-full min-h-[200px] overflow-hidden">
              
             
              <NextImage src={node.book.image} alt={`Cover image of ${node.book.name}`} priority={idx <= 1 ? true : false} fill sizes="(max-width:420px) 50vw,(max-width:600px) 33vw, (max-width:1200px) 10vw, 10vw" className="home-c object-cover rounded">

              </NextImage>
              {node.book?.isHot !== 'No' ? 
              <HotIcon level={node.book.isHot}></HotIcon>
              : null
              }
             
            </div>
            </Link>
            
              
            
            <span className="card-txt">
            <Link href={`/read/${node.book.slug}`} color="foreground">
            {node.book.name}
            </Link>
            
            </span>
            <span className="my-[5px] flex gap-2 items-center">
              <StarsOnly rating={node.book.avgRating ? node.book.avgRating : 0}></StarsOnly>
              <span className="text-foreground font-semibold text-xs">
                {node.book.avgRating ? node.book.avgRating : ''}
              </span>
            </span>
            
              
              <div className="ch-btns mt-2">
              {node.chapters.map((node:any) => {
                return (
                  <div key={node._id}>
                  <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="ch-links flex gap-1 items-center" isBlock>
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
      <div className="p-6 flex justify-end">
          
          <Link href="/read" size="sm">View all</Link>
        </div>
      </div>
      
      <RankingDisplay></RankingDisplay>

      
      
      
    </main>
    </>
  );
}
