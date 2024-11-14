import { AiFillFire } from "react-icons/ai"

interface HotIconProps {
    level: String
}


export default function HotIcon ({level}:HotIconProps) {

    let color
    if (level === 'Red' ) {
        color = 'Red'
    } else if (level === 'Yellow') {
        color = '#FFD580'
    } else if (level === 'Orange') {
        color = '#ff8c00'
    }

    return (
        
        <div className={`bg-black rounded-full -rotate-30 p-1 z-10`}>
            <AiFillFire color={color}></AiFillFire>
        </div>
            
    )
}