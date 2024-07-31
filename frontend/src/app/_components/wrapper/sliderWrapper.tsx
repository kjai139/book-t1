import { dbConnect } from "@/app/_utils/db"
import { cache } from "react"
import Wt from "@/app/_models/wt"
import MainDynamicSlide from "../slider/mainSlider"

export const revalidate = 14400
//4 hrs

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
    const updates = await GetSliderData()
    return (
        <MainDynamicSlide slideArr={updates.slider}></MainDynamicSlide>
    )
}