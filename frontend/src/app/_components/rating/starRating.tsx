'use client'

import { useCallback, useEffect, useState } from "react"
import Star from "./star"
import { v4 as uuidv4 } from 'uuid'

interface RatingProps {
    wtId: string,
}

interface RateWtError {
    message: string,
    code? : number
}



export default function Rating ({wtId}:RatingProps) {

    const stars = []
    const starsDisabled = []
    const [rating, setRating] = useState(0)
    const [totalRated, setTotalRated] = useState(0)
    const [hasUserVoted, setHasUserVoted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tempId, setTempId] = useState<string | null>('temp')
    const [isDoneLoading, setIsDoneLoading] = useState(false)
    const [didUserJustVote, setDidUserJustVote] = useState(false)
    const [userRating, setUserRating] = useState<number | null>(null)

    useEffect(() => {
        if (tempId === 'temp') {
            const tempIdLocal = localStorage.getItem('tempId')
            if (tempIdLocal) {
                console.log(tempIdLocal)
                setTempId(tempIdLocal)
            } else {
                const newTempId = uuidv4()
            
                localStorage.setItem('tempId', newTempId)
                console.log(localStorage)
                setTempId(newTempId)
            }
        }
        
    }, [tempId])

    const getRating = async () => {
        try {
            const tempId = localStorage.getItem('tempId')
            const response = await fetch(`/api/rating/get?wtId=${wtId}&tempId=${tempId}`, {
                method: 'GET',
                next: {
                    tags: ['updateContent']
                }
            })

            if (response.ok) {
                const json = await response.json()
                console.log(json)
                if (json) {
                    if (json.results){
                        setRating(json.results)
                    }
                    
                    setIsDoneLoading(true)
                    setTotalRated(json.totalRated)
                }
                if (json.didUserRate) {
                    setUserRating(json.didUserRate.rating)
                    setHasUserVoted(true)
                
                }
                
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getRating()
    },[])

   

    const rateWt = useCallback( async (rating:number) => {
        
        try {
            setIsLoading(true)
            const requestBody = {
                rating: rating,
                tempId: tempId,
                wtId: wtId
            }
            const response = await fetch(`/api/rating/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (response.ok) {
                setIsLoading(false)
                setRating(rating)
                setDidUserJustVote(true)
                console.log(`User rated ${wtId} ${rating} stars`)
            } else {
                setIsLoading(false)
                const json = await response.json()
                if (json.code === 409) {
                    setHasUserVoted(true)
                }
            }
            
            
        } catch (err:unknown) {

            setIsLoading(false)
            setHasUserVoted(false)
            console.error(err)
            
        }
    }, [tempId])


   
    for (let i = 0; i < 5; i++) {
        starsDisabled.push(
        <Star idx={i} key={`star-disc-${i}`}
        remain={rating === 0 ? -1 : rating - i} isDisabled={true}
        ></Star>
        )
    
    }

    for (let i = 0; i < 5; i++) {
        stars.push(
        <Star idx={i} key={`star${i}`}
        remain={rating === 0 ? -1 : rating - i} isDisabled={hasUserVoted || didUserJustVote} onClickFunc={rateWt}
        ></Star>
        )
    
    }



    return (
        <div className="flex items-start gap-1 w-full">
            <div className="flex flex-col">
                {!isDoneLoading || isLoading ? <div>{starsDisabled}</div> : 
                <div className="flex items-center">
                    {stars} {isDoneLoading && !didUserJustVote && <span className="text-warning-500 text-sm ml-1 font-semibold">
                    {rating}/5 {/* out of {totalRated} */}
                </span>}
                </div>}
                {isDoneLoading && hasUserVoted && 
                <span className="text-xs text-default-500 italic py-1 px-2">You have already rated this a {userRating}.</span>}
                {isDoneLoading && !hasUserVoted && !didUserJustVote &&
                <span className="sm:text-sm text-xs text-default-500 italic py-1 px-2">Give it a rating!</span>
                }
                {didUserJustVote &&
                <span className="sm:text-sm text-xs italic py-2 px-2 text-warning">Thanks for your rating! Please consider leaving a review in the comments below.</span>
                }
            </div>
        <div className="flex flex-col">
        

       
        </div>
        </div>
    )

}