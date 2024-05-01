
import { dbConnect } from "./db"
import Wt from "../_models/wt"
import Genre from "../_models/genre"
import { unstable_cache } from "next/cache"


export const getRankings = unstable_cache(async() => {
    try {
      await dbConnect()
      const monthlyRanking = await Wt.find({}).sort({monthlyViews: -1, name: -1}).limit(10).populate({path:'genres', model:Genre})
     
      const json = {
          rankings:monthlyRanking
      }
  
      return JSON.parse(JSON.stringify(json))
    } catch (err:any) {
        console.error(err)
    }
    
  }, ['rankings'], {
    revalidate: 21600
  })

