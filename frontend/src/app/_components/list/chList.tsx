

import { Link } from "@nextui-org/react"
import { formatDateDMY } from "@/app/_utils/dates"



interface ChListProps{
    chs: [],
    curSlug: string,
}




export default function ChList ({chs, curSlug}:ChListProps) {
   



    return (
        <div className="flex flex-col chList-cont max-h-[300px] overflow-y-auto w-full max-w-[630px] mb-4">
            <ul className="grid grid-cols-1 gap-2 auto-rows-auto px-2">
                {chs && chs.map((ch:any) => {
                    return (
                        <li key={ch._id} aria-label={`Chapter ${ch.chapterNumber}`}>
                            <div>
                                <Link href={`/read/${curSlug}/${ch.chapterNumber}`} className="flex gap-4 items-center py-4 px-4 font-semibold ch-links"  color="foreground" size="sm" isBlock>
                            <span>{`Chapter ${ch.chapterNumber}`}</span>
                            {
                                formatDateDMY(ch.releasedAt) === 'New' ? 
                                <span className="text-xs pulsate bg-danger px-2">
                                {formatDateDMY(ch.releasedAt)}
                                </span> : 
                                <span className="text-xs text-default-500">
                                {formatDateDMY(ch.releasedAt)}
                                 </span>

                            }
                            </Link>
                            
                            </div>
                        </li>
                    )
                })}
                

            </ul>
           

        </div>
    )
}