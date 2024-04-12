import { Divider, Link } from "@nextui-org/react"
import NextImage from "next/image"
import { formatDateDMY } from './_utils/dates'
import apiUrl from "./_utils/apiEndpoint"
import StarsOnly from "./_components/rating/starsDisplayOnly"
import MainDynamicSlide from "./_components/slider/mainSlider"
import RankingDisplay from "./_components/footer/ranking"
import { ThemeSwitcher } from "./_components/themeSwitcher"

interface Updates {

}

async function GetHomeUpdates() {

  try {
    const response = await fetch(`${apiUrl}/api/wt/updates/get?page=1`, {
      credentials: 'include',
      method: 'GET',
      cache: 'no-cache'
      
  })

  if (response.ok) {
    const updates = await response.json()
    /* console.log('updates:', updates) */

    return updates
  } else {
    throw new Error('Failed to fetch updates')
  }


  

  } catch (err) {
    console.error('Error fetching updates')
    return {
      props: {
          updates: null
      },
    }
  }

    

}

async function getRankings () {
  try {
    const response = await fetch(`${apiUrl}/api/wt/rankings/get`, {
      method: 'GET',
      next: {
        revalidate: 3600
      }
    })
    if (response.ok) {
      const data = await response.json()
      console.log('ranking:', data)
      return data
    }

  } catch (err) {
    console.error('Error fetching rankings')
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
      <div className="max-w-[1024px] w-full">
        <ThemeSwitcher></ThemeSwitcher>
        <MainDynamicSlide slideArr={updates.slider}></MainDynamicSlide>
        <div className="pt-4 px-4 flex justify-between">
          <h4>Latest Update</h4>
          <Link href="/read" size="sm">View all</Link>
        </div>
        <Divider className="my-4"></Divider>
        <div className="cards-cont gap-4 sm:gap-4 lg:gap-8 p-2">
      
      {updates && updates.updates.map((node, idx) => {
        /* console.log('BOOK:', node.book)
        console.log('CHATPERS:', node.chapters) */
        let slug = node.book.slug
        return (
          <div key={node.book._id} className="cg">
           
            <Link href={`/read/${node.book.slug}`}>
            <div className="relative w-full min-h-[200px] overflow-hidden">
              
             
              <NextImage src={node.book.image} alt={`Cover image of ${node.book.image}`} priority={idx <= 4 ? true : false} fill sizes="(max-width:600px) 40vw, (max-width:1200px) 20vw" className="home-c object-cover rounded">

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
              {node.chapters.map((node) => {
                return (
                  <div key={node._id}>
                  <Link color="foreground" href={`/read/${slug}/${node.chapterNumber}`} className="flex gap-1 items-center" isBlock>
                  <span className="text-xs sm:text-sm py-1">{`Chapter ${node.chapterNumber}`}</span>
                  
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
      <div className="p-6 flex justify-end">
          
          <Link href="/read" size="sm">View all</Link>
        </div>
      </div>
      
      <RankingDisplay rankingList={rankings}></RankingDisplay>

      
      
      
    </main>
    </>
  );
}
