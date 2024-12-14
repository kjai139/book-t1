import { dbConnect } from "@/app/_utils/db"
import { cache } from "react"
import Wt from "@/app/_models/wt"
import MainDynamicSlide from "../slider/mainSlider"
import { unstable_noStore } from "next/cache"


const GetSliderData = cache(async () => {
    await dbConnect()
    try {
        const slider = await Wt.aggregate([
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genres',
                    foreignField: '_id',
                    as: 'genres'
                }//serves as populate
            }
        ]).sample(6)


        const json = {
            slider: slider
        }

        return JSON.parse(JSON.stringify(json))

    } catch (err:any) {
        console.error(err)
    }

    
})

export default async function SliderWrapper () {
    unstable_noStore()
    const updates = await GetSliderData()
    return (
        <MainDynamicSlide slideArr={updates.slider}></MainDynamicSlide>
    )
}