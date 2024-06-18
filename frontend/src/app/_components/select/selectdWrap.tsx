
import ChSelect from "./chSelect"
import { ThemeSwitcher } from "../themeSwitcher"
import { Button, Link } from "@nextui-org/react"
import { getChList, getNext, getPrev } from "@/app/_utils/getChList"


export default async function ChSelectDynamicWrapper ({params}:{params: any}) {
    
    const chList = await getChList(params)
   
    return (
        <div className="flex flex-col w-full gap-4">
            <div className="w-full flex flex-col py-2 px-4 items-end">
                <ChSelect wtName={params.wtName} chList={chList.chList} curCh={params.chNum}></ChSelect>
            
            </div>    
    
            <div className="w-full flex justify-between items-center gap-4 pb-2 px-4 sm:justify-end">
                <div className="sm:hidden">
                    <ThemeSwitcher></ThemeSwitcher>
                </div>
                <div className="flex gap-2">
                {
                    chList.chList[chList.chList.length - 1].chapterNumber < Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getPrev(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`< Prev`}
                    </Button> :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`< Prev`}
                    </Button> 

                    

                }
                {
                    chList.chList[0].chapterNumber > Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getNext(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`Next >`}
                    </Button>  :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`Next >`}
                    </Button> 

                }
                </div>
            </div>
        </div>
    )
}