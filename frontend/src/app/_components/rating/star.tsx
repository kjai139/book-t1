import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

interface StarProps {
    remain: number
}


export default function Star ({remain}:StarProps) {
    

    return (
        <span>
            {remain == 0 &&
                <FaStar color="yellow"></FaStar> 
                
            }
            {
                remain >= 1 &&
                <FaStar color="yellow"></FaStar> 
            }
            {
                remain < 0 &&
                <FaRegStar></FaRegStar>
            }
            {
                remain > 0 && remain < 1 &&
                <FaRegStarHalfStroke color="yellow"></FaRegStarHalfStroke>
            }
        </span>
    )
}