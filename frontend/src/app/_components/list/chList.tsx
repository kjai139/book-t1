

import { Button } from "@nextui-org/react"
import { formatDateDMY } from "@/app/_utils/dates"

interface ChListProps{
    chs: any
}


export default function ChList ({chs}:ChListProps) {



    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-2 auto-rows-auto">
                {chs.map((ch) => {
                    return (
                        <Button key={ch._id} size="md" variant="ghost" fullWidth aria-label={`Chapter ${ch.chapterNumber}`}>
                            <div className="flex flex-col items-start">
                            <span className="">{`Chapter ${ch.chapterNumber}`}</span>
                            <span className="text-xs text-default-500">
                                {formatDateDMY(ch.releasedAt)}
                            </span>
                            </div>
                        </Button>
                    )
                })}
                

            </div>

        </div>
    )
}