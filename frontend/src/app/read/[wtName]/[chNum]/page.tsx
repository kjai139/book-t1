
import { notFound } from "next/navigation";
import Image from "next/image";
import BreadCrumbs from "@/app/_components/breadcrumbs/breadcrumb";
import LocalStorageSaveHistory from "@/app/_components/localstorage/lastPageHistory";
import { ResolvingMetadata } from "next";
import IncreViews from "@/app/_components/viewAdd";
import Wt from "@/app/_models/wt";
import Wtc from "@/app/_models/wtChapter";
import WtPage from "@/app/_models/wtPage"
import { dbConnect } from "@/app/_utils/db";
import DisqusComments from "@/app/_components/comments/disqus";
import ServerError from "@/app/_components/serverError";
import ChSelectDynamicWrapper from "@/app/_components/select/selectdWrap";
import BotChSelectDynamicWrap from "@/app/_components/select/botChSelectWrap";
import { randomHash } from "@/app/_utils/version";


export const revalidate = 360


export async function generateStaticParams({
    params: { wtName }
}:{
    params:{wtName:string}
}) {
    try {
        const slug = wtName.split(randomHash)[0]
        await dbConnect()
        /* console.log('PARAMS IN WT PAGE GENERATESTATIC', wtName) */
        const wt = await Wt.findOne({slug: slug })
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
        return []
        
    }
   

}

export async function generateMetadata ({params}:any, parent:ResolvingMetadata) {

    try {
        const slug = params.wtName.split(randomHash)[0]
        const wt = await Wt.findOne({slug: slug})
        return {
            title: `${wt.name} Chapter ${params.chNum}`,
            description: `Read Manhwa/Manga/Manhua - ${wt?.altName},${wt.name} Chapter ${params.chNum}`,
            openGraph: {
                images: [wt.image],
            }
        }
    } catch (err) {
       console.error(err)
       return {
        title:`Error Fetching Page`,
        description: `An server error has occured. Please try refreshing page`
       }
    }
}

async function getChContent (params:any) {
    try {
        const slug = params.wtName.split(randomHash)[0]
        const wt = await Wt.findOne({slug: slug })
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
        throw new Error('An error has occured getting chContent')
    }
}




export default async function Page({params}:{params: {wtName: string; chNum: string}}) {
    let content
    
    try {
        
        content = await getChContent(params)
    } catch (err) {
        console.error('Database Error fetching page')
        console.error(err)
        return <ServerError></ServerError>
    }
    
    if (!content) {
        notFound()
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
            
            <ChSelectDynamicWrapper params={params}></ChSelectDynamicWrapper>
            
            
        
            
            
            <div>
                {content.images.map((node:any, idx:number) => {
                    console.log('CONTENT IMGS MAP', node)
                    return (
                        
                        <div key={node._id} className="flex flex-col items-center">
                            <Image src={node.url} priority={idx === 0 ? true : false} alt="image" width={node.imgWidth} height={node.imgHeight} sizes="(max-width:800px) 100vw, (max-width:1200px) 80vw, 80vw" placeholder="blur" blurDataURL={node.url} quality={100} unoptimized></Image>
                        </div>
                    )
                })}
            </div>
            <BreadCrumbs wtUrl={params.wtName} wtcUrl={params.chNum.toString()}></BreadCrumbs>
            <BotChSelectDynamicWrap params={params}></BotChSelectDynamicWrap>
           
            <div className="text-default-500 text-xs p-4">
                <h3>{`You are reading the Manhwa/Manga/Manhua - ${content?.wt?.altName ? content?.wt?.altName + ',' : ''} ${content.wtc.name}`}</h3>
            </div>
            <DisqusComments slug={`/read/${params.wtName}/${params.chNum}`} title={content.wtc.name} identifier={content.wtc._id}></DisqusComments>


        </div>
        </main>
    )
}