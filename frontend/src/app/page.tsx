
import { Divider, Link } from "@nextui-org/react"
import { formatDateDMY } from './_utils/dates'
import MainDynamicSlide from "./_components/slider/mainSlider"

import Wt from "./_models/wt"
import Wtc from "./_models/wtChapter"
import { IoIosAlert } from "react-icons/io"

import { dbConnect } from "./_utils/db"
import { cache } from 'react'
import dynamic from "next/dynamic"
import RecentlyDisplayed from "./_components/grid/recentlyUpdated"
import RecentlyUpdatedWrapper from "./_components/wrapper/recentlyUpdatedWrapper"
import SliderWrapper from "./_components/wrapper/sliderWrapper"
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
        <SliderWrapper></SliderWrapper>
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
        {/* <RecentlyDisplayed updatesArr={updates}></RecentlyDisplayed> */}
        <RecentlyUpdatedWrapper></RecentlyUpdatedWrapper>
       
      <div className="p-6 flex justify-end">
          
          <Link href="/read" size="sm">View all</Link>
        </div>
      </div>
      
      <RankingDisplay></RankingDisplay>

      
      
      
    </main>
    </>
  );
}
