import apiUrl from "@/app/_utils/apiEndpoint";
import { Divider } from "@nextui-org/react";
import SiteData from "@/app/_models/siteData"

async function getFooterData () {
    try {
        
        const siteData = await SiteData.findOne()

        const json = {
            siteData: siteData
        }
        return JSON.parse(JSON.stringify(json))
        

    } catch (err) {
        console.error(err)
    }
}


export default async function MainFooter () {

    const siteData = await getFooterData()
    /* console.log('siteData home', siteData) */

    return (
        <footer className="bg-content1 flex flex-col p-2 gap-2 mt-16 justify-center items-center">
            <span>

            </span>
            <span className="flex justify-center gap-2 max-w-[1024px] w-full p-2">
                {/* <Link href="#" color="foreground" size="sm">Contact</Link>
                <Link href="#" color="foreground" size="sm">Request</Link>
                <Link href="#" color="foreground" size="sm">Privacy</Link> */}
                <span className="text-sm text-default-500">
                    {siteData.siteData.about}
                </span>
            </span>
            <Divider></Divider>
            <span className="flex flex-col gap-2 justify-center items-center text-center p-2">
                <p>
                {siteData.siteData.siteC}
                </p>
                <p className="text-sm text-center">
                    {siteData.siteData.footerTxt}
                </p>
                
            </span>

        </footer>
    )
}