"use client"

import { FaChessKing, FaChessRook, FaChessQueen } from "react-icons/fa"
import NextImage from "next/image"
import { Divider, Link, Tabs, Tab } from "@nextui-org/react"
import { randomHash } from "@/app/_utils/version"

interface SideRankingTabProps {
    rankingList:any
}

export default function SideRankingTab ({rankingList}:SideRankingTabProps) {
    return (
        <div className="flex flex-col lg:mx-0 bg-content1 lg:bg-inherit">
        <div className="lg:max-w-[350px] w-full p-2">
            <h3 className="p-2 font-semibold text-sm">
                Popularity Ranking
            </h3>
            <Divider className="mt-2"></Divider>
        </div>
        <Tabs variant="underlined" classNames={{
            base: 'px-2 sm:absolute static w-full justify-end lg:static sm:pt-2',
            tabList: 'sm:w-auto w-full lg:w-full'
        }} color="primary" aria-label="Popularity ranking display options">
        <Tab key="monthly" title="Monthly">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 p-4 w-full gap-4 lg:max-w-[300px] rank-grid-bot">
            {rankingList && rankingList.rankings.map((wt:any, idx:number) => {
                const genres = wt.genres.map((node:any) => node.name).join(', ')
                return (
                    <li key={`${wt._id}-srm`} className="items-center rank-li-grid gap-2">
                        <div className="flex p-2 items-center gap-4 justify-center sm:flex text-lg flex-col">
                            {idx === 0 &&
                            <FaChessKing size={22} color="gold"></FaChessKing>
                            }
                            {idx === 1 &&
                            <FaChessQueen size={22} color="silver"></FaChessQueen>
                            }
                            {
                                idx === 2 &&
                            <FaChessRook size={22} color="cd7f32"></FaChessRook>
                            }
                            <span className={`${idx < 4 ? 'font-bold' : 'font-semibold'} ${idx === 0 && 'txt-gold'} ${idx === 1 && 'txt-silver'} ${idx === 2 && 'txt-bronze'}`}>
                                {idx + 1}
                            </span>
                        </div>
                        <Link className="rank-grid max-w-[320px] gap-2 items-center" href={`/read/${wt.slug}${randomHash}`} color="foreground">
                        
                        <div className="relative w-full flex-1 h-[80px]">
                            <NextImage src={wt.image} alt={`Cover image of ${wt.name} at rank ${idx}`} fill sizes="(max-width:600px) 15vw, (max-width:1200px) 10vw, 10vw" className="rounded object-cover"></NextImage>

                        </div>
                        <div className="flex flex-col">
                        <span className="flex-1 flex ranking-txt text-sm mb-1">
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 p-4 w-full gap-4 lg:max-w-[300px] rank-grid-bot">
            {rankingList && rankingList.trankings.map((wt:any, idx:number) => {
                const genres = wt.genres.map((node:any) => node.name).join(', ')
                return (
                    <li key={`${wt._id}-sra`} className="items-center rank-li-grid gap-2">
                        <div className="flex p-2 items-center gap-4 justify-center sm:flex text-lg flex-col">
                            {idx === 0 &&
                            <FaChessKing size={22} color="gold"></FaChessKing>
                            }
                            {idx === 1 &&
                            <FaChessQueen size={22} color="silver"></FaChessQueen>
                            }
                            {
                                idx === 2 &&
                            <FaChessRook size={22} color="cd7f32"></FaChessRook>
                            }
                            <span className={`${idx < 4 ? 'font-bold' : 'font-semibold'} ${idx === 0 && 'txt-gold'} ${idx === 1 && 'txt-silver'} ${idx === 2 && 'txt-bronze'}`}>
                                {idx + 1}
                            </span>
                        </div>
                        <Link className="rank-grid max-w-[320px] gap-2 items-center" href={`/read/${wt.slug}${randomHash}`} color="foreground">
                        
                        <div className="relative w-full flex-1 h-[80px]">
                            <NextImage src={wt.image} alt={`Cover image of ${wt.name} at rank ${idx}`} fill sizes="(max-width:600px) 15vw, (max-width:1200px) 10vw, 10vw" className="rounded object-cover"></NextImage>

                        </div>
                        <div className="flex flex-col">
                        <span className="flex-1 flex ranking-txt text-sm mb-1">
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