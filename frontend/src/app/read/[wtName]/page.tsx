import BreadCrumbs from "@/app/_components/breadcrumbs/breadcrumb";
import SaveBookmarkBtn from "@/app/_components/button/saveBookmark";
import ChList from "@/app/_components/list/chList";
import LastRead from "@/app/_components/localstorage/lastRead";
import Rating from "@/app/_components/rating/starRating";
import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Divider, Image, Link } from "@nextui-org/react";
import { notFound } from "next/navigation";
import SideRankingDisplay from "@/app/_components/sidebar/sideRankings";
import { ThemeSwitcher } from "@/app/_components/themeSwitcher";





async function getWts(params) {
    console.log('PARAMS IN getWTS:', params)
    try {
        const response = await fetch(`${apiUrl}/api/wt/one/get?name=${params.wtName}`, {
            next: {
                revalidate: 86400
            }
        })

        if (!response.ok) {
            throw new Error('ERROR FETCHING getWts')
        }

        const chResponse = await fetch(`${apiUrl}/api/wt/ch/count/get?name=${params.wtName}`, {
            next: {
                revalidate: 1
            }
        })

        if (!chResponse.ok) {
            throw new Error('ERROR FETCHING WT CHP in getWts')
        }

        const wt = await response.json()
        const ch = await chResponse.json()
        wt.totalCh = ch.totalCh

        return wt

    } catch (err) {
        console.error(err)
    }
    
    

}

export async function generateMetadata({params}) {
    console.log('GENERATE META PARAM', params)
    const response = await fetch(`${apiUrl}/api/wt/meta/get?name=${params.wtName}`, {
        method:'GET'
    })
    if (!response.ok) {
        throw new Error('ERROR FETCHING METADATA IN WT GENERAL')
    }
    const data = await response.json()
    return {
        title: data.wt.name,
        description: `Read ${data.wt.name}`
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

export default async function WtPage({params}) {
    const wtData = getWts(params)
    const rankingsData = getRankings()
    const [wt, rankings] = await Promise.all([wtData, rankingsData])
    console.log('WTPAGE wt:', wt)
    if (!wt) {
        notFound()
    }

    
    const table = [
            {
                name:'Status',
                value: wt.wt.status
            },
            {
                name: 'Released Year',
                value: wt.wt.releasedYear
            },
            {
                name: 'Author',
                value: wt.wt.author
            },
            {
                name: 'Artist(s)',
                value: wt.wt.artist
            },
            {
                name:'TL Group',
                value: wt.wt.tlGroup
            }
    ]
    
    const firstChapterNum = wt.totalCh[wt.totalCh.length - 1].chapterNumber

    const lastChapterNum = wt.totalCh[0].chapterNumber

    const sortedGenres = wt.wt.genres.sort((a, b) => {
        return (a.name > b.name ? 1 : (a.name === b.name ? 0 : -1))
    })

    

    return (
        <main>
            <div className="flex flex-col lg:flex-row max-w-[1024px] gap-4 p-2">
            
        <div className="lg:max-w-[700px] md:my-8 md:py-8 lg:py-8 lg:my-8 sm:my-8 sm:p-8 bg-content1 p-2 rounded lg:shadow flex flex-col gap-4">
            
            <span className="my-4">
                <h3 className="text-center w-full text-lg font-semibold">{wt.wt.name}</h3>
            </span>
            <div className="items-center flex flex-col gap-8">
                <BreadCrumbs wtUrl={wt.wt.name}></BreadCrumbs>
                <div className="flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex flex-col gap-4 justify-between">
                <Image src={wt.wt.image} alt={`Cover image of ${wt.wt.name}`} className="sm:max-h-[240px]"></Image>
                <SaveBookmarkBtn image={wt.wt.image} wTstatus={wt.wt.status} wtName={wt.wt.name} wtGenres={wt.wt.genres}></SaveBookmarkBtn>
                </div>

                <div className="flex flex-col max-w-[630px] sm:max-w-[450px] justify-between gap-4">
                    <div className="flex w-full">
                        <Rating wtId={wt.wt._id}></Rating>
                    </div>
                    <span className="text-sm">
                        <p>{wt.wt.about}</p>
                    </span>
                    <div className="flex gap-2 justify-evenly">
                        <Button as={Link} href={`/read/${params.wtName}/${firstChapterNum}`} aria-label="First Chapter" fullWidth>
                            First Chapter
                        </Button>
                        <Button as={Link} href={`/read/${params.wtName}/${lastChapterNum}`} aria-label="Latest Chapter" fullWidth>
                            Latest Chapter
                        </Button>
                    </div>
                </div>
                </div>

                <div className="flex flex-col w-full max-w-[400px]">
                    <table>
                        <tbody className="text-sm">
                            {table.map((node, idx) => {
                                return (
                                    <tr className="flex gap-2 text-xs sm:text-md" key={`tr-${idx}`}>
                                        <td className="border-r-1 border-default-400 flex-1 text-default-600 p-1">
                                            <p>{node.name}</p>
                                            </td>
                                        <td className="flex-1 text-default-500 p-1">{node.value}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
                
                <div className="flex gap-2 flex-wrap max-w-[630px]">
                {sortedGenres.map((genre) => {
                    return (
                        <Button as={Link} href={`/genres/${genre.slug}`} aria-label={`Check the ${genre.name} genre collection`} key={genre._id} size="sm" radius="full">
                            {genre.name}
                        </Button>
                    )
                })}
                </div>
                <div className="max-w-[630px] w-full">
                <LastRead wtId={wt.wt._id} wtName={wt.wt.name}></LastRead>
                </div>
                <div className="w-full">
                    <h3 className="font-semibold">{`Chapters for ${wt.wt.name}`}</h3>
                    <Divider className="mt-4"></Divider>
                </div>
                <ChList chs={wt.totalCh} curSlug={params.wtName}></ChList>

               
                
            </div>
            
            </div>
            <SideRankingDisplay rankingList={rankings}></SideRankingDisplay>
        </div>
        </main>
    )
}