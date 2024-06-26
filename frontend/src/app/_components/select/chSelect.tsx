'use client'

import { Select, SelectItem } from "@nextui-org/react";

interface ChSelectProps {
    chList: any[],
    curCh: any,
    wtName: string,
}

export default function ChSelect ({chList, curCh, wtName}:ChSelectProps) {

   
    const disabledKeys = chList.filter(ch => ch.chapterNumber === Number(curCh)).map(ch => ch._id)
    
    return (
        <Select
        items={chList}
        label="Select a chapter"
        size="sm"
        defaultSelectedKeys={disabledKeys}
        disabledKeys={disabledKeys}
        placeholder={`Chapter ${curCh}`}
        className="max-w-xs"
        >
            {(ch) => <SelectItem href={`/read/${wtName}/${ch.chapterNumber}`} key={ch._id}>{`Chapter ${ch.chapterNumber}`}</SelectItem>}

        </Select>
    )
}