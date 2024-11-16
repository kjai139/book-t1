
import ChSelect from "./chSelect"
import { Button, Link } from "@nextui-org/react"
import { getChList, getNext, getPrev } from "@/app/_utils/getChList"
import { GrStatusInfo } from "react-icons/gr"
import { unstable_noStore } from "next/cache"


export default async function BotChSelectDynamicWrap ({params}: {params: any}) {
    unstable_noStore()
    const chList = await getChList(params)

    return (
        <div className="flex flex-col w-full gap-4">
                <div className="w-full flex flex-col py-1 px-4 items-end">
                <ChSelect wtName={params.wtName} chList={chList.chList} curCh={params.chNum}></ChSelect>
                </div>

                <div className="w-full flex pb-2 px-4 justify-end gap-4 ng">
                    {
                        chList.chList[chList.chList.length - 1].chapterNumber < Number(params.chNum) ?
                        <Button as={Link} href={`/read/${params.wtName}/${getPrev(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                            <span className="px-2">{`< Prev`}</span>
                        </Button> :
                        <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                        <span className="px-2">{`< Prev`}</span>
                    </Button> 

                        

                    }
                    {
                        chList.chList[0].chapterNumber > Number(params.chNum) ?
                        <Button as={Link} href={`/read/${params.wtName}/${getNext(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                            <span className="px-2">{`Next >`}</span>
                        </Button>  :
                        <Button as={Link} variant="light" isIconOnly href={`/read/${params.wtName}`} aria-label="back to index page" size="sm" className="font-semibold" color="primary">
                        <GrStatusInfo size={24}></GrStatusInfo>
                        </Button> 

                    }

                </div>
            </div>
    )
}