import DisabledStar from "./disabledStars"

interface StarsOnlyProps {
    rating: number
}


export default function StarsOnly ({rating}:StarsOnlyProps) {
    const stars = []

    for (let i = 1; i <= 5; i++) {
        stars.push(
        <DisabledStar key={`star${i}`}
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