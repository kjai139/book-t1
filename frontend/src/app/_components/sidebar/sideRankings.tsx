
import { getRankings } from "@/app/_utils/getRankings"
import SideRankingTab from "../tabs/sideRankingTab"
/* import { unstable_cache } from "next/cache"

const getCachedRanking = unstable_cache(
    async() => getRankings(),
    ['rankings'],
    { tags: ['rankings'] }
) */

export default async function SideRankingDisplay () {

    const rankingList = await getRankings()

    return (
        <div className="lg:max-w-[280px] w-full">
            <SideRankingTab rankingList={rankingList}></SideRankingTab>
        </div>
    )
}