'use client'

import { Select, SelectItem } from "@nextui-org/react";



export default function ChSelect ({chList, curCh, wtName}) {

    const disabledKeys = chList.filter(ch => ch.chapterNumber === Number(curCh)).map(ch => ch._id)
    /* console.log(disabledKeys) */
    return (
        <Select
        items={chList}
        label="Select a chapter"
        size="sm"
        disabledKeys={disabledKeys}
        placeholder={`Chapter ${curCh}`}
        className="max-w-xs"
        >
            {(ch) => <SelectItem href={`/read/${wtName}/${ch.chapterNumber.toString()}`} key={ch._id}>{`Chapter ${ch.chapterNumber}`}</SelectItem>}

        </Select>
    )
}