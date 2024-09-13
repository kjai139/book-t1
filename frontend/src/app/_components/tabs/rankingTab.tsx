"use client"

import { FaChessKing, FaChessQueen, FaChessRook } from "react-icons/fa"
import { Link, Tab, Tabs, Divider } from "@nextui-org/react"
import NextImage from "next/image"
import { randomHash } from "@/app/_utils/version"

interface RankingTabsProps {
    rankings:any[any],
    
}

export default function RankingTabs ({rankings}:RankingTabsProps) {
    return (
        <div className="flex flex-col">
            <div className="max-w-[1024px] w-full p-2">
            <h3 className="font-semibold p-2">
                Popularity Ranking
            </h3>
            <Divider className="mt-2"></Divider>
            </div>
        <Tabs classNames={{
            base: 'px-2 sm:absolute static w-full sm:justify-end sm:pt-2 max-w-[1024px]',
            tabList: 'sm:w-auto w-full'
        }} color="primary" variant="underlined" aria-label="Popularity ranking display options">
            <Tab key="monthly" title="Monthly">
            <ul className="grid grid-cols-1 lg:grid-cols-3 pt-0 p-4 w-full gap-4 lg:max-w-[1024px] ml-auto mr-auto rank-grid-bot sm:grid-cols-2">
            {rankings && rankings.rankings.map((wt:any, idx:number) => {
                
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
                        <Link href={`/read/${wt.slug}${randomHash}`} className="flex w-[80%] rank-details items-center" color="foreground">
                        
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

        </ul>

            </Tab>
            <Tab key="all" title="All">
            <ul className="grid grid-cols-1 lg:grid-cols-3 p-4 w-full gap-4 lg:max-w-[1024px] ml-auto mr-auto rank-grid-bot sm:grid-cols-2 pt-0">
            {rankings && rankings.trankings.map((wt:any, idx:number) => {
                
                const genres = wt.genres.map((node:any) => node.name).join(', ')
                return (
                    
                    <li key={`${wt._id}-rft`} className="flex items-center bg-content1 py-2 px-4">
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
                        <Link href={`/read/${wt.slug}${randomHash}`} className="flex w-[80%] rank-details items-center" color="foreground">
                        
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

        </ul>
            </Tab>

        </Tabs>
         
        </div>
    )
}