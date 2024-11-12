
import { Divider, Link } from "@nextui-org/react"
import { IoIosAlert } from "react-icons/io"
import dynamic from "next/dynamic"
import RecentlyUpdatedWrapper from "./_components/wrapper/recentlyUpdatedWrapper"
import SliderWrapper from "./_components/wrapper/sliderWrapper"
const RankingDisplay = dynamic(() => import('./_components/footer/ranking'))


export const revalidate = 3600


export default async function Home() {


  return (
    <>

      <main className="flex flex-col items-center">
        <div className="w-full mw">
          <SliderWrapper></SliderWrapper>
          <div>

            <span className='text-xs text-default-500 flex p-4 justify-center gap-1'>
              <IoIosAlert size={16} color="#73737C"></IoIosAlert> Please share the site with your friends if you enjoyed reading here!
            </span>
          </div>
          <div className="pt-4 px-4 flex justify-between">
            <h4 className="font-semibold">Recently Updated</h4>
            <Link href="/read" size="sm">View all</Link>
          </div>
          <Divider className="my-2"></Divider>
         
          <RecentlyUpdatedWrapper></RecentlyUpdatedWrapper>

          <div className="p-6 flex justify-end">

            <Link href="/read" size="sm">View all</Link>
          </div>
        </div>

        <RankingDisplay></RankingDisplay>




      </main>
    </>
  );
}
