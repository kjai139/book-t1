import { FaChessKing, FaChessRook, FaChessQueen } from "react-icons/fa"
import NextImage from "next/image"
import { Divider } from "@nextui-org/react"

interface SideRankingDisplayProps {
    rankingList: {rankings: [any]}
}

export default function SideRankingDisplay ({rankingList}:SideRankingDisplayProps) {

    

    return (
        <div className="flex flex-col mt-8 rounded shadow bg-content1">
        <div className="max-w-[300px] w-full p-2">
            <h3 className="p-1">
                Popularity Rankings
            </h3>
            <Divider className="mt-4"></Divider>
        </div>
        
        <ul className="grid grid-cols-1 p-4 w-full gap-4 max-w-[300px]">
            {rankingList && rankingList.rankings.map((wt, idx) => {
                return (
                    <li key={wt._id} className="flex items-center">
                        <div className="flex p-2 items-center gap-4 justify-center w-[20%] text-lg flex-col lg:flex-row">
                            {idx === 0 &&
                            <FaChessKing size={30} color="gold"></FaChessKing>
                            }
                            {idx === 1 &&
                            <FaChessQueen size={30} color="silver"></FaChessQueen>
                            }
                            {
                                idx === 2 &&
                            <FaChessRook size={30} color="cd7f32"></FaChessRook>
                            }
                            <span className={`${idx < 4 ? 'font-bold' : 'font-semibold'} ${idx === 0 && 'txt-gold'} ${idx === 1 && 'txt-silver'} ${idx === 2 && 'txt-bronze'}`}>
                                {idx + 1}
                            </span>
                        </div>
                        <div className="flex w-[80%] items-center">
                        <div className="relative w-full flex-1 h-[80px]">
                            <NextImage src={wt.image} alt={`Cover image of ${wt.name} at rank ${idx}`} fill sizes="(max-width:600px) 15vw, (max-width:1200px) 10vw, 10vw" className="rounded object-contain"></NextImage>

                        </div>
                        
                        <span className="flex-1 flex items-center ranking-txt">
                            {wt.name}
                        </span>
                        </div>
                    
                    </li>
                )
            })}

        </ul>
        </div>
    )
}