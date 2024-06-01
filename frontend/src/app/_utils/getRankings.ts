
import { dbConnect } from "./db"
import Wt from "../_models/wt"
import Genre from "../_models/genre"
import { cache } from "react"



export const getRankings = cache(async() => {
    try {
        await dbConnect()
        const monthlyRanking = await Wt.find({}).sort({monthlyViews: -1, name: -1}).limit(10).populate({
            path: 'genres',
            model: Genre
        })
        const totalRanking = await Wt.find().sort({totalViews: -1, name: -1}).limit(10).populate({
            path: 'genres',
            model: Genre
        })
        let index = 0

        for (const node of monthlyRanking) {
            if (index <= 2) {
                node.isHot = 'Red'
                await node.save()
            } else if (index > 2 && index < 7) {
                node.isHot = 'Orange'  
                await node.save()
            } else if (index >= 7) {
                node.isHot = 'Yellow'   
                await node.save()
            }
            index += 1
        }
      
      
        
     
      const json = {
          rankings:monthlyRanking,
          trankings: totalRanking
      }
      console.log('JSON FROM RANKING', json)
  
      return JSON.parse(JSON.stringify(json))
    } catch (err:any) {
        console.error(err)
    }
    
})

