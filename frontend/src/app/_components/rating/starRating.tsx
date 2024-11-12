'use client'

import { useCallback, useEffect, useState } from "react"
import Star from "./star"
import { v4 as uuidv4 } from 'uuid'
import { rateWtSa } from "@/app/actions"

interface RatingProps {
    wtId: string,
}

export interface RateWtUserDetails {
    rating: number,
    wtId: string,
    tempId: string
}



export default function Rating({ wtId }: RatingProps) {

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
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (tempId === 'temp') {
            const tempIdLocal = localStorage.getItem('tempId')
            if (tempIdLocal) {
                console.log('[TempId]', tempIdLocal)
                setTempId(tempIdLocal)
            } else {
                const uuid = uuidv4()
                const timeStamp = Date.now()
                const newTempId = `${uuid}${timeStamp}`
                console.log(`[TempId] new Temp id granted:${newTempId}`)
                localStorage.setItem('tempId', `${newTempId}`)
                console.log(`[TempId] localStorage: `, localStorage)
                setTempId(newTempId)
            }
        } else if (tempId !== null && tempId !== 'temp' && tempId !== 'undefined') {
            console.log('[TempId] Temp Id =', tempId)
            getRating(tempId)



        }

    }, [tempId])

    const getRating = async (tempId: string) => {
        try {
            const response = await fetch(`/api/rating/get?wtId=${wtId}&tempId=${tempId}`, {
                method: 'GET',
                next: {
                    tags: ['updateContent']
                }
            })

            if (response.ok) {
                const json = await response.json()
                console.log('[starRating getRating]', json)

                if (json.results) {
                    setRating(json.results)
                }

                if (json.didUserRate) {
                    setUserRating(json.didUserRate.rating)
                    setHasUserVoted(true)

                }
                setIsDoneLoading(true)
                setTotalRated(json.totalRated)

            }

        } catch (err) {
            console.error(err)
        }
    }


    const rateWt = async (rating: number) => {
        setErrorMsg('')
        setIsLoading(true)
        if (!tempId || tempId === 'temp') {
            setIsLoading(false)
            setErrorMsg('LocalStorage must be enabled to add your rating.')
        } else if (tempId && tempId !== 'temp') {
            const userDetails: RateWtUserDetails = {
                rating: rating,
                tempId: tempId,
                wtId: wtId

            }

            try {
                const response = await rateWtSa(userDetails)
                if (response === 'success') {

                    setRating(rating)
                    setDidUserJustVote(true)
                    setIsLoading(false)
                    console.log(`User rated ${wtId} ${rating} stars`)
                } else if (response === 'alreadyVoted') {
                    setIsLoading(false)
                    setHasUserVoted(true)
                } else if (!response) {
                    setIsLoading(false)
                    setErrorMsg('Encountered a server error. Please try again later.')
                }
            } catch (err) {
                setIsLoading(false)
                console.error(err)
                setErrorMsg('Encountered a server error. Please try again later.')
            }




        }

    }





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
                {!isDoneLoading || isLoading || errorMsg ? <div>{starsDisabled}</div> :
                    <div className="flex items-center">
                        {stars} {isDoneLoading && !didUserJustVote && <span className="text-warning-500 text-sm ml-1 font-semibold">
                            {rating}/5 {/* out of {totalRated} */}
                        </span>}
                    </div>}
                {isDoneLoading && hasUserVoted && !errorMsg && userRating &&
                    <span className="text-xs text-default-500 italic py-1 px-2">You have already rated this a {userRating}.</span>}
                {isDoneLoading && !hasUserVoted && !didUserJustVote && !errorMsg &&
                    <span className="sm:text-sm text-xs text-foreground italic py-1 px-2">Give it a rating!</span>
                }
                {didUserJustVote && !errorMsg &&
                    <span className="sm:text-sm text-xs italic py-2 px-2 text-warning">Thanks for your rating! Please consider writing your thoughts in the comments below.</span>
                }
                {
                    errorMsg &&
                    <span className="sm:text-sm text-xs italic py-2 px-2 text-danger">
                        {errorMsg}
                    </span>
                }
            </div>
            <div className="flex flex-col">



            </div>
        </div>
    )

}