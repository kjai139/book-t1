import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

interface StarProps {
    remain: number,
    idx: number,
    isDisabled: boolean,
    onClickFunc?: any
}


export default function Star ({remain, idx, isDisabled, onClickFunc}:StarProps) {
    let size = 20

    return (
        
        <span>
            {
                
                remain >= 1 &&
                <button onClick={() => onClickFunc(idx + 1)} className={`${isDisabled ? 'dStar' : 'undefined'} p-1 px-2`}>
                <FaStar color="#F7C948" size={size}></FaStar>
                </button> 
            }
            {
                remain <= 0 &&
                <button onClick={() => onClickFunc(idx + 1)} className={`${isDisabled ? 'dStar' : 'undefined'} p-1 px-2`}>
                <FaRegStar size={size}></FaRegStar>
                </button> 
            }
            {
                remain > 0 && remain < 1 &&
                <button onClick={() => onClickFunc(idx + 1)} className={`${isDisabled ? 'dStar' : 'undefined'} p-1 px-2`}>
                <FaRegStarHalfStroke color="#F7C948" size={size}></FaRegStarHalfStroke>
                </button> 
            }
        </span>
    )
}