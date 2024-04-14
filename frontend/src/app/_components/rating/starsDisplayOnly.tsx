import DisabledStar from "./disabledStars"

interface StarsOnlyProps {
    rating: number,
    isOnCard?: boolean,
}


export default function StarsOnly ({rating, isOnCard}:StarsOnlyProps) {
    const stars = []

    for (let i = 1; i <= 5; i++) {
        stars.push(
        <DisabledStar isOnCard={isOnCard} key={`star${i}`}
        remain={rating - i}
        ></DisabledStar>
        )
    
    }


    return (
        <div className="flex items-center gap-1">
             <div className="flex">{stars}</div>
        </div>
        
    )
}