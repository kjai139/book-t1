import { FaChessKing, FaChessRook, FaChessQueen } from "react-icons/fa"
import NextImage from "next/image"
import { Divider, Link } from "@nextui-org/react"

interface RankingDisplayProps {
    rankingList: {rankings: []}
}

export default function RankingDisplay ({rankingList}:RankingDisplayProps) {

    console.log('RANKING LIST........', rankingList)

    return (
        <div className="w-full max-w-[1024px]">
        <div className="max-w-[1024px] w-full p-2">
            <h3 className="font-semibold p-2">
                Popularity Rankings
            </h3>
            <Divider className="mt-2"></Divider>
        </div>
        
        <ul className="grid grid-cols-1 lg:grid-cols-3 p-4 w-full gap-4 lg:max-w-[1024px] md:grid-cols-3 ml-auto mr-auto rank-grid-bot sm:grid-cols-2">
            {rankingList && rankingList.rankings.map((wt:any, idx) => {
                
                const genres = wt.genres.map((node:any) => node.name).join(', ')
                return (
                    
                    <li key={`${wt._id}-rf`} className="flex items-center bg-content1 py-1 px-2">
                        <div className="flex p-2 items-center gap-4 justify-center w-[20%] text-lg flex-col">
                            {idx === 0 &&
                            <FaChessKing size={24} color="gold"></FaChessKing>
                            }
                            {idx === 1 &&
                            <FaChessQueen size={24} color="silver"></FaChessQueen>
                            }
                            {
                                idx === 2 &&
                            <FaChessRook size={24} color="cd7f32"></FaChessRook>
                            }
                            <span className={`${idx < 4 ? 'font-bold' : 'font-semibold'} ${idx === 0 && 'txt-gold'} ${idx === 1 && 'txt-silver'} ${idx === 2 && 'txt-bronze'}`}>
                                {idx + 1}
                            </span>
                        </div>
                        <Link href={`/read/${wt.slug}`} className="flex w-[80%] rank-details items-center" color="foreground">
                        
                        <div className="relative w-full flex-1 h-[80px]">
                            <NextImage src={wt.image} alt={`Cover image of ${wt.name} at rank ${idx}`} fill sizes="(max-width:600px) 15vw, (max-width:1200px) 10vw, 10vw" className="rounded object-contain"></NextImage>

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

        </ul>
        </div>
    )
}