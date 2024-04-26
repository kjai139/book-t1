
import { Divider, Link } from "@nextui-org/react"
import NextImage from "next/image"
import { formatDateDMY } from './_utils/dates'
import StarsOnly from "./_components/rating/starsDisplayOnly"
import MainDynamicSlide from "./_components/slider/mainSlider"
import RankingDisplay from "./_components/footer/ranking"
import Wt from "./_models/wt"
import Wtc from "./_models/wtChapter"
import Genre from "./_models/genre"
import { dbConnect } from "./_utils/db"






async function GetHomeUpdates() {
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

    
}

async function getRankings () {
  try {
    await dbConnect()
    const monthlyRanking = await Wt.find({}).sort({monthlyViews: -1, name: -1}).limit(10).populate({path:'genres', model:Genre})
   
    const json = {
        rankings:monthlyRanking
    }

    return JSON.parse(JSON.stringify(json))
  } catch (err:any) {
      console.error(err)
  }
  
}


export default async function Home() {
  const updatesData = GetHomeUpdates()
  const rankingsData = getRankings()
  const [updates, rankings] = await Promise.all([updatesData, rankingsData])
  
  /* console.log('PROPS RECEIVED FROM SSG', updates) */
  
  
  
  return (
    <>
    
    <main className="flex flex-col items-center">
      <div className="w-full mw">
        <div className="px-4 py-2 justify-end flex">
        {/* <ThemeSwitcher></ThemeSwitcher> */}
        </div>
        <MainDynamicSlide slideArr={updates.slider}></MainDynamicSlide>
        <div className="pt-4 px-4 flex justify-between">
          <h4 className="font-semibold">Recently Updated</h4>
          <Link href="/read" size="sm">View all</Link>
        </div>
        <Divider className="my-4"></Divider>
        <div className="cards-cont gap-4 sm:gap-6 lg:gap-6 p-2">
      
      {updates && updates.updates.map((node:any, idx:any) => {
        /* console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters) */
        let slug = node.book.slug
        return (
          <div key={node.book._id} className="cg">
           
            <Link href={`/read/${node.book.slug}`}>
            <div className="relative w-full min-h-[200px] overflow-hidden">
              
             
              <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} priority={idx <= 1 ? true : false} fill sizes="(max-width:420px) 50vw,(max-width:600px) 30vw, (max-width:1200px) 10vw, 10vw" className="home-c object-cover rounded">

              </NextImage>
             
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
                  <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="flex gap-1 items-center" isBlock>
                  <span className="text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                  
                  {formatDateDMY(node.releasedAt) === 'New' ?

                  <span className={`text-xs sm:text-sm text-danger-600 font-bold flex-1 text-center`}>
                    <span className="ml-1 bg-danger-600 text-foreground px-2 py-[2px] rounded">
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
      <div className="p-6 flex justify-end">
          
          <Link href="/read" size="sm">View all</Link>
        </div>
      </div>
      
      <RankingDisplay rankingList={rankings}></RankingDisplay>

      
      
      
    </main>
    </>
  );
}
