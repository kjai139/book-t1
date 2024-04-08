'use client'

import { useCallback, useEffect, useState } from "react"
import Star from "./star"
import { v4 as uuidv4 } from 'uuid'
import apiUrl from "@/app/_utils/apiEndpoint"

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
            const response = await fetch(`${apiUrl}/api/ratings/get?wtId=${wtId}&tempId=${tempId}`, {
                method: 'GET',
                next: {
                    revalidate: 1
                }
            })

            if (response.ok) {
                const json = await response.json()
                console.log(json)
                if (json.results) {
                    setRating(json.results)
                    setIsDoneLoading(true)
                    setTotalRated(json.totalRated)
                }
                if (json.didUserRate) {
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
            const response = await fetch(`${apiUrl}/api/rating/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (response.ok) {
                setIsLoading(false)
                setHasUserVoted(true)
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

   
    for (let i = 1; i <= 5; i++) {
        starsDisabled.push(
        <Star idx={i} key={`star${i}`}
        remain={rating - i} isDisabled={true}
        ></Star>
        )
    
    }

    for (let i = 1; i <= 5; i++) {
        stars.push(
        <Star idx={i} key={`star${i}`}
        remain={rating - i} isDisabled={hasUserVoted} onClickFunc={rateWt}
        ></Star>
        )
    
    }



    return (
        <div className="flex items-center gap-1 w-full">{isLoading ? <div>{starsDisabled}</div> : <div>{stars}</div>}
        <div className="flex flex-col">
        
        {isDoneLoading && <span className="text-warning-500 text-sm ml-1">
            {rating}/5 out of {totalRated}
        </span>}
        {isDoneLoading && hasUserVoted ? 
        <span className="text-xs text-default-500 italic">You have already rated this.</span> :
        <span className="text-xs text-default-500 italic">Give it a rating!</span>
        }
        </div>
        </div>
    )

}