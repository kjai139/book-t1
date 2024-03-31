import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Link } from "@nextui-org/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BreadCrumbs from "@/app/_components/breadcrumbs/breadcrumb";
import ChSelect from "@/app/_components/select/chSelect";
import LocalStorageSaveHistory from "@/app/_components/localstorage/lastPageHistory";

export async function generateStaticParams({
    params: { wtName }
}:{
    params:{wtName:string}
}) {
    try {
        const response = await fetch(`${apiUrl}/api/wtpage/get?name=${wtName}`)

        if (!response.ok) {
            throw new Error(`error in generating pg num, ${wtName}`)
        }
        const nums = await response.json()
        

        return nums.allCh.map((ch) => ({
            chNum: ch.chapterNumber.toString()
        }))
    } catch (err) {
        console.error(err)
        
    }
   

}

export async function generateMetadata ({params}) {
    const formattedName = params.wtName.replace(/-/g, ' ')
    return {
        title: `${formattedName} Chapter ${params.chNum}`,
        description: `Read ${formattedName} Chapter ${params.chNum}`
    }
}

async function getChContent (params) {
    try {
        const response = await fetch(`${apiUrl}/api/wtpage/getch?name=${params.wtName}&num=${params.chNum}`, {
            next: {
                revalidate:1
            }
        })

        if (!response.ok) {
            throw new Error(`Error getting chContent`)
        } else {
            const chContent = await response.json()
            return chContent
        }

    } catch (err) {
        console.error(err)
    }
}


export default async function Page({params}:{params: {wtName: string; chNum: string}}) {

    console.log('PARAMS FROM PG', params)
    const content = await getChContent(params)
    if (!content) {
        notFound()
    }
    console.log('content:', content)

    const getPrev = (num:string) => {
        const prevNum = Number(num) - 1
        return prevNum.toString()
    }

    const getNext =(num:string) => {
        const nextNum = Number(num) + 1
        return nextNum.toString()
    }



    return (
        <div className="flex flex-col gap-2 items-center max-w-[1024px]">
            <LocalStorageSaveHistory wtRef={content.wtc.wtRef} chName={params.wtName} chNum={params.chNum}></LocalStorageSaveHistory>
            <div className="p-4 text-center">
                <h3>{content.wtc.name}</h3>
            </div>
            
            <BreadCrumbs wtUrl={params.wtName} wtcUrl={params.chNum.toString()}></BreadCrumbs>
        
            
            
            <div className="w-full flex flex-col py-1 px-4">
            <ChSelect wtName={params.wtName} chList={content.chList} curCh={params.chNum}></ChSelect>
            </div>    
            
            <div className="w-full flex justify-between pb-2 px-4">
                {
                    content.chList[content.chList.length - 1].chapterNumber < Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getPrev(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`< Prev`}
                    </Button> :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`< Prev`}
                </Button> 

                    

                }
                {
                    content.chList[0].chapterNumber > Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getNext(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`Next >`}
                    </Button>  :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`Next >`}
                     </Button> 

                }

            </div>
            <div>
                {content.images.map((node, idx) => {
                    console.log('CONTENT IMGS MAP', node)
                    return (
                        
                        <div key={node._id}>
                            <Image src={node.url} priority={idx === 0 ? true : false} alt="image" width={node.imgWidth} height={node.imgHeight} sizes="(max-width:600px) 100vw, 50vw"></Image>
                        </div>
                    )
                })}
            </div>
            <div className="w-full flex flex-col py-1 px-4">
            <ChSelect wtName={params.wtName} chList={content.chList} curCh={params.chNum}></ChSelect>
            </div>

            <div className="w-full flex justify-between pb-2 px-4">
                {
                    content.chList[content.chList.length - 1].chapterNumber < Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getPrev(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`< Prev`}
                    </Button> :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`< Prev`}
                </Button> 

                    

                }
                {
                    content.chList[0].chapterNumber > Number(params.chNum) ?
                    <Button as={Link} href={`/read/${params.wtName}/${getNext(params.chNum)}`} size="sm" className="text-default-500 font-semibold">
                        {`Next >`}
                    </Button>  :
                    <Button as={Link} href="#" isDisabled size="sm" className="text-default-500 font-semibold">
                    {`Next >`}
                     </Button> 

                }

            </div>


        </div>
    )
}