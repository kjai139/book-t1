
import SaveBookmarkBtn from "@/app/_components/button/saveBookmark";
import ChList from "@/app/_components/list/chList";
import LastRead from "@/app/_components/localstorage/lastRead";
import Rating from "@/app/_components/rating/starRating";
import { Button, Divider, Image, Link } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { dbConnect } from "@/app/_utils/db";
import Genre from "@/app/_models/genre"
import Wt from "@/app/_models/wt";
import Wtc from "@/app/_models/wtChapter";
import DisqusComments from "@/app/_components/comments/disqus";
import dynamic from "next/dynamic";
import { unstable_noStore } from "next/cache";
import ServerError from "@/app/_components/serverError";
import NextImage from "next/image";
import { randomHash } from "@/app/_utils/version";



const SideRankingDisplay = dynamic(() => import('@/app/_components/sidebar/sideRankings'))



async function getWts(params: any) {
    console.log('PARAMS IN getWTS:', params)

    try {
        const slug = params.wtName.split(randomHash)[0]
        await dbConnect()
        const wt = await Wt.findOne({ slug: slug }).populate({ path: 'genres', model: Genre, options: { sort: { name: 'asc' } } })


        const totalCh = await Wtc.find({ wtRef: wt._id }).sort({ chapterNumber: -1 })

        const json = {
            wt: wt,
            totalCh: totalCh
        }

        return JSON.parse(JSON.stringify(json))
        // remember to stringify and parse to avoid max stack exceed


    } catch (err) {
        console.error(err)
        throw new Error('Error fetching Wts')
    }




}

async function getChapterList(params: any) {
    unstable_noStore()
    try {
        const slug = params.wtName.split(randomHash)[0]
        const wt = await Wt.findOne({ slug: slug })
        const totalCh = await Wtc.find({ wtRef: wt._id }).sort({ chapterNumber: -1 })

        const json = {
            totalCh: totalCh
        }

        return JSON.parse(JSON.stringify(json))
    } catch (err) {
        console.error(err)
        throw new Error('Error fetching chList')
    }
}

export async function generateMetadata({ params }: any) {

    /* console.log('GENERATE META PARAM', params) */
    try {
        const slug = params.wtName.split(randomHash)[0]
        await dbConnect()
        const wt = await Wt.findOne({ slug: slug })

        return {
            title: `Read ${wt.name}`,
            description: `Read ${wt.name}, ${wt?.altName}`,
            openGraph: {
                images: [wt.image],
            }
        }
    } catch (err) {
        console.error(err)
        return {
            title: `Error getting Data`,
            description: 'Encountered a server error, please refresh page or try again later.'
        }
    }

}



export default async function WtPage({ params }: any) {
    /* const wt = await getWts(params) */
    let wt: any
    let chList: any
    const wtPromise = getWts(params)
    const chListPromise = getChapterList(params)
    try {

        [wt, chList] = await Promise.all([wtPromise, chListPromise])

    } catch (err) {
        return <ServerError></ServerError>
    }
    /* const [wt, chList] = await Promise.all([wtPromise, chListPromise]) */

    /* console.log('RANKINGS: IN WTPAGE', rankings) */

    /* console.log('WTPAGE wt:', wt) */
    if (!wt) {
        notFound()
    }


    const table = [
        {
            name: 'Status',
            value: wt.wt.status
        },
        {
            name: 'Released Year',
            value: wt.wt.releasedYear
        },
        {
            name: 'Raw Language',
            value: wt.wt.raw
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
            name: 'TL Group',
            value: wt.wt.tlGroup
        },

    ]

    const firstChapterNum = wt.totalCh[wt.totalCh.length - 1].chapterNumber

    const lastChapterNum = wt.totalCh[0].chapterNumber






    return (
        <main>


            <div className="flex flex-col lg:flex-row max-w-[1024px] gap-4 pt-0 w-full lg:gap-1">


                <div className="lg:max-w-[750px] bg-content1 lg:bg-inherit flex flex-col my-0 w-full relative overflow-hidden">
                    <div className="absolute top-0 lg:hidden" style={{
                        width: '5000%'
                    }}>
                        <NextImage src={wt.wt.image} alt="background image" className="bgp" unoptimized priority width={0} height={0} style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            objectPosition: 'top',
                        }}></NextImage>
                    </div>

                    <span className="mt-4 mb-2 relative">

                        <h3 className="text-center w-full text-xl font-bold lg:text-2xl sm:text-xl relative z-10 px-4">{wt.wt.name}</h3>
                    </span>

                    <div className="items-center flex flex-col gap-8 p-2">
                        {/* <BreadCrumbs wtUrl={wt.wt.name}></BreadCrumbs> */}
                        <div className="flex flex-col w-full sm:flex-row sm:gap-4 gap-4 p-1 z-10">
                            <div className="flex flex-col gap-4 justify-between items-center">
                                <Image width={300} height='100%' src={wt.wt.image} loading="eager" alt={`Cover image of ${wt.wt.name}`} className="p-2 w-full max-w-[350px] sm:max-w-[240px] sm:shadow"></Image>
                                <SaveBookmarkBtn image={wt.wt.image} wTstatus={wt.wt.status} wtId={wt.wt._id} wtName={wt.wt.name} wtGenres={wt.wt.genres}></SaveBookmarkBtn>
                            </div>

                            <div className="flex flex-col justify-between gap-4 flex-1">
                                <div className="flex flex-col">

                                    <h4 className="p-2 text-sm">
                                        {wt.wt.altName}
                                    </h4>

                                    <div className="flex w-full">
                                        <Rating wtId={wt.wt._id}></Rating>
                                    </div>
                                    <span className="text-sm text-foreground whitespace-pre-line p-2 mt-4">
                                        <p>{wt.wt.about}</p>
                                    </span>
                                </div>
                                <div className="flex gap-2 justify-evenly ng">
                                    <Button as={Link} href={`/read/${params.wtName}/${firstChapterNum}`} aria-label="First Chapter" fullWidth>
                                        First Chapter
                                    </Button>
                                    <Button as={Link} href={`/read/${params.wtName}/${lastChapterNum}`} aria-label="Latest Chapter" fullWidth>
                                        Latest Chapter
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full text-center">
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

                        <div className="flex gap-2 flex-wrap">
                            {wt.wt.genres.map((genre: any) => {
                                return (
                                    <Button as={Link} href={`/genres/${genre.slug}`} aria-label={`Check the ${genre.name} genre collection`} key={genre._id} size="sm" radius="full">
                                        {genre.name}
                                    </Button>
                                )
                            })}
                        </div>
                        <div className="w-full">
                            <LastRead wtId={wt.wt._id} wtName={wt.wt.name}></LastRead>
                        </div>
                        <div className="w-full">
                            <h3 className="font-semibold">{`Chapters for ${wt.wt.name}`}</h3>
                            <Divider className="mt-4"></Divider>
                        </div>
                        <ChList chs={chList.totalCh} curSlug={params.wtName}></ChList>



                    </div>
                    <DisqusComments slug={`/read/${params.wtName}`} identifier={wt.wt._id} title={wt.wt.name}></DisqusComments>

                </div>

                <SideRankingDisplay></SideRankingDisplay>
            </div>
        </main>
    )
}