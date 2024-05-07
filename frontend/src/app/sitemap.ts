
import { dbConnect } from "./_utils/db";
import Wt from "./_models/wt";

async function getWts () {
    await dbConnect()
    const wts = await Wt.find()
    return wts
}





export default async function sitemap() {

    
    const wt = await getWts()


    const wtPosts = wt.map((node:any) => ({
        
            url:`${process.env.NEXT_PUBLIC_HOME_DOMAIN}/read/${node.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9
            
        
    }))
    
    return [
        {
            url: process.env.NEXT_PUBLIC_HOME_DOMAIN as string,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1
        },
        ...wtPosts
    ]
}