'use client'

import Star from "./star"

interface RatingProps {
    rating: number,
    onRatingChange: any
}



export default function Rating ({rating, onRatingChange}:RatingProps) {

    const stars = []

   
    for (let i = 1; i <= 5; i++) {
        stars.push(
        <Star key={`star${i}`}
        remain={rating - i}
        ></Star>
        )
    
    }



    return (
        <div className="flex">{stars}</div>
    )

}