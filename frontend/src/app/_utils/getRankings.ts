
import { dbConnect } from "./db"
import Wt from "../_models/wt"
import Genre from "../_models/genre"
import SiteData from "../_models/siteData"



export const getRankings = async() => {
    try {
      await dbConnect()
      const monthlyRanking = await SiteData.findOne().populate({
        path: 'monthlyRanking',
        populate: {
            path:'genres', 
            model:Genre
        }
      })
      
        
     
      const json = {
          rankings:monthlyRanking.monthlyRanking
      }
      console.log('JSON FROM RANKING', json)
  
      return JSON.parse(JSON.stringify(json))
    } catch (err:any) {
        console.error(err)
    }
    
}

