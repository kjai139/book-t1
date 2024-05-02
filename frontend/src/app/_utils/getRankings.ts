
import { dbConnect } from "./db"
import Wt from "../_models/wt"
import Genre from "../_models/genre"



export const getRankings = async() => {
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
    
}

