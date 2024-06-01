import { FaChessKing, FaChessRook, FaChessQueen } from "react-icons/fa"
import NextImage from "next/image"
import { Divider, Link } from "@nextui-org/react"
import { getRankings } from "@/app/_utils/getRankings"
import RankingTabs from "../tabs/rankingTab"
/* import { unstable_cache } from "next/cache"


const getCachedRanking = unstable_cache(
    async() => getRankings(),
    ['rankings'],
    { revalidate: 14400, tags: ['rankings'] }
) */


export default async function RankingDisplay () {
    const rankingList = await getRankings()
    console.log('RANKING LIST........', rankingList)

    return (
        <div className="w-full max-w-[1024px]">
        
        <RankingTabs rankings={rankingList}></RankingTabs>
        
        {/* <ul className="grid grid-cols-1 lg:grid-cols-3 p-4 w-full gap-4 lg:max-w-[1024px] ml-auto mr-auto rank-grid-bot sm:grid-cols-2">
            {rankingList && rankingList.rankings.map((wt:any, idx:number) => {
                
                const genres = wt.genres.map((node:any) => node.name).join(', ')
                return (
                    
                    <li key={`${wt._id}-rf`} className="flex items-center bg-content1 py-2 px-4">
                        <div className="flex p-2 items-center gap-4 justify-center w-[20%] text-lg flex-col">
                            {idx === 0 &&
                            <FaChessKing size={20} color="gold"></FaChessKing>
                            }
                            {idx === 1 &&
                            <FaChessQueen size={20} color="silver"></FaChessQueen>
                            }
                            {
                                idx === 2 &&
                            <FaChessRook size={20} color="cd7f32"></FaChessRook>
                            }
                            <span className={`${idx < 4 ? 'font-bold' : 'font-semibold'} ${idx === 0 && 'txt-gold'} ${idx === 1 && 'txt-silver'} ${idx === 2 && 'txt-bronze'}`}>
                                {idx + 1}
                            </span>
                        </div>
                        <Link href={`/read/${wt.slug}`} className="flex w-[80%] rank-details items-center" color="foreground">
                        
                        <div className="relative w-full h-[80px]">
                            <NextImage src={wt.image} alt={`Cover image of ${wt.name} at rank ${idx}`} fill sizes="(max-width:600px) 15vw, (max-width:1200px) 10vw, 10vw" className="rounded object-cover"
                            ></NextImage>

                        </div>
                        <div className="flex flex-col">
                        <span className="flex-1 flex items-center ranking-txt text-sm font-semibold">
                            {wt.name}
                        </span>
                        <span className="text-xs text-default-500 ranking-txt">{genres}</span>
                        </div>
                        
                        </Link>
                    
                    </li>
                    
                    
                )
            })}

        </ul> */}
        </div>
    )
}