
import ChSelect from "./chSelect"
import { ThemeSwitcher } from "../themeSwitcher"
import { Button, Link } from "@nextui-org/react"
import { getChList, getNext, getPrev } from "@/app/_utils/getChList"
import { GrStatusInfo } from "react-icons/gr"
import { GrFormPreviousLink } from "react-icons/gr";

export default async function ChSelectDynamicWrapper ({params}:{params: any}) {
    
    const chList = await getChList(params)
    const btnVariant = 'solid'
    const btnSize = 'sm'
   
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="w-full flex flex-col py-2 px-4 items-end">
                <ChSelect wtName={params.wtName} chList={chList.chList} curCh={params.chNum}></ChSelect>
            
            </div>    
    
            <div className="w-full flex justify-between items-center gap-4 pb-2 px-4 sm:justify-end">
                <div className="sm:hidden">
                    <ThemeSwitcher></ThemeSwitcher>
                </div>
                <div className="flex gap-2 items-center">
                {
                    chList.chList[chList.chList.length - 1].chapterNumber < Number(params.chNum) ?
                    <Button as={Link} variant={btnVariant} href={`/read/${params.wtName}/${getPrev(params.chNum)}`} size={btnSize} className="text-default-500 font-semibold">
                        <span className="px-2">{`< Prev`}</span>
                    </Button> :
                    <Button as={Link} variant={btnVariant} href="#" isDisabled size={btnSize} className="text-default-500 font-semibold">
                    <span className="px-2">{`< Prev`}</span>
                    </Button> 

                    

                }
                {
                    chList.chList[0].chapterNumber > Number(params.chNum) ?
                    <Button as={Link} variant={btnVariant} href={`/read/${params.wtName}/${getNext(params.chNum)}`} size={btnSize} className="text-default-500 font-semibold">
                        <span className="px-2">{`Next >`}</span>
                    </Button>  :
                    <Button as={Link} variant={'light'} isIconOnly href={`/read/${params.wtName}`} aria-label="back to index page" size={btnSize} className="font-semibold" color="primary">
                    <GrStatusInfo size={24}></GrStatusInfo>
                    </Button> 

                }
                </div>
            </div>
        </div>
    )
}