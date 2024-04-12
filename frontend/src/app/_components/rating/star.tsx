import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

interface StarProps {
    remain: number,
    idx: number,
    isDisabled: boolean,
    onClickFunc?: any
}


export default function Star ({remain, idx, isDisabled, onClickFunc}:StarProps) {
    

    return (
        
        <span>
            {remain == 0 &&
            <button onClick={() => onClickFunc(idx)} className={`${isDisabled ? 'dStar' : 'undefined'}`}>
                <FaStar color="#F7C948"></FaStar>
            </button> 
                
            }
            {
                
                remain >= 1 &&
                <button onClick={() => onClickFunc(idx)} className={`${isDisabled ? 'dStar' : 'undefined'}`}>
                <FaStar color="#F7C948"></FaStar>
                </button> 
            }
            {
                remain < 0 &&
                <button onClick={() => onClickFunc(idx)} className={`${isDisabled ? 'dStar' : 'undefined'}`}>
                <FaRegStar></FaRegStar>
                </button> 
            }
            {
                remain > 0 && remain < 1 &&
                <button onClick={() => onClickFunc(idx)} className={`${isDisabled ? 'dStar' : 'undefined'}`}>
                <FaRegStarHalfStroke color="#F7C948"></FaRegStarHalfStroke>
                </button> 
            }
        </span>
    )
}