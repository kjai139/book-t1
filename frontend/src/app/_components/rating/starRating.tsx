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
    const [rating, setRating] = useState(4)
    const [hasUserVoted, setHasUserVoted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tempId, setTempId] = useState<string | null>('temp')
    

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
            const response = await fetch(`${apiUrl}/api/ratings/get?wtId=${wtId}`)

            if (response.ok) {
                
            }

        } catch (err) {

        }
    }

   

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
        <div className="flex">{isLoading ? starsDisabled : stars}</div>
    )

}