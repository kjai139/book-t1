import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

interface StarProps {
    remain: number,
    
}


export default function DisabledStar ({remain}:StarProps) {
    

    return (
        
        <span>
            {remain == 0 &&
           
                <FaStar color="#F7C948"></FaStar>
            
                
            }
            {
                
                remain >= 1 &&
               
                <FaStar color="#F7C948"></FaStar>
               
            }
            {
                remain < 0 &&
              
                <FaRegStar></FaRegStar>
                
            }
            {
                remain > 0 && remain < 1 &&
               
                <FaRegStarHalfStroke color="#F7C948"></FaRegStarHalfStroke>
               
            }
        </span>
    )
}