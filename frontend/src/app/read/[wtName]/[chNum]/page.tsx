
import { Button, Link } from "@nextui-org/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BreadCrumbs from "@/app/_components/breadcrumbs/breadcrumb";
import ChSelect from "@/app/_components/select/chSelect";
import LocalStorageSaveHistory from "@/app/_components/localstorage/lastPageHistory";
import { ResolvingMetadata } from "next";
import IncreViews from "@/app/_components/viewAdd";
import { ThemeSwitcher } from "@/app/_components/themeSwitcher";
import Wt from "@/app/_models/wt";
import Wtc from "@/app/_models/wtChapter";
import WtPage from "@/app/_models/wtPage"
import { dbConnect } from "@/app/_utils/db";
import DisqusComments from "@/app/_components/comments/disqus";
import { unstable_noStore } from "next/cache";

export async function generateStaticParams({
    params: { wtName }
}:{
    params:{wtName:string}
}) {
    try {
        await dbConnect()
        /* console.log('PARAMS IN WT PAGE GENERATESTATIC', wtName) */
        const wt = await Wt.findOne({slug: wtName })
        if (!wt) {
            return null
        } else {
            const allCh = await Wtc.find({wtRef: wt._id})

            if (!allCh) {
                return null
            }

            return allCh.map((ch:any) => ({
                chNum: ch.chapterNumber.toString()
            }))

            
        }     
        
    } catch (err) {
        console.error(err)
        
    }
   

}

export async function generateMetadata ({params}:any, parent:ResolvingMetadata) {

    try {
        const wt = await Wt.findOne({slug: params.wtName})
        return {
            title: `${wt.name} Chapter ${params.chNum}`,
            description: `Read Manhwa/Manga/Manhua - ${wt?.altName},${wt.name} Chapter ${params.chNum}`,
            openGraph: {
                images: [wt.image],
            }
        }
    } catch (err) {
       console.error(err)
    }
}

async function getChContent (params:any) {
    try {
       
        const wt = await Wt.findOne({slug: params.wtName })
        if (!wt) {
            console.log('wt not found in get content')
            return null
        }
        const wtc = await Wtc.findOne({wtRef: wt._id, chapterNumber: params.chNum})
        if (!wtc) {
            console.log('wtc not found in get content')
            return null
        }
        const wtPages = await WtPage.find({chapterRef: wtc._id}).sort({pageNum: 1})
        if (!wtPages) {
            console.log('wtPages not found in get content')
            return null
        }

        /* const allWtc = await Wtc.find({wtRef: wt._id}).sort({
            chapterNumber: -1
        }) */

        const json = {
            wtc: wtc,
            images: wtPages,
            wt: wt
            /* chList: allWtc */
        }

        return JSON.parse(JSON.stringify(json))
    
       

    } catch (err) {
        console.error(err)
    }
}

async function getChList (params:any) {
    unstable_noStore()
    const wt = await Wt.findOne({slug: params.wtName })
    if (!wt) {
        console.log('wt not found in get content')
        return null
    }
    const allWtc = await Wtc.find({wtRef: wt._id}).sort({
        chapterNumber: -1
    })
    if (!allWtc) {
        console.log('allWtc not found in get content')
        return null
    }

    const json = {
        chList:allWtc
    }
    return JSON.parse(JSON.stringify(json))
}


export default async function Page({params}:{params: {wtName: string; chNum: string}}) {

    /* console.log('PARAMS FROM PG', params) */
    const pageData = getChContent(params)
    const chListData = getChList(params)

    const [content, chList] = await Promise.all([pageData, chListData])
    /* const content = await getChContent(params) */
    if (!content) {
        notFound()
    }
    
    /* console.log('content:', content) */

    const getPrev = (num:string) => {
        const prevNum = Number(num) - 1
        return prevNum.toString()
    }

    const getNext =(num:string) => {
        const nextNum = Number(num) + 1
        return nextNum.toString()
    }



    return (
        <main>
        <div className="flex flex-col gap-4 items-center max-w-[1024px]">
            <LocalStorageSaveHistory wtRef={content.wtc.wtRef} chName={params.wtName} chNum={params.chNum}></LocalStorageSaveHistory>
            <IncreViews wtName={params.wtName}></IncreViews>
            <div className="px-4 py-2 text-center font-bold text-lg mt-8">
                <h3>{content.wtc.name}</h3>
            </div>
            
            
            <BreadCrumbs wtUrl={params.wtName} wtcUrl={params.chNum.toString()}></BreadCrumbs>
        
            
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
            <div>
                {content.images.map((node:any, idx:number) => {
                    console.log('CONTENT IMGS MAP', node)
                    return (
                        
                        <div key={node._id}>
                            <Image src={node.url} priority={idx === 0 ? true : false} alt="image" width={node.imgWidth} height={node.imgHeight} sizes="(max-width:800px) 100vw, (max-width:1200px) 80vw, 80vw" placeholder="blur" blurDataURL={node.url} quality={100} unoptimized></Image>
                        </div>
                    )
                })}
            </div>
            <BreadCrumbs wtUrl={params.wtName} wtcUrl={params.chNum.toString()}></BreadCrumbs>
            <div className="flex flex-col w-full gap-4">
                <div className="w-full flex flex-col py-1 px-4 items-end">
                <ChSelect wtName={params.wtName} chList={chList.chList} curCh={params.chNum}></ChSelect>
                </div>

                <div className="w-full flex pb-2 px-4 justify-end gap-4 ng">
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
            <div className="text-default-500 text-xs p-4">
                <h3>{`You are reading the Manhwa/Manga/Manhua - ${content?.wt?.altName ? content?.wt?.altName + ',' : ''} ${content.wtc.name}`}</h3>
            </div>
            <DisqusComments slug={`/read/${params.wtName}/${params.chNum}`} title={content.wtc.name} identifier={content.wtc._id}></DisqusComments>


        </div>
        </main>
    )
}